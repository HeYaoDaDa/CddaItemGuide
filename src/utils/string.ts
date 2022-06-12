import { globalI18n } from 'src/boot/i18n';

export function readableData(value: unknown) {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
      if (Number.isInteger(value)) {
        return Math.trunc(value);
      } else {
        return value.toFixed(2);
      }
    case 'boolean':
      return globalI18n.global.t('base.' + (value ? 'true' : 'false'));
    default:
      return value;
  }
}
