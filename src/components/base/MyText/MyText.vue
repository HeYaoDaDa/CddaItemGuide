<template>
  <template v-for="(contentItem, index) in normalContent" :key="contentItem">
    <my-text-part :content="contentItem" :route="normalRoute[index]" :p="props.p" :li="props.li">
      <slot />
    </my-text-part>

    <my-text-part v-if="props.separator && index < normalContent.length - 1" :content="props.separator ?? ', '" />
  </template>
</template>

<script lang="ts">
export default {
  name: 'MyText',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ContentProps } from 'src/types/MyFieldProp';
import { toArray } from 'src/utils/commonUtil';
import { computed } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import MyTextPart from './MyTextPart.vue';
//TODO:https://github.com/vuejs/core/issues/4294
const props = defineProps<{
  content?: ContentProps;
  route?: RouteLocationRaw | RouteLocationRaw[];
  separator?: string;
  p?: boolean;
  li?: boolean;
}>();
const normalContent = computed(() => toArray(props.content));
const normalRoute = computed(() => toArray(props.route));
</script>
