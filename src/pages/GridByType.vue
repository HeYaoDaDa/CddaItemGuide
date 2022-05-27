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
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import { logger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { gettext } from 'src/gettext';
import { CddaItem } from 'src/types/CddaItem';
import { arrayIsNotEmpty, replaceArray } from 'src/utils/commonUtil';
import { reactive, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const gridApi = ref(undefined as GridApi | undefined);
const cddaItems = reactive(new Array<CddaItem>());

function update(myRoute: typeof route) {
  const type = myRoute.params.type as string;
  replaceArray(cddaItems, cddaItemIndexer.finalized ? cddaItemIndexer.findByType(type) : []);
}

update(route);

function onGridReady(event: GridReadyEvent) {
  gridApi.value = event.api;
  gridApi.value.sizeColumnsToFit();
  logger.debug('grid load success, rows size is ', cddaItems.length);
}

function defaultCellClick(event: CellClickedEvent) {
  router.push((<CddaItem>event.node.data).getRoute());
}

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    update(to);
  }
});

watch([gettext, cddaItemIndexer.finalized], (newValue, oldValue) => {
  if (newValue[1] !== oldValue[1]) {
    logger.debug('cddaItemIndexer change, update data.');
    update(route);
  } else if (gridApi.value) {
    logger.debug('gettext change, refesh cells and header.');
    gridApi.value.refreshCells();
    gridApi.value.refreshHeader();
  }
});
</script>
