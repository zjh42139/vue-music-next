import { computed } from "vue";
import { usePlayStore } from "@/store/play";
import { PLAY_MODE } from "@/assets/js/constant";

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

  function changeMode() {
    const mode = (playStore.playMode + 1) % 3;
    playStore.changeMode(mode);
  }

  return {
    modeIcon,
    changeMode,
  };
}
