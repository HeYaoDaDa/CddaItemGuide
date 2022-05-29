import MyCard from 'components/base/MyCard.vue';
import MyField from 'components/base/MyField.vue';
import MyText from 'components/base/MyText/MyText.vue';
import { MyCardProp, MyFieldProp, MyTextProp } from 'src/types/MyFieldProp';
import { h, shallowReactive, VNode } from 'vue';
export class ViewUtil {
  result: VNode[] = shallowReactive([]);

  add(v: VNode) {
    this.result.push(v);
  }

  addCard(props: MyCardProp) {
    const cardUtil = new ViewUtil();
    this.add(h(MyCard, props, () => cardUtil.result));
    return cardUtil;
  }

  addField(props: MyFieldProp) {
    const subUtil = new ViewUtil();
    this.add(h(MyField, props, () => subUtil.result));
    return subUtil;
  }

  addText(props: MyTextProp) {
    const subUtil = new ViewUtil();
    this.add(h(MyText, props as object, () => subUtil.result));
    return subUtil;
  }
}
