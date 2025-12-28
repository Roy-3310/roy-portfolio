<template>
  <div class="wrap">
    <!-- =========================================================
      PHASE 1: Loading（載入中）
      - 進度條 0→100
      - Loading 怪物
    ========================================================== -->
    <section
      v-if="phase === 'loading'"
      class="pageLoading"
      aria-label="loading"
    >
      <div class="loadingMonster" aria-hidden="true">
        <div class="eye">
          <div
            class="eyeball"
            :style="{ transform: `translateX(${loadingEyeOffsetX}px)` }"
          ></div>
        </div>
        <div class="mouth"></div>
      </div>

      <div class="loadingBox">
        <div class="loadingTitle">Loading...</div>
        <div class="loading">
          <div class="bar" :style="{ width: loadingPercent + '%' }"></div>
        </div>
        <div class="loadingPercent">{{ loadingPercent }}%</div>
      </div>
    </section>

    <!-- =========================================================
      PHASE 2: Briefing（任務說明 / 開始按鈕）
      - 顯示本關任務（每種顏色要擊殺幾隻）
      - Start 後才正式計時
    ========================================================== -->
    <section
      v-else-if="phase === 'briefing'"
      class="overlay"
      aria-label="briefing"
    >
      <div class="panel">
        <div class="panelTitle">關卡 {{ level }} 任務</div>

        <div class="panelDesc">
          畫面載入後，你可以點擊怪物射擊得分。完成任務即通關，下一關會更難。
        </div>

        <div class="mission">
          <div class="missionRow" v-for="c in COLOR_KEYS" :key="c">
            <span class="badge" :class="`b-${c}`"></span>
            <span class="label">{{ colorName(c) }}</span>
            <span class="need">需要擊殺：{{ mission.need[c] }} 隻</span>
            <span class="done">已擊殺：{{ mission.kills[c] }} 隻</span>
          </div>
        </div>

        <div class="panelHint">
          操作：滑鼠移動瞄準｜點擊怪物射擊｜K 切換怪物移動｜R 重新開始（回到
          Loading）
        </div>

        <div class="panelActions">
          <button class="btn primary" @click="startLevel">開始任務</button>
          <button class="btn ghost" @click="restartToLoading">重新開始</button>
        </div>
      </div>
    </section>

    <!-- =========================================================
      PHASE 3: Playing（遊戲進行中）
      - HUD（分數 / 任務進度 / 計時）
      - Arena（黑底方格 / 準星 / 彈孔 / 怪物 / 粒子）
    ========================================================== -->
    <section v-else-if="phase === 'playing'" class="game">
      <div class="hud">
        <div class="hudLeft">
          <div class="score">Score: {{ score }}</div>
          <div class="time">Time: {{ formatMs(elapsedMs) }}</div>
        </div>

        <div class="hudRight">
          <div class="progressTitle">任務進度</div>
          <div class="progressList">
            <div class="progressItem" v-for="c in COLOR_KEYS" :key="c">
              <span class="badge" :class="`b-${c}`"></span>
              <span class="label">{{ colorName(c) }}</span>
              <span class="count"
                >{{ mission.kills[c] }} / {{ mission.need[c] }}</span
              >
            </div>
          </div>
          <div class="hint">K：切換移動｜R：重新開始（回到 Loading）</div>
        </div>
      </div>

      <div
        class="arena"
        ref="arenaRef"
        @mousemove="onMouseMove"
        @click="onArenaClick"
        aria-label="arena"
      >
        <!-- 黑底方格 -->
        <div class="grid"></div>

        <!-- 準星（隱藏游標） -->
        <div
          class="crosshair"
          :style="{ left: mouse.x + 'px', top: mouse.y + 'px' }"
        ></div>

        <!-- 彈孔 -->
        <div
          v-for="s in shots"
          :key="s.id"
          class="spot"
          :style="{ left: s.x + 'px', top: s.y + 'px' }"
        ></div>

        <!-- 怪物-->
        <button
          v-for="m in monsters"
          :key="m.id"
          class="monster"
          :class="[m.variant, { hit: m.hit }]"
          :style="monsterStyle(m)"
          @click.stop="shootMonster(m)"
        >
          <div class="eye">
            <div
              class="eyeball"
              :style="{ transform: `translateX(${m.eyeOffsetX}px)` }"
            ></div>
          </div>
          <div class="mouth"></div>
        </button>

        <!-- 粒子特效 -->
        <div
          v-for="p in particles"
          :key="p.id"
          class="particle"
          :style="{
            left: p.x + 'px',
            top: p.y + 'px',
            width: p.size + 'px',
            height: p.size + 'px',
            backgroundColor: p.color,
            opacity: Math.max(p.life / 40, 0),
          }"
        ></div>
      </div>

      <!-- 作品說明 -->
      <div class="desc">
        <div class="title">作品說明</div>
        <ul>
          <li>
            結合「時間函數 Loading」與「事件觸發射擊」：載入完成後進入射擊關卡。
          </li>
          <li>
            怪物以 DOM + CSS
            造型呈現；眼睛為正圓，並以低頻率隨機左右看，增加生命感。
          </li>
          <li>
            擊殺怪物獲得分數並產生粒子特效；場上怪物維持一定數量並自動補齊。
          </li>
          <li>
            任務與關卡：每關要求擊殺不同顏色怪物數量，越後面越難，並記錄通關耗時。
          </li>
        </ul>
      </div>
    </section>

    <!-- =========================================================
      PHASE 4: Complete（通關結算 / 下一關）
    ========================================================== -->
    <section
      v-else-if="phase === 'complete'"
      class="overlay"
      aria-label="complete"
    >
      <div class="panel">
        <div class="panelTitle">關卡 {{ level }} 完成</div>
        <div class="panelDesc">
          通關時間：<b>{{ formatMs(elapsedMs) }}</b
          >　 本關得分：<b>{{ score }}</b>
        </div>

        <div class="mission doneBlock">
          <div class="missionRow" v-for="c in COLOR_KEYS" :key="c">
            <span class="badge" :class="`b-${c}`"></span>
            <span class="label">{{ colorName(c) }}</span>
            <span class="need">目標：{{ mission.need[c] }}</span>
            <span class="done">完成：{{ mission.kills[c] }}</span>
          </div>
        </div>

        <div class="panelActions">
          <button class="btn primary" @click="nextLevel">下一關</button>
          <button class="btn ghost" @click="restartToLoading">
            重新開始（回到 Loading）
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from "vue";

