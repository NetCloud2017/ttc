<template>
  <div class="egrid-cell-view-text-overflow" :style="customStyle">
    {{ text }}
  </div>
</template>

<script>
  import mValidate from 'utils/common-method/validate/index';
  export default {
    props: ['row', 'col', 'column'],

    computed: {
      text () {
        let property = mValidate.stringIsNullOrEmpty(this.col.convertProp) ? this.column.property : this.col.convertProp; // 属性字段名
        // 获取指定字段数据
        let value = this.row[property];
        // 判断value值是否为空，如果是则返回‘-’
        return mValidate.stringIsNullOrEmpty(value) ? '-' : value;
      },
      // 定制化的样式
      customStyle() {
        let customStyle = this.col.customStyle; // 定义样式的字符串
        if (mValidate.stringIsNullOrEmpty(customStyle) || (this.row.normal && this.col.differProp)) { // 判段是否有自定义的样式和者显示自定义的样式
          return '';
        }
        let styleAttrArrays = this.col.customStyle.split(';');
        // console.log('styleAttrArrays: ' + JSON.stringify(styleAttrArrays));
        for (let i = 0; i < styleAttrArrays.length; i++) {
          let replaceProp = styleAttrArrays[i].substring(styleAttrArrays[i].indexOf(':') + 1).trim();
          if (replaceProp.indexOf('replace-') === -1) { // 判断是否有替换样式的属性值的标识
            continue;
          }
          let prop = replaceProp.replace('replace-', ''); // 用‘’替换需要替换样式的属性值的标识
          let value = this.row[prop];
          if (!mValidate.stringIsNullOrEmpty(value)) { // 如果有样式的属性值则替换样式属性值， 如果没有则删除样式的属性
            customStyle = customStyle.replace(replaceProp, value);
          } else {
            customStyle = customStyle.replace(styleAttrArrays[i] + ';', '');
          }
        }
        return customStyle;
      }
    }
  };
</script>
<style>
  .egrid-cell-view-text-overflow {
    width: 100%;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
</style>
