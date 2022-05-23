<template>
  <q-page class="row justify-around content-start" :style="{ display: 'grid', 'grid-template-columns': '99%' }">
    <template v-for="searchResults in searchResultLists" :key="searchResults[0].type">
      <p>{{ searchResults[0].sreachParam.category }}</p>

      <q-list>
        <search-item v-for="searchResult in searchResults" :key="searchResult.id" :cddaItem="searchResult" />
      </q-list>
    </template>
  </q-page>
</template>

<script lang="ts">
export default {
  name: 'SearchResultPage',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import Fuse from 'fuse.js';
import { includes } from 'lodash';
import { Loading } from 'quasar';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import SearchItem from 'src/components/SearchItem.vue';
import { useUserConfigStore } from 'src/stores/userConfig';
import { CddaItem } from 'src/types/CddaItem';
import { reactive } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const searchResultLists = reactive(new Array<Array<CddaItem>>());
const route = useRoute();
const searcher = new Fuse(cddaItemIndexer.searchs, { keys: ['sreachParam.name', 'sreachParam.description'] });
const userConfig = useUserConfigStore();

function updateSearchResultItems(newroute: typeof route) {
  Loading.show();

  searcher.setCollection(cddaItemIndexer.searchs);
  const allSearchResults = searcher
    .search(newroute.query.content as string)
    .map((a) => a.item)
    .filter((result) => includes(userConfig.modIds, result.modId));

  const tempMap: Map<string, CddaItem[]> = new Map();
  allSearchResults.forEach((searchResult) => {
    if (!tempMap.has(searchResult.type)) tempMap.set(searchResult.type, []);
    tempMap.get(searchResult.type)?.push(searchResult);
  });

  searchResultLists.length = 0;
  tempMap.forEach((searchResults) => searchResultLists.push(searchResults));
  searchResultLists.sort((a, b) => a[0].sreachParam.weight - b[0].sreachParam.weight);
  console.log('search Rsult ', searchResultLists.length);

  Loading.hide();
}

updateSearchResultItems(route);

onBeforeRouteUpdate((to, from) => {
  if (to.query !== from.query) {
    updateSearchResultItems(to);
  }
});
</script>