/* =========================================================
  顏色定義（怪物種類）
  任務目標的 key
========================================================= */
const COLOR_KEYS = ["green", "blue", "pink"];

/* 文字顯示用 */
function colorName(k) {
  if (k === "green") return "綠色怪物";
  if (k === "blue") return "藍色怪物";
  return "粉色怪物";
}

/* =========================================================
  Phase 狀態機
  - loading -> briefing -> playing -> complete
========================================================= */
const phase = ref("loading");

/* =========================================================
  DOM ref：arena 尺寸計算
========================================================= */
const arenaRef = ref(null);
function arenaRect() {
  const el = arenaRef.value;
  return el ? el.getBoundingClientRect() : null;
}

/* =========================================================
  Loading 狀態
========================================================= */
const loadingPercent = ref(0);
const loadingEyeOffsetX = ref(0);
let loadingTimer = null;
let loadingEyeTimer = null;

/* =========================================================
  遊戲狀態（分數、關卡、時間）
========================================================= */
const score = ref(0);
const level = ref(1);

const startTime = ref(0); // ms timestamp（遊戲開始）
const elapsedMs = ref(0); // 經過時間（更新顯示用）

/* =========================================================
  任務：need（目標）與 kills（目前擊殺）
  - 每關任務會重新生成（隨機）
========================================================= */
const mission = reactive({
  need: { green: 0, blue: 0, pink: 0 },
  kills: { green: 0, blue: 0, pink: 0 },
});

/* =========================================================
  輸入：滑鼠位置（準星）
========================================================= */
const mouse = reactive({ x: 0, y: 0 });

/* =========================================================
  彈孔（點擊 arena 留下）
========================================================= */
const shots = ref([]);
let shotId = 1;

/* =========================================================
  怪物資料
========================================================= */
const monsters = ref([]);
let monsterId = 1;

const moving = ref(true); // K 切換移動

/* =========================================================
  粒子資料
========================================================= */
const particles = ref([]);
let particleId = 1;

