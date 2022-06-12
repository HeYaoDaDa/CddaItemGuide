<template>
  <my-render />
</template>

<script setup lang="ts">
import MergerVNode from 'src/components/base/MegerVNode.vue';
import { CddaItem } from 'src/classes';
import { h } from 'vue';

const props = defineProps<{
  cddaItem: CddaItem<object>;
}>();

const myRender = h(MergerVNode, {}, () => props.cddaItem.view());
</script>
