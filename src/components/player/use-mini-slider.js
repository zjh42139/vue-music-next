import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { usePlayStore } from "@/store/play";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

BScroll.use(Slide);

export default function useMiniSlider() {
  const playStore = usePlayStore();

  const sliderWrapperRef = ref(null);
  const slider = ref(null);

  const fullScreen = computed(() => playStore.fullScreen);
  const playList = computed(() => playStore.playList);
  const sliderShow = computed(() => !fullScreen.value && playList.value.length);
  const currentIndex = computed(() => playStore.currentIndex);

  onMounted(() => {
    let sliderVal;
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });

          sliderVal.on("slidePageChanged", ({ pageX }) => {
            playStore.setCurrentIndex(pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newCurrentIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newCurrentIndex, 0, 0);
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) slider.value.destory();
  });

  return {
    slider,
    sliderWrapperRef,
  };
}
