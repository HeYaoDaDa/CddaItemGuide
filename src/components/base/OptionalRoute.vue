<template>
  <router-link v-if="props.route" :to="props.route">
    {{ props.content }}
    <slot />
  </router-link>

  <template v-else>
    {{ props.content }}
    <slot />
  </template>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  content?: string | number | boolean;
  route?: RouteLocationRaw;
}>();
</script>
