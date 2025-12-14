// src/projects/radarShooter/createRadarShooter.js
import Vec2 from "@/utils/Vec2";

/**
 * 雷達射擊遊戲（Canvas）
 * - 玩家：中央船艦
 * - 雷達：定期放出掃描波（圓圈擴散），偵測到敵人後「標記位置」一小段時間
 * - 光束：滑鼠控制「極座標扇形光束」（黃色三角形/扇形），照到敵人會自動發射飛彈
 * - 敵人：三角函數繪製多邊形（N 邊），緩慢靠近玩家
 * - 小艇：繞著敵人多邊形每個頂點旋轉，可撞擊玩家
 * - 玩家死亡：結算存活時間
 */
export function createRadarShooter(ctx, canvas, onHud) {
  let rafId = 0;
  let running = false;

  // =============== 工具 ===============
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));
  const now = () => performance.now();

  // 將角度差縮到 [-PI, PI]
  const angleDelta = (a, b) => {
    let d = a - b;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  };

  const polar = (r, ang) => new Vec2(Math.cos(ang) * r, Math.sin(ang) * r);

  // =============== 畫布尺寸 / dpi ===============
  let dpr = 1;
  function resizeToDisplaySize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return { w, h };
  }

  // =============== 世界 / 狀態 ===============
  const state = {
    phase: "loading", // loading | briefing | playing | dead
    startAt: 0,
    elapsedMs: 0,

    // 玩家（固定畫面中心）
    ship: {
      p: new Vec2(0, 0),
      r: 18,
      hp: 1,
    },

    // 滑鼠
    mouse: {
      // 以「畫面座標」記
      x: 0,
      y: 0,
      // 以「世界座標」推導（世界座標以玩家為中心）
      world: new Vec2(0, 0),
      angle: 0,
      dist: 0,
    },

    // 雷達脈衝
    radar: {
      cooldownMs: 1400, // 多久放一次雷達
      speed: 520, // 波前擴散速度 px/s
      maxR: 520, // 最大掃描半徑
      revealMs: 1100, // 被偵測到後標記多久
      lastEmitAt: 0,
      pulses: [], // { r, bornAt }
    },

    // 光束
    beam: {
      widthRad: (12 * Math.PI) / 180, // 半角：±12°
      maxR: 620,
      // 自動射擊節流
      fireCooldownMs: 140,
      lastFireAt: 0,
    },

    // 物件
    enemies: [], // 多邊形敵人
    missiles: [], // 飛彈
    particles: [], // 爆炸粒子

    // 計分/狀態
    score: 0,

    // 生成
    spawn: {
      enemyLimit: 10,
      enemyEveryMs: 700,
      lastSpawnAt: 0,
    },
  };

  // =============== 作品需求：載入 -> 任務說明 -> 開始 ===============
  const meta = {
    loadingPercent: 0,
    loadingSpeed: 1.6, // 每幀加多少（視覺用）
  };

  // =============== 敵人 & 小艇 ===============
  function makeEnemy() {
    // 出生在玩家外圍一圈
    const spawnR = rand(420, 760);
    const ang = rand(-Math.PI, Math.PI);
    const p = polar(spawnR, ang);

    const sides = randi(3, 7); // 三角形到七邊形
    const baseR = rand(22, 60); // 多邊形半徑
    const rot = rand(0, Math.PI * 2);

    // 越大越慢（簡單平衡）
    const speed = clamp(40 + 90 * (1 / (baseR / 25)), 38, 110);

    // 頂點小艇：每個頂點 1 艘
    const boats = Array.from({ length: sides }).map((_, i) => ({
      // 小艇繞頂點的小圓軌道
      orbitR: rand(6, 12),
      orbitSpeed: rand(1.0, 2.2) * (Math.random() < 0.5 ? -1 : 1),
      phase: rand(0, Math.PI * 2),
      r: rand(6, 9), // 碰撞半徑
    }));

    return {
      id: `${now()}_${Math.random().toString(16).slice(2)}`,
      p,
      v: new Vec2(0, 0),
      sides,
      baseR,
      rot,
      speed, // 逼近玩家速度
      wobbleA: rand(0.08, 0.22), // 多邊形邊緣些微脈動
      wobbleF: rand(1.2, 2.6),

      revealedUntil: 0, // 雷達標記到什麼時候（timestamp）
      hp: 1,

      boats,
    };
  }

  // =============== 飛彈 ===============
  function fireMissile(targetEnemy) {
    const t = now();
    if (t - state.beam.lastFireAt < state.beam.fireCooldownMs) return;
    state.beam.lastFireAt = t;

    // 從玩家中心射出
    const origin = state.ship.p.clone();
    const toTarget = targetEnemy.p.sub(origin);
    const dir = toTarget.unit;

    state.missiles.push({
      id: `${t}_${Math.random()}`,
      p: origin,
      v: dir.mul(520), // 飛彈速度
      r: 3.5,
      life: 1400, // ms
      bornAt: t,
      targetId: targetEnemy.id,
    });
  }

  // =============== 粒子 ===============
  function spawnExplosion(pos, baseColor = "rgba(255,200,90,1)") {
    const count = 26;
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(80, 280);
      state.particles.push({
        id: `${now()}_${i}_${Math.random()}`,
        p: pos.clone(),
        v: polar(sp / 60, a), // 每幀位移（簡化）
        life: randi(22, 46),
        r: rand(1.4, 3.6),
        color: baseColor,
      });
    }
  }

  // =============== 雷達脈衝 ===============
  function emitRadar() {
    const t = now();
    state.radar.lastEmitAt = t;
    state.radar.pulses.push({ r: 0, bornAt: t });
  }

  function updateRadar(dt) {
    const t = now();
    // 定期放出雷達
    if (t - state.radar.lastEmitAt > state.radar.cooldownMs) {
      emitRadar();
    }

    // 更新脈衝半徑
    for (const pulse of state.radar.pulses) {
      pulse.r += state.radar.speed * dt;
    }

    // 命中偵測：當 pulse.r 接近 enemy 的距離，就算掃到
    for (const pulse of state.radar.pulses) {
      for (const e of state.enemies) {
        const d = e.p.length; // 因為玩家在 (0,0)，距離=向量長度
        if (Math.abs(pulse.r - d) < 10) {
          e.revealedUntil = Math.max(e.revealedUntil, t + state.radar.revealMs);
        }
      }
    }

    // 移除過大的 pulse
    state.radar.pulses = state.radar.pulses.filter(
      (p) => p.r <= state.radar.maxR
    );
  }

  // =============== 光束 & 目標鎖定（極座標扇形） ===============
  function beamHitsEnemy(e) {
    // 條件：雷達揭示中才可被「顯示其位置一小段時間」+ 可被光束鎖定
    const t = now();
    if (t > e.revealedUntil) return false;

    const ang = e.p.angle;
    const dAng = Math.abs(angleDelta(ang, state.mouse.angle));
    const inCone = dAng <= state.beam.widthRad;

    const inRange =
      e.p.length <= Math.min(state.beam.maxR, state.mouse.dist + 200);

    return inCone && inRange;
  }

  function findBeamTarget() {
    // 取「角度差最小」或「最近」都可以；這裡取角度差最小再比距離
    let best = null;
    let bestAng = Infinity;
    let bestDist = Infinity;

    for (const e of state.enemies) {
      if (!beamHitsEnemy(e)) continue;
      const dAng = Math.abs(angleDelta(e.p.angle, state.mouse.angle));
      const d = e.p.length;
      if (dAng < bestAng || (dAng === bestAng && d < bestDist)) {
        best = e;
        bestAng = dAng;
        bestDist = d;
      }
    }
    return best;
  }

  // =============== 更新：敵人逼近 + 小艇碰撞 + 飛彈碰撞 ===============
  function updateEnemies(dt) {
    // 補怪
    const t = now();
    const canSpawn = t - state.spawn.lastSpawnAt > state.spawn.enemyEveryMs;
    if (canSpawn && state.enemies.length < state.spawn.enemyLimit) {
      state.spawn.lastSpawnAt = t;
      state.enemies.push(makeEnemy());
    }

    // 逼近玩家中心
    for (const e of state.enemies) {
      const dir = e.p.mul(-1).unit; // 指向 (0,0)
      e.v = dir.mul(e.speed * dt);
      e.p = e.p.add(e.v);

      // 多邊形旋轉
      e.rot += dt * 0.6;
    }
  }

  function updateMissiles(dt) {
    const t = now();

    // 移動 / 生命
    for (const m of state.missiles) {
      m.p = m.p.add(m.v.mul(dt));
    }

    // 碰撞：飛彈碰到敵人中心附近就算命中（你也可以改成碰到多邊形）
    for (let i = state.missiles.length - 1; i >= 0; i--) {
      const m = state.missiles[i];

      // 超時
      if (t - m.bornAt > m.life) {
        state.missiles.splice(i, 1);
        continue;
      }

      // 找 target
      const e = state.enemies.find((x) => x.id === m.targetId);
      if (!e) continue;

      if (m.p.distance(e.p) < e.baseR * 0.85 + 10) {
        // 命中：爆炸 + 得分 + 移除敵人
        spawnExplosion(e.p, "rgba(255,210,90,1)");
        state.score += Math.round(120 + (60 - e.baseR) * 2);

        // 移除敵人
        state.enemies = state.enemies.filter((x) => x.id !== e.id);
        state.missiles.splice(i, 1);
      }
    }
  }

  function updateParticles() {
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.p = p.p.add(p.v);
      p.v = p.v.mul(0.98);
      p.life -= 1;
      if (p.life <= 0) state.particles.splice(i, 1);
    }
  }

  function checkShipCollision() {
    // 玩家在 (0,0)
    const shipR = state.ship.r;

    // 1) 敵人本體靠太近
    for (const e of state.enemies) {
      if (e.p.length < shipR + e.baseR * 0.85) return true;

      // 2) 頂點小艇：計算每個頂點 + 舟繞行位置
      const verts = computeEnemyVertices(e);
      const t = now() / 1000;
      for (let i = 0; i < verts.length; i++) {
        const vtx = verts[i];
        const boat = e.boats[i];
        const orbitPos = vtx.add(
          polar(boat.orbitR, t * boat.orbitSpeed + boat.phase)
        );
        if (orbitPos.length < shipR + boat.r) return true;
      }
    }
    return false;
  }

  // =============== 多邊形頂點（用三角函數繪製多邊形） ===============
  function computeEnemyVertices(e) {
    const verts = [];
    const n = e.sides;
    const t = now() / 1000;

    // wobble 讓多邊形有生命感（小幅呼吸）
    const wobble = 1 + Math.sin(t * e.wobbleF) * e.wobbleA;

    for (let i = 0; i < n; i++) {
      const a = e.rot + (i * Math.PI * 2) / n;
      const r = e.baseR * wobble;
      verts.push(e.p.add(polar(r, a)));
    }
    return verts;
  }

  // =============== HUD 回呼（給 Vue 顯示） ===============
  function pushHud() {
    if (!onHud) return;
    onHud({
      phase: state.phase,
      score: state.score,
      elapsedMs: state.elapsedMs,
      loadingPercent: Math.floor(meta.loadingPercent),
      enemies: state.enemies.length,
    });
  }

  // =============== 主迴圈 ===============
  let lastTs = 0;
  function tick(ts) {
    if (!running) return;
    rafId = requestAnimationFrame(tick);

    const { w, h } = resizeToDisplaySize();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(1, 1);

    const dt = clamp((ts - lastTs) / 1000, 0, 0.033);
    lastTs = ts;

    // 更新 mouse 世界座標（以畫面中心為 (0,0)）
    const cx = w / 2;
    const cy = h / 2;

    const mx = state.mouse.x * dpr;
    const my = state.mouse.y * dpr;

    const world = new Vec2(mx - cx, my - cy);
    state.mouse.world = world;
    state.mouse.angle = world.angle;
    state.mouse.dist = world.length;

    // ========= phase 更新 =========
    if (state.phase === "loading") {
      meta.loadingPercent = clamp(
        meta.loadingPercent + meta.loadingSpeed,
        0,
        100
      );
      if (meta.loadingPercent >= 100) {
        state.phase = "briefing";
      }
    } else if (state.phase === "playing") {
      if (!state.startAt) state.startAt = now();
      state.elapsedMs = Math.max(0, now() - state.startAt);

      updateRadar(dt);
      updateEnemies(dt);

      // 光束照到敵人 => 自動發射飛彈
      const target = findBeamTarget();
      if (target) fireMissile(target);

      updateMissiles(dt);
      updateParticles();

      // 撞擊死亡
      if (checkShipCollision()) {
        state.phase = "dead";
      }
    }

    // ========= 渲染 =========
    drawScene(w, h);

    pushHud();
  }

  // =============== 渲染：黑底方格 / 雷達 / 光束 / 敵人 / 小艇 / 飛彈 / 粒子 / 玩家 ===============
  function drawScene(w, h) {
    // 背景黑
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    // 以畫面中心當世界原點
    ctx.save();
    ctx.translate(w / 2, h / 2);

    drawGrid(w, h);
    drawRadar();
    drawBeam();

    drawEnemies();
    drawMissiles();
    drawParticles();

    drawShip();

    ctx.restore();

    // overlay
    if (state.phase === "briefing") drawBriefingOverlay(w, h);
    if (state.phase === "dead") drawDeadOverlay(w, h);
  }

  function drawGrid(w, h) {
    // 黑底方格（類似你前面作品的格線）
    const step = 60;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    // 因為世界原點在中心，畫格線要從 -w/2 到 w/2
    for (let x = -w; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, -h);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = -h; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(-w, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRadar() {
    const t = now();
    // 雷達脈衝圈
    for (const pulse of state.radar.pulses) {
      const a = 1 - pulse.r / state.radar.maxR;
      ctx.beginPath();
      ctx.arc(0, 0, pulse.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(120,240,180,${clamp(a, 0, 1) * 0.55})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 被偵測到的敵人：畫一個 marker（顯示位置一小段時間）
    for (const e of state.enemies) {
      if (t > e.revealedUntil) continue;
      const a = clamp((e.revealedUntil - t) / state.radar.revealMs, 0, 1);

      ctx.save();
      ctx.translate(e.p.x, e.p.y);
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + 0.55 * a})`;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, 0, e.baseR * 1.05, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawBeam() {
    // 極座標扇形/三角形光束（黃色）
    const ang = state.mouse.angle;
    const r = clamp(state.beam.maxR, 140, 900);

    ctx.save();
    ctx.rotate(ang);

    const half = state.beam.widthRad;
    const p1 = polar(r, -half);
    const p2 = polar(r, +half);

    // 用 gradient 讓光束更像掃描光
    const grad = ctx.createLinearGradient(0, 0, r, 0);
    grad.addColorStop(0, "rgba(255,210,90,0.12)");
    grad.addColorStop(1, "rgba(255,210,90,0.0)");

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 外框
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(p1.x, p1.y);
    ctx.moveTo(0, 0);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "rgba(255,210,90,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  function drawEnemies() {
    const t = now();
    for (const e of state.enemies) {
      const verts = computeEnemyVertices(e);

      // 多邊形本體
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(verts[0].x, verts[0].y);
      for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
      ctx.closePath();

      // 顏色：偵測到時更亮
      const revealed = t <= e.revealedUntil;
      ctx.fillStyle = revealed
        ? "rgba(120,180,255,0.22)"
        : "rgba(255,255,255,0.08)";
      ctx.strokeStyle = revealed
        ? "rgba(160,220,255,0.75)"
        : "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // 敵人中心點
      ctx.beginPath();
      ctx.arc(e.p.x, e.p.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fill();

      // 頂點小艇：繞行（可防禦/撞擊的視覺）
      const sec = t / 1000;
      for (let i = 0; i < verts.length; i++) {
        const boat = e.boats[i];
        const vtx = verts[i];
        const orb = vtx.add(
          polar(boat.orbitR, sec * boat.orbitSpeed + boat.phase)
        );

        // 小艇外圈
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, boat.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,120,120,0.55)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function drawMissiles() {
    for (const m of state.missiles) {
      ctx.save();
      ctx.translate(m.p.x, m.p.y);

      // 飛彈方向（用速度向量角度）
      const a = m.v.angle;
      ctx.rotate(a);

      // 小箭頭（飛彈）
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-8, 4);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,230,160,0.95)";
      ctx.fill();

      ctx.restore();
    }
  }

  function drawParticles() {
    for (const p of state.particles) {
      const a = clamp(p.life / 46, 0, 1);
      ctx.beginPath();
      ctx.arc(p.p.x, p.p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(",1)", `,${a})`);
      ctx.fill();
    }
  }

  function drawShip() {
    // 玩家船艦（簡單三角形）
    ctx.save();
    const ang = state.mouse.angle;
    ctx.rotate(ang);

    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-12, -10);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.stroke();

    // 船艦雷達核心
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120,240,180,0.9)";
    ctx.fill();

    ctx.restore();
  }

  function drawBriefingOverlay(w, h) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `${18 * dpr}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillText(
      "任務：活下去。雷達會顯示敵人位置，光束照到敵人會自動發射飛彈。",
      22 * dpr,
      44 * dpr
    );

    ctx.font = `${14 * dpr}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText(
      "操作：移動滑鼠控制黃色光束。按下 Enter 開始。",
      22 * dpr,
      70 * dpr
    );

    ctx.restore();
  }

  function drawDeadOverlay(w, h) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = `${24 * dpr}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillText("船艦被摧毀", 22 * dpr, 52 * dpr);

    ctx.font = `${14 * dpr}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fillText(
      `存活時間：${formatMs(state.elapsedMs)}   分數：${state.score}`,
      22 * dpr,
      80 * dpr
    );
    ctx.fillText("按下 R 重新開始。", 22 * dpr, 104 * dpr);

    ctx.restore();
  }

  function formatMs(ms) {
    const total = Math.floor(ms);
    const m = Math.floor(total / 60000);
    const s = Math.floor((total % 60000) / 1000);
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  // =============== 對外 API ===============
  function init() {
    // 初始化狀態
    state.phase = "loading";
    meta.loadingPercent = 0;

    state.startAt = 0;
    state.elapsedMs = 0;
    state.score = 0;

    state.enemies = [];
    state.missiles = [];
    state.particles = [];
    state.radar.pulses = [];
    state.radar.lastEmitAt = now();
    state.spawn.lastSpawnAt = now();

    // 初始滑鼠放中間（避免 angle NaN）
    const rect = canvas.getBoundingClientRect();
    state.mouse.x = rect.width / 2;
    state.mouse.y = rect.height / 2;

    pushHud();
  }

  function start() {
    // briefing -> playing
    if (state.phase === "briefing") {
      state.phase = "playing";
      state.startAt = now();
      state.elapsedMs = 0;
      state.score = 0;

      // 開局先給幾隻敵人
      for (let i = 0; i < 6; i++) state.enemies.push(makeEnemy());
      emitRadar();
    }
  }

  function restart() {
    init();
  }

  function destroy() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function setMouse(x, y) {
    state.mouse.x = x;
    state.mouse.y = y;
  }

  function keyDown(key) {
    const k = String(key).toLowerCase();
    if (k === "enter") start();
    if (k === "r") restart();
  }

  function run() {
    if (running) return;
    running = true;
    lastTs = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  return { init, run, destroy, setMouse, keyDown, start, restart };
}
