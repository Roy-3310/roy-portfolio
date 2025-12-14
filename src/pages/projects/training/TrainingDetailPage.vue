<template>
  <PageHero
    :title="project?.name || '作品不存在'"
    :subtitle="project?.summary || '請回到列表頁選擇作品。'"
  >
    <div class="actions">
      <BaseButton as="router-link" to="/projects/training" variant="ghost">
        回職訓列表
      </BaseButton>
      <BaseButton as="router-link" to="/" variant="ghost"> 回首頁 </BaseButton>
    </div>
  </PageHero>

  <!-- ================= 主內容 ================= -->
  <section class="container" v-if="project">
    <div class="grid grid-2">
      <!-- ===== 左欄：可點擊截圖 ===== -->
      <BaseCard>
        <div class="cover" @click="openPreview(project.cover)">
          <img :src="project.cover" :alt="project.name" />
          <div class="zoomHint">點擊查看完整畫面</div>
        </div>
      </BaseCard>

      <!-- ===== 右欄：作品說明 ===== -->
      <BaseCard>
        <SectionTitle title="設計理念" />
        <p class="muted" style="white-space: pre-line">
          {{ project.concept }}
        </p>

        <div class="hr"></div>

        <SectionTitle title="使用技術" />
        <div class="tags">
          <TagPill v-for="t in project.tech" :key="t">{{ t }}</TagPill>
        </div>

        <div class="hr"></div>

        <SectionTitle title="詳細說明" />
        <p class="muted" style="white-space: pre-line">
          {{ project.details }}
        </p>
      </BaseCard>
    </div>
  </section>

  <!-- ===== 找不到作品 ===== -->
  <section class="container" v-else>
    <BaseCard>
      <div class="muted">找不到此作品（id：{{ $route.params.id }}）。</div>
    </BaseCard>
  </section>

  <!-- ================= Lightbox 全圖預覽 ================= -->
  <Teleport to="body">
    <div v-if="previewImage" class="lightbox" @click.self="closePreview">
      <img :src="previewImage" class="lightboxImage" />
      <button class="closeBtn" @click="closePreview">×</button>
    </div>
  </Teleport>

  <div style="height: 22px"></div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { trainingProjects } from "../../../data/projects.training";

import PageHero from "../../../components/layout/PageHero.vue";
import BaseCard from "../../../components/ui/BaseCard.vue";
import BaseButton from "../../../components/ui/BaseButton.vue";
import SectionTitle from "../../../components/ui/SectionTitle.vue";
import TagPill from "../../../components/ui/TagPill.vue";

/* ================= 資料 ================= */
const route = useRoute();
const project = computed(() =>
  trainingProjects.find((x) => x.id === route.params.id)
);

/* ================= Lightbox 狀態 ================= */
const previewImage = ref(null);

function openPreview(src) {
  previewImage.value = src;
}

function closePreview() {
  previewImage.value = null;
}
</script>

<style lang="scss" scoped>
/* ================= Hero actions ================= */
.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ================= Cover（可點擊截圖） ================= */
.cover {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: zoom-in;

  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    transition: transform 0.25s ease, filter 0.25s ease;
  }

  &:hover img {
    transform: scale(1.03);
    filter: brightness(1.05);
  }

  .zoomHint {
    position: absolute;
    bottom: 10px;
    right: 12px;
    font-size: 12px;
    opacity: 0.8;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    padding: 4px 8px;
    border-radius: 999px;
    pointer-events: none;
  }
}

/* ================= Tags ================= */
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ================= Lightbox ================= */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: grid;
  place-items: center;
  z-index: 9999;
  animation: fadeIn 0.25s ease;
}

.lightboxImage {
  max-width: 92vw;
  max-height: 92vh;
  border-radius: 14px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
}

.closeBtn {
  position: absolute;
  top: 18px;
  right: 22px;
  font-size: 28px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.75;

  &:hover {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
