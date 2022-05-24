import MyField from 'components/base/MyField.vue';
import MyCard from 'components/base/MyCard.vue';
import MyText from 'components/base/MyText/MyText.vue';
import { MyCardProp, MyFieldProp, MyTextProp } from 'src/types/MyFieldProp';
import { h, reactive, VNode } from 'vue';
export class ViewUtil {
  result: VNode[] = reactive([]);

  add(v: VNode) {
    this.result.push(v);
  }

  addCard(props: MyCardProp) {
    const cardUtil = reactive(new ViewUtil());
    this.add(h(MyCard, props, () => cardUtil.result));
    return cardUtil;
  }

  addField(props: MyFieldProp) {
    this.add(h(MyField, props));
  }

  addText(props: MyTextProp) {
    this.add(h(MyText, props));
  }
}
