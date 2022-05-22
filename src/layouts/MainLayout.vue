<template>
  <q-layout view="hHr LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

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

<script lang="ts">
export default {
  name: 'MainLayout',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import UserConfig from 'src/components/userConfig/UserConfig.vue';
import FastNavigation from 'src/components/fastNavigation/FastNavigation.vue';
import { ref } from 'vue';
import SearchInput from 'src/components/SearchInput.vue';

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
