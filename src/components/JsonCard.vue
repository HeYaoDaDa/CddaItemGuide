<template>
  <q-card class="col q-my-sm q-mx-xs" :style="{ 'min-width': '-webkit-fill-available' }">
    <q-card-section>
      <q-expansion-item label="JSON">
        <pre>{{ JSON.stringify(props.cddaItem.json, null, 4) }}</pre>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { CddaItem } from 'src/types/CddaItem';

const props = defineProps<{
  cddaItem: CddaItem;
}>();
</script>
