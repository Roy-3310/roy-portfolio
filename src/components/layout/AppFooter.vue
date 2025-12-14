<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="left">
        <div class="brand">{{ profile.name }}</div>
        <div class="muted">
          © {{ year }} Portfolio. Built with Vue + Vite + SCSS.
        </div>
      </div>

      <div class="right">
        <a class="link" :href="profile.github" target="_blank" rel="noreferrer"
          >GitHub</a
        >
        <a
          class="link"
          :href="profile.linkedin"
          target="_blank"
          rel="noreferrer"
          >LinkedIn</a
        >
        <router-link class="link" to="/contact">Contact</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { siteProfile as profile } from "../../data/siteProfile";

const year = computed(() => new Date().getFullYear());
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.footer {
  border-top: 1px solid $line;
  padding: 26px 0;
  background: rgba(0, 0, 0, 0.18);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;

  @media (max-width: $bp-sm) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.brand {
  font-weight: 700;
  margin-bottom: 6px;
}

.right {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.link {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid $line;
  background: rgba(255, 255, 255, 0.05);
}
</style>
