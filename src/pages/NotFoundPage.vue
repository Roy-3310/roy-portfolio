<template>
  <PageHero title="404" subtitle="找不到此頁面。" />
  <section class="container">
    <BaseCard>
      <p class="muted">你輸入的網址不存在，請回首頁或使用導覽列。</p>
      <BaseButton as="router-link" to="/" variant="primary">回首頁</BaseButton>
    </BaseCard>
  </section>
  <div style="height: 22px"></div>
</template>

<script setup>
import PageHero from "../components/layout/PageHero.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseButton from "../components/ui/BaseButton.vue";
</script>
