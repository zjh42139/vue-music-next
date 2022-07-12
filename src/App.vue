<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle"></router-view>
  <player></player>
</template>

<script setup>
import MHeader from "@/components/header/header";
import Tab from "@/components/tab/tab";
import player from "./components/player/player";
import { computed } from "vue";
import { usePlayStore } from "./store/play";

const playStore = usePlayStore();

const playlist = computed(() => playStore.playlist);
const viewStyle = computed(() => {
  const bottom = playlist.value.length ? "60px" : "0";
  return { bottom };
});
</script>

<style lang="scss"></style>
