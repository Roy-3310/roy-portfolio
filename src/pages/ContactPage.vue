<template>
  <PageHero
    title="聯絡方式"
    subtitle="若對我的作品有興趣，歡迎透過以下方式聯絡。"
  />

  <section class="container">
    <div class="grid grid-2">
      <BaseCard>
        <h3 class="h3">聯絡資訊</h3>
        <div class="list">
          <div class="row">
            <div class="k">Email</div>
            <a class="v" :href="`mailto:${profile.email}`">{{
              profile.email
            }}</a>
          </div>
          <div class="row">
            <div class="k">GitHub</div>
            <a
              class="v"
              :href="profile.github"
              target="_blank"
              rel="noreferrer"
              >{{ profile.github }}</a
            >
          </div>
          <!-- <div class="row">
            <div class="k">LinkedIn</div>
            <a
              class="v"
              :href="profile.linkedin"
              target="_blank"
              rel="noreferrer"
              >{{ profile.linkedin }}</a
            >
          </div> -->
        </div>
      </BaseCard>

      <!-- <BaseCard>
        <h3 class="h3">快速留言（前端示意）</h3>
        <p class="muted">
          此表單可後續串接 Email 服務或後端 API（如 Formspree / 自建 API）。
        </p>

        <form class="form" @submit.prevent="submit">
          <label class="field">
            <span class="muted">姓名</span>
            <input v-model.trim="form.name" placeholder="Your name" />
          </label>

          <label class="field">
            <span class="muted">Email</span>
            <input v-model.trim="form.email" placeholder="you@example.com" />
          </label>

          <label class="field">
            <span class="muted">訊息</span>
            <textarea
              v-model.trim="form.message"
              rows="5"
              placeholder="想聊聊什麼？"
            ></textarea>
          </label>

          <div class="actions">
            <BaseButton as="button" variant="primary" type="submit"
              >送出（示意）</BaseButton
            >
            <span v-if="ok" class="muted">已送出（示意），後續可接後端。</span>
          </div>
        </form>
      </BaseCard> -->
    </div>
  </section>

  <div style="height: 22px"></div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { siteProfile as profile } from "../data/siteProfile";

import PageHero from "../components/layout/PageHero.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseButton from "../components/ui/BaseButton.vue";

const form = reactive({ name: "", email: "", message: "" });
const ok = ref(false);

function submit() {
  ok.value = true;
  setTimeout(() => (ok.value = false), 2000);
  form.name = "";
  form.email = "";
  form.message = "";
}
</script>

<style lang="scss" scoped>
@use "../styles/variables" as *;

.h3 {
  margin: 0 0 10px;
}

.list {
  display: grid;
  gap: 12px;
}

.row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid $line;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}

.k {
  font-weight: 850;
}

.v {
  color: rgba(255, 255, 255, 0.86);
  word-break: break-all;
}

.form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;

  input,
  textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid $line;
    background: rgba(255, 255, 255, 0.04);
    color: $text;
    outline: none;
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
