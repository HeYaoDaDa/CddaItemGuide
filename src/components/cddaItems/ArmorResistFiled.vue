<template>
  <template v-for="(resists, i) in props.data.armorResists" :key="i">
    <span v-for="(formatCover, j) in resists[0].formatCovers" :key="formatCover[0].id">
      <my-text :content="formatCover[0]" />
      <template v-if="isNotEmpty(formatCover[1])"
        >j
        <my-text content="(" />
        <my-text :content="formatCover[1]" separator=", " />
        <my-text content=")" />
      </template>
      <my-text v-if="j < resists[0].formatCovers.length - 1" content=", " />
    </span>
    <div :style="{ display: 'flex' }">
      <dl v-for="(resist, j) in resists" :key="j">
        <armor-resist-field-set :data="resist" />
      </dl>
    </div>
  </template>
</template>

<script setup lang="ts">
import { isNotEmpty } from 'src/utils';
// import MyField from '../base/MyField.vue';
import MyText from '../base/MyText/MyText.vue';
import ArmorResistFieldSet from './ArmorResistFieldSet.vue';
import { ArmorResist } from 'src/classes/items/item/Armor/ArmorResist/ArmorResist';

const props = defineProps<{
  data: ArmorResist;
}>();
</script>
