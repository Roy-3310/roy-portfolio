<template>
  <PageHero
    title="職訓局學習歷程"
    subtitle="整理課程內容與學習重點：設計思路、技術應用、成果展示。"
  />

  <section class="container">
    <div class="grid grid-3">
      <BaseCard
        v-for="p in list"
        :key="p.id"
        clickable
        :onClick="() => go(p.id)"
      >
        <div class="thumb">
          <img :src="p.cover" :alt="p.name" />
        </div>
        <div class="name">{{ p.name }}</div>
        <div class="muted small">{{ p.summary }}</div>
        <div class="hr"></div>
        <div class="muted small">點擊查看詳細說明</div>
      </BaseCard>
    </div>
  </section>

  <div style="height: 22px"></div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { trainingProjects as list } from "../../../data/projects.training";

import PageHero from "../../../components/layout/PageHero.vue";
import BaseCard from "../../../components/ui/BaseCard.vue";

const router = useRouter();
const go = (id) => router.push(`/projects/training/${id}`);
</script>

<style lang="scss" scoped>
.thumb {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 165px;
    object-fit: cover;
  }
}

.name {
  font-weight: 900;
}
.small {
  font-size: 13px;
}
</style>
