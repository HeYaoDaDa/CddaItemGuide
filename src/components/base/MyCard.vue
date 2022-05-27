<template>
  <q-card class="col q-my-sm q-mx-xs" :style="{ 'min-width': props.width ?? '25%' }">
    <q-card-section>
      <optional-route
        v-if="props.label"
        :content="$t(props.translate ?? 'label.' + props.label)"
        :route="props.route"
      />

      <slot name="befor" />

      <dl>
        <slot />
      </dl>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
import { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  label?: string;
  width?: string;
  translate?: string;
  route?: RouteLocationRaw;
}>();
</script>

<style lang="scss">
dl {
  display: grid;
  grid-template-columns: max-content auto;
  margin-top: 0px;
  margin-bottom: 0px;
}

dt {
  font-weight: bold;
  text-align: right;
}

dd {
  margin-inline-start: 1rem;
}

dd ul {
  padding-left: 0.7em;
  margin-block-start: 0px;
  margin-block-end: 0px;
}

p {
  margin-bottom: 0px;
}
</style>
