<template>
  <q-layout view="hHr LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> <router-link to="/">Quasar App</router-link> </q-toolbar-title>

        <search-input />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <user-config />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer side="right" bordered show-if-above>
      <fast-navigation />
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { logger } from 'src/boot/logger';
import FastNavigation from 'src/components/fastNavigation/FastNavigation.vue';
import SearchInput from 'src/components/SearchInput.vue';
import UserConfig from 'src/components/userConfig/UserConfig.vue';
import { useConfigOptionsStore } from 'src/stores/configOptions';
import { ref } from 'vue';

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

/**
 * init start
 */
useConfigOptionsStore()
  .initVersions()
  .catch((e) => logger.error(e));
</script>
