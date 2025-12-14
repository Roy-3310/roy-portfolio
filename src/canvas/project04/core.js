import Vec2 from "@/utils/Vec2";

/**
 * Project04：Agar-like 即時吞噬模擬
 * - 多玩家（AI + 主玩家）
 * - 即時 Canvas 繪製
 * - 食物、吞噬、粒子、視角縮放
 */
export function createProject04(ctx, canvas) {
  let rafId; // requestAnimationFrame ID
  let time = 0; // 全域時間（frame 計數）

  /* ================= 世界設定 ================= */
  const WORLD = {
    w: 2000, // 世界寬度
    h: 2000, // 世界高度
    grid: 100, // 背景格線間距
  };

  /* ================= 數量限制 ================= */
  const LIMIT = {
    food: 180, // 同時存在的食物數
    player: 20, // 同時存在的玩家數
  };

  /* ================= 粒子系統 ================= */
  // 用於食物被吃掉時的視覺回饋
  const particles = [];

  /* ================= 全域狀態 ================= */
  const state = {
    me: null, // 主玩家（鏡頭追蹤目標）
    players: [], // 所有玩家（包含 AI）
    foods: [], // 食物陣列
    mouse: new Vec2(canvas.width / 2, canvas.height / 2), // 滑鼠位置
    scale: 1, // 世界縮放倍率（依主玩家大小）
  };

  /* ========================================================= */
  /* ================= 初始化 / 銷毀 ========================= */

  function init() {
    // 建立玩家（第一個為主玩家）
    for (let i = 0; i < LIMIT.player; i++) {
      createPlayer(i === 0);
    }

    // 建立食物
    for (let i = 0; i < LIMIT.food; i++) {
      createFood();
    }

    // 啟動主迴圈
    draw();
  }

  function destroy() {
    cancelAnimationFrame(rafId);
  }

  /* ========================================================= */
  /* ================= 建立物件 ============================== */

  // 隨機玩家顏色（使用 HSL 保持視覺一致）
  function randomColor() {
    return `hsl(${Math.random() * 360},70%,60%)`;
  }

  // 隨機食物顏色
  function randomFoodColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
  }

  /**
   * 建立食物被吃掉時的粒子效果
   * @param {Vec2} pos - 食物位置
   * @param {string} color - 食物顏色
   */
  function spawnFoodParticles(pos, color, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;

      particles.push({
        p: pos.clone(), // 粒子位置
        v: new Vec2(Math.cos(angle) * speed, Math.sin(angle) * speed), // 粒子速度
        life: 30 + Math.random() * 20, // 存活幀數
        color,
        r: Math.random() * 2 + 1, // 半徑
      });
    }
  }

  /**
   * 建立玩家
   * @param {boolean} isMe - 是否為主玩家
   */
  function createPlayer(isMe = false) {
    const baseMass = isMe
      ? 120 + Math.random() * 40 // 主玩家稍大
      : 30 + Math.random() * 120; // AI 玩家大小隨機

    const p = {
      p: new Vec2(Math.random() * WORLD.w, Math.random() * WORLD.h),
      v: new Vec2(), // 速度向量
      mass: baseMass, // 質量（影響半徑）
      r: Math.sqrt(baseMass),
      color: randomColor(),
      isMe,
      alive: true,

      // ===== AI 行為狀態 =====
      target: null, // 追逐目標（食物或玩家）
      targetType: null, // "food" | "player"
      aiMode: "wander", // "wander" | "chase"
    };

    state.players.push(p);
    if (isMe) state.me = p;
  }

  /**
   * 建立食物
   */
  function createFood() {
    state.foods.push({
      p: new Vec2(Math.random() * WORLD.w, Math.random() * WORLD.h),
      r: 3,
      color: randomFoodColor(),
    });
  }

  /**
   * 找最近的食物（給 AI 用）
   */
  function findNearestFood(pos, maxDist = 300) {
    let nearest = null;
    let minD = maxDist;

    state.foods.forEach((f) => {
      const d = pos.distance(f.p);
      if (d < minD) {
        minD = d;
        nearest = f;
      }
    });

    return nearest;
  }

  /* ========================================================= */
  /* ================= 更新邏輯 ============================== */

  /**
   * 更新粒子（位置、衰減、生命）
   * 注意：只能更新一次，不能放在玩家 loop 裡
   */
  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.p = pt.p.add(pt.v); // 移動
      pt.v = pt.v.mul(0.95); // 阻尼
      pt.life--; // 壽命遞減

      if (pt.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  /**
   * 確保一定存在主玩家
   * 避免 state.me 為 null 導致畫面崩潰
   */
  function ensureMe() {
    if (!state.me || !state.me.alive) {
      const next = state.players.find((p) => p.alive);
      if (next) {
        state.players.forEach((p) => (p.isMe = false));
        next.isMe = true;
        state.me = next;
      } else {
        // 極端情況：全部死光，補一個新主玩家
        createPlayer(true);
      }
    }
  }

  /**
   * 每幀更新（邏輯核心）
   */
  function update() {
    time++;

    /* 半徑與質量同步 */
    state.players.forEach((p) => {
      p.r = Math.sqrt(p.mass);
    });

    /* ================= 主玩家控制 ================= */
    if (state.me && state.me.alive) {
      const center = new Vec2(canvas.width / 2, canvas.height / 2);

      // 滑鼠方向向量
      const dir = state.mouse.sub(center);

      state.me.v = dir.unit.mul(1.4);
      state.me.p = state.me.p.add(state.me.v);
    }

    /* ================= AI 行為 ================= */
    state.players.forEach((p) => {
      if (p.isMe || !p.alive) return;

      // 若目標食物已被吃掉 → 放棄目標
      if (
        p.targetType === "food" &&
        p.target &&
        !state.foods.includes(p.target)
      ) {
        p.target = null;
        p.targetType = null;
        p.aiMode = "wander";
      }

      // 每 90 幀重新決策
      if (time % 90 === 0) {
        const food = findNearestFood(p.p, 400);
        if (food) {
          p.target = food;
          p.targetType = "food";
          p.aiMode = "chase";
        } else {
          const prey = state.players.filter(
            (o) => o !== p && o.alive && o.mass < p.mass * 0.9
          );

          if (prey.length && Math.random() < 0.4) {
            p.target = prey[Math.floor(Math.random() * prey.length)];
            p.targetType = "player";
            p.aiMode = "chase";
          } else {
            p.target = null;
            p.aiMode = "wander";
          }
        }
      }

      // 行為執行
      if (p.aiMode === "chase" && p.target) {
        const dir = p.target.p.sub(p.p).unit;
        p.p = p.p.add(dir.mul(1.2));
      } else {
        // 漂移行為
        p.p.x += Math.cos(time * 0.01 + p.mass) * 0.5;
        p.p.y += Math.sin(time * 0.01 + p.mass) * 0.5;
      }
    });

    /* ================= 世界邊界限制 ================= */
    state.players.forEach((p) => {
      p.p.x = Math.max(p.r, Math.min(WORLD.w - p.r, p.p.x));
      p.p.y = Math.max(p.r, Math.min(WORLD.h - p.r, p.p.y));
    });

    /* ================= 吃食物 ================= */
    state.players.forEach((p) => {
      state.foods = state.foods.filter((f) => {
        if (p.p.distance(f.p) < p.r) {
          p.mass += 5;
          spawnFoodParticles(f.p, f.color);
          return false;
        }
        return true;
      });
    });

    /* ================= 玩家互吃 ================= */
    state.players.forEach((a) => {
      state.players.forEach((b) => {
        if (
          a !== b &&
          a.alive &&
          b.alive &&
          a.mass > b.mass * 1.1 &&
          a.p.distance(b.p) < a.r
        ) {
          a.mass += b.mass * 0.8;
          b.alive = false;
        }
      });
    });

    /* 清理死亡玩家 */
    state.players = state.players.filter((p) => p.alive);

    /* 確保主玩家存在 */
    ensureMe();

    /* 自動補齊玩家與食物 */
    while (state.players.length < LIMIT.player) {
      createPlayer(false);
    }
    while (state.foods.length < LIMIT.food) {
      createFood();
    }

    /* 視角縮放（Agar-like 效果） */
    if (state.me) {
      state.scale = 80 / (state.me.r + 80);
    }

    /* 更新粒子 */
    updateParticles();
  }

  /* ========================================================= */
  /* ================= 繪圖 ================================ */

  function draw() {
    update();

    // 清空畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 黑色背景
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 防呆：主玩家不存在時不畫世界
    if (!state.me) {
      rafId = requestAnimationFrame(draw);
      return;
    }

    ctx.save();

    // 鏡頭鎖定主玩家
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(state.scale, state.scale);
    ctx.translate(-state.me.p.x, -state.me.p.y);

    drawGrid();
    drawFoods();
    drawParticles();
    drawPlayers();

    ctx.restore();

    rafId = requestAnimationFrame(draw);
  }

  /* ================= 繪圖子函式 ================= */

  function drawGrid() {
    ctx.strokeStyle = "#222";
    for (let x = 0; x <= WORLD.w; x += WORLD.grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD.h);
      ctx.stroke();
    }
    for (let y = 0; y <= WORLD.h; y += WORLD.grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD.w, y);
      ctx.stroke();
    }
  }

  function drawFoods() {
    state.foods.forEach((f) => {
      ctx.beginPath();
      ctx.arc(f.p.x, f.p.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = f.color;
      ctx.fill();
    });
  }

  function drawParticles() {
    particles.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.p.x, pt.p.y, pt.r, 0, Math.PI * 2);
      ctx.globalAlpha = Math.max(pt.life / 40, 0);
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function drawPlayers() {
    state.players
      .sort((a, b) => a.r - b.r)
      .forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.p.x, p.p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
  }

  /* ========================================================= */
  /* ================= 對外 API ============================== */

  return {
    init,
    destroy,
    setMouse(x, y) {
      state.mouse.set(x, y);
    },
  };
}
