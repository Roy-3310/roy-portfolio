<template>
  <div class="canvas-wrap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref(null);

let ctx;
let time = 0;
let mouse = { x: 200, y: 200 };
let rafId;

// ================== 工具函式 ==================
function drawGrid() {
  ctx.beginPath();
  for (let i = 0; i <= 8; i++) {
    let pos = i * 50;
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, 400);
    ctx.moveTo(0, pos);
    ctx.lineTo(400, pos);
  }
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.stroke();
}

function drawGround() {
  ctx.fillStyle = "#9ccc65";
  ctx.fillRect(0, 350, 400, 50);

  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.lineTo(400, 350);
  ctx.strokeStyle = "#555";
  ctx.stroke();
}

// ================== 建築（⚠️ 完整原版） ==================
function drawHouse(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 60, 50);
  ctx.strokeRect(x, y, 60, 50);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 30, y - 25);
  ctx.lineTo(x + 60, y);
  ctx.closePath();
  ctx.fillStyle = "#b71c1c";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fffde7";
  ctx.fillRect(x + 10, y + 15, 12, 12);
  ctx.fillRect(x + 38, y + 15, 12, 12);

  // 牆壁群
  ctx.fillStyle = "#cc3333";
  ctx.fillRect(300, 300, 50, 50);
  ctx.strokeRect(300, 300, 50, 50);

  ctx.beginPath();
  ctx.rect(250, 250, 50, 100);
  ctx.rect(50, 300, 50, 50);
  ctx.fillStyle = "#fcfc9c";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(100, 250, 50, 100);
  ctx.rect(200, 250, 50, 100);
  ctx.fillStyle = "#fa7c52";
  ctx.fill();
  ctx.stroke();

  // 拱門
  ctx.beginPath();
  ctx.moveTo(100, 200);
  ctx.lineTo(250, 200);
  ctx.lineTo(250, 250);
  ctx.lineTo(200, 250);
  ctx.arc(175, 250, 25, Math.PI * 2, Math.PI, true);
  ctx.lineTo(100, 250);
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  // 屋頂
  ctx.beginPath();
  ctx.moveTo(100, 200);
  ctx.lineTo(175, 150);
  ctx.lineTo(250, 200);
  ctx.closePath();
  ctx.fillStyle = "#cc3333";
  ctx.fill();
  ctx.stroke();

  // 旗子
  ctx.beginPath();
  ctx.moveTo(175, 150);
  ctx.lineTo(175, 100 - mouse.y / 5);
  ctx.lineTo(200, 110 - ((time * 0.2) % 10) - mouse.y / 5);
  ctx.lineTo(175, 120 - mouse.y / 5);
  ctx.closePath();
  ctx.fillStyle = `hsl(${mouse.x % 360},50%,50%)`;
  ctx.fill();
  ctx.stroke();
}

// ================== 樹木 ==================
function drawTree(x, y) {
  ctx.fillStyle = "#6d4c41";
  ctx.fillRect(x + 8, y + 25, 8, 25);

  ctx.beginPath();
  ctx.arc(x + 12, y + 20, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#2e7d32";
  ctx.fill();
}

// ================== 花草 ==================
function drawFlower(x, y, offset) {
  ctx.beginPath();
  ctx.arc(x, y + Math.sin(time / 10 + offset) * 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = "pink";
  ctx.fill();
}

// ================== 雲朵 ==================
function drawCloud(x, y) {
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.arc(x + 15, y - 5, 14, 0, Math.PI * 2);
  ctx.arc(x + 30, y, 12, 0, Math.PI * 2);
  ctx.fill();
}

// ================== 車子 ==================
function drawCar() {
  let carX = ((time * 0.5) % 450) - 50;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(carX, 320, 50, 20);
  ctx.strokeRect(carX, 320, 50, 20);

  ctx.beginPath();
  ctx.arc(carX + 10, 345, 5, 0, Math.PI * 2);
  ctx.arc(carX + 40, 345, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
}

// ================== 主繪圖（⚠️ 完整順序） ==================
function draw() {
  time++;
  ctx.clearRect(0, 0, 400, 400);

  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, "#90caf9");
  sky.addColorStop(1, "#e3f2fd");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 400, 300);

  drawGrid();
  drawGround();

  drawCloud(50 + ((time * 0.3) % 450), 80);
  drawCloud(200 + ((time * 0.2) % 450), 60);

  drawHouse(0, 300, "#ffcc80");
  drawHouse(140, 300, "#bcaaa4");
  drawHouse(350, 300, "#ffe082");

  drawTree(90, 300);
  drawTree(220, 300);

  for (let i = 0; i < 10; i++) {
    drawFlower(30 + i * 35, 360, i);
  }

  drawCar();

  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();

  rafId = requestAnimationFrame(draw);
}

onMounted(() => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext("2d");

  canvas.width = 400;
  canvas.height = 400;

  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  });

  draw();
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>
