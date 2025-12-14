<template>
  <header class="header">
    <div class="container header-inner">
      <router-link class="brand" to="/">
        <span class="dot"></span>
        <span class="brand-text">{{ profile.name }}</span>
        <span class="kbd">Portfolio</span>
      </router-link>

      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active"
          >首頁</router-link
        >
        <router-link
          to="/project/fitmeal"
          class="nav-link"
          active-class="active"
          >代表作品</router-link
        >
        <router-link to="/projects/art" class="nav-link" active-class="active"
          >美術</router-link
        >
        <router-link to="/projects/dev" class="nav-link" active-class="active"
          >程式</router-link
        >
        <router-link
          to="/projects/training"
          class="nav-link"
          active-class="active"
          >職訓</router-link
        >
        <router-link to="/certificates" class="nav-link" active-class="active"
          >證照</router-link
        >
        <router-link to="/contact" class="nav-link" active-class="active"
          >聯絡</router-link
        >
      </nav>

      <button class="menu-btn" @click="open = !open" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div v-if="open" class="mobile">
      <div class="container mobile-inner">
        <router-link to="/" class="m-link" @click="open = false"
          >首頁</router-link
        >
        <router-link to="/project/fitmeal" class="m-link" @click="open = false"
          >代表作品</router-link
        >
        <router-link to="/projects/art" class="m-link" @click="open = false"
          >美術</router-link
        >
        <router-link to="/projects/dev" class="m-link" @click="open = false"
          >程式</router-link
        >
        <router-link
          to="/projects/training"
          class="m-link"
          @click="open = false"
          >職訓</router-link
        >
        <router-link to="/certificates" class="m-link" @click="open = false"
          >證照</router-link
        >
        <router-link to="/contact" class="m-link" @click="open = false"
          >聯絡</router-link
        >
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { siteProfile as profile } from "../../data/siteProfile";

const open = ref(false);
</script>

<style lang="scss" scoped>
@use "../../styles/variables" as *;
@use "../../styles/mixins" as *;

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(11, 15, 20, 0.65);
  border-bottom: 1px solid $line;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66px;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: $accent;
  box-shadow: 0 0 0 6px rgba(80, 220, 80, 0.12);
}

.brand-text {
  font-size: 16px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: $bp-md) {
    display: none;
  }
}

.nav-link {
  color: $muted;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: all 160ms ease;

  &:hover {
    color: $text;
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.06);
  }
}

.active {
  color: $text;
  border-color: rgba(80, 220, 80, 0.35);
  background: rgba(80, 220, 80, 0.12);
}

.menu-btn {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid $line;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;

  @media (max-width: $bp-md) {
    display: grid;
    place-items: center;
    gap: 5px;
  }

  span {
    display: block;
    width: 18px;
    height: 2px;
    background: rgba(255, 255, 255, 0.72);
    border-radius: 2px;
  }
}

.mobile {
  border-top: 1px solid $line;
  background: rgba(11, 15, 20, 0.92);
}

.mobile-inner {
  padding: 14px 0 18px;
  display: grid;
  gap: 10px;
}

.m-link {
  padding: 10px 12px;
  border: 1px solid $line;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: $text;
}
</style>
