 <template>
  <div class="marketSection">
    <header class="marketHead">
      <span>{{"市场行情INDEX（单位:RMB）"}}</span>
    </header>
    <el-table
      border
      ref="homeSingleTable"
      :data="markList"
      v-loadmore="loadHomeMk"
      highlight-current-row
      @row-click="routerTo"
      height="520"
      class="homeMarketTable"
    >
      <el-table-column
        prop="marketDataNo"
        label="编号"
      >
      </el-table-column>
      <el-table-column
        prop="mainProductName"
        label="产品"
      >
      </el-table-column>
      <el-table-column
        prop="mainStandard"
        label="主标准"
      >
      </el-table-column>
      <el-table-column
        prop="marketPrice"
        label="市价"
      >
        <template slot-scope="scope">
          <price-cell :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        prop="adRatio"
        label="涨跌"
      >
        <template slot-scope="scope">
          <updown-cell :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        prop="discountRate"
        label="建议折率"
      >
        <template slot-scope="scope">
          <rate-cell :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        prop="flowCoefficient"
        label="流通系数"
      >
        <template slot-scope="scope">
          <cccf-cell :row="scope.row" />
        </template>
      </el-table-column>
      <div slot="append" v-if="noMore" class="no-more">没有更多数据了</div>
    </el-table>
  </div>
</template>
<script>
  let priceCell = {
    template: `<div :style="{color: rowColor}">{{this.row.marketPrice}}</div>`,
    props: ['row'],
    computed: {
      rowColor () {
        return this.row.adRatioColor;
      }
    }
  };
  let updownCell = {
    template: `<div :style="{color: this.rowColor}" >{{row.adRatioString}}</div>`,
    props: ['row'],
    computed: {
      rowColor () {
        return this.row.adRatioColor;
      }
    }
  };
  let rateCell = {
    template: `<div :style="{color: '#e5962e' }">{{row.discountRateString }}</div>`,
    props: ['row']
  };
  let cccfCell = {
    template: `<div :style="{color: '#e5962e'}">{{row.flowCoefficient}}</div>`,
    props: ['row']
  };
  export default {
    props: ['refresh'],
    data() {
      return {
        skMarketData: [],
        noMore: false,
        markList: [],
        maxLength: 0
      };
    },
    beforeMount () {
      this.reqMarketData();
    },
    mounted () {
      this.$nextTick(() => {
        if (this.skMarketData) {
          this.setCurrent(this.skMarketData[0]);
        };
      });
    },
    methods: {
      initData () {
        // 数据刷新；
        this.skMarketData = [];
        this.reqMarketData();
      },
      loadHomeMk () {
        var start = this.markList.length + 10;
        console.log('loadmore', start, this.maxLength);
        if (start < this.maxLength) {
          var addList = this.skMarketData.slice(0, start);
          this.markList = this.markList.concat(addList);
        } else {
          this.noMore = true;
        }
      },
      setCurrent(row) {
        this.$refs.homeSingleTable.setCurrentRow(row);
      },
      routerTo (row, event, column) {
        // 点击某行 跳转到市场行情；并定位
        this.$store.dispatch('sendCurrentRow', row);
        this.setCurrent(row);
        this.$router.replace('/skclient/marketIndex');
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      reqMarketData() {
        this.ajax({
          type: 'GET',
          url: 'malisk/client/home/homeMarketDetail',
          success: res => {
            setTimeout(() => {
              this.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              this.skMarketData = res.result;
              this.maxLength = res.result.length;
              if (this.maxLength <= 15) {
                this.markList = res.result;
              } else {
                this.markList = res.result.splice(0, 15);
              }
            } else {
              this.errorTip(res.message);
            }
          }
        });
      }
    },
    watch: {
      skMarketData: {
        handler: function () {
          this.setCurrent(this.skMarketData[0]);
        }
      },
      refresh: {
        handler: function () {
          this.initData();
        }
      }
    },
    components: {
      priceCell,
      updownCell,
      rateCell,
      cccfCell
    }
  };
</script>
<style lang='less' rel='stylesheet/less' scoped>
.marketSection {
  width: 780px;
  height: 570px;
  padding: 0 10px;
  margin-bottom: 10px;
  background: #1f2533;
  .marketHead {
    height: 34px;
    font-size: 14px;
    line-height: 34px;
  }
  .homeMarketTable{
    cursor: pointer;
    .no-more{
      background: #000;
      line-height:40px;
      text-align:center;
      color:#fff;
    }
  }
}
</style>
