<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script setup>
import { onMounted, defineProps, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
import MusicList from "@/components/music-list/music-list";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  singer: Object,
});

const songs = ref([]);
const loading = ref(true);

const computedSinger = computed(() => {
  let ret = null;
  const singer = props.singer;
  if (singer && !computedSinger) {
    ret = singer;
  } else {
    const cachedSinger = storage.session.get(SINGER_KEY);
    if (cachedSinger && cachedSinger.mid === route.params.id) {
      ret = cachedSinger;
    }
  }
  return ret;
});
const pic = computed(() => {
  const singer = computedSinger.value;
  return singer && singer.pic;
});
const title = computed(() => {
  const singer = computedSinger.value;
  return singer && singer.name;
});

watch(
  () => route.params.id,
  (id) => {
    const cachedSinger = storage.session.get(SINGER_KEY);
    if (cachedSinger && cachedSinger.mid !== id) {
      const path = route.matched[0].path;
      router.push({ path });
    }
  }
);

onMounted(async () => {
  if (!computedSinger.value) {
    const path = route.matched[0].path;
    router.push({ path });
    return;
  }
  const result = await getSingerDetail(computedSinger.value);
  songs.value = await processSongs(result.songs);
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
