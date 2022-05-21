<template>
  <span>User Config</span>
  <q-list>
    <version-select />

    <language-select />
  </q-list>
</template>

<script lang="ts">
export default {
  name: 'UserConfig',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import VersionSelect from './VersionSelect.vue';
import LanguageSelect from './LanguageSelect.vue';
</script>
