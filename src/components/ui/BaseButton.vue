<template>
  <component
    :is="as"
    :to="to"
    :href="href"
    :target="target"
    :rel="rel"
    class="btn"
    :class="variant"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  as: { type: String, default: "button" }, // "button" | "a" | "router-link"
  to: { type: [String, Object], default: null },
  href: { type: String, default: "" },
  target: { type: String, default: "" },
  rel: { type: String, default: "" },
  variant: { type: String, default: "primary" }, // primary | ghost
});
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid $line;
  cursor: pointer;
  font-weight: 650;
  letter-spacing: 0.2px;
  transition: transform 160ms ease, background 160ms ease,
    border-color 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &.primary {
    background: rgba(80, 220, 80, 0.14);
    border-color: rgba(80, 220, 80, 0.35);
  }

  &.ghost {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
