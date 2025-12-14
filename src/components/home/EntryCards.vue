<template>
  <div class="grid grid-3">
    <BaseCard clickable :onClick="() => go('/project/fitmeal')">
      <div class="card-top">
        <div class="title">代表作品</div>
        <TagPill>最具代表性</TagPill>
      </div>
      <div class="muted">Fit Meal Life：完整專案說明 + 外部連結</div>
    </BaseCard>

    <BaseCard clickable :onClick="() => go('/projects/art')">
      <div class="card-top">
        <div class="title">美術類作品</div>
        <TagPill>PS / AI</TagPill>
      </div>
      <div class="muted">Photoshop 與 Illustrator 作品集展示</div>
    </BaseCard>

    <BaseCard clickable :onClick="() => go('/projects/dev')">
      <div class="card-top">
        <div class="title">程式設計類作品</div>
        <TagPill>Unity / Web</TagPill>
      </div>
      <div class="muted">Unity 小遊戲、網頁互動與網頁小遊戲</div>
    </BaseCard>

    <BaseCard clickable :onClick="() => go('/projects/training')">
      <div class="card-top">
        <div class="title">職訓學習歷程</div>
        <TagPill>Learning</TagPill>
      </div>
      <div class="muted">課程作業/小專案的整理與反思</div>
    </BaseCard>

    <BaseCard clickable :onClick="() => go('/certificates')">
      <div class="card-top">
        <div class="title">證照區</div>
        <TagPill>Proof</TagPill>
      </div>
      <div class="muted">結業證書、iCAP、網頁丙級、Photoshop 認證</div>
    </BaseCard>

    <BaseCard clickable :onClick="() => go('/contact')">
      <div class="card-top">
        <div class="title">聯絡方式</div>
        <TagPill>Contact</TagPill>
      </div>
      <div class="muted">Email / GitHub / LinkedIn</div>
    </BaseCard>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import BaseCard from "../ui/BaseCard.vue";
import TagPill from "../ui/TagPill.vue";

const router = useRouter();
const go = (path) => router.push(path);
</script>

<style lang="scss" scoped>
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.title {
  font-weight: 850;
  font-size: 16px;
}
</style>
