<!-- src/components/canvas/RadarShooterDemo.vue -->
<template>
  <div class="wrap">
    <div class="hud">
      <div class="row">
        <div class="title">Radar Beam Shooter</div>
        <div class="meta">
          <span class="pill">Phase: {{ hud.phase }}</span>
          <span class="pill">Enemies: {{ hud.enemies }}</span>
          <span class="pill">Score: {{ hud.score }}</span>
          <span
            class="pill"
            v-if="hud.phase === 'playing' || hud.phase === 'dead'"
          >
            Time: {{ fmt(hud.elapsedMs) }}
          </span>
          <span class="pill" v-if="hud.phase === 'loading'">
            Loading: {{ hud.loadingPercent }}%
          </span>
        </div>
      </div>

      <div class="hint">操作：移動滑鼠控制黃色光束｜Enter 開始｜R 重新開始</div>
    </div>

    <div class="stage" ref="stageRef">
      <canvas ref="canvasRef" class="canvas"></canvas>
    </div>

    <div class="desc">
      <div class="descTitle">作品說明</div>
      <ul>
        <li>
          使用「極座標扇形光束」實作滑鼠掃描光束，照到敵人會自動發射飛彈。
        </li>
        <li>玩家會定期放出雷達脈衝；敵人被掃到後只會顯示位置一小段時間。</li>
        <li>
          敵人本體用「三角函數繪製多邊形」，每個頂點都有小艇繞行，具備撞擊威脅。
        </li>
        <li>
          遊戲以 requestAnimationFrame 更新迴圈，避免 setInterval
          造成的卡頓與漂移。
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { createRadarShooter } from "@/projects/radarShooter/createRadarShooter";

const canvasRef = ref(null);
const stageRef = ref(null);

const hud = reactive({
  phase: "loading",
  score: 0,
  elapsedMs: 0,
  loadingPercent: 0,
  enemies: 0,
});

let game = null;

function fmt(ms) {
  const total = Math.floor(ms);
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getLocalPos(evt) {
  const el = stageRef.value;
  if (!el) return { x: 0, y: 0 };
  const r = el.getBoundingClientRect();
  return { x: evt.clientX - r.left, y: evt.clientY - r.top };
}

function onMouseMove(e) {
  if (!game) return;
  const p = getLocalPos(e);
  game.setMouse(p.x, p.y);
}

function onKeyDown(e) {
  if (!game) return;
  game.keyDown(e.key);
}

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  // 建立遊戲，HUD 用 callback 回填
  game = createRadarShooter(ctx, canvas, (nextHud) => {
    hud.phase = nextHud.phase;
    hud.score = nextHud.score;
    hud.elapsedMs = nextHud.elapsedMs;
    hud.loadingPercent = nextHud.loadingPercent;
    hud.enemies = nextHud.enemies;
  });

  game.init();
  game.run();

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("keydown", onKeyDown);
  if (game) game.destroy();
  game = null;
});
</script>

<style scoped lang="scss">
.wrap {
  display: grid;
  gap: 12px;
}

.hud {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  padding: 12px 14px;
  color: rgba(255, 255, 255, 0.92);

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .title {
    font-weight: 900;
    letter-spacing: 0.4px;
  }

  .meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .pill {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.25);
  }

  .hint {
    margin-top: 8px;
    font-size: 12px;
    opacity: 0.75;
  }
}

.stage {
  width: 100%;
  height: min(560px, 70vh);
  border-radius: 18px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.desc {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.88);

  .descTitle {
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
