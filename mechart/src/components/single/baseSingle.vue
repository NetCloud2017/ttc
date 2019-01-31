<template>
  <div :class="baseClass">
    <slot name="labelSlot">
      <div :class="labelClass" >
        <i v-if="showLabelIcon" :class="labelIcon"></i>
        <span v-html="bindHtml(param.bindHtml)"></span>
        {{getLabel(param.label)}}{{(param.delimiter && param.delimiter.length > 0) ? param.delimiter : '：'}}
      </div>
    </slot>
    <slot name="valueSlot">
      <el-input
        v-if="param.isInput"
        :class="valueClass"
        :type="param.type"
        :rows="rows"
        :placeholder="currentPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :value="currentValue"
        @change="handleChange">
      </el-input>
    </slot>
    <div :title="data[param.key]" :class="valueClass" v-if="isOnlyShow(param)">{{data[param.key]}}{{unit(data[param.key], param.unit)}}</div>
  </div>

</template>
<script type="text/babel">
  import { valueEquals } from 'element-ui/src/utils/util';
  export default {
    props: {
      value: [String, Number],
      size: String,
      resize: String,
      disabled: Boolean,
      readonly: Boolean,
      rows: {
        type: Number,
        default: 2
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      baseClass: Array,
      labelClass: Array,
      labelIcon: Array,
      valueClass: Array,
      suffixIcon: String,
      prefixIcon: String,
      label: String,
      clearable: {
        type: Boolean,
        default: false
      },
      tabindex: String,
      data: Object,
      param: {
        type: Object,
        default: {
          type: 'text',  // input框的类型
          label: '', // 标签显示的文字
          isInput: false, // 是否可输入
          placeholder: '', // 输入框的提示文字
          delimiter: '：', // 标签和内容的间隔符
          key: '' // 内容的字段名
        }
      },
      placeholder: {
        type: String,
        default: ''
      },
      isInput: {
        type: Boolean,
        default: false
      },
      isShowValue: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentValue: this.data[this.param.key] === undefined || this.data[this.param.key] === null
          ? ''
          : this.data[this.param.key],
        dataV: {},
        valuetext: '',
//        labeltext: '',
        currentPlaceholder: this.placeholder ? this.placeholder : ''
      };
    },
    watch: {
      placeholder(val) {
        this.currentPlaceholder = val;
      },
      data(data) {
        this.dataV = data;
        this.currentValue = data[this.param.key];
        console.log('currentValue : ' + JSON.stringify(this.currentValue));
//        this.labeltext = data.label.text;
      }
    },
    computed: {
      // 判断是否是仅仅显示value数据
      isOnlyShow(val) {
        return function (val) {
          return !val.isInput && (val.isShowValue === undefined || val.isShowValue);
        };
      },
      // 动态绑定的html
      bindHtml(bindHtml) {
        return function (bindHtml) {
          return bindHtml && bindHtml.length > 0 ? bindHtml : '';
        };
      },
      // 动态获取label的值
      getLabel(label) {
        return function (label) {
          return label && label.length > 0 ? label : '';
        };
      },
      // 控制是否显示label前面的图标
      showLabelIcon() {
        return this.labelIcon && this.labelIcon.length > 0;
      },
      // 返回显示数据的单位（元/吨、天/元， 台等等）
      unit(val, unit) {
        return function (val, unit) {
          if (!unit) {
            return '';
          }
          return val && val !== '' ? unit : '';
        };
      }
    },
    methods: {
      handleChange(event) {
        this.emitChange(event);
      },
      emitChange(val) {
        if (!valueEquals(this.currentValue, val)) {
          this.$emit('change', val);
        }
      }
    }
  };
</script>
