<template>
  <template v-if="!(typeof props.isHide === 'function' ? props.isHide() : props.isHide)">
    <dt>
      <optional-route :content="$t(props.translate ?? 'label.' + props.label)" :route="props.route" />
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

<script setup lang="ts">
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
import { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  label: string;
  translate?: string;
  isHide?: boolean | (() => boolean);
  route?: RouteLocationRaw;
  dl?: boolean;
  ul?: boolean;
}>();
</script>
