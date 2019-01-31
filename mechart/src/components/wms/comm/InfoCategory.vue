<template>
  <div v-if="showInfoCategory">
    <div v-if="categoryTitle && categoryTitle.length > 0 && showInfoCategory" :class="titleClass">{{ categoryTitle }}</div>
    <div v-if="showInfoCategory" :class="contentClass" >
      <base-single v-for="(item, index) in params" v-if="showInfo(data[item.key])" :baseClass="rowClass(item.baseClass)" :labelIcon="item.labelIcon"
                   :labelClass="labelClass(item.labelClass)" :valueClass="valueClass(item.valueClass)"
                   :key="item.label" :param="item" :data="data" :type="inputType(item.text)">
        <div slot="labelSlot" v-if="needLabelSlot(item.needLabelSlot)"><slot :name="'labelSlot' + index"></slot></div>
        <div :class="valueClass(item.valueClass)" slot="valueSlot" v-if="needValueSlot(item.needValueSlot)">
          <slot :name="'valueSlot' + index"></slot>
        </div>
      </base-single>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BaseSingle from 'components/single/baseSingle';
  import validate from 'utils/common-method/validate/index';
  export default {
    components: {
      BaseSingle
    },
    props: {
      categoryTitle: {
        type: String,
        default: ''
      },
      params: {
        type: Array,
        default() {
          return [{
            type: 'text',  // input框的类型
            label: '', // 标签显示的文字
            isInput: false, // 是否可输入
            placeholder: '', // 输入框的提示文字
            delimiter: '：', // 标签和内容的间隔符
            key: '', // 内容的字段名
            baseClass: [], // 子组件的基本样式
            labelClass: [], // 标签的样式
            valueClass: [], // 内容样式
            isShowValue: false,
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          }];
        }
      },
      titleClass: {
        type: Array,
        default() {
          return ['title'];
        }
      }, // 分类项标题的样式
      contentClass: {
        type: Array,
        default() {
          return ['default-content-class'];
        }
      }, // 分类项整体内容的样式
      data: Object
    },
    data() {
      return {};
    },
    computed: {
      // 每一行显示的样式
      rowClass(val) {
        return function (val) {
          return val && val.length > 0 ? val : ['base'];
        };
      },
      // label显示的样式
      labelClass(val) {
        return function (val) {
          return val && val.length > 0 ? val : ['defalut-label-class'];
        };
      },
      // value显示的样式
      valueClass(val) {
        return function (val) {
          return val && val.length > 0 ? val : ['defalut-value-class'];
        };
      },
      // 判断label是否需要用slot
      needLabelSlot(val) {
        return function (val) {
          return val;
        };
      },
      // 判断value是否需要用slot
      needValueSlot(val) {
        return function (val) {
          return val;
        };
      },
      // 输入框的输入类型
      inputType(val) {
        return function (val) {
          return val && val.length > 0 ? val : 'text';
        };
      },
      // 判断分类信息是否显示，如果内容为空则不展示
      showInfoCategory() {
        let show = false;
        let len = this.params.length;
        for (let i = 0; i < len; i++) {
          if (!validate.stringIsNullOrEmpty(this.data[this.params[i].key])) {
            show = true;
            break;
          }
        }
        return show;
      },
      // 根据组件需要展示的内容判断组件显示还是不显示，如果内容为空则不展示
      showInfo(val) {
        return function (val) {
          return !validate.stringIsNullOrEmpty(val);
        };
      }
    },
    methods: {
      getClass: function (val, defaultClass) {
        return val && val.length > 0 ? val : defaultClass;
      }
    }
  };
</script>
<style >
  .title{
    height: 2.5rem;
    line-height: 2.5rem;
    box-sizing: border-box;
    padding: 0 1.2rem;
    font-size: 1.2rem;
    color: #1a1a1a;
  }
  .base{
    width: 100%;
    height: 2.5rem;
    vertical-align:middle;
    display:flex;
  }
  .default-content-class{
    display:flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .defalut-label-class{
    width: 9rem;
    height: 2.5rem;
    line-height: 2.5rem;
    box-sizing: border-box;
    padding: 0 0 0 1.2rem ;
    font-size: 1.2rem;
    color: #1a1a1a;
    vertical-align: middle;
    text-align: left;
  }
  .defalut-value-class {
    width: 50%;
    height: 2.5rem;
    line-height: 2.5rem;
    box-sizing: border-box;
    padding: 0 1.2rem;
    font-size: 1.2rem;
    color: #1a1a1a;
    vertical-align: middle;
    text-align: left;
  }
</style>
