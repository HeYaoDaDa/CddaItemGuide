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

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
export default {
  name: 'OptionalRoute',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: string | number | boolean;
  route?: RouteLocationRaw;
}>();
</script>
