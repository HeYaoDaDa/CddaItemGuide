<template>
  <q-card class="col q-my-sm q-mx-xs" :style="{ 'min-width': props.width ?? '25%' }">
    <q-card-section>
      <optional-route
        v-if="props.label"
        :content="$t(props.translate ?? 'label.' + props.label)"
        :route="props.route"
      />

      <template v-if="props.cddaItem">
        <p :class="['text-weight-bold', 'text-h3']">
          <span v-if="props.symbol && props.color" :style="{ color: props.color }">{{ props.symbol + '  ' }}</span>

          <span>{{ props.cddaItem.getName() }}</span>

          <q-badge :class="['text-weight-bold', 'text-h6']">{{ props.cddaItem.getMod().name.translate() }}</q-badge>
        </p>

        <my-text v-if="props.cddaItem.getDescription()" :content="props.cddaItem.getDescription()" />
      </template>

      <slot name="befor" />

      <dl>
        <slot />
      </dl>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import OptionalRoute from 'src/components/base/OptionalRoute.vue';
import { CddaItem } from 'src/classes';
import { RouteLocationRaw } from 'vue-router';
import MyText from './MyText/MyText.vue';

const props = defineProps<{
  label?: string;
  width?: string;
  translate?: string;
  route?: RouteLocationRaw;
  cddaItem?: CddaItem<object>;
  symbol?: string;
  color?: string;
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
