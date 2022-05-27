<template>
  <my-label
    v-if="show"
    :label="props.label"
    :translate="props.translate"
    :isHide="props.isHide"
    :route="props.labelRoute"
    :dl="props.dl"
    :ul="props.ul"
  >
    <my-text
      :content="props.content"
      :route="props.valueRoute"
      :separator="props.separator"
      :p="props.p"
      :li="props.ul"
    >
      <slot />
    </my-text>
  </my-label>
</template>

<script setup lang="ts">
import { ContentProps } from 'src/types/MyFieldProp';
import { computed } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import MyLabel from './MyLabel.vue';
import MyText from './MyText/MyText.vue';

//TODO:https://github.com/vuejs/core/issues/4294
const props = defineProps<{
  label: string;
  translate?: string;
  isHide?: boolean | (() => boolean);
  labelRoute?: RouteLocationRaw;
  dl?: boolean;
  ul?: boolean;
  content?: ContentProps;
  valueRoute?: RouteLocationRaw | RouteLocationRaw[];
  separator?: string;
  p?: boolean;
  forceShow?: boolean;
}>();
const show = computed(() => {
  if (props.forceShow) return true;
  if (Array.isArray(props.content) && props.content.length === 0) return false;
  return true;
});
</script>
