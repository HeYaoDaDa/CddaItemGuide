import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem, CddaSubItem } from 'src/classes';
import { CddaItemRef, GettextString } from 'src/classes/items';
import { fuelVersionFactory } from 'src/classes/items/material/Fuel/FuelVersionFactory';
import { materialBurnVersionFactory } from 'src/classes/items/material/MaterialBurn/MaterialBurnVersionFactory';
import MaterialCardVue from 'src/components/cddaItems/MaterialCard.vue';
import { jsonTypes } from 'src/constants/jsonTypesConstant';
import { isEmpty } from 'src/utils';
import { CddaJsonParseUtil } from 'src/utils/json/CddaJsonParseUtil';
import { ViewUtil } from 'src/utils/ViewUtil';
import { h } from 'vue';
import { MaterialBreathability } from '../MaterialBreathability/MaterialBreathability';

export class Material extends CddaItem<MaterialData> {
  data = {} as MaterialData;

  doGetName(): string {
    return this.data.name.translate();
  }

  doLoadJson(data: MaterialData, util: CddaJsonParseUtil): void {
    data.name = util.getGettextString('name');
    data.bashResist = util.getNumber('bash_resist');
    data.cutResist = util.getNumber('cut_resist');
    data.bulletResist = util.getNumber('bullet_resist');
    data.acidResist = util.getNumber('acid_resist');
    data.elecResist = util.getNumber('elec_resist');
    data.fireResist = util.getNumber('fire_resist');
    data.chipResist = util.getNumber('chip_resist');
    data.density = util.getNumber('density', 1);
    data.sheetThickness = util.getNumber('sheet_thickness');
    data.windResist = util.getOptionalNumber('wind_resist');
    data.specificHeatSolid = util.getNumber('specific_heat_liquid', 4.186);
    data.specificTeatLiquid = util.getNumber('specific_heat_solid', 2.108);
    data.latentHeat = util.getNumber('latent_heat', 334);
    data.freezePoint = util.getNumber('freezing_point');
    data.breathability = util.getCddaSubItem('breathability', new MaterialBreathability().parseJson(undefined));
    data.salvagedInto = util.getOptionalCddaItemRef('salvaged_into', jsonTypes.item);
    data.repairedWith = util.getOptionalCddaItemRef('repaired_with', jsonTypes.item);
    data.edible = util.getBoolean('edible');
    data.rotting = util.getBoolean('rotting');
    data.soft = util.getBoolean('soft');
    data.reinforces = util.getBoolean('reinforces');
    data.vitamins = util
      .getArray('vitamins', <[string, number]>{})
      .map((vitaminTulpe) => [CddaItemRef.init(vitaminTulpe[0], jsonTypes.vitamin), vitaminTulpe[1]]);
    data.burnData = util.getArray('burn_data', materialBurnVersionFactory.getProduct());
    if (isEmpty(data.burnData) && data.fireResist <= 0)
      data.burnData.push(materialBurnVersionFactory.getProduct().parseJson({ burn: 1 }));
    data.fuelData = util.getOptionalCddaSubItem('fuel_data', fuelVersionFactory.getProduct());
    data.burnProducts = util
      .getArray('burn_products', <[string, number]>{})
      .map((burnProduct) => [CddaItemRef.init(burnProduct[0], jsonTypes.item), burnProduct[1]]);
  }

  doFinalize(): void {
    this.weight = 1;
    this.isSearch = true;
  }

  doView(data: MaterialData, util: ViewUtil): void {
    util.add(h(MaterialCardVue, { cddaItem: this }));
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }
}

interface MaterialData {
  name: GettextString;

  salvagedInto?: CddaItemRef;
  repairedWith?: CddaItemRef;

  bashResist: number;
  cutResist: number;
  bulletResist: number;
  acidResist: number;
  elecResist: number;
  fireResist: number;
  chipResist: number;

  density: number;
  breathability: MaterialBreathability;
  windResist?: number;

  specificTeatLiquid: number;
  specificHeatSolid: number;
  latentHeat: number;

  freezePoint: number;
  edible: boolean;
  rotting: boolean;
  soft: boolean;
  reinforces: boolean;

  sheetThickness: number;
  vitamins: [CddaItemRef, number][];
  fuelData?: CddaSubItem;
  burnData: CddaSubItem[];
  burnProducts: [CddaItemRef, number][];
}
