<template>
  <q-select
    filled
    emit-value
    map-options
    v-model="selectedMods"
    :options="configOptions.mods"
    option-value="id"
    option-label="name"
    label="mods"
    multiple
    use-chips
  />
</template>

<script lang="ts">
export default {
  name: 'ModsSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed } from 'vue';

const userConfig = useUserConfigStore();
const configOptions = useConfigOptionsStore();

const selectedMods = computed({
  get: () => userConfig.modIds,
  set: (val) => {
    userConfig.selectMods(val);
  },
});
</script>
