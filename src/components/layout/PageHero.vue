<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="text">
        <h1 class="title">{{ title }}</h1>
        <p v-if="subtitle" class="subtitle muted">{{ subtitle }}</p>
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.hero {
  padding: 34px 0 8px;
}
.title {
  margin: 0;
  font-size: 34px;
  line-height: 1.15;
}
.subtitle {
  margin: 10px 0 0;
  max-width: 70ch;
}
</style>
