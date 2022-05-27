<template>
  <q-select filled emit-value map-options v-model="selectedMods" :options="options" label="mods" multiple use-chips />
</template>

<script setup lang="ts">
import { logger } from 'src/boot/logger';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed } from 'vue';

const userConfig = useUserConfigStore();
const configOptions = useConfigOptionsStore();

const options = computed({
  get: () =>
    configOptions.mods.map((mod) => {
      return {
        label: mod.name.translate(),
        value: mod.id,
      };
    }),
  set: () => logger.error('no change!!'),
});

const selectedMods = computed({
  get: () => userConfig.modIds,
  set: (val) => {
    userConfig.selectMods(val);
  },
});
</script>
