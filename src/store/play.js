import { defineStore } from "pinia";
import { PLAY_MODE, FAVORITE_KEY, MODE_KEY } from "@/assets/js/constant";
import { shuffle } from "@/assets/js/util";
import { load } from "@/assets/js/array-store";

export const usePlayStore = defineStore("play", {
  state: () => {
    return {
      sequenceList: [],
      playlist: [],
      playing: false,
      playMode: load(MODE_KEY, 0),
      currentIndex: 0,
      fullScreen: false,
      favoriteList: load(FAVORITE_KEY, []),
    };
  },
  getters: {
    currentSong: (state) => state.playlist[state.currentIndex] || {},
  },
  actions: {
    setPlayingState(playing) {
      this.playing = playing;
    },
    setSquenceList(sequenceList) {
      this.sequenceList = sequenceList;
    },
    setPlayList(playlist) {
      this.playlist = playlist;
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
      const newIndex = this.playlist.findIndex((song) => song.id === oldSongId);

      this.setCurrentIndex(newIndex);
      this.setPlayMode(mode);
    },
    addSongLyric({ song, lyric }) {
      this.sequenceList.map((item) => {
        if (item.mid === song.mid) item.lyric = lyric;
        return item;
      });
    },
    removeSong(song) {
      const playlist = this.playlist;
      const list = playlist.filter((item) => item.id !== song.id);
      const playIndex = findIndex(playlist, song);
      if (playIndex < 0) return;
      if (playIndex < this.currentIndex || playIndex === playlist.length - 1) {
        this.currentIndex--;
      }
      this.setPlayList(list);
    },
    clearSongList() {
      this.setSquenceList([]);
      this.setPlayList([]);
      this.setCurrentIndex(0);
    },
  },
});

function findIndex(list, song) {
  return list.findIndex((item) => item.id === song.id);
}
