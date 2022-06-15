<template>
  <my-card :cddaItem="props.cddaItem">
    <my-field
      v-if="props.cddaItem.data.salvagedInto"
      label="salvagedInto"
      :content="props.cddaItem.data.salvagedInto"
    />

    <my-field
      v-if="props.cddaItem.data.repairedWith"
      label="repairedWith"
      :content="props.cddaItem.data.repairedWith"
    />

    <my-field label="bash" :content="props.cddaItem.data.bashResist" />

    <my-field label="cut" :content="props.cddaItem.data.cutResist" />

    <my-field label="bullet" :content="props.cddaItem.data.bulletResist" />

    <my-field label="acid" :content="props.cddaItem.data.acidResist" />

    <my-field label="electricity" :content="props.cddaItem.data.elecResist" />

    <my-field label="fire" :content="props.cddaItem.data.fireResist" />

    <my-field label="chip" :content="props.cddaItem.data.chipResist" />

    <my-field label="density" :content="props.cddaItem.data.density" />

    <my-field v-if="props.cddaItem.data.windResist" label="windResist" :content="props.cddaItem.data.windResist" />

    <my-field label="specificTeatLiquid" :content="props.cddaItem.data.specificTeatLiquid" />

    <my-field label="specificHeatSolid" :content="props.cddaItem.data.specificHeatSolid" />

    <my-field label="latentHeat" :content="props.cddaItem.data.latentHeat" />

    <my-field label="freezePoint" :content="props.cddaItem.data.freezePoint" />

    <my-field label="breathability" :content="props.cddaItem.data.breathability" />

    <my-field label="edible" :content="props.cddaItem.data.edible" />

    <my-field label="rotting" :content="props.cddaItem.data.rotting" />

    <my-field label="soft" :content="props.cddaItem.data.soft" />

    <my-field label="reinforces" :content="props.cddaItem.data.reinforces" />

    <my-field label="sheetThickness" :content="props.cddaItem.data.sheetThickness" />

    <my-label label="vitamin" v-if="isNotEmpty(props.cddaItem.data.vitamins)" ul>
      <li v-for="vitamin in props.cddaItem.data.vitamins" :key="vitamin[0].id">
        <my-text :content="vitamin[0]" />
        <my-text :content="`(${vitamin[1]})`" />
      </li>
    </my-label>

    <my-field v-if="props.cddaItem.data.fuelData" label="fuel" :content="props.cddaItem.data.fuelData" :dl="true" />

    <my-label label="burn" v-if="isNotEmpty(props.cddaItem.data.burnData)" ul>
      <li v-for="(burn, index) in props.cddaItem.data.burnData" :key="index">
        <dl>
          <my-text :content="burn" />
        </dl>
      </li>
    </my-label>

    <my-label label="burnProduct" v-if="isNotEmpty(props.cddaItem.data.burnProducts)" ul>
      <li v-for="burnProduct in props.cddaItem.data.burnProducts" :key="burnProduct[0].id">
        <my-text :content="burnProduct[0]" />
        <my-text :content="`(${burnProduct[1]})`" />
      </li>
    </my-label>
  </my-card>
</template>

<script setup lang="ts">
import { Material } from 'src/classes/items/material/Material/Material';
import { isNotEmpty } from 'src/utils';
import MyCard from '../base/MyCard.vue';
import MyField from '../base/MyField.vue';
import MyLabel from '../base/MyLabel.vue';
import MyText from '../base/MyText/MyText.vue';

const props = defineProps<{
  cddaItem: Material;
}>();
</script>
