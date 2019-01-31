<template>
  <div class="page-info-category-demo">
    <h3> 信息分类显示组件demo </h3>
    <info-category categoryTitle="基础信息" :params="params" :data="data">

    </info-category>


    <h3> 用户信息详情页demo </h3>
    <info-category categoryTitle="" :params="params1" :data="data1">
      <el-carousel slot="valueSlot5" indicator-position="outside">
        <el-carousel-item v-for="item in fileUrlsArray" v-bind:key="item.url" :name="item.url">
          <!--组件使用说明 https://www.npmjs.com/package/vue-photo-preview -->
          <img  class="el-have--picture-card" :src="item.url"  preview="0" :preview-text="item.name"/>
        </el-carousel-item>
      </el-carousel>
    </info-category>

    <div :class="labelClass" style="margin-top: 30rem">身&#8195;&#8195;&#8195;&#8195;份</div>
  </div>
</template>
<script>
  import InfoCategory from 'components/wms/comm/InfoCategory';
  export default {
    components: {
      InfoCategory
    },
    data() {
      return {
        params: [
          {
            type: 'text',
            label: '货主企业',
            delimiter: '：',
            key: 'ownerName',
            baseClass: ['base-single'], // 子组件的基本样式
            labelClass: ['label-class'], // 标签的样式
            valueClass: ['value-class'], // 内容样式
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          },
          {
            type: 'text',
            label: '联 系 人 姓 名',
            delimiter: '：',
            key: 'contractName',
            baseClass: ['base-single'], // 子组件的基本样式
            labelClass: ['label-class'], // 标签的样式
            valueClass: ['value-class'], // 内容样式
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          },
          {
            type: 'text',
            label: '联系人电话',
            delimiter: '：',
            key: 'contractMobile',
            baseClass: ['base-single'], // 子组件的基本样式
            labelClass: ['label-class'], // 标签的样式
            valueClass: ['value-class'], // 内容样式
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          },
          {
            type: 'text',
            label: '预计入库时间',
            delimiter: '：',
            key: 'instorePlanTime',
            baseClass: ['base-single'], // 子组件的基本样式
            labelClass: ['label-class'], // 标签的样式
            valueClass: ['value-class'], // 内容样式
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          },
          {
            type: 'text',
            label: '司机姓名',
            isInput: true,
            placeholder: '请输入司机姓名',
            delimiter: '：',
            key: 'driverName',
            baseClass: ['base-single'], // 子组件的基本样式
            labelClass: ['label-class'], // 标签的样式
            valueClass: ['value-class'], // 内容样式
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          },
          {
            type: 'text',
            label: '司机电话',
            delimiter: '：',
            key: 'driverMobile',
            baseClass: ['base-single'], // 子组件的基本样式
            labelClass: ['label-class'], // 标签的样式
            valueClass: ['value-class'], // 内容样式
            needLabelSlot: false, // label slot
            needValueSlot: false // value slot
          }
        ],
        data: {
          ownerName: '永百川货运',
          contractName: '王大贵',
          contractMobile: '18318318318',
          instorePlanTime: '2018-9-27',
          driverName: '王大贵',
          driverMobile: '15819685274'
        },
        params1: [
          {
            bindHtml: '<span >身&#8195;&#8195;&#8195;&#8195;份</span>',
            key: 'userType'
          },
          {
            bindHtml: '<span >公&ensp;&ensp;司&ensp;全&ensp;称</span>',
//            label: '公司全称',
            key: 'ownerName'
          },
          {
            label: '联系人姓名',
            key: 'contractName'
          },
          {
            label: '联 系 人 号 码',
            key: 'contractMobile'
          },
          {
            label: '营 业 执 照 号',
            isInput: false,
            key: 'licenseNo'
          },
          {
            label: '营业执照照片',
            key: 'licenseUrl',
            isShowValue: false,
            needValueSlot: true // value slot
          }
        ],
        data1: {
          userType: '货主',
          ownerName: '深圳市红星贸易有限公司',
          contractName: '张凯',
          contractMobile: '18318318318',
          licenseNo: '4135664431243',
          licenseUrl: '15819685274'
        },
        item: {
          name: '商检单',
          url: 'http://i.imgur.com/CqmBjo5.jpg'
        },
        fileUrlsArray: [
          {
            name: '商检单',
            url: 'http://i.imgur.com/CqmBjo5.jpg'
          },
          {
            name: '唛头照片',
            url: 'http://i.imgur.com/zkaAooq.jpg'
          },
          {
            name: '唛头照片',
            url: 'http://i.imgur.com/0gqnEaY.jpg'
          }
        ]
      };
    },
    methods: {

    }
  };
</script>
<style >
  h3 {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  .page-info-category-demo .base-single{
    width: 100%;
    height: 2.5rem;
    vertical-align:middle;
    display:flex;
  }
  .page-info-category-demo .label-class{
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
  .page-info-category-demo .value-class{
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
  .page-info-category-demo .img-content{
    white-space: nowrap;
  }
  .page-info-category-demo .el-have--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    margin-left: 10px;
    vertical-align: top;
    white-space: nowrap;

  }
</style>