/* =========================================================
  難度參數（會隨關卡增加）
========================================================= */
function difficultyConfig(lv) {
  // 場上維持怪物數量：越後面越多
  const limitMonsters = Math.min(8 + lv * 2, 26);

  // 怪物補充節奏：越後面越快補
  const spawnEveryMs = Math.max(900 - lv * 80, 320);

  // 怪物速度倍率：越後面越快
  const speedMul = 1 + lv * 0.12;

  return { limitMonsters, spawnEveryMs, speedMul };
}

/* =========================================================
  任務生成（隨機且越後面越難）
  - 需求：每種顏色要擊殺各幾隻
========================================================= */
function generateMission(lv) {
  // 清空 kills
  for (const c of COLOR_KEYS) mission.kills[c] = 0;

  // 目標數量：基礎 + 關卡成長 + 隨機浮動
  const base = 1 + Math.floor(lv / 2); // lv1~2:1，lv3~4:2...
  for (const c of COLOR_KEYS) {
    mission.need[c] = base + Math.floor(Math.random() * (1 + Math.min(lv, 3)));
  }
}

/* =========================================================
  建立怪物
  - 隨機大小（越小越難點，但分數更高）
  - 隨機顏色種類（green/blue/pink）
  - 邊界不可超出 arena
  - 眼睛偶爾左右看：eyeOffsetX / nextEyeMoveAt
========================================================= */
function createMonster(cfg) {
  const rect = arenaRect();
  if (!rect) return;

  const size = 42 + Math.random() * 78; // 42~120
  const pad = 10;

  const variant = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
  const baseSpeed = (0.65 + Math.random() * 1.55) * cfg.speedMul;

  const x = pad + Math.random() * (rect.width - size - pad * 2);
  const y = pad + Math.random() * (rect.height - size - pad * 2);

  monsters.value.push({
    id: monsterId++,
    x,
    y,
    size,
    vx: (Math.random() < 0.5 ? -1 : 1) * baseSpeed,
    vy: (Math.random() < 0.5 ? -1 : 1) * baseSpeed,

    // 顏色分類（同時也是任務 key）
    variant,

    // 眼睛狀態（偶爾左右看）
    eyeOffsetX: 0,
    nextEyeMoveAt: performance.now() + 800 + Math.random() * 2200,

    //  命中回饋狀態（新增）
    hit: false, // 是否正在命中狀態
    hitUntil: 0, // 命中結束時間（timestamp）
  });
}

/* =========================================================
  維持怪物數量（自動補齊）
========================================================= */
function ensureMonsters(cfg) {
  while (monsters.value.length < cfg.limitMonsters) {
    createMonster(cfg);
  }
}

/* =========================================================
  更新怪物（移動 + 邊界反彈 + 眼睛偶爾左右看）
========================================================= */
function updateMonsters(cfg) {
  const rect = arenaRect();
  if (!rect) return;

  updateMonsterEyes();

  if (!moving.value) return;

  for (const m of monsters.value) {
    // 移動
    m.x += m.vx;
    m.y += m.vy;

    // 邊界：不可超出 arena（反彈）
    if (m.x <= 0) {
      m.x = 0;
      m.vx *= -1;
    }
    if (m.y <= 0) {
      m.y = 0;
      m.vy *= -1;
    }
    if (m.x + m.size >= rect.width) {
      m.x = rect.width - m.size;
      m.vx *= -1;
    }
    if (m.y + m.size >= rect.height) {
      m.y = rect.height - m.size;
      m.vy *= -1;
    }
  }
}

function updateMonsterEyes() {
  const now = performance.now();
  for (const m of monsters.value) {
    if (now >= m.nextEyeMoveAt) {
      const dir = [-1, 0, 1][Math.floor(Math.random() * 3)];
      const maxOffset = Math.max(3, m.size * 0.06);
      m.eyeOffsetX = dir * maxOffset;
      m.nextEyeMoveAt = now + 800 + Math.random() * 2200;
    }
  }
}

