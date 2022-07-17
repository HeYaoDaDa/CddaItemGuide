<template>
  <my-render />
</template>

<script setup lang="ts">
import MergerVNode from 'src/components/base/MegerVNodes.vue';
import { CddaSubItem } from 'src/classes';
import { h } from 'vue';

const props = defineProps<{
  cddaSubItem: CddaSubItem;
}>();
const myRender = h(MergerVNode, {}, () => props.cddaSubItem.view());
</script>
