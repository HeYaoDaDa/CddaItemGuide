import { CddaItem, CddaSubItem } from 'src/classes';
import { RouteLocationRaw } from 'vue-router';

export interface MyFieldProp {
  label: string;
  translate?: string;
  isHide?: boolean | (() => boolean);
  labelRoute?: RouteLocationRaw;
  dl?: boolean;
  ul?: boolean;
  content?: ContentProps;
  valueRoute?: RouteLocationRaw | RouteLocationRaw[];
  separator?: string;
  p?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContentProp = undefined | string | number | boolean | CddaSubItem;
export type ContentProps = ContentProp | ContentProp[];

export interface MyTextProp {
  content?: ContentProps;
  route?: RouteLocationRaw | RouteLocationRaw[];
  separator?: string;
  p?: boolean;
  li?: boolean;
}

export interface MyCardProp {
  label?: string;
  width?: string;
  translate?: string;
  route?: RouteLocationRaw;
  cddaItem?: CddaItem<object>;
  symbol?: string;
  color?: string;
}
