<template>
  <my-card label="material">
    <my-field label="name" :content="data.name" />

    <my-field v-if="data.salvagedInto" label="salvagedInto" :content="data.salvagedInto" />

    <my-field label="repairedWith" :content="data.repairedWith" />

    <my-field label="bash" :content="data.bashResist" />

    <my-field label="cut" :content="data.cutResist" />

    <my-field label="bullet" :content="data.bulletResist" />

    <my-field label="acid" :content="data.acidResist" />

    <my-field label="electricity" :content="data.elecResist" />

    <my-field label="fire" :content="data.fireResist" />

    <my-field label="chip" :content="data.chipResist" />

    <my-field label="density" :content="data.density" />

    <my-field v-if="data.windResist" label="windResist" :content="data.windResist" />

    <my-field label="specificTeatLiquid" :content="data.specificTeatLiquid" />

    <my-field label="specificHeatSolid" :content="data.specificHeatSolid" />

    <my-field label="latentHeat" :content="data.latentHeat" />

    <my-field label="freezePoint" :content="data.freezePoint" />

    <my-field label="edible" :content="data.edible" />

    <my-field label="rotting" :content="data.rotting" />

    <my-field label="soft" :content="data.soft" />

    <my-field label="reinforces" :content="data.reinforces" />

    <my-field label="sheetThickness" :content="data.sheetThickness" />

    <my-label label="vitamin" v-if="arrayIsNotEmpty(data.vitamins)" ul>
      <li v-for="vitamin in data.vitamins" :key="vitamin[0].id">
        <my-text :content="vitamin[0]" />
        <my-text :content="`(${vitamin[1]})`" />
      </li>
    </my-label>

    <my-field v-if="data.fuelData" label="fuel" :content="data.fuelData" />

    <my-label label="burn" v-if="arrayIsNotEmpty(props.cddaItem.data.burnData)" ul>
      <li v-for="(burn, index) in props.cddaItem.data.burnData" :key="index">
        <dl>
          <my-text :content="burn" />
        </dl>
      </li>
    </my-label>

    <my-label label="burnProduct" v-if="arrayIsNotEmpty(data.burnProducts)" ul>
      <li v-for="burnProduct in data.burnProducts" :key="burnProduct[0].id">
        <my-text :content="burnProduct[0]" />
        <my-text :content="`(${burnProduct[1]})`" />
      </li>
    </my-label>
  </my-card>
</template>

<script setup lang="ts">
import MyCard from '../base/MyCard.vue';
import MyField from '../base/MyField.vue';
import MyLabel from '../base/MyLabel.vue';
import MyText from '../base/MyText/MyText.vue';
import { Material } from 'src/types/cddaItemType/material/Material';
import { arrayIsNotEmpty } from 'src/utils/commonUtil';
import { reactive } from 'vue';

const props = defineProps<{
  cddaItem: Material;
}>();

const data = reactive(props.cddaItem.data);
</script>
