<template>
  <q-page class="row justify-around content-start" :style="{ height: '100px' }">
    <ag-grid-vue
      v-if="arrayIsNotEmpty(cddaItems)"
      :style="{ height: '100%', width: '100%' }"
      class="ag-theme-alpine"
      :gridOptions="{
        onGridReady: onGridReady,
      }"
      :defaultColDef="{
        resizable: true,
        skipHeaderOnAutoSize: true,
        onCellClicked: defaultCellClick,
      }"
      :columnDefs="cddaItems[0].gridColumnDefine()"
      :rowData="cddaItems"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/reactivity';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { gettext } from 'src/gettext';
import { CddaItem } from 'src/types/CddaItem';
import { arrayIsNotEmpty } from 'src/utils/commonUtil';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const gridApi = ref(new GridApi());

const cddaItems = computed(() => {
  const type = route.params.type as string;
  return cddaItemIndexer.findByType(type);
});

function onGridReady(event: GridReadyEvent) {
  gridApi.value = event.api;
  gridApi.value.sizeColumnsToFit();
  logger.debug('grid load success, rows size is ', cddaItems.value.length);
}

function defaultCellClick(event: CellClickedEvent) {
  router.push((<CddaItem>event.node.data).getRoute());
}

// watch gettext
watch(gettext, () => {
  logger.debug('gettext change, refesh cells.');
  gridApi.value.refreshCells();
});
</script>
