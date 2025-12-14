<template>
  <div class="resume">
    <div class="block">
      <div class="label">自我簡介</div>
      <div class="content muted">{{ summary }}</div>
    </div>

    <div class="block">
      <div class="label">學歷</div>
      <div class="content muted">{{ resume.education }}</div>
    </div>

    <div class="block">
      <div class="label">經歷</div>
      <ol class="content muted">
        <li v-for="(x, i) in resume.experience" :key="i">{{ x }}</li>
      </ol>
    </div>

    <div class="block">
      <div class="label">語言</div>
      <ul class="content muted">
        <li v-for="(x, i) in resume.languages" :key="i">{{ x }}</li>
      </ul>
    </div>

    <div class="block">
      <div class="label">技能</div>
      <ul class="content muted">
        <li v-for="(x, i) in resume.strengths" :key="i">{{ x }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  summary: { type: String, required: true },
  resume: { type: Object, required: true },
});
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;

.resume {
  border: 1px solid $line;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.block {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid $line;

  @media (max-width: $bp-sm) {
    grid-template-columns: 1fr;
  }

  &:last-child {
    border-bottom: none;
  }
}

.label {
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.content {
  margin: 0;
  padding-left: 18px;
}
</style>
