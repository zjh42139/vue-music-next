<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <template v-if="currentSong">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle" @click="togglePage">
          <div class="middle-l" :style="middleLStyle" v-show="showCover">
            <div class="cd-wrapper">
              <div class="cd">
                <img
                  class="image playing"
                  ref="imageRef"
                  :style="cdStyle"
                  :src="currentSong.pic"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>

        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                :class="getFavoriteIcon(currentSong)"
                @click="toggleFavorite(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </template>
    </div>
    <audio
      ref="audioRef"
      :loop="isLoop"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="next"
    ></audio>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { usePlayStore } from "@/store/play";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useLyric from "./use-lyric";
import useMiddleInteractive from "./use-middle-interactive";
import ProgressBar from "./progress-bar";
import Scroll from "../base/scroll/scroll";
import { formatTime } from "@/assets/js/util";
import { removeClass, addClass } from "@/assets/js/dom";
import { PLAY_MODE } from "@/assets/js/constant";

const playStore = usePlayStore();

const audioRef = ref(null);
const songReady = ref(false);
const currentTime = ref(0);
const imageRef = ref(null);
let progressChanging = false;

const fullScreen = computed(() => playStore.fullScreen);
const currentSong = computed(() => playStore.currentSong);
const playing = computed(() => playStore.playing);
const currentIndex = computed(() => playStore.currentIndex);
const playList = computed(() => playStore.playList);
const playIcon = computed(() => (playing.value ? "icon-pause" : "icon-play"));
const progress = computed(() => currentTime.value / currentSong.value.duration);
const disableCls = computed(() => (songReady.value ? "" : "disable"));
const { modeIcon, changeMode } = useMode();
const { getFavoriteIcon, toggleFavorite } = useFavorite();
const {
  lyricScrollRef,
  lyricListRef,
  pureMusicLyric,
  playingLyric,
  currentLyric,
  currentLineNum,
  playLyric,
  stopLyric,
} = useLyric({
  songReady,
  currentTime,
});
const { showCover, togglePage } = useMiddleInteractive();
const isLoop = computed(() => playStore.playMode === PLAY_MODE.loop);
const cdStyle = computed(() => ({
  "animation-play-state": playing.value ? "running" : "paused",
}));

watch(currentSong, (newSong) => {
  if (!newSong.id || !newSong.url) {
    return;
  }
  currentTime.value = 0;
  songReady.value = false;
  const audioEl = audioRef.value;
  audioEl.src = newSong.url;
  audioEl.play();
  playStore.setPlayingState(true);

  const imageEl = imageRef.value;
  if (imageEl) {
    removeClass(imageEl, "playing");
    imageEl.offsetWidth;
    addClass(imageEl, "playing");
  }
});
watch(playing, (newPlaying) => {
  if (!songReady.value) return;
  const audioEl = audioRef.value;
  if (newPlaying) {
    audioEl.play();
    playLyric();
  } else {
    audioEl.pause();
    stopLyric();
  }
});

function goBack() {
  playStore.setFullScreen(false);
}
function togglePlay() {
  if (!songReady.value) return;
  playStore.setPlayingState(!playStore.playing);
}
function pause() {
  playStore.setPlayingState(false);
}
function prev() {
  const list = playList.value;
  if (!songReady.value || !list.length) {
    return;
  } else {
    if (list.length === 1) {
      loop();
    }
    const prevIndex = (currentIndex.value - 1 + list.length) % list.length;
    playStore.setCurrentIndex(prevIndex);
  }
}
function next() {
  const list = playList.value;
  if (!songReady.value || !list.length) {
    return;
  } else {
    if (list.length === 1) {
      loop();
    }
    const nextIndex = (currentIndex.value + 1) % list.length;
    playStore.setCurrentIndex(nextIndex);
  }
}
function loop() {
  const audioEl = audioRef.value;
  audioEl.currentTime = 0;
  audioEl.play();
  playStore.setPlayingState(true);
}
function ready() {
  if (songReady.value) return;
  songReady.value = true;
  playLyric();
}
function error() {
  songReady.value = true;
}
function updateTime(e) {
  if (!progressChanging) currentTime.value = e.target.currentTime;
}
function onProgressChanging(progress) {
  progressChanging = true;
  currentTime.value = progress * currentSong.value.duration;
}
function onProgressChanged(progress) {
  progressChanging = false;
  currentTime.value = progress * currentSong.value.duration;
  audioRef.value.currentTime = progress * currentSong.value.duration;
  playLyric();
  if (!playing.value) stopLyric();
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
