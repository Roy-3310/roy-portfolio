<template>
  <PageHero
    title="美術類作品"
    subtitle="Photoshop 影像編輯 / Illustrator 向量繪圖。點擊作品可放大並查看理念與技術。"
  />

  <section class="container">
    <div class="grid grid-3">
      <BaseCard
        v-for="p in list"
        :key="p.id"
        clickable
        :onClick="() => open(p)"
      >
        <div class="thumb">
          <img :src="p.cover" :alt="p.name" />
        </div>

        <div class="name">{{ p.name }}</div>
        <div class="muted small">{{ p.tool }}</div>

        <div class="hr"></div>

        <div class="muted small"><b>理念：</b>{{ p.concept }}</div>

        <div class="tags">
          <TagPill v-for="t in p.techniques" :key="t">{{ t }}</TagPill>
        </div>
      </BaseCard>
    </div>

    <ImageLightbox
      :open="lightbox.open"
      :src="lightbox.src"
      :title="lightbox.title"
      :meta="lightbox.meta"
      @close="lightbox.open = false"
    />
  </section>

  <div style="height: 22px"></div>
</template>

<script setup>
import { reactive } from "vue";
import { artProjects as list } from "../../../data/projects.art";

import PageHero from "../../../components/layout/PageHero.vue";
import BaseCard from "../../../components/ui/BaseCard.vue";
import TagPill from "../../../components/ui/TagPill.vue";
import ImageLightbox from "../../../components/ui/ImageLightbox.vue";

const lightbox = reactive({
  open: false,
  src: "",
  title: "",
  meta: "",
});

function open(p) {
  lightbox.open = true;
  lightbox.src = p.cover;
  lightbox.title = p.name;
  lightbox.meta = `${p.tool} · ${p.concept}`;
}
</script>

<style lang="scss" scoped>
.thumb {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 170px;
    object-fit: cover;
  }
}

.name {
  font-weight: 850;
}

.small {
  font-size: 13px;
}

.tags {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
