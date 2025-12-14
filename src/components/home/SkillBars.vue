<template>
  <div class="skills">
    <div v-for="s in skills" :key="s.name" class="item">
      <div class="row">
        <div class="name">{{ s.name }}</div>
        <div class="val muted">{{ s.level }}%</div>
      </div>
      <div class="bar">
        <div class="fill" :style="{ width: `${s.level}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  skills: { type: Array, required: true },
});
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;

.skills {
  display: grid;
  gap: 12px;
}

.item {
  display: grid;
  gap: 8px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name {
  font-weight: 650;
}

.bar {
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid $line;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(80, 220, 80, 0.9),
    rgba(80, 220, 80, 0.25)
  );
}
</style>
