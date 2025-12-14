<template>
  <div class="row">
    <h2 class="h2">{{ title }}</h2>
    <p v-if="desc" class="muted">{{ desc }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  desc: { type: String, default: "" },
});
</script>

<style lang="scss" scoped>
.h2 {
  margin: 0;
  font-size: 20px;
}
.row {
  display: grid;
  gap: 6px;
  margin: 18px 0 10px;
}
</style>
