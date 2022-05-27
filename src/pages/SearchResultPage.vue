<template>
  <q-page class="row justify-around content-start" :style="{ display: 'grid', 'grid-template-columns': '99%' }">
    <template v-if="searchResultLists.length > 0">
      <template v-for="searchResults in searchResultLists" :key="searchResults[0].type">
        <p>{{ searchResults[0].type }}</p>

        <q-list>
          <template v-for="searchResult in searchResults" :key="searchResult.id">
            <search-item :cddaItem="searchResult" />
          </template>
        </q-list>
      </template>
    </template>

    <my-text v-else :content="$t('message.noFind')" />
  </q-page>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js';
import { includes } from 'lodash';
import { useQuasar } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import MyText from 'src/components/base/MyText/MyText.vue';
import SearchItem from 'src/components/SearchItem.vue';
import { gettext } from 'src/gettext';
import { useUserConfigStore } from 'src/stores/userConfig';
import { CddaItem } from 'src/types/CddaItem';
import { reactive, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const quasar = useQuasar();

const searchResultLists = reactive(new Array<Array<CddaItem>>());
const route = useRoute();
const searcher = new Fuse(cddaItemIndexer.searchs, { keys: ['name', 'description'] });
const userConfig = useUserConfigStore();

function updateSearchResultItems(newRoute: typeof route) {
  const loadLock = !quasar.loading.isActive;
  if (loadLock) quasar.loading.show({ message: i18n.global.t('message.searching') });

  const allSearchResults = searcher
    .search(newRoute.query.content as string)
    .map((a) => a.item)
    .filter((result) => includes(userConfig.modIds, result.modId));

  const tempMap: Map<string, CddaItem[]> = new Map();
  allSearchResults.forEach((searchResult) => {
    if (!tempMap.has(searchResult.type)) tempMap.set(searchResult.type, []);
    tempMap.get(searchResult.type)?.push(searchResult);
  });

  searchResultLists.length = 0;
  tempMap.forEach((searchResults) => searchResultLists.push(searchResults));
  searchResultLists.sort((a, b) => a[0].weight - b[0].weight);

  if (loadLock) quasar.loading.hide();
}

updateSearchResultItems(route);

onBeforeRouteUpdate((to, from) => {
  if (to.query !== from.query) {
    updateSearchResultItems(to);
  }
});

watch([gettext, cddaItemIndexer.finalized], () => {
  logger.debug('gettext change, refesh search params.');
  cddaItemIndexer.resetSearchs();
  searcher.setCollection(cddaItemIndexer.searchs);
  logger.debug(cddaItemIndexer.searchs);
  updateSearchResultItems(route);
});
</script>
