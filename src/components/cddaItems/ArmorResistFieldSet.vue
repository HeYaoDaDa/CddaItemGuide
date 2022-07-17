<template>
  <my-field label="coverage">
    <my-text :content="data.coverage" />
  </my-field>

  <my-field label="probability">
    <my-text :content="data.probability" />
  </my-field>

  <my-field label="encumber">
    <my-text :content="data.encumber" />
  </my-field>

  <my-field label="maxEncumber" v-if="data.encumber !== data.maxEncumber">
    <my-text :content="data.maxEncumber" />
  </my-field>

  <my-field label="resist" dl>
    <my-field label="bash">
      <my-text :content="data.bashResist" />
    </my-field>

    <my-field label="cut">
      <my-text :content="data.cutResist" />
    </my-field>

    <my-field label="stab">
      <my-text :content="data.stabResist" />
    </my-field>

    <my-field label="bullet">
      <my-text :content="data.bulletResist" />
    </my-field>

    <my-field label="acid">
      <my-text :content="data.acidResist" />
    </my-field>

    <my-field label="fire">
      <my-text :content="data.fireResist" />
    </my-field>

    <my-field label="environmental">
      <my-text :content="data.envResist" />
    </my-field>
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'PocketDataFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyField from '../base/MyField.vue';
import MyText from '../base/MyText/MyText.vue';
import { ArmorResistInterface } from 'src/classes/items/item/Armor/ArmorResist/ArmorResist';
import { reactive } from 'vue';

const props = defineProps<{
  data: ArmorResistInterface;
}>();
const data = reactive(props.data);
</script>
