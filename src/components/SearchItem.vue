<template>
  <router-link :to="props.cddaItem.getRoute()">
    <q-card width="100%">
      <p>
        <span>{{ props.cddaItem.getRefName() }}</span>

        <q-badge>{{ props.cddaItem.getMod().name.translate() }}</q-badge>
      </p>

      <p v-if="props.cddaItem.getDescription()">{{ props.cddaItem.getDescription() }}</p>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { CddaItem } from 'src/classes';

const props = defineProps<{
  cddaItem: CddaItem<object>;
}>();
</script>
