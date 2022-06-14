<template>
  <q-page class="row justify-around content-start" :style="{ height: '100px' }">
    <ag-grid-vue
      v-if="isNotEmpty(cddaItems)"
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
import { myLogger } from 'src/boot/logger';
import { cddaItemIndexer } from 'src/CddaItemIndexer';
import { globalGettext } from 'src/gettext';
import { CddaItem } from 'src/classes';
import { isNotEmpty, replaceArray } from 'src/utils';
import { ref, shallowReactive, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const gridApi = ref(undefined as GridApi | undefined);
const cddaItems = shallowReactive(new Array<CddaItem<object>>());

function update(myRoute: typeof route) {
  const type = myRoute.params.type as string;

  replaceArray(cddaItems, cddaItemIndexer.finalized ? cddaItemIndexer.findByType(type) : []);
}

update(route);

function onGridReady(event: GridReadyEvent) {
  gridApi.value = event.api;
  gridApi.value.sizeColumnsToFit();
  myLogger.debug('grid load success, rows size is ', cddaItems.length);
}

function defaultCellClick(event: CellClickedEvent) {
  router.push((<CddaItem<object>>event.node.data).getRoute());
}

onBeforeRouteUpdate((to, from) => {
  if (to.params !== from.params) {
    update(to);
  }
});
watch([globalGettext, cddaItemIndexer.finalized], (newValue, oldValue) => {
  if (newValue[1] !== oldValue[1]) {
    myLogger.debug('cddaItemIndexer change, update data.');
    update(route);
  } else if (gridApi.value) {
    myLogger.debug('gettext change, refesh cells and header.');
    gridApi.value.refreshCells();
    gridApi.value.refreshHeader();
  }
});
</script>
