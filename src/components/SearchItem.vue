<template>
  <router-link :to="props.cddaItem.getRoute()">
    <q-card width="100%">
      <p>
        <span>{{ props.cddaItem.name }}</span>

        <q-badge>{{ configOptions.findModById(props.cddaItem.modId)?.name.translate() }}</q-badge>
      </p>

      <p v-if="props.cddaItem.description">{{ props.cddaItem.description }}</p>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { CddaItem } from 'src/types/CddaItem';
const props = defineProps<{
  cddaItem: CddaItem;
}>();

const configOptions = useConfigOptionsStore();
</script>
