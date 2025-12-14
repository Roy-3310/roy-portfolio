<template>
  <div class="wrap">
    <div class="grid grid-3">
      <BaseCard
        v-for="c in list"
        :key="c.id"
        clickable
        :onClick="() => openLightbox(c)"
      >
        <div class="thumb">
          <img :src="c.image" :alt="c.name" />
        </div>
        <div class="name">{{ c.name }}</div>
        <div class="muted small">{{ c.issuer }} · {{ c.year }}</div>
      </BaseCard>
    </div>

    <div class="actions">
      <BaseButton as="router-link" to="/certificates" variant="ghost"
        >查看全部證照</BaseButton
      >
    </div>

    <ImageLightbox
      :open="lightbox.open"
      :src="lightbox.src"
      :title="lightbox.title"
      :meta="lightbox.meta"
      @close="lightbox.open = false"
    />
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import BaseCard from "../ui/BaseCard.vue";
import BaseButton from "../ui/BaseButton.vue";
import ImageLightbox from "../ui/ImageLightbox.vue";

import { certificates } from "../../data/certificates";

const list = computed(() => certificates.slice(0, 3));

const lightbox = reactive({
  open: false,
  src: "",
  title: "",
  meta: "",
});

function openLightbox(c) {
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
    height: 150px;
    object-fit: cover;
  }
}

.name {
  font-weight: 800;
}

.small {
  font-size: 13px;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
