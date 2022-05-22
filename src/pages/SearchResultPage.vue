<template>
  <q-page class="row justify-around content-start">
    <q-card v-for="searchResultItem in searchResultItems" :key="searchResultItem.id" class="col-6">
      {{ searchResultItem.sreachParam.one }}
      <q-badge>{{ searchResultItem.modId }}</q-badge>
    </q-card>
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
import { Loading } from 'quasar';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { CddaItem } from 'src/types/CddaItem';
import { replaceArray } from 'src/utils/commonUtil';
import { reactive } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const searchResultItems = reactive(new Array<CddaItem>());
const route = useRoute();
const searcher = new Fuse(cddaItemIndexer.searchs, { keys: ['sreachParam.one', 'sreachParam.two'] });

function updateSearchResultItems(newroute: typeof route) {
  Loading.show();
  searcher.setCollection(cddaItemIndexer.searchs);
  replaceArray(
    searchResultItems,
    searcher.search(newroute.query.content as string).map((a) => a.item)
  );
  Loading.hide();
}

updateSearchResultItems(route);

onBeforeRouteUpdate((to, from) => {
  logger.debug('search onBeforeRouteUpdate');
  if (to.query !== from.query) {
    updateSearchResultItems(to);
  }
});
</script>
