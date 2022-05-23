<template>
  <q-card v-if="isShow" class="col q-my-sm q-mx-xs" :style="{ 'min-width': '-webkit-fill-available' }">
    <q-card-section>
      <q-expansion-item label="JSON">
        <pre>{{ json }}</pre>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'JsonCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { CddaItem } from 'src/types/CddaItem';
const props = defineProps<{
  cddaItem: CddaItem;
}>();
const cddaItem = reactive(props.cddaItem);
const json = ref(JSON.stringify(cddaItem.json, null, 4));
const isShow = json.value != undefined;
</script>
