<template>
  <common :show-search="false" title="市场行情（单位：RMB）">
    <div class="quotPage">
      <el-table
        border
        height="380"
        ref="marketSingleTable"
        :data="showList"
        highlight-current-row
        @row-click="handleCurrentChange"
        @row-contextmenu="rightCatchEvent"
        v-loadmore="loadMk"
        class="sk-table-black"
      >
        <el-table-column
          prop="mainLevelCode"
          label="编号"
        >
          <template slot-scope="scope" >
            <num-cell :row="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          prop="mainProductName"
          label="产品"
        >
          <template slot-scope="scope">
            <product-cell :row="scope.row" />
          </template>
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
      </el-table>
    </div>
    <!--<pc-dailog-->
      <!--title="添加取消自选项"-->
      <!--v-if="showMenu"-->
      <!--@confirm="confirm"-->
      <!--@cancel="showMenu = false"-->
      <!--customStyle="width: 250px; height: 90px;"-->
      <!--cancelText="删除自选项"-->
      <!--confirmText="添加自选项"-->
    <!--/>-->
    <div class="leftclick-menu" v-if="showMenu">
      <div class="leftclick-menu-mask" @click="showMenu = false;" @contextmenu="menuMaskClick($event)"></div>
      <ul class="leftclick-menu-con" :style="{left: menuPosition.x, top: menuPosition.y}">
        <li @click="confirm(1)" v-if="!isUserConcern" @contextmenu.prevent="">添加自选项</li>
        <li @click="confirm(2)" v-else @contextmenu.prevent="">删除自选项</li>
      </ul>
    </div>
  </common>
