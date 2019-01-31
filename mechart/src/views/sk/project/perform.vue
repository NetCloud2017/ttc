<template>
  <div class="page-assets-perform">
    <div class="baseDiv">
      <div class="header-box">
        <div class="title">请填写项目开始执行的日期，该日期将用于计算项目剩余融资天数</div>
      </div>
      <div class="datebox">
        <div>执行日期</div>
        <div  class="date-pdding-left">
          <el-date-picker
          v-model="performDate"
          value-format="yyyy-MM-dd"
          class="el-date-picker-zindex"
          type="date"
          placeholder="选择日期">
        </el-date-picker></div>
      </div>

    </div>

  </div>
</template>
<script type="text/ecmascript-6">
  import searchSelect from 'components/search-select/searchSelect';
  export default {
    components: {
      searchSelect
    },
    props: {
      id: [String, Number] // 编辑项目的ID
    },
    data() {
      return {
        performDate: '' // 资产执行日期
      };
    },
    computed: {
    },
    methods: {
      // 定义表头的样式
      getHeaderCellClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background: #ffffff; height: 34px; text-align: center !important; color: #1a1a1a !important;';
        } else {
          return '';
        }
      }
    }
  };
</script>
<style>
  .page-assets-perform {
    background-color: #ffffff;
    width: 100%
  }

  .page-assets-perform .baseDiv {
    width: 100%;
    height: auto;
    background-color: white;
    color: #1a1a1a;
  }
  .page-assets-perform .baseDiv .header-box{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0px;
  }
  .page-assets-perform .baseDiv .header-box .title {
    color: #1a1a1a;
    font-size: 14px;
    padding: 0px;
  }
  .page-assets-perform .baseDiv .el-input {
    color: #1a1a1a;
    font-size: 14px;
    height: 34px;
  }
  .page-assets-perform .baseDiv .datebox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 20px;
  }
  .page-assets-perform .baseDiv .datebox .date-pdding-left{
    padding-left: 10px;
  }

</style>
