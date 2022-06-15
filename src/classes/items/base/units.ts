import { CddaSubItem } from 'src/classes';
import { ViewUtil } from 'src/utils/ViewUtil';

export class Volume extends CddaSubItem {
  value = 0;

  static init(ml: number) {
    const result = new Volume();

    result.value = ml;

    return result;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Volume) return this.value === v.value;
    else return false;
  }

  parseJson(jsonObject: unknown, mult?: number) {
    if (typeof jsonObject === 'number') this.value = jsonObject * 250 * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      if (jsonObject.toLowerCase().endsWith('ml')) this.value = parseInt(jsonObject);
      else if (jsonObject.toLowerCase().endsWith('l')) this.value = parseInt(jsonObject) * 1000;
    }

    return this;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.value >= 1000 ? `${this.value / 1000} L` : `${this.value} ml` });
  }
}

export class Weight extends CddaSubItem {
  value = 0;

  static init(g: number) {
    const result = new Weight();

    result.value = g;

    return result;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Weight) return this.value === v.value;
    else return false;
  }

  parseJson(jsonObject: unknown, mult?: number) {
    if (typeof jsonObject === 'number') this.value = jsonObject * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      if (jsonObject.toLowerCase().endsWith('mg')) this.value = parseInt(jsonObject) / 1000;
      else if (jsonObject.toLowerCase().endsWith('kg')) this.value = parseInt(jsonObject) * 1000;
      else if (jsonObject.toLowerCase().endsWith('g')) this.value = parseInt(jsonObject);
    }

    return this;
  }

  doView(util: ViewUtil): void {
    let str = '';

    if (this.value >= 1000 * 1000) {
      str = `${this.value / 1000 / 1000} t`;
    } else if (this.value >= 1000) {
      str = `${this.value / 1000} kg`;
    } else {
      str = `${this.value} g`;
    }

    util.addText({ content: str });
  }
}

export class Length extends CddaSubItem {
  value = 0;

  static init(cm: number) {
    const result = new Length();

    result.value = cm;

    return result;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Length) return this.value === v.value;
    else return false;
  }

  parseJson(jsonObject: unknown, mult?: number) {
    if (typeof jsonObject === 'number') this.value = jsonObject * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      if (jsonObject.toLowerCase().endsWith('m')) this.value = parseInt(jsonObject) * 1000;
      if (jsonObject.toLowerCase().endsWith('km')) this.value = parseInt(jsonObject) * 1000 * 1000;
      else if (jsonObject.toLowerCase().endsWith('cm')) this.value = parseInt(jsonObject);
    }

    return this;
  }

  doView(util: ViewUtil): void {
    let str = '';

    if (this.value >= 1000 * 1000) {
      str = `${this.value / 1000 / 1000} km`;
    } else if (this.value >= 1000) {
      str = `${this.value / 1000} m`;
    } else {
      str = `${this.value} cm`;
    }

    util.addText({ content: str });
  }
}

export class Time extends CddaSubItem {
  value = 0;

  static init(s: number) {
    const result = new Time();

    result.value = s;

    return result;
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Time) return this.value === v.value;
    else return false;
  }

  parseJson(jsonObject: unknown, mult?: number) {
    if (typeof jsonObject === 'number') this.value = jsonObject * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      const re = /([0-9]+)\s*([A-Za-z]+)?/;
      const reResult = re.exec(jsonObject);
      const value = parseInt(reResult?.[1] ?? '0');
      const unit = reResult?.[2] ?? 's';

      if (['turns', 'turn', 't', 'seconds', 'second', 's'].includes(unit)) {
        this.value = value;
      } else if (['minutes', 'minute', 'm'].includes(unit)) {
        this.value = value * 60;
      } else if (['hours', 'hour', 'h'].includes(unit)) {
        this.value = value * 60 * 60;
      } else if (['days', 'day', 'd'].includes(unit)) {
        this.value = value * 60 * 60 * 24;
      } else {
        this.value = value;
      }
    }

    return this;
  }

  doView(util: ViewUtil): void {
    let result = '';

    const date = new Date(0);

    date.setSeconds(this.value);

    const day = date.getUTCDate() - 1;
    const hour = date.getUTCHours();
    const m = date.getUTCMinutes();
    const s = date.getUTCSeconds();

    if (day > 0) {
      result += day.toString() + ' d';
    }

    if (hour > 0) {
      result += hour.toString() + ' h';
    }

    if (m > 0) {
      result += m.toString() + ' m';
    }

    if (s > 0) {
      result += s.toString() + ' s';
    }

    util.addText({ content: result });
  }
}
