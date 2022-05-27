<template>
  <span>User Config</span>
  <q-list>
    <version-select />

    <language-select />

    <mods-select />
  </q-list>
</template>

<script setup lang="ts">
import LanguageSelect from './LanguageSelect.vue';
import ModsSelect from './ModsSelect.vue';
import VersionSelect from './VersionSelect.vue';
</script>
