import BScroll from "@better-scroll/core";
import ObserveDOM from "@better-scroll/observe-dom";

import { onMounted, onUnmounted, ref } from "vue";

BScroll.use(ObserveDOM);

export default function useScroll(warpperRef, options, emit) {
  const scroll = ref(null);
  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(warpperRef.value, {
      observeDOM: true,
      ...options,
    }));

    if (options.probeType > 0) {
      scrollVal.on("scroll", (pos) => {
        emit("scroll", pos);
      });
    }
  });
  onUnmounted(() => {
    scroll.value.destroy();
  });

  return scroll;
}
