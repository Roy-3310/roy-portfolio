<template>
  <section class="hero">
    <BubbleBackground />

    <div class="container hero-inner">
      <div class="left">
        <div class="badge">Web · UIUX · Interactive</div>
        <h1 class="h1">Hi，我是 {{ profile.name }}</h1>
        <p class="lead muted">{{ profile.summary }}</p>

        <div class="cta">
          <BaseButton as="router-link" to="/project/fitmeal"
            >查看代表作品</BaseButton
          >
          <BaseButton as="router-link" to="/contact" variant="ghost"
            >聯絡我</BaseButton
          >
        </div>

        <div class="meta">
          <span class="kbd">{{ profile.location }}</span>
          <span class="kbd">{{ profile.title }}</span>
        </div>
      </div>

      <div class="right">
        <div class="avatar-card">
          <img class="avatar" :src="profile.avatar" alt="avatar" />
          <div class="avatar-info">
            <div class="name">{{ profile.name }}</div>
            <div class="muted">{{ profile.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="container section">
    <SectionTitle
      title="快速入口"
      desc="代表作品、作品分類、職訓歷程、證照與聯絡方式。"
    />
    <EntryCards />
  </section>

  <section class="container section">
    <div class="grid grid-2">
      <div>
        <SectionTitle title="技能" desc="使用熟練度。" />
        <BaseCard>
          <SkillBars :skills="profile.skills" />
        </BaseCard>
      </div>

      <div>
        <SectionTitle title="履歷簡介" desc="能力與經驗。" />
        <ResumeTable :summary="profile.summary" :resume="profile.resume" />
      </div>
    </div>
  </section>

  <section class="container section">
    <SectionTitle title="證照預覽" desc="點擊可放大查看；完整列表在證照頁。" />
    <CertificatesPreview />
  </section>

  <div style="height: 18px"></div>
</template>

<script setup>
import { siteProfile as profile } from "../data/siteProfile";

import BubbleBackground from "../components/home/BubbleBackground.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import SectionTitle from "../components/ui/SectionTitle.vue";

import EntryCards from "../components/home/EntryCards.vue";
import SkillBars from "../components/home/SkillBars.vue";
import ResumeTable from "../components/home/ResumeTable.vue";
import CertificatesPreview from "../components/home/CertificatesPreview.vue";
</script>

<style lang="scss" scoped>
@use "../styles/variables" as *;
@use "../styles/mixins" as *;

.hero {
  position: relative;
  padding: 38px 0 22px;
  overflow: hidden;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: center;

  @media (max-width: $bp-md) {
    grid-template-columns: 1fr;
  }
}

.badge {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(80, 220, 80, 0.35);
  background: rgba(80, 220, 80, 0.1);
  font-weight: 750;
  margin-bottom: 10px;
}

.h1 {
  margin: 0;
  font-size: 44px;
  line-height: 1.08;

  @media (max-width: $bp-sm) {
    font-size: 36px;
  }
}

.lead {
  margin: 12px 0 0;
  max-width: 70ch;
  line-height: 1.7;
}

.cta {
  margin-top: 14px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.avatar-card {
  @include card;
  padding: 16px;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.avatar {
  width: 100%;
  max-width: 320px;
  border-radius: 18px;
  border: 1px solid $line;
  object-fit: cover;
}

.avatar-info {
  text-align: center;
}

.name {
  font-weight: 900;
  font-size: 18px;
}

.section {
  padding: 18px 0;
}
</style>
