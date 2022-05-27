<template>
  <router-link :to="cddaItem.getRoute()">
    <q-card width="100%">
      <p>
        <span>{{ cddaItem.name }}</span>

        <q-badge>{{ configOptions.findModById(cddaItem.modId)?.name.translate() }}</q-badge>
      </p>

      <p v-if="cddaItem.description">{{ cddaItem.description }}</p>
    </q-card>
  </router-link>
</template>

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
