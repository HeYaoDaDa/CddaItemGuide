<template>
  <q-card v-if="isShow" class="col q-my-sm q-mx-xs" :style="{ 'min-width': '-webkit-fill-available' }">
    <q-card-section>
      <q-expansion-item label="JSON">
        <pre>{{ json }}</pre>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { CddaItem } from 'src/types/CddaItem';
import { reactive, ref } from 'vue';
const props = defineProps<{
  cddaItem: CddaItem;
}>();
const cddaItem = reactive(props.cddaItem);
const json = ref(JSON.stringify(cddaItem.json, null, 4));
const isShow = json.value != undefined;
</script>
