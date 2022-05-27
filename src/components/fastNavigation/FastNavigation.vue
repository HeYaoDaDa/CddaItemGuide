<template>
  <span>Fast Navigation</span>
  <router-link :to="{ name: 'gridByCddaItemType', params: { type: jsonTypes.modInfo } }">mod info</router-link>
</template>

<script setup lang="ts">
import { jsonTypes } from 'src/constants/jsonTypesConstant';
</script>
