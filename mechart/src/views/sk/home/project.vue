<template>
 <div class="proSection">
  <header class="proHead">
      <span>{{'项目库（单位: MT/RMB）'}}</span>
  </header>
  <el-table
    border
    ref="proSingleTable"
    :data="tableData"
    highlight-current-row
    @row-click="goToPro"
    style="width: 100%"
    height="450"
    class="proTable"
  >
    <el-table-column
      type="index"
      width="40"
      :index="tableIndex"
    >
    <!-- 无法处理掉 #号标题； -->
    </el-table-column>
    <el-table-column
      prop="projectNo"
      label="项目编号"
    >
    </el-table-column>
    <el-table-column
      prop="tradeTypeName"
      label="业务类型"
    >
    </el-table-column>
    <el-table-column
      prop="statusName"
      label="状态"
    >
      <template slot-scope="scope">
        <status-cell :row="scope.row" />
      </template>
    </el-table-column>
    <el-table-column
      label="资产总额"
      prop="totalPrice"
    >
    </el-table-column>
    <el-table-column
      label="申报折率"
      prop="discountRateDeclareDisplay"
    >
    </el-table-column>
    <el-table-column
      label="折后总价"
      prop="totalDiscountedAmountDeclare"
    >
    </el-table-column>
    <el-table-column
      label="建议折率"
      prop="discountRateAdviceDisplay"
    >
      <template slot-scope="scope">
          <advise-cell :row="scope.row" />
      </template>
    </el-table-column>
    <el-table-column
      label="风险系数"
      prop="riskCoefficient"
    >
      <template slot-scope="scope">
        <risk-rate-cell :row="scope.row" />
      </template>
    </el-table-column>
  </el-table>
 </div>
</template>
<script>
import List from '../demo/list.vue';
let statusCell = {
  template: `<div :style="{color: rowColor}">{{row.statusName}}</div>`,
  props: ['row'],
  computed: {
    rowColor () {
      let oxcolor = '';
      switch (this.row.status) {
        case 1 :
          oxcolor = '#fdfe1f';
          break;
        case 7:
          oxcolor = '#e6345e';
          break;
        case 2:
        case 3:
        case 4:
        case 6:
        default:
          oxcolor = '#fff';
      }
      return oxcolor;
    }
  }
};
let adviseCell = {
  template: `<div :style="{color: '#e5962e' }">{{row.discountRateAdviceDisplay}}</div>`,
  props: ['row']
};
let riskRateCell = {
  template: `<div :style="{background: rowColor}">{{row.riskCoefficient}}</div>`,
  props: ['row'],
  computed: {
    rowColor () {
      return this.row.riskRateColor;
    }
  }
};
export default {
  props: ['refresh'],
  data() {
    return {
      tableData: []
    };
  },
  beforeMount () {
    this.reqProData();
  },
  beforeUpdate () {
    this.setCurrent(this.tableData[0]);
  },
  methods: {
    initData () {
      this.tableData = [];
      this.reqProData();
    },
    tableIndex (index) {
      return index + 1;
    },
    goToPro (row, event, column) {
      this.setCurrent(row);
      this.$router.replace(`/skclient/projectIndex?fromPage=2&id=${row.id}`);
    },
    setCurrent(row) {
      this.$refs.proSingleTable.setCurrentRow(row);
    },
    reqProData () {
      //  没有数据 返回导致res.code undefined 报错；
      this.ajax({
        type: 'GET',
        url: 'malisk/client/home/homeProjectList',
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.tableData = res.result;
          } else {
            this.errorTip(res.message);
          }
        }
      });
    }
  },
  watch: {
    refresh: {
      handler: function () {
        this.initData();
      }
    }
  },
  components: {
    List,
    riskRateCell,
    adviseCell,
    statusCell
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .proSection{
    width: 1090px;
    height: 493px;
    padding: 0 10px;
    margin-bottom: 10px;
    background: #1f2533;
    .proHead{
      height: 34px;
      font-size: 14px;
      line-height: 34px;
    }
    .proTable{
      cursor: pointer;
    }
  }
</style>
