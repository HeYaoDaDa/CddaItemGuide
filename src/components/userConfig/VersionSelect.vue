<template>
  <q-select
    filled
    v-model="selectedGameVersion"
    :options="configOptions.versions.map((version) => version.id)"
    label="version"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { useUserConfigStore } from 'src/stores/userConfig';
import { computed } from 'vue';

const userConfig = useUserConfigStore();
const configOptions = useConfigOptionsStore();

const selectedGameVersion = computed({
  get: () => userConfig.versionId,
  set: (val) => {
    userConfig.selectVersion(val);
  },
});
</script>
