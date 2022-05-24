<template>
  <template v-if="normalContent">
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

<script lang="ts">
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
import { ContentProp } from 'src/types/MyFieldProp';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteLocationRaw } from 'vue-router';
import MegerVNodesVue from '../MegerVNodes.vue';
export default {
  name: 'MyTextPart',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  content?: ContentProp;
  route?: RouteLocationRaw;
  p?: boolean;
  li?: boolean;
}>();
function formatContent(content?: ContentProp) {
  switch (typeof content) {
    case 'string':
      return content;
    case 'number':
      if (Number.isInteger(content)) {
        return Math.trunc(content);
      } else {
        return content.toFixed(2);
      }
    case 'boolean':
      const i18n = useI18n();
      return i18n.t('base.' + (content ? 'true' : 'false'));
    case 'object':
      return h(MegerVNodesVue, null, () => content.view());
  }
  return content;
}
const normalContent = computed(() => formatContent(props.content));
</script>
