<template>
  <div class="card" :class="{ clickable }" @click="onClick">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  clickable: { type: Boolean, default: false },
  onClick: { type: Function, default: null },
});
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.card {
  @include card;
  padding: 16px;
}

.clickable {
  cursor: pointer;
  @include hoverLift;
}
</style>
