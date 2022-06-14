<template>
  <q-select filled emit-value map-options v-model="selectedMods" :options="options" label="mods" multiple use-chips />
</template>

<script setup lang="ts">
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed } from 'vue';

const userConfig = useUserConfigStore();
const configOptions = useConfigOptionsStore();
const options = computed(() => {
  const result = new Array<{ label: string; value: string }>();

  configOptions.mods.forEach((mod) => {
    result.push({
      label: mod.name.translate(),
      value: mod.id,
    });
  });

  return result;
});
const selectedMods = computed({
  get: () => userConfig.modIds,
  set: (val) => {
    userConfig.selectMods(val);
  },
});
</script>
