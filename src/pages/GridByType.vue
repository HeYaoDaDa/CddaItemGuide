<template>
  <q-page class="row justify-around content-start" :style="{ display: 'grid', 'grid-template-columns': '99%' }">
    <ag-grid-vue
      v-if="arrayIsNotEmpty(cddaItems)"
      :style="{ height: '500px' }"
      class="ag-theme-alpine"
      :columnDefs="cddaItems[0].gridColumnDefine()"
      :rowData="cddaItems"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { arrayIsNotEmpty } from 'src/utils/commonUtil';
import { useRoute } from 'vue-router';

const route = useRoute();

const cddaItems = computed(() => {
  const type = route.params.type as string;
  return cddaItemIndexer.findByType(type);
});
</script>
