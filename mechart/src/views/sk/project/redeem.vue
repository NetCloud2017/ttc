<template>
  <div class="page-assets-redeem">
    <div class="baseDiv">
      <div class="datebox">
        <div>赎单日期</div>
        <div  class="date-pdding-left">
          <el-date-picker
            v-model="redeemDate"
            class="el-date-picker-zindex"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            placeholder="请选择">
          </el-date-picker></div>
        </div>
    </div>
    <div  class="asset-table">
      <el-table border :header-cell-style="getHeaderCellClass" :data="allData.productListVos" height="280"
                style="width: 100%">
        <el-table-column   prop="mainLevelCode" label="编码" width="110">
        </el-table-column>
        <el-table-column  class="product-table-column"  prop="mainProductName" label="产品" >
        </el-table-column>
        <el-table-column prop="mainStandard" label="主标准" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="subStandard" label="二级标准" show-overflow-tooltip width="100">
        </el-table-column>
        <el-table-column prop="leftVolume" label="待赎数量(KG)" show-overflow-tooltip width="110">
        </el-table-column>
        <el-table-column prop="leftAmount" label="待赎资产" show-overflow-tooltip width="90">
        </el-table-column>
        <el-table-column prop="redeemVolume" label="出货数量(KG)" width="110">
          <template slot-scope="scope">
            <el-input size="mini" maxlength="10" @keyup.native="verifyDecimal(scope.row, 'redeemVolume')"  v-model="scope.row.redeemVolume"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="redeemAmount" label="赎单金额" width="110">
          <template slot-scope="scope" >
            <span v-if="scope.row.redeemVolume < scope.row.leftVolume">
              {{scope.row.redeemAmount=((scope.row.redeemVolume / scope.row.leftVolume) * scope.row.discountTotalAmountCal).toFixed(2)}}
            </span>
            <span v-if="scope.row.redeemVolume == scope.row.leftVolume">
              {{scope.row.redeemAmount=(scope.row.discountTotalAmountCal - scope.row.tradeAmountCal).toFixed(2)}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import maValidate from '@/utils/common-method/validate/index';
  // import {validateTips} from 'utils/tips';
  export default {
    components: {
    },
    props: {
      id: [String, Number], // 编辑项目的ID
      performDate: String // 执行日期
    },
    data() {
      return {
         // 产品列表
        allData: {},
        redeemDate: null,
        pickerOptions: {
          disabledDate: this.disabledDate
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      // 日期判断方法
      disabledDate(time) {
        var performDateStr = new Date(this.performDate);
        var performDateFormat = performDateStr.getTime(performDateStr);
        return time.getTime() <= performDateFormat - 8.64e7;
      },
      // 定义表头的样式
      getHeaderCellClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background: #f0f0f0; height: 34px; text-align: center !important; color: #1a1a1a !important;';
        } else {
          return '';
        }
      },
      getData() {
        let that = this;
        this.ajax({
          url: 'malisk/client/asset/assetProductList/' + that.id,
          loading: true,
          type: 'get',
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            that.allData = res.result;
          }
        });
      },
      // 校验小数
      verifyDecimal(row, prop) {
        if (row.redeemVolume > row.leftVolume) {
          // this.errorTip('出货数量不能大于待赎数量');
          row.redeemVolume = row.leftVolume;
        } else {
          maValidate.verifyDecimal(row, prop);
        }
      }
    }
  };
</script>
<style>
  .page-assets-redeem {
    background-color: #ffffff;
    width: 100%;
    color: #1a1a1a;
    font-size: 14px;
  }
  .page-assets-redeem .baseDiv {
    width: 100%;
    height: auto;
    background-color: white
  }
  .page-assets-redeem .baseDiv .datebox{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .page-assets-redeem .baseDiv .datebox .date-pdding-left{
    padding-left: 10px;
  }
  .page-assets-redeem  .baseDiv .datebox .el-input {
    width: 200px !important;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
  }
  .page-assets-redeem  .baseDiv .datebox  .el-input__inner {
    font-size: 14px;
    border: 1px #99a3bb solid !important;
  }
  .page-import-project .baseDiv .el-form-item {
    display: inline-block;
    width: 400px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .page-assets-redeem  .asset-table .product-table-column{
    background: #ffffff;
  }
  .page-assets-redeem  .asset-table  {
    margin-top: 20px;
  }
  .page-assets-redeem .baseDiv  .goods-title {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    width: 100%;
    margin-top: 20px;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    background: white
  }
  .page-assets-redeem .asset-table .el-table__body-wrapper {
    background: #ffffff !important;
  }
  .page-assets-redeem .asset-table .el-table--small td {
    text-align: center;
    background: #ffffff !important;
  }
  .page-assets-redeem .el-table td {
    background: #ffffff !important;
  }
  .page-assets-redeem  .asset-table .el-table .cell {
    padding-left: 2px;
    padding-right: 2px;
  }
  .page-assets-redeem  .asset-table  .el-table th div {
    padding-left: 2px;
    padding-right: 2px;
  }
  .page-assets-redeem  .asset-table  .el-table--border td:first-child .cell {
    padding-left: 2px;
    padding-right: 2px;
  }
  .page-assets-redeem  .asset-table  .el-table--border th:first-child .cell {
    padding-left: 2px;
    padding-right: 2px;
  }
  .page-assets-redeem .asset-table .el-table--small td {
    padding: 3px 0 !important;
    height: 30px !important;
  }
  .page-assets-redeem .asset-table .el-table__row{
    height: 30px !important;
  }
  .page-assets-redeem .asset-table .el-table tr {
    background-color: #fff !important;
  }
  .page-assets-redeem .asset-table .cell {
    line-height: 20px !important;
    text-align: center !important;
    color: #1a1a1a !important;
  }
  .page-assets-redeem .asset-table .el-input {
    width: 100px !important;
  }
  .page-assets-redeem  .asset-table .el-popper {
    z-index: 6000 !important;
  }
  .page-assets-redeem .asset-table .el-input__inner {
    text-align: center !important;
    height: 24px;
    line-height: 24px;
    border: 1px #99a3bb solid !important;
  }
  .page-assets-redeem .asset-table  .el-popper[x-placement^=bottom] {
    margin-top: 12px;
    width: 260px !important;
    z-index: 6000 !important;
  }
  .page-assets-redeem  .asset-table .el-table--border {
    border-color:#99a3bb !important;
  }
  .page-assets-redeem  .asset-table .el-table--group {
    border-color:#99a3bb !important;
  }
  .page-assets-redeem  .asset-table .el-table--border::after {
    background: #99a3bb !important;
  }

  .page-assets-redeem  .asset-table .el-table--group::after {
    background: #99a3bb !important;
  }
  .page-assets-redeem  .asset-table  .el-table::before{
    background: #99a3bb !important;
  }
  .page-assets-redeem  .asset-table .el-table td {
    border-color: #99a3bb !important;
  }
  .page-assets-redeem  .asset-table .el-table th {
    border-color: #99a3bb !important;
    background: #f0f0f0;
  }
  .page-assets-redeem .asset-table .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #ffffff !important;
  }
</style>
