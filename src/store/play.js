import { defineStore } from "pinia";
import { PLAY_MODE, FAVORITE_KEY, MODE_KEY } from "@/assets/js/constant";
import { shuffle } from "@/assets/js/util";
import { load } from "@/assets/js/array-store";

export const usePlayStore = defineStore("play", {
  state: () => {
    return {
      sequenceList: [],
      playList: [],
      playing: false,
      playMode: load(MODE_KEY, 0),
      currentIndex: 0,
      fullScreen: false,
      favoriteList: load(FAVORITE_KEY, []),
    };
  },
  getters: {
    currentSong: (state) => state.playList[state.currentIndex],
  },
  actions: {
    setPlayingState(playing) {
      this.playing = playing;
    },
    setSquenceList(sequenceList) {
      this.sequenceList = sequenceList;
    },
    setPlayList(playList) {
      this.playList = playList;
    },
    setPlayMode(playMode) {
      this.playMode = playMode;
    },
    setCurrentIndex(currentIndex) {
      this.currentIndex = currentIndex;
    },
    setFullScreen(fullScreen) {
      this.fullScreen = fullScreen;
    },
    setFavoriteList(favoriteList) {
      this.favoriteList = favoriteList;
    },
    selectPlay({ list, index }) {
      this.setPlayMode(PLAY_MODE.sequence);
      this.setSquenceList(list);
      this.setPlayingState(true);
      this.setFullScreen(true);
      this.setPlayList(list);
      this.setCurrentIndex(index);
    },
    randomplay(list) {
      this.setPlayMode(PLAY_MODE.random);
      this.setSquenceList(list);
      this.setPlayingState(true);
      this.setFullScreen(true);
      this.setPlayList(shuffle(list));
      this.setCurrentIndex(0);
    },
    changeMode(mode) {
      const oldSongId = this.currentSong.id;
      if (mode === PLAY_MODE.random) {
        this.setPlayList(shuffle(this.sequenceList));
      } else {
        this.setPlayList(this.sequenceList);
      }
      const newIndex = this.playList.findIndex((song) => song.id === oldSongId);

      this.setCurrentIndex(newIndex);
      this.setPlayMode(mode);
    },
    addSongLyric({ song, lyric }) {
      this.sequenceList.map((item) => {
        if (item.mid === song.mid) item.lyric = lyric;
        return item;
      });
    },
  },
});
