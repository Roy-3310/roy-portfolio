<template>
  <div class="tabs">
    <div class="tabbar">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: t.key === activeKey }"
        @click="activeKey = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="panel">
      <slot :active="activeTab">
        <p class="muted" style="margin: 0; white-space: pre-line">
          {{ activeTab?.content ?? "" }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  tabs: { type: Array, required: true },
  defaultKey: { type: String, default: "" },
});

const activeKey = ref(props.defaultKey || props.tabs?.[0]?.key || "");

watch(
  () => props.defaultKey,
  (v) => {
    if (v) activeKey.value = v;
  }
);

const activeTab = computed(() =>
  props.tabs.find((x) => x.key === activeKey.value)
);
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;

.tabs {
  display: grid;
  gap: 10px;
}

.tabbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tab {
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid $line;
  background: rgba(255, 255, 255, 0.05);
  color: $muted;
  cursor: pointer;
  transition: all 160ms ease;

  &:hover {
    color: $text;
  }

  &.active {
    color: $text;
    border-color: rgba(80, 220, 80, 0.35);
    background: rgba(80, 220, 80, 0.12);
  }
}

.panel {
  border: 1px solid $line;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  padding: 14px;
}
</style>