/* =========================================================
  射擊怪物
  - 點擊怪物
  - 得分：越小分數越高
  - 增加該顏色擊殺數
  - 粒子特效
  - 移除怪物
  - 檢查任務是否完成
========================================================= */
function shootMonster(m) {
  // 分數
  const pts = Math.max(10, Math.round((150 - m.size) * 2));
  score.value += pts;

  // 任務擊殺數
  mission.kills[m.variant] += 1;

  // 🔥 命中回饋：設定 hit 狀態（約 120ms）
  m.hit = true;
  m.hitUntil = performance.now() + 120;

  // 🔥 粒子特效
  spawnMonsterParticles(m);

  // ⏱ 短延遲後再真正移除（讓動畫能播放）
  setTimeout(() => {
    monsters.value = monsters.value.filter((x) => x.id !== m.id);

    // 任務完成檢查
    if (isMissionComplete()) {
      finishLevel();
    }
  }, 110);
}

/* 任務是否完成 */
function isMissionComplete() {
  return COLOR_KEYS.every((c) => mission.kills[c] >= mission.need[c]);
}

/* 通關：停止計時、切到 complete */
function finishLevel() {
  phase.value = "complete";
}

/* 下一關 */
function nextLevel() {
  level.value += 1;
  beginLoadingThenBriefing();
}

/* 重新開始（回到 Loading，從第 1 關） */
function restartToLoading() {
  level.value = 1;
  score.value = 0;
  beginLoadingThenBriefing();
}

/* =========================================================
  粒子：怪物死亡特效
========================================================= */
function spawnMonsterParticles(monster) {
  const count = 18;
  const cx = monster.x + monster.size / 2;
  const cy = monster.y + monster.size / 2;

  const color =
    monster.variant === "blue"
      ? "#3fa9f5"
      : monster.variant === "pink"
      ? "#ff6aa2"
      : "#8bc34a";

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.4 + 0.9;

    particles.value.push({
      id: particleId++,
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 18,
      size: 3 + Math.random() * 4,
      color,
    });
  }
}

