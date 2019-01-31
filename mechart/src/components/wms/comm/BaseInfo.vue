<template>
  <div v-if="showBaseInfoCategory" class="base-info-category">
    <div v-if="categoryTitle && categoryTitle.length > 0 && showBaseInfoCategory" :class="titleClass">{{ categoryTitle }}</div>
    <div v-if="showBaseInfoCategory" :class="contentClass" >
      <base-single :style="baseSigneStyle" v-for="(item, index) in params" v-if="showInfo(data[item.key])" :baseClass="rowClass(item.baseClass)" :labelIcon="item.labelIcon"
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
          return ['default-title-class'];
        }
      }, // 分类项标题的样式
      contentClass: {
        type: Array,
        default() {
          return ['default-content-class'];
        }
      }, // 分类项整体内容的样式
      data: Object,
      widthPercent: String // 单条信息占一行的宽度比
    },
    data() {
      return {};
    },
    computed: {
      // 每一行显示的样式
      rowClass(val) {
        return function (val) {
          return val && val.length > 0 ? val : ['default-base-single'];
        };
      },
      // label显示的样式
      labelClass(val) {
        return function (val) {
          return val && val.length > 0 ? val : ['default-label-class'];
        };
      },
      // value显示的样式
      valueClass(val) {
        return function (val) {
          return val && val.length > 0 ? val : ['default-value-class'];
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
      showBaseInfoCategory() {
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
      },
      // 设置显示项占一行的宽度百分比 baseSigneStyle
      baseSigneStyle() {
        if (!validate.stringIsNullOrEmpty(this.widthPercent)) {
          return 'width: ' + this.widthPercent + ' !important;';
        } else {
          return '';
        }
      }
    },
    methods: {
      getClass: function (val, defaultClass) {
        return val && val.length > 0 ? val : defaultClass;
      }
    }
  };
</script>
<style>
  .base-info-category {
  }

  .base-info-category .default-title-class {
    display: block;
    width: auto;
    height: 50px;
    line-height: 50px;
    text-align: left;
    box-sizing: border-box;
    font-size: 14px !important;
    padding-left: 20px;
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #1a1a1a;
    background-color: white;
  }

  .base-info-category .default-content-class {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .base-info-category .default-base-single {
    width: 33.33%;
    height: 100px;
    padding-left: 20px;
    vertical-align: middle;
    display: inline-block;
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    background-color: white;
  }

  .base-info-category .default-label-class {
    width: 100%;
    box-sizing: border-box;
    font-size: 14px !important;
    color: #808080;
    vertical-align: middle;
    text-align: left;
    padding-top: 18px;
    padding-bottom: 18px;
  }
  .base-info-category .default-label-class .maliiconfont  {
    color: #ff6c2b;
  }

  .base-info-category .default-value-class {
    width: 100%;
    box-sizing: border-box;
    color: #1a1a1a;
    vertical-align: middle;
    text-align: left;
  }
</style>