</template>
<script>
import Common from './common.vue';
import { mapState } from 'vuex';
import PcDailog from '../../../components/dialog/addSelfItem';
let numCell = {
  template: `<div :style="[textColor]">{{row.mainLevelCode || '-- --'}}</div>`,
  props: ['row'],
  computed: {
    textColor () {
      return this.row.isUserConcern ? { color: '#fdfe1f' } : { color: '#fff' };
    }
  }
};
let productCell = {
  template: `<div :style="[textColor]">{{row.mainProductName || '-- --'}}</div>`,
  props: ['row'],
  computed: {
    textColor () {
      return this.row.isUserConcern ? { color: '#fdfe1f' } : { color: '#fff' };
    }
  }
};
let standardCell = {
  template: `<div :style="[selectedColor]">{{this.row.standard || '-- --'}}</div>`,
  props: ['row'],
  data: function () {
    return {
      selectedColor: {
        color: '#fdfe1f'
      }
    };
  }
};
let priceCell = {
  template: `<div :style="{color: rowColor}">{{this.row.marketPrice || '-- --'}}</div>`,
  props: ['row'],
  computed: {
    rowColor () {
      return this.row.adRatioColor;
    }
  }
};
let updownCell = {
  template: `<div :style="{color: this.rowColor}" >{{row.adRatioString || '-- --'}}</div>`,
  props: ['row'],
  computed: {
    rowColor () {
      return this.row.adRatioColor;
    }
  }
};
let rateCell = {
  template: `<div :style="{color: color }">{{this.row.discountRateString || '-- --'}}</div>`,
  props: ['row'],
  computed: {
    color () {
      return this.row.adRatioColor;
    }
  }
};
let cccfCell = {
  template: `<div :style="{color: color}">{{row.flowCoefficient}}</div>`,
  props: ['row'],
  computed: {
    color () {
      return this.row.adRatioColor;
    }
  }
};
export default {
  props: ['newMarket'],
  data() {
    return {
      showMenu: false,
      isUserConcern: false,
      row: null,
      quotDataList: [],
      showList: [],
      maxLength: 0,
      menuPosition: {x: 0, y: 0}
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeMount () {
    this.requestList();
  },
  beforeUpdate () {
    // 数据更新默认选择第一行和展示第一行的二级标
    this.setCurrent(this.quotDataList[0]);
  },
  methods: {
    initData () {
      this.quotDataList = [];
      this.showMenu = false;
      this.row = null;
      this.$store.dispatch('sendToTag', []);
      this.$store.dispatch('sendToTagRow', {});
      this.requestList();
    },
    requestList () {
      // 
      let marketId = { id: '' };
      this.reqMarketData(marketId);
    },
    setCurrent (row) {
      this.$refs.marketSingleTable.setCurrentRow(row);
      this.searchSecTagData(row);
    },
    handleCurrentChange (row, event, column) {
      // 手动选择时展示手动选择的二级标
      this.setCurrent(row);
    },       
    handleScroll() {
      this.showMenu = false;
    },
    loadMk () {
      var start = this.showList.length + 10;
      if (start < this.maxLength) {
        var addList = this.quotDataList.slice(0, start);
        this.showList = this.showList.concat(addList);
      } else {
        this.noMore = true;
      }
    },
    confirm (type) {
        // 提交选项
      let data = {
        marketDataNo: this.row.marketDataNo,
        operateType: type + ''
      };
      this.submitItem(data);
      this.showMenu = false;
    },
    rightCatchEvent (row, event) {
      console.log('row------------------');
      console.log(row);
      event.preventDefault();
      this.menuPosition.x = event.clientX + 'px';
      this.menuPosition.y = event.clientY + 'px';
      this.row = row;
      this.isUserConcern = this.row.isUserConcern;
      this.showMenu = true;
    },
    menuMaskClick(event) {
      event.preventDefault();
      this.showMenu = false;
    },
    reqMarketData (data) {
      this.ajax({
        type: 'POST',
        url: 'malisk/client/market/marketList',
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.quotDataList = res.result;
            this.maxLength = res.result.length;
            this.reqMkNews({mainLevelCode: '', mainProductName: this.quotDataList[0].mainProductName, title: ''});
            if (this.maxLength <= 15) {
              this.showList = res.result;
            } else {
              this.showList = res.result.splice(0, 15);
            }
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    submitItem (data) { // 添加 ，移除自选
      this.ajax({
        type: 'POST',
        url: 'malisk/client/market/userConcern',
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            data.operateType === '1' && this.successTip('添加自选成功');
            data.operateType === '2' && this.successTip('删除自选成功');
            this.requestList();
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    searchSecTagData (data) {
      let searchToTag = {
        mainLevelCode: data.mainLevelCode,
        mainProductName: '',
        title: ''
      };
      this.ajax({
        type: 'POST',
        url: 'malisk/client/market/subStandardList',
        data: searchToTag,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.$store.dispatch('sendToTag', res.result);
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    reqMkNews (data = {mainLevelCode: '', mainProductName: '', title: ''}) {
      this.ajax({
        type: 'POST',
        url: 'malisk/client/market/newsList',
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            // 讲新闻传给store;
            this.mkNews = res.result;
          } else {
            this.errorTip(res.message);
          }
        }
      });
    }    
  },
  computed: {
    ...mapState(['skHomeData'])
  },
  watch: {
    'skHomeData.currentRow': {
      handler: function () {
        // 当在home那边改变currentRow 时调用这里；
        this.$nextTick(() => {
          if (this.skHomeData.currentRow.hasOwnProperty('marketDataNo') && this.quotDataList.length) {
            debugger;
            let row = this.quotDataList.find((ele) => this.skHomeData.currentRow.marketDataNo === ele.marketDataNo);
            this.setCurrent(row);
            this.searchSecTagData(row);
          };
        });
      }
    },
    newMarket: {
      handler: function () {
        this.initData();
      }
    }
  },
  components: {
    Common,
    cccfCell,
    rateCell,
    updownCell,
    priceCell,
    standardCell,
    productCell,
    numCell,
    PcDailog
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.quotPage{
  width: 100%;
  height: 376px;
}
  .leftclick-menu{
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    z-index:50;
  }
  .leftclick-menu-mask{
    position:fixed;
    top:0;
    left:0;
    background: transparent;
    width:100vw;
    height:100vh;
    z-index:51;
  }
  .leftclick-menu-con{
    position:fixed;
    width:160px;
    line-height:40px;
    background:#252a36;
    color:#fff;
    z-index:100;
    border:1px solid #797979;
    border-top:none;
  }
.leftclick-menu-con li{
  text-indent:20px;
  color:#cccccc;
  cursor: pointer;
  height:40px;
  border-top:1px solid #797979;
}
.leftclick-menu-con li:hover{
  background:#171c28;
}
</style>
