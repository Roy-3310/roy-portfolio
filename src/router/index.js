import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import ContactPage from "../pages/ContactPage.vue";
import CertificatesPage from "../pages/CertificatesPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

import MainProjectPage from "../pages/projects/MainProjectPage.vue";
import ArtListPage from "../pages/projects/art/ArtListPage.vue";

import DevListPage from "../pages/projects/dev/DevListPage.vue";
import DevProjectDetail from "../pages/projects/dev/DevProjectDetail.vue";

import TrainingListPage from "../pages/projects/training/TrainingListPage.vue";
import TrainingDetailPage from "../pages/projects/training/TrainingDetailPage.vue";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    { path: "/", name: "home", component: HomePage },

    // 代表作品
    {
      path: "/project/fitmeal",
      name: "project-fitmeal",
      component: MainProjectPage,
    },

    // 作品分類
    { path: "/projects/art", name: "projects-art", component: ArtListPage },

    { path: "/projects/dev", name: "projects-dev", component: DevListPage },
    {
      path: "/projects/dev/:id",
      name: "dev-project-detail",
      component: DevProjectDetail,
    },

    {
      path: "/projects/training",
      name: "projects-training",
      component: TrainingListPage,
    },
    {
      path: "/projects/training/:id",
      name: "project-training-detail",
      component: TrainingDetailPage,
    },

    // 證照 / 聯絡
    {
      path: "/certificates",
      name: "certificates",
      component: CertificatesPage,
    },
    { path: "/contact", name: "contact", component: ContactPage },

    // 404
    { path: "/:pathMatch(.*)*", name: "notfound", component: NotFoundPage },
  ],
});

export default router;