/* 更新粒子 */
function updateParticles() {
  for (let i = particles.value.length - 1; i >= 0; i--) {
    const p = particles.value[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.life -= 1;
    if (p.life <= 0) particles.value.splice(i, 1);
  }
}

/* =========================================================
  Arena：滑鼠、彈孔
========================================================= */
function onMouseMove(e) {
  const r = arenaRect();
  if (!r) return;
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
}

function onArenaClick(e) {
  const r = arenaRect();
  if (!r) return;

  shots.value.push({
    id: shotId++,
    x: e.clientX - r.left,
    y: e.clientY - r.top,
  });

  // 限制彈孔數量，避免 DOM 過多
  if (shots.value.length > 42) shots.value.shift();
}

/* 怪物 style */
function monsterStyle(m) {
  return {
    left: m.x + "px",
    top: m.y + "px",
    width: m.size + "px",
    height: m.size + "px",
  };
}

/* =========================================================
  遊戲迴圈：使用 requestAnimationFrame（更順、更不會停頓）
  - 避免 setInterval 在多物件時產生「吃食物停頓」那類卡頓感
========================================================= */
let rafId = 0;
let lastTs = 0;
let spawnAcc = 0;

/* 啟動遊戲 loop */
function startLoop() {
  cancelAnimationFrame(rafId);
  lastTs = performance.now();
  spawnAcc = 0;

  const tick = (ts) => {
    const dt = ts - lastTs;
    lastTs = ts;

    // 只有 playing 才更新
    if (phase.value === "playing") {
      const cfg = difficultyConfig(level.value);

      // 計時顯示
      elapsedMs.value = Math.max(0, ts - startTime.value);

      // 補怪（以時間累積方式控制，避免 setInterval 漂移）
      spawnAcc += dt;
      if (spawnAcc >= cfg.spawnEveryMs) {
        spawnAcc = 0;
        ensureMonsters(cfg);
      }

      // 更新怪物與粒子
      updateMonsters(cfg);
      updateParticles();
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

/* 停止 loop */
function stopLoop() {
  cancelAnimationFrame(rafId);
}

/* =========================================================
  進入本關：briefing -> playing
========================================================= */
async function startLevel() {
  // 清空場景
  monsters.value = [];
  particles.value = [];
  shots.value = [];

  // 設定計時起點
  startTime.value = performance.now();
  elapsedMs.value = 0;

  // 先切換畫面
  phase.value = "playing";

  // ✅ 等 Vue 把 arena DOM 畫出來
  await nextTick();

  // 再初始化怪物（此時 arenaRef 一定存在）
  const cfg = difficultyConfig(level.value);
  ensureMonsters(cfg);
}

/* =========================================================
  Loading -> Briefing（每次關卡開始前都回到 loading 走一遍）
  - 符合「重新開始按鈕並且回到載入中，任務隨機」
========================================================= */
function beginLoadingThenBriefing() {
  // 先回到 loading
  phase.value = "loading";
  loadingPercent.value = 0;

  // 清空（避免上一局殘留）
  monsters.value = [];
  particles.value = [];
  shots.value = [];
  elapsedMs.value = 0;

  // 生成新任務（隨機 + 隨關卡變難）
  generateMission(level.value);

  // 模擬 loading 進度（你可以改成真資源載入）
  if (loadingTimer) clearInterval(loadingTimer);
  loadingTimer = setInterval(() => {
    loadingPercent.value += 1;
    if (loadingPercent.value >= 100) {
      loadingPercent.value = 100;
      clearInterval(loadingTimer);
      loadingTimer = null;

      // 進入 briefing（顯示任務）
      phase.value = "briefing";
    }
  }, 26);
}

/* =========================================================
  鍵盤事件：K 切換移動 / R 重新開始
========================================================= */
function onKeyDown(evt) {
  const k = evt.key.toLowerCase();
  if (k === "k") moving.value = !moving.value;
  if (k === "r") restartToLoading();
}

/* =========================================================
  時間格式化（mm:ss.ms）
========================================================= */
function formatMs(ms) {
  const total = Math.floor(ms);
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const t = Math.floor(total % 1000);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  const tt = String(t).padStart(3, "0");
  return `${mm}:${ss}.${tt}`;
}

/* =========================================================
  mounted / unmounted
========================================================= */
onMounted(() => {
  // Loading 怪物眼睛：用低頻 setInterval（省效能）
  loadingEyeTimer = setInterval(() => {
    loadingEyeOffsetX.value = Math.random() * 12 - 6; // -6 ~ +6
  }, 900);

  // 初始：走 loading -> briefing
  beginLoadingThenBriefing();

  // 開啟主 loop（rAF）
  startLoop();

  // 鍵盤
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  if (loadingTimer) clearInterval(loadingTimer);
  if (loadingEyeTimer) clearInterval(loadingEyeTimer);
  window.removeEventListener("keydown", onKeyDown);
  stopLoop();
});
</script>

<style scoped lang="scss">
/* =========================================================
  Layout
========================================================= */
.wrap {
  display: grid;
  gap: 14px;
}

/* =========================================================
  Overlay（Briefing / Complete）
========================================================= */
.overlay {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 10, 10, 0.88);
  padding: 18px;
  min-height: 360px;
  display: grid;
  place-items: center;
}

.panel {
  width: min(720px, 100%);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  padding: 16px 16px;
  color: rgba(255, 255, 255, 0.92);
  display: grid;
  gap: 12px;
}

.panelTitle {
  font-weight: 900;
  letter-spacing: 0.6px;
  font-size: 18px;
}

.panelDesc {
  opacity: 0.86;
  line-height: 1.6;
  font-size: 14px;
}

.panelHint {
  opacity: 0.7;
  font-size: 13px;
}

.panelActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  border-radius: 14px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 0.2px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
.btn.primary {
  background: linear-gradient(90deg, #8bc34a, #3fa9f5, #ff6aa2);
  border-color: transparent;
  color: #0b0b0b;

  &:hover {
    filter: brightness(1.05);
  }
}
.btn.ghost {
  background: transparent;
}

/* 任務列表 */
.mission {
  display: grid;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.missionRow {
  display: grid;
  grid-template-columns: 14px 110px 1fr 1fr;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.missionRow .label {
  font-weight: 800;
}
.missionRow .need,
.missionRow .done {
  opacity: 0.86;
}

/* 顏色 badge */
.badge {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  display: inline-block;
}
.b-green {
  background: #8bc34a;
}
.b-blue {
  background: #3fa9f5;
}
.b-pink {
  background: #ff6aa2;
}

/* =========================================================
  HUD
========================================================= */
.game {
  display: grid;
  gap: 14px;
}

.hud {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  padding: 12px 14px;
  color: rgba(255, 255, 255, 0.92);
}

.hudLeft {
  display: grid;
  gap: 6px;
}
.score {
  font-weight: 900;
  letter-spacing: 0.4px;
}
.time {
  opacity: 0.75;
  font-size: 13px;
}

.hudRight {
  display: grid;
  gap: 6px;
  min-width: 260px;
}

.progressTitle {
  font-weight: 900;
  font-size: 13px;
  opacity: 0.9;
}

.progressList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.progressItem {
  display: grid;
  grid-template-columns: 14px 84px 1fr;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  opacity: 0.92;
}

.progressItem .count {
  opacity: 0.85;
}

.hint {
  opacity: 0.7;
  font-size: 12px;
}

/* =========================================================
  Arena（黑底 + 格線 + 準星）
========================================================= */
.arena {
  position: relative;
  width: 100%;
  height: min(560px, 68vh);
  border-radius: 18px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: none; /* 隱藏系統游標 */
}

.grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.08) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.35;
}

/* 準星 */
.crosshair {
  position: absolute;
  width: 28px;
  height: 28px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.85);

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    background: rgba(255, 255, 255, 0.85);
    transform: translate(-50%, -50%);
  }
  &::before {
    width: 2px;
    height: 34px;
  }
  &::after {
    width: 34px;
    height: 2px;
  }
}

/* 彈孔 */
.spot {
  position: absolute;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.55);
  background: rgba(0, 0, 0, 0.45);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35) inset;
  pointer-events: none;
}

