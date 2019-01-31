<template>
 <div class="assetSection">
    <header class="assetHead">
      <span>{{'资产管理'}}</span>
    </header>
    <el-table
      border
      ref="assetSingleTable"
      :data="assetsData"
      highlight-current-row
      @row-click="goToAssets"
      style="width: 100%"
      height="170"
      class="assetsT"
    >
      <el-table-column
        prop="projectNo"
        label="项目编号"
      >
      </el-table-column>
      <el-table-column
        prop="discountRateDeclareDisplay"
        label="执行折率"
      >
      </el-table-column>
      <el-table-column
        prop="totalDiscountedAmountDeclare"
        label="折后总价"
      >
      </el-table-column>
      <el-table-column
        prop="riskCoefficient"
        label="风险系数"
      >
        <template slot-scope="scope">
          <danger-cell :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>
 </div>
</template>
<script>
let dangerCell = {
  template: `<div :style="{background: paint}">{{row.riskCoefficient}}</div>`,
  props: ['row'],
  computed: {
    paint () {
      return this.row.riskRateColor;
    }
  }
};
export default {
  props: ['refresh'],
  data () {
    return {
      assetsData: []
    };
  },
  beforeMount () {
    this.reqAssetData();
  },
  beforeUpdate () {
    if (this.assetsData[0]) {
      this.setCurrent(this.assetsData[0]);
    };
  },
  methods: {
    initData () {
      // 从新初始化数据
      this.assetsData = [];
      this.reqAssetData();
    },
    setCurrent (row) {
      this.$refs.assetSingleTable.setCurrentRow(row);
    },
    goToAssets (row, event, column) {
      this.setCurrent(row);
      this.$store.dispatch('', row);
      this.$router.replace(`/skclient/projectIndex?fromPage=1&id=${row.id}`);
    },
    reqAssetData () {
      this.ajax({
        type: 'GET',
        url: 'malisk/client/home/homePropertyList',
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.$store.dispatch('sendSkAssets', res.result);
            this.assetsData = res.result.pageProjectVos;
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
    dangerCell
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.assetSection{
  box-sizing: content-box !important;
  width: 480px;
  height: 228px;
  padding: 0 10px;
  margin-bottom: 10px;
  background: #1f2533;
  overflow: hidden;
  .assetHead{
    height: 34px;
    font-size: 14px;
    line-height: 34px;
  }
  .assetsT{
    cursor: pointer;
  }
}
</style>
