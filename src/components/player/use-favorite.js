import { computed } from "vue";
import { usePlayStore } from "@/store/play";
import { save, remove } from "@/assets/js/array-store";
import { FAVORITE_KEY } from "@/assets/js/constant";

export default function useFavorite() {
  const playStore = usePlayStore();
  const favoriteList = computed(() => playStore.favoriteList);
  const maxLen = 100;

  function getFavoriteIcon(song) {
    return isFavorite(song) ? "icon-favorite" : "icon-not-favorite";
  }

  function toggleFavorite(song) {
    let list;
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare);
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen);
    }
    playStore.setFavoriteList(list);

    function compare(item) {
      return item.id === song.id;
    }
  }

  function isFavorite(song) {
    return favoriteList.value.some((item) => item.id === song.id);
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
