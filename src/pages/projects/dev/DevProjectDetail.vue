<script setup>
import PageHero from "@/components/layout/PageHero.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProjectOverviewCard from "@/components/project/ProjectOverviewCard.vue";
import ProjectGallery from "@/components/project/ProjectGallery.vue";
import { useDevProject } from "@/composables/useDevProject";
import CitySceneCanvas from "@/components/canvas/CitySceneCanvas.vue";
import Project04Showcase from "@/components/canvas/Project04Showcase.vue";
import MonsterShooterDemo from "@/components/demos/MonsterShooterDemo.vue";
import SectionTitle from "@/components/ui/SectionTitle.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import RadarShooterDemo from "@/components/canvas/RadarShooterDemo.vue";

const { project, hintTags } = useDevProject();
const demoMap = {
  CitySceneCanvas,
  Project04Showcase,
  MonsterShooterDemo,
  RadarShooterDemo,
};
</script>

<template>
  <PageHero
    :title="project?.name || '作品不存在'"
    :subtitle="project?.summary || '請回到列表頁選擇作品。'"
  >
    <div class="actions">
      <BaseButton as="router-link" to="/projects/dev" variant="ghost">
        回程式作品列表
      </BaseButton>
      <BaseButton as="router-link" to="/" variant="ghost"> 回首頁 </BaseButton>
    </div>
  </PageHero>

  <section class="container" v-if="project">
    <div class="grid grid-2">
      <!-- 左欄：作品說明 -->
      <div class="stack">
        <ProjectOverviewCard :project="project" :tags="hintTags" />
      </div>

      <!-- 右欄：主視覺（互動 or 圖片） -->
      <div class="stack">
        <!-- ✅ 有互動展示 -->
        <BaseCard v-if="project.demoComponent">
          <SectionTitle
            title="互動展示"
            desc="此作品可直接在網頁中體驗互動效果。"
          />
          <component :is="demoMap[project.demoComponent]" />
        </BaseCard>

        <!-- ✅ 沒有互動展示才顯示截圖 -->
        <ProjectGallery
          v-else
          :images="project.gallery"
          :title="project.name"
          :meta="project.category"
        />
      </div>
    </div>
  </section>

  <section class="container" v-else>
    <BaseCard>
      <div class="muted">找不到此作品。</div>
    </BaseCard>
  </section>
</template>

<style lang="scss" scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
