<template>
  <q-page class="row justify-around content-start">
    <cdda-item-views />

    <p v-if="cddaItems.length === 0">{{ $t('message.noFind') }}</p>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { myLogger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import MegerVNodesVue from 'src/components/base/MegerVNodes.vue';
import JsonCardVue from 'src/components/JsonCard.vue';
import { CddaItem } from 'src/classes';
import { replaceArray } from 'src/utils';
import { computed, h, ref, shallowReactive, VNode, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const route = useRoute();
const quasar = useQuasar();

const show = ref(false);
const cddaItems: CddaItem<object>[] = shallowReactive([]);
const cddaItemViews = computed(() =>
  h(MegerVNodesVue, null, () => {
    const views = new Array<VNode>();
    cddaItems.forEach((cddaItem) => views.push(...cddaItem.view(), h(JsonCardVue, { cddaItem })));
    return views;
  })
);

function updateView(type: string, id: string) {
  show.value = false;
  let loadLock = !quasar.loading.isActive;
  if (loadLock) quasar.loading.show();

  replaceArray(cddaItems, cddaItemIndexer.findByTypeAndId(type, id));

  if (loadLock) quasar.loading.hide();
  show.value = true;
}

updateView(route.params.type as string, route.params.id as string);

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    myLogger.debug('onBeforeRouteUpdate', to);
    updateView(to.params.type as string, to.params.id as string);
  }
});

watch(cddaItemIndexer.finalized, () => updateView(route.params.type as string, route.params.id as string));
</script>
