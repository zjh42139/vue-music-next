import { ref } from "vue";

export default function useMiddleInteractive() {
  const showCover = ref(true);
  const middleLStyle = ref(null);
  const middleRStyle = ref(null);
  function togglePage() {
    showCover.value = !showCover.value;
  }
  return {
    showCover,
    togglePage,
    middleLStyle,
    middleRStyle,
  };
}
