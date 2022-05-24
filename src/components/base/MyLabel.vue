<template>
  <template v-if="!(typeof props.isHide === 'function' ? props.isHide() : props.isHide)">
    <dt>
      <optional-route :content="$t(props.transfer ?? 'label.' + props.label)" $route="props.route" />
    </dt>

    <dd>
      <dl v-if="dl">
        <slot />
      </dl>

      <ul v-if="ul">
        <slot />
      </ul>

      <slot v-if="!(dl || ul)" />
    </dd>
  </template>
</template>

<script lang="ts">
import { RouteLocationRaw } from 'vue-router';
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
export default {
  name: 'MyLabel',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  transfer?: string;
  isHide?: boolean | (() => boolean);
  route?: RouteLocationRaw;
  dl?: boolean;
  ul?: boolean;
}>();
</script>
