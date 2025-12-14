<template>
  <PageHero
    title="證照與認證"
    subtitle="職訓局結業證書、iCAP、網頁丙級、Photoshop 認證等。點擊可放大查看。"
  />

  <section class="container">
    <div class="grid grid-3">
      <BaseCard
        v-for="c in list"
        :key="c.id"
        clickable
        :onClick="() => open(c)"
      >
        <div class="thumb">
          <img :src="c.image" :alt="c.name" />
        </div>
        <div class="name">{{ c.name }}</div>
        <div class="muted small">{{ c.issuer }} · {{ c.year }}</div>
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
import { certificates as list } from "../data/certificates";

import PageHero from "../components/layout/PageHero.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import ImageLightbox from "../components/ui/ImageLightbox.vue";

const lightbox = reactive({ open: false, src: "", title: "", meta: "" });

function open(c) {
  lightbox.open = true;
  lightbox.src = c.image;
  lightbox.title = c.name;
  lightbox.meta = `${c.issuer} · ${c.year}`;
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
    height: 160px;
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
