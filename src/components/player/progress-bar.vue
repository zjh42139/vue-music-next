<template>
  <div class="progress-bar" ref="progressBarRef" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, defineEmits } from "vue";

const progressBtnWidth = 0;

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["progress-changing", "progress-changed"]);

const offset = ref(0);
const progressRef = ref(null);
const progressBarRef = ref(null);
const touch = {};

const progressStyle = computed(() => `width:${offset.value}px`);
const btnStyle = computed(() => `transform:translateX(${offset.value}px)`);
const elClientWidth = computed(() => progressBarRef.value.clientWidth);

watch(
  () => props.progress,
  (newProgress) => {
    const barWidth = elClientWidth.value - progressBtnWidth;
    offset.value = barWidth * newProgress;
  }
);

function onTouchStart(e) {
  touch.x1 = e.touches[0].pageX;
  touch.beginWidth = progressRef.value.clientWidth;
}
function onTouchMove(e) {
  const delta = e.touches[0].pageX - touch.x1;
  const tempWidth = touch.beginWidth + delta;
  const barWidth = elClientWidth.value - progressBtnWidth;
  const progress = Math.min(1, Math.max(0, tempWidth / barWidth));
  offset.value = barWidth * progress;
  emit("progress-changing", progress);
}
function onTouchEnd() {
  const barWidth = elClientWidth.value - progressBtnWidth;
  const progress = progressRef.value.clientWidth / barWidth;
  emit("progress-changed", progress);
}
function onClick(e) {
  const offsetWidth =
    e.pageX - progressBarRef.value.getBoundingClientRect().left;
  const barWidth = elClientWidth.value - progressBtnWidth;
  const progress = offsetWidth / barWidth;
  emit("progress-changed", progress);
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
