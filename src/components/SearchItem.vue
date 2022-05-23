<template>
  <q-card width="100%">
    <p>
      <span>{{ cddaItem.sreachParam.name }}</span>

      <q-badge>{{ configOptions.findModById(cddaItem.modId)?.name.translate() }}</q-badge>
    </p>

    <p v-if="cddaItem.sreachParam.description">{{ cddaItem.sreachParam.description }}</p>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'SearchItem',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { CddaItem } from 'src/types/CddaItem';
import { toRefs } from 'vue';
const props = defineProps<{
  cddaItem: CddaItem;
}>();
const { cddaItem } = toRefs(props);

const configOptions = useConfigOptionsStore();
</script>
