<template>
  <BaseCard>
    <div class="cover">
      <img :src="project.cover" :alt="project.name" />
    </div>

    <div class="hr" />

    <div class="tags">
      <TagPill>{{ project.category }}</TagPill>
      <TagPill v-for="(t, i) in tags" :key="i">{{ t }}</TagPill>
    </div>

    <div class="hr" />

    <SectionTitle
      title="作品說明"
      desc="每個作品都具備：設計理念、技術、流程/特點 等欄位。"
    />

    <TabsPanel :tabs="project.tabs" />
  </BaseCard>
</template>

<script setup>
import BaseCard from "@/components/ui/BaseCard.vue";
import TagPill from "@/components/ui/TagPill.vue";
import TabsPanel from "@/components/ui/TabsPanel.vue";
import SectionTitle from "@/components/ui/SectionTitle.vue";

defineProps({
  project: Object,
  tags: Array,
});
</script>
