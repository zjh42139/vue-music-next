import { computed } from "vue";
import { usePlayStore } from "@/store/play";
import { PLAY_MODE, MODE_KEY } from "@/assets/js/constant";
import storage from "good-storage";

export default function useMode() {
  const playStore = usePlayStore();

  const playMode = computed(() => playStore.playMode);
  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "icon-sequence"
      : playModeVal === PLAY_MODE.loop
      ? "icon-loop"
      : "icon-random";
  });

  const modeText = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "顺序播放"
      : playModeVal === PLAY_MODE.loop
      ? "单曲循环"
      : "随机播放";
  });

  function changeMode() {
    const mode = (playStore.playMode + 1) % 3;
    playStore.changeMode(mode);
    storage.set(MODE_KEY, mode);
  }

  return {
    modeIcon,
    modeText,
    changeMode,
  };
}
