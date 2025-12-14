<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="close">
      <div class="panel">
        <div class="top">
          <div class="title">{{ title }}</div>
          <button class="x" @click="close" aria-label="close">×</button>
        </div>

        <div class="body">
          <img :src="src" :alt="title" />
          <div v-if="meta" class="meta muted">{{ meta }}</div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: "" },
  title: { type: String, default: "" },
  meta: { type: String, default: "" },
});
const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: grid;
  place-items: center;
  z-index: 999;
  padding: 18px;
}

.panel {
  width: min(980px, 100%);
  border: 1px solid $line;
  border-radius: 18px;
  background: rgba(11, 15, 20, 0.92);
  overflow: hidden;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid $line;
}

.title {
  font-weight: 700;
}

.x {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid $line;
  background: rgba(255, 255, 255, 0.06);
  color: $text;
  font-size: 20px;
  cursor: pointer;
}

.body {
  padding: 14px;
  display: grid;
  gap: 10px;
}

img {
  width: 100%;
  height: auto;
  border-radius: 14px;
  border: 1px solid $line;
}

.meta {
  font-size: 13px;
}
</style>
