<template>
  <q-page class="row justify-around content-start" :style="{ display: 'grid', 'grid-template-columns': '99%' }">
    <template v-if="searchResultLists.length > 0">
      <template v-for="searchResults in searchResultLists" :key="searchResults[0].type">
        <p>{{ searchResults[0].type }}</p>

        <q-list>
          <!-- becase name is can change, so key need add name -->
          <template v-for="searchResult in searchResults" :key="searchResult.id + searchResult.name">
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
import { myLogger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import MyText from 'src/components/base/MyText/MyText.vue';
import SearchItem from 'src/components/SearchItem.vue';
import { globalGettext } from 'src/gettext';
import { useUserConfigStore } from 'src/stores/userConfig';
import { CddaItem } from 'src/classes';
import { reactive, shallowReactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const quasar = useQuasar();
const i18n = useI18n();
const searchResultLists = reactive(new Array<Array<CddaItem<object>>>());
const route = useRoute();
const searcher = new Fuse(cddaItemIndexer.searchs, { keys: ['refName', 'description'] });
const userConfig = useUserConfigStore();

function updateSearchResultItems(newRoute: typeof route) {
  const loadLock = !quasar.loading.isActive;
  if (loadLock) quasar.loading.show({ message: i18n.t('message.searching') });

  const allSearchResults = searcher
    .search(newRoute.query.content as string)
    .map((a) => a.item)
    .filter((result) => includes(userConfig.modIds, result.modId));
  const tempMap: Map<string, CddaItem<object>[]> = new Map();

  allSearchResults.forEach((searchResult) => {
    if (!tempMap.has(searchResult.type)) tempMap.set(searchResult.type, shallowReactive([]));
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
watch([globalGettext, cddaItemIndexer.finalized], () => {
  myLogger.debug('gettext change, refesh search params.');
  cddaItemIndexer.resetSearchs();
  searcher.setCollection(cddaItemIndexer.searchs);
  updateSearchResultItems(route);
});
</script>
