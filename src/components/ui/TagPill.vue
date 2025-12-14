<template>
  <span class="pill"><slot /></span>
</template>

<style lang="scss" scoped>
@use "../../styles/variables" as *;
.pill {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid $line;
  background: rgba(255, 255, 255, 0.05);
  color: $muted;
  font-size: 12px;
  line-height: 1;
}
</style>
