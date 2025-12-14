<template>
  <BaseCard>
    <SectionTitle title="圖片展示" desc="以圖片截圖展示成果。" />

    <div class="gallery">
      <button
        class="shot"
        v-for="(img, i) in images"
        :key="i"
        @click="open(img)"
      >
        <img :src="img" alt="gallery" />
      </button>
    </div>

    <ImageLightbox
      :open="lightbox.open"
      :src="lightbox.src"
      :title="title"
      :meta="meta"
      @close="lightbox.open = false"
    />
  </BaseCard>
</template>

<script setup>
import { reactive } from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import SectionTitle from "@/components/ui/SectionTitle.vue";
import ImageLightbox from "@/components/ui/ImageLightbox.vue";

defineProps({
  images: { type: Array, required: true },
  title: String,
  meta: String,
});

const lightbox = reactive({ open: false, src: "" });

function open(src) {
  lightbox.open = true;
  lightbox.src = src;
}
</script>
