<template>
  <PageHero
    title="程式設計類作品"
    subtitle="Unity 遊戲（圖片 + 說明）／網頁互動／網頁小遊戲。點擊進入每個作品的詳細頁（含內部分頁）。"
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

        <div class="top">
          <div class="name">{{ p.name }}</div>
          <TagPill>{{ p.category }}</TagPill>
        </div>

        <div class="muted small">{{ p.summary }}</div>

        <div class="hr"></div>

        <div class="muted small">點擊查看：設計理念 / 使用技術 / 特色功能</div>
      </BaseCard>
    </div>
  </section>

  <div style="height: 22px"></div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { devProjects as list } from "../../../data/projects.dev";

import PageHero from "../../../components/layout/PageHero.vue";
import BaseCard from "../../../components/ui/BaseCard.vue";
import TagPill from "../../../components/ui/TagPill.vue";

const router = useRouter();
const go = (id) => router.push(`/projects/dev/${id}`);
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

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.name {
  font-weight: 900;
}

.small {
  font-size: 13px;
}
</style>
