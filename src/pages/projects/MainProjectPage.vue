<template>
  <PageHero :title="project.name" :subtitle="project.tagline">
    <div class="actions">
      <BaseButton as="a" :href="project.link" target="_blank" rel="noreferrer">
        開啟外部網站
      </BaseButton>
      <BaseButton as="router-link" to="/" variant="ghost">回首頁</BaseButton>
    </div>
  </PageHero>

  <section class="container">
    <div class="grid grid-2">
      <BaseCard>
        <h3 class="h3">專案簡介</h3>
        <p class="muted" style="white-space: pre-line">
          {{ project.description }}
        </p>
        <div class="hr"></div>
        <h3 class="h3">使用技術</h3>
        <div class="tags">
          <TagPill v-for="t in project.tech" :key="t">{{ t }}</TagPill>
        </div>
        <div class="hr"></div>
        <h3 class="h3">網站連結</h3>
        <a
          class="muted"
          :href="project.webLink"
          target="_blank"
          rel="noopener noreferrer"
          style="white-space: pre-line"
        >
          {{ project.webLink }}
        </a>
      </BaseCard>

      <BaseCard>
        <h3 class="h3">專案特色</h3>
        <ul class="muted">
          <li v-for="(x, i) in project.highlights" :key="i">{{ x }}</li>
        </ul>
        <div class="hr"></div>
        <h3 class="h3">截圖</h3>
        <div class="shots">
          <button
            class="shot"
            v-for="(img, i) in project.screenshots"
            :key="i"
            @click="open(img)"
          >
            <img :src="img" alt="screenshot" />
          </button>
        </div>
      </BaseCard>
    </div>

    <ImageLightbox
      :open="lightbox.open"
      :src="lightbox.src"
      :title="project.name"
      :meta="project.link"
      @close="lightbox.open = false"
    />
  </section>

  <div style="height: 22px"></div>
</template>

<script setup>
import { reactive } from "vue";
import { mainProject as project } from "../../data/projects.main";

import PageHero from "../../components/layout/PageHero.vue";
import BaseButton from "../../components/ui/BaseButton.vue";
import BaseCard from "../../components/ui/BaseCard.vue";
import TagPill from "../../components/ui/TagPill.vue";
import ImageLightbox from "../../components/ui/ImageLightbox.vue";

const lightbox = reactive({ open: false, src: "" });
function open(src) {
  lightbox.open = true;
  lightbox.src = src;
}
</script>

<style lang="scss" scoped>
.h3 {
  margin: 0 0 10px;
}

.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.shots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.shot {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
  padding: 0;

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
  }
}
</style>
