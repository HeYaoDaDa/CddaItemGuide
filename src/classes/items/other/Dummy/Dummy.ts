import { ColDef, ColGroupDef } from 'ag-grid-community';
import { CddaItem } from 'src/classes';

export class Dummy extends CddaItem<object> {
  doLoadJson(): void {
    return;
  }

  doGetName(): string | undefined {
    return;
  }

  doView(): void {
    return;
  }

  gridColumnDefine(): (ColGroupDef | ColDef)[] {
    return [];
  }
}
