import { ViewUtil } from 'src/utils/viewUtil';
import { MyClass } from './EqualClass';

export class Volume extends MyClass<Volume> {
  value = 0;

  constructor(ml?: number) {
    super();
    if (ml) {
      this.value = ml;
    }
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Volume) return this.value === v.value;
    else return false;
  }

  fromJson(jsonObject: unknown, mult?: number): Volume | undefined {
    const result = new Volume();
    if (typeof jsonObject === 'undefined') return result;
    if (typeof jsonObject === 'number') result.value = jsonObject * 250 * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      if (jsonObject.toLowerCase().endsWith('ml')) result.value = parseInt(jsonObject);
      else if (jsonObject.toLowerCase().endsWith('l')) result.value = parseInt(jsonObject) * 1000;
    }
    return result;
  }

  doView(util: ViewUtil): void {
    util.addText({ content: this.value >= 1000 ? `${this.value / 1000} L` : `${this.value} ml` });
  }
}

export class Weight extends MyClass<Weight> {
  value = 0;

  constructor(g?: number) {
    super();
    if (g) {
      this.value = g;
    }
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Weight) return this.value === v.value;
    else return false;
  }

  fromJson(jsonObject: unknown, mult?: number): Weight | undefined {
    const result = new Weight();
    if (typeof jsonObject === 'undefined') return result;
    if (typeof jsonObject === 'number') result.value = jsonObject * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      if (jsonObject.toLowerCase().endsWith('mg')) result.value = parseInt(jsonObject) / 1000;
      else if (jsonObject.toLowerCase().endsWith('kg')) result.value = parseInt(jsonObject) * 1000;
      else if (jsonObject.toLowerCase().endsWith('g')) result.value = parseInt(jsonObject);
    }
    return result;
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

export class Length extends MyClass<Length> {
  value = 0;

  constructor(cm?: number) {
    super();
    if (cm) {
      this.value = cm;
    }
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Length) return this.value === v.value;
    else return false;
  }

  fromJson(jsonObject: unknown, mult?: number): Length | undefined {
    const result = new Length();
    if (typeof jsonObject === 'undefined') return result;
    if (typeof jsonObject === 'number') result.value = jsonObject * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      if (jsonObject.toLowerCase().endsWith('m')) result.value = parseInt(jsonObject) * 1000;
      if (jsonObject.toLowerCase().endsWith('km')) result.value = parseInt(jsonObject) * 1000 * 1000;
      else if (jsonObject.toLowerCase().endsWith('cm')) result.value = parseInt(jsonObject);
    }
    return result;
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

export class Time extends MyClass<Time> {
  value = 0;

  constructor(s?: number) {
    super();
    if (s) {
      this.value = s;
    }
  }

  equal(v: object): boolean {
    if (v === undefined) return false;
    if (typeof v === 'number') return this.value === v;
    if (v instanceof Time) return this.value === v.value;
    else return false;
  }

  fromJson(jsonObject: unknown, mult?: number): Time | undefined {
    const result = new Time();
    if (typeof jsonObject === 'undefined') result.value = 0;
    if (typeof jsonObject === 'number') result.value = jsonObject * (mult ?? 1);
    if (typeof jsonObject === 'string') {
      const re = /([0-9]+)\s*([A-Za-z]+)?/;
      const reResult = re.exec(jsonObject);
      const value = parseInt(reResult?.[1] ?? '0');
      const unit = reResult?.[2] ?? 's';
      if (['turns', 'turn', 't', 'seconds', 'second', 's'].includes(unit)) {
        result.value = value;
      } else if (['minutes', 'minute', 'm'].includes(unit)) {
        result.value = value * 60;
      } else if (['hours', 'hour', 'h'].includes(unit)) {
        result.value = value * 60 * 60;
      } else if (['days', 'day', 'd'].includes(unit)) {
        result.value = value * 60 * 60 * 24;
      } else {
        result.value = value;
      }
    }
    return result;
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
