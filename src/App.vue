<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
  <player></player>
</template>

<script setup>
import MHeader from "@/components/header/header";
import Tab from "@/components/tab/tab";
import player from "./components/player/player";
</script>

<style lang="scss"></style>
