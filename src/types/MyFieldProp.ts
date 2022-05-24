import { RouteLocationRaw } from 'vue-router';
import { MyClass } from './EqualClass';

export interface MyFieldProp {
  label: string;
  transfer?: string;
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
export type ContentProp = undefined | string | number | boolean | MyClass<any>;
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
  transfer?: string;
  route?: RouteLocationRaw;
}
