import { computed } from "vue";
import { useRoute } from "vue-router";
import { devProjects } from "../data/projects.dev.js";

export function useDevProject() {
  const route = useRoute();

  const project = computed(() => {
    return devProjects.find((p) => p.id === route.params.id);
  });

  const hintTags = computed(() => {
    if (!project.value) return [];

    const map = {
      Unity: ["圖片展示", "玩法說明", "C#"],
      "Web Interactive": ["Canvas", "動畫", "互動"],
      "Web Game": ["狀態管理", "UI 回饋", "RWD"],
    };

    return map[project.value.category] || [];
  });

  return {
    project,
    hintTags,
  };
}
