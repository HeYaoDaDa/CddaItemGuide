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

<script lang="ts">
import { useUserConfigStore } from 'src/stores/userConfig';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { computed } from 'vue';
export default {
  name: 'VersionSelect',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const userConfig = useUserConfigStore();
const configOptions = useConfigOptionsStore();

const selectedGameVersion = computed({
  get: () => userConfig.versionId,
  set: (val) => {
    userConfig.selectVersion(val);
  },
});
</script>
