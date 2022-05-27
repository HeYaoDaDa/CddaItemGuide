<template>
  <template v-if="normalContent !== undefined">
    <template v-if="typeof normalContent === 'object'">
      <normal-content />
    </template>

    <template v-else>
      <li v-if="props.li">
        <optional-route :content="normalContent" :route="props.route" />
      </li>

      <p v-if="props.p">
        <optional-route :content="normalContent" :route="props.route" />
      </p>

      <span v-if="!(props.p || props.li)">
        <optional-route :content="normalContent" :route="props.route" />
      </span>
    </template>
  </template>

  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
import { ContentProp } from 'src/types/MyFieldProp';
import { formatBooleanAndNumber } from 'src/utils/commonUtil';
import { computed, h } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import MegerVNodesVue from '../MegerVNodes.vue';

const props = defineProps<{
  content?: ContentProp;
  route?: RouteLocationRaw;
  p?: boolean;
  li?: boolean;
}>();

function formatContent(content?: ContentProp) {
  if (typeof content === 'object') {
    return h(MegerVNodesVue, null, () => content.view());
  }
  return formatBooleanAndNumber(content) as ContentProp;
}
const normalContent = computed(() => formatContent(props.content));
</script>
