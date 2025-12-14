<template>
  <div class="canvas-wrap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { createProject04 } from "@/canvas/project04/core";

const canvasRef = ref(null);
let game;

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  canvas.width = 500;
  canvas.height = 500;

  game = createProject04(ctx, canvas);
  game.init();

  canvas.addEventListener("mousemove", (e) => {
    game.setMouse(e.offsetX, e.offsetY);
  });
});

onUnmounted(() => {
  game?.destroy();
});
</script>

<style scoped>
.canvas-wrap {
  display: flex;
  justify-content: center;
  background: #000;
  padding: 12px;
}

canvas {
  background: #111;
  border-radius: 12px;
}
</style>