/* =========================================================
  Monster（DOM + CSS 造型）
  - 眼睛圓形 + 眼珠偶爾左右看（由 eyeOffsetX 驅動）
========================================================= */
.monster {
  position: absolute;
  border: none;
  padding: 0;
  border-radius: 14px;
  background: #8bc34a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  cursor: pointer;

  display: grid;
  place-items: center;
  gap: 10px;

  transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease;

  /* 讓按下時有手感 */
  &:active {
    transform: translateZ(0) scale(0.98);
  }

  .eye {
    width: 36%;
    aspect-ratio: 1 / 1; /* ✅ 強制正圓 */
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: grid;
    place-items: center;
    margin-top: 10%;
    overflow: hidden;
  }

  .eyeball {
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.88);
    transition: transform 0.35s ease; /* 左右看要平滑 */
  }

  .mouth {
    width: 56%;
    height: 16%;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.75);
    margin-bottom: 12%;
  }
}
/* 🔥 命中瞬間視覺回饋 */
.monster.hit {
  transform: scale(0.88); // 擠壓感
  filter: brightness(1.35) saturate(1.2); // 閃白
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.55),
    0 14px 40px rgba(0, 0, 0, 0.65);
}

.monster.blue {
  background: #3fa9f5;
}
.monster.pink {
  background: #ff6aa2;
}

/* 粒子 */
.particle {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(0.5px);
}

/* =========================================================
  Loading 視覺
========================================================= */
.pageLoading {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: #0b0b0b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  min-height: 360px;

  display: grid;
  place-items: center;
  padding: 22px;
}

.loadingMonster {
  width: 120px;
  height: 120px;
  border-radius: 18px;
  background: #8bc34a;
  display: grid;
  place-items: center;
  gap: 10px;
  margin-bottom: 14px;

  .eye {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: grid;
    place-items: center;
    overflow: hidden;
  }
  .eyeball {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.88);
    transition: transform 0.35s ease;
  }
  .mouth {
    width: 62px;
    height: 14px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.75);
  }
}

.loadingBox {
  width: min(520px, 100%);
  display: grid;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}
.loadingTitle {
  font-weight: 900;
  letter-spacing: 0.8px;
}
.loading {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}
.bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #8bc34a, #3fa9f5, #ff6aa2);
  transition: width 0.06s linear;
}
.loadingPercent {
  opacity: 0.75;
  font-size: 13px;
}

/* =========================================================
  作品說明
========================================================= */
.desc {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.88);

  .title {
    font-weight: 900;
    margin-bottom: 8px;
  }
  ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 6px;
    opacity: 0.88;
  }
}
</style>
