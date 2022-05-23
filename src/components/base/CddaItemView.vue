<template>
  <my-render />
</template>

<script lang="ts">
import MergerVNode from 'src/components/base/MegerVNode.vue';
import { CddaItem } from 'src/types/CddaItem';
import { h } from 'vue';
export default {
  name: 'CddaItemView',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
const props = defineProps<{
  cddaItem: CddaItem;
}>();
const myRender = h(MergerVNode, {}, () => props.cddaItem.view());
</script>
