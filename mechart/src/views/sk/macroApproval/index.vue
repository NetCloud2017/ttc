<template>
  <div class="macroApproval-wrap">
    <div class="macroApproval-left">
      <div class="macroApproval-left-top">
        <div class="MacroData-hearde">
          <div class="MacroData-header-left">宏观数据</div>
          <div class="MacroData-header-rigth">关键指标</div>
        </div>
        <div class="MacroData" id="MacroData">
          <keep-alive>
            <component :is="currentView" @messageexplainOpen='getisshow'></component>
          </keep-alive>
        </div>
        <div class="KeyIndicators">
          <div class="KeyIndicators-table">
              <div class="KeyIndicators-item" v-for="(item,index) in indexType" :key='index' v-on:click='uptadeEcharts(index)' :class='{active:index==echartsKpiIndex}'>
                <div>
                  <span>{{item.kpiName}}</span>
                  <span v-if='index === 0' class="kpiValuegreen">{{item.kpiValue}}</span>
                    <span v-else-if='index === 1' >
                      <span v-if="item.kpiValue > 0" class="kpiValuered">{{item.kpiValue}}</span>
                        <span v-if="item.kpiValue === 0" class="kpiValuewhite">{{item.kpiValue}}</span>
                          <span v-if="item.kpiValue < 0" class="kpiValuegreen">{{item.kpiValue}}</span>
                    </span>
                    <span v-else-if='index === 2' class="kpiValuegreen">{{item.kpiValue}}</span>
                    <span v-else-if='index === 3' class="kpiValuered">{{item.kpiValue}}</span>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="macroApproval">
        <div class="macroApproval-hearde">
            <div class="macroApproval-header-left">MIG专业研究报告</div>
            <div class="macroApproval-header-rigth">
             <search style="margin-right: 0;" ref="search" placeholder="搜索" @resultMethod="searchData" searchKey="title"
                  remoteUrl=""></search>
            </div>
        </div>
        <div class="ResearchReport">
           <ul class="newsContent" v-if='ResearchReportIsshow'>
            <li class="newsList" v-for="(item, index) in MacroApprovalData" :key="index">
              <span :key="index" @click="getpdf(item.fileUrl, item.title)">
                <span>{{item.publishTime}}</span>
                <span>{{item.subTypeName}}</span>
                <span>{{item.title}}</span>
              </span>
            </li>
          </ul>
          <div v-else class="newsContentNone">暂无相关报告</div>
        </div>
      </div>
    </div>

    <div class="macroApproval-rigth">
      <div class="ExchangeRateFluctuation">
        <div class="ExchangeRateFluctuation-hearde">
              <div class="ExchangeRateFluctuation-header-left">汇率波动</div>
              <div class="ExchangeRateFluctuation-header-rigth">
                <span @click="futures">期货价格计算器</span>
                <span @click="interest">利息计算器</span>
                  <span @click="TariffscheduleOpen">各国关税表</span>
                  <span @click="NationalAccessOpen">牛肉国家准入表</span>
              </div>
          </div>
        <div class="ExchangeRateFluctuation-echarts" >
            <select class="Moneytype" v-model="moneyType">
              <option value="USD/CNY">美元/人民币</option>
              <option value="USD/ARS">阿根廷比索/美元</option>
              <option value="USD/BRL">巴西雷加尔/美元</option>
            </select>
            <div id="ExchangeRateFluctuation-echarts-X"></div>
        </div>
      </div>
      <div class="macroApproval-rigth-bottom">
        <div class="macroApproval-hearde-bottom">
            <div class="macroApproval-header-left-bottom">进口额份额(MT)</div>
            <div class="macroApproval-header-rigth-bottom">中国进口牛肉原产地市场份额</div>
        </div>
        <div class="ImportShare" id="ImportShare"></div>
        <div class="ChinaShare">
          <ul class="ChinaShareContent">
            <li class="ChinaShareList" v-for="(item, index) in PicoriginList" :key="index">
              <span>{{item.countryCode}}</span>
              <span>{{item.sharePercentage}}</span>
              <span>{{item.importAmount}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Futures :title='"期货计算器"' :isShow="futuresIsshow" @on-close="futuresIsshow = false" />
    <Interest :title='"利息计算器"' :isShow="interestIsshow" @on-close="interestIsshow = false" />
    <Tariffschedule :title='"各国关税表"' :isShow="tariffscheduleIsshow" @on-close="tariffscheduleIsshow = false" />
    <NationalAccess :title='"牛肉国家准入表"' :isShow="nationalAccessIsshow" @on-close="nationalAccessIsshow = false"/>
    <explain :title='"说明"' :isShow="explainIsshow" @on-close="explainIsshow = false" :echartsData="echartsMemo[echartsKpiIndex]"/>
  </div>
</template>
<script>
import Importvolume from './Importvolume.vue';
import Currentindex from './Currentindex.vue';
import Futures from './futures.vue';
import Interest from './interest.vue';
import IncrementMAVG from './IncrementMAVG.vue';
import indexMIGCC from './indexMIGCC.vue';
import Tariffschedule from './Tariffschedule.vue';
import NationalAccess from './NationalAccess.vue';
import explain from './explain.vue';
import search from 'components/search/search.vue';
require('../../../../static/tv/tv.js');
export default {
  data() {
    return {
      moneyType: 'USD/CNY', // 初始汇率表的值
      futuresIsshow: false, // 显示期货计算器
      interestIsshow: false, // 显示利息计算器
      tariffscheduleIsshow: false, // 显示各国关税表
      nationalAccessIsshow: false, // 显示牛肉国家表
      explainIsshow: false, // 显示echarts图表说明
      indexType: [],
      echartsKpiIndex: 0, // echarts组件的下标
      echartsArr: ['Importvolume', 'Currentindex', 'IncrementMAVG', 'indexMIGCC'],
      echartsMemo: [],
      PicData: [],
      PiclegendData: [],
      PicseriesData: [],
      PicoriginList: [], // 饼图数据
      MacroApprovalData: [], // 研究报告数据
      MacroApprovalTitle: null, // 研究报告标题
      ResearchReportIsshow: true // 是否显示研究报告
    }/* eslint-disable semi */
  },
  components: {
    Importvolume,
    Currentindex,
    IncrementMAVG,
    indexMIGCC,
    Futures,
    Interest,
    Tariffschedule,
    NationalAccess,
    explain,
    search
  },
  created() {
    this.getIndexDef();
    this.getPicData();
    this.getMacroApprovalData();
  },
  mounted() {
    /* eslint-disable no-new */
    /* eslint-disable no-undef */
    /* eslint-disable new-cap */
    new TradingView.widget({
      'width': 1048,
      'height': 450,
      'symbol': this.moneyType,
      'interval': 'D',
      'timezone': 'Etc/UTC',
      'theme': 'Dark',
      'style': '1',
      'locale': 'zh_CN',
      'toolbar_bg': '#f1f3f6',
      'enable_publishing': false,
      'allow_symbol_change': true,
      'container_id': 'ExchangeRateFluctuation-echarts-X'
    });
    this.uptadeEcharts(0);
  },
  computed: {
    currentView () {
      return this.echartsArr[this.echartsKpiIndex];
    }
  },
  methods: {
    // 获取指数说明
    getIndexDef () {
      this.ajax({
        url: '/malisk/client/echarts/getEchartsKpi',
        type: 'GET',
        success: (res) => {
          if (res.code === 200) {
            this.indexType = res.result;
            // 获取所以表格的说明
            this.indexType.forEach(item => {
              if (item.memo != null) {
                this.echartsMemo.push(item.memo);
              }
            });
          }
        }
      });
    },
    // 获取pic数据
    getPicData() {
      this.ajax({
        url: '/malisk/client/echarts/getMtPieEcharts',
        type: 'POST',
        success: (res) => {
          if (res.code === 200) {
            this.PicData = res.result;
            this.PiclegendData = this.PicData.legendData;
            this.PicseriesData = this.PicData.seriesData;
            this.PicoriginList = this.PicData.originList;
            this.getPic();
          }
        }
      });
    },
    // 获取研究报告
    getMacroApprovalData() {
      this.ajax({
        url: '/malisk/client/macro/MIGReport',
        type: 'POST',
        data: {title: this.MacroApprovalTitle},
        success: (res) => {
          if (res.code === 200) {
            this.MacroApprovalData = res.result.sort(function(a, b) {
              return a.publishTime > b.publishTime ? 1 : -1;
            })
          }
        }
      });
    },
    // 获取饼图
    getPic () {
      this.$chart.pic('ImportShare', this.PiclegendData, this.PicseriesData); // 饼图
    },
    uptadeEcharts (index) {
      this.echartsKpiIndex = index;
    },
    // 期货计算器的显示
    futures() {
      this.futuresIsshow = true;
    },
    // 利息计算器的显示
    interest() {
      this.interestIsshow = true;
    },
    // 关税表
    TariffscheduleOpen() {
      this.tariffscheduleIsshow = true;
    },
    // 牛肉国家准入
    NationalAccessOpen() {
      this.nationalAccessIsshow = true;
    },
    // 说明
    explainOpen() {
      this.explainIsshow = true;
    },
    // echarts表说明弹窗
    getisshow(val) {
      this.explainIsshow = val;
    },
    // 搜索返回数据
    searchData(data) {
      this.ajax({
        url: '/malisk/client/macro/MIGReport',
        type: 'POST',
        data: {title: data},
        success: (res) => {
          if (res.code === 200) {
            this.MacroApprovalData = res.result.sort(function(a, b) {
              return a.publishTime > b.publishTime ? 1 : -1;
            })
            if (this.MacroApprovalData.length === 0) {
              this.ResearchReportIsshow = false;
            } else {
              this.ResearchReportIsshow = true;
            }
          }
        }
      });
    },
    getpdf(pdfurl, title) {
      this.downpdf(pdfurl, title);
    }
  },
  watch: {
    moneyType(newval, oldval) {
      new TradingView.widget({
        'width': 1048,
        'height': 450,
        'symbol': this.moneyType,
        'interval': 'D',
        'timezone': 'Etc/UTC',
        'theme': 'Dark',
        'style': '1',
        'locale': 'zh_CN',
        'toolbar_bg': '#f1f3f6',
        'enable_publishing': false,
        'allow_symbol_change': true,
        'container_id': 'ExchangeRateFluctuation-echarts-X'
      })
    }
  }
}
</script>

<style>
.newsContentNone{
  width: 100%;
  font-size: 19px;
  margin: 130px 0px 0px 320px;
}
.kpiValuewhite{
  color:white !important;
}
.kpiValuered{
  color: red !important;
}
.kpiValuegreen{
  color: green !important;
}
.echart-img{
  width: 15px;
  height: 15px;
  cursor:pointer;
}
.echart-title{
  position: absolute;
  top: 40px;
  left: 30px;
  display: inline-block;
  z-index: 999;
  font-size: 16px;
}
.ChinaShareContent{
  margin: 20px 0px 42px 60px;
}
.ChinaShareList{
  margin-bottom: 10px;
  text-align: left;
}
.ChinaShareList span{
  font-size: 18px;
  display: inline-block;
  width: 120px;
  text-align: left;
}
.newsList{
  margin-bottom: 13px;
}
.newsList span{
  display: inline-block;
  margin-right: 24px;
  color: #fff;
}
.newsList span:nth-child(2){
  display: inline-block;
  margin-right: 24px;
  width: 80px;
  text-align: center;
  color: #fff;
}
.newsContent{
  margin: 20px;
}
.inputItemx{
  -webkit-appearance: none;
  outline: none;
  box-sizing: content-box;
  height: 24px;
  line-height: 24px;
  background: inherit;
  width: 100px;
  color: #fff !important;
  border: 1px solid #99a3bb;
}
.active{
  background: #252a36;
}
.macroApproval-wrap{
  display: flex;
  margin-bottom: 40px;
}
.macroApproval-left{
    width: 800px;
    height:100%;
  }
  .MacroData-hearde{
    width: 100%;
    display: flex;
  }
  .MacroData-header-left{
    width: 560px;
    height: 34px;
    line-height: 34px;
    margin:  0px 5px 0px 10px;
  }
.MacroData-header-rigth{
    width: 210px;
    height: 34px;
    line-height: 34px;
    margin:  0px 5px 0px 10px;
  }
  .macroApproval-left-top{
    width: 100%;
    height: 437px;
    background-color: #171c28;
  }
 .MacroData{
   position: relative;
   float: left;
   width: 560px;
   height: 383px;
   border: 1px solid #303541;
   margin:  0px 5px 20px 10px;
 }
 .KeyIndicators{
   float: left;
   width: 210px;
   height: 383px;
   border: 1px solid #303541;
   margin:  0px 10px 20px 5px;
 }
 .KeyIndicators .KeyIndicators-item{
   position: relative;
   width: 100%;
   height: 40px;
   line-height: 40px;
   cursor:pointer;
 }
 .KeyIndicators .KeyIndicators-item span{
    display: inline-block;
 }
 .KeyIndicators .KeyIndicators-item span:first-child{
   margin-left: 10px;
   color: #1383f2;
   font-size: 14px;
 }
 .KeyIndicators .KeyIndicators-item span:last-child{
   position: absolute;
   right: 10px;
 }
 .KeyIndicators .KeyIndicators-item:hover{
   background: #252a36;
 }
 .macroApproval{
   overflow: hidden;
   margin-top: 10px;
   width: 800px;
   height: 427px;
   background-color: #171c28;
 }
  .macroApproval-hearde{
    width: 100%;
    display: flex;
    justify-content:space-between;
  }
  .macroApproval-header-left{
    height: 34px;
    line-height: 34px;
    margin:  0px 5px 0px 10px;
  }
.macroApproval-header-rigth{
  padding-top: 4px;
    height: 30px;
    margin:  0px 10px 0px 10px;
  }
 .macroApproval .ResearchReport{
   width: 780px;
   height: 380px;
   border: 1px solid #303541;
   margin: 0px 0 0 10px;
   overflow: hidden;
   overflow-y:visible;

 }
 .macroApproval-rigth{
   width: 1070px;
   height: 100%;
   margin-left: 10px;

 }
  .ExchangeRateFluctuation-hearde{
    width: 100%;
    display: flex;
    justify-content:space-between;
  }
  .ExchangeRateFluctuation-header-left{
    width: 40%;
    height: 34px;
    line-height: 34px;
    margin:  0px 5px 0px 10px;
  }
.ExchangeRateFluctuation-header-rigth{
    width: 52%;
    height: 34px;
    line-height: 34px;
    margin:  0px 10px 0px 10px;
  }
.ExchangeRateFluctuation-header-rigth span:first-child{
      width: 120px;
      margin-left: 73px;
  }
  .ExchangeRateFluctuation-header-rigth span:last-child{
      width: 120px;
  }
.ExchangeRateFluctuation-header-rigth span{
  line-height: 22px;
  margin-top: 5px;
  width: 100px;
  height: 24px;
  border: solid 1px #990808;
  text-align: center;
  font-size: 14px;
  font-weight:bold;
  color: #990808;
  margin-left: 10px;
  display: inline-block;
  cursor:pointer;
  border-radius: 2px;
}
#ExchangeRateFluctuation-echarts-X{
  position: relative;
  top:24px;
}
 .macroApproval-rigth .ExchangeRateFluctuation{
   width: 1070px;
   height: 554px;
   overflow: hidden;
   background-color: #171c28;
 }
 .macroApproval-rigth .ExchangeRateFluctuation .ExchangeRateFluctuation-echarts{
   margin: 0px 0 0 10px;
   width: 1050px;
   height: 510px;
   border: 1px solid #303541;
 }
 .macroApproval-rigth .macroApproval-rigth-bottom{
   width: 1070px;
   height: 310px;
   background-color: #171c28;
   margin-top: 10px;
 }
  .macroApproval-hearde-bottom{
    width: 100%;
    display: flex;
  }
  .macroApproval-header-left-bottom{
    width: 50%;
    height: 34px;
    line-height: 34px;
    margin:  0px 5px 0px 10px;
  }
.macroApproval-header-rigth-bottom{
    width: 50%;
    height: 34px;
    line-height: 34px;
    margin:  0px 5px 0px 10px;
  }
  .macroApproval-rigth .macroApproval-rigth-bottom .ImportShare{
    float: left;
    margin: 0px 0 0 10px;
    width: 520px;
    height: 263px;
    border: 1px solid #303541;
  }
   .macroApproval-rigth .macroApproval-rigth-bottom .ChinaShare{
    float: left;
    margin: 0px 0 0 10px;
    width: 520px;
    height: 263px;
    border: 1px solid #303541;
   }
  .Moneytype{
    position: relative;
    top: 10px;
    left: 840px;
    border:1px solid #303541;
    outline:none;
    color: #ffffff;
    font-size: 16px;
    width: 200px;
    height: 34px;
    background-color: #171c28;
   }
</style>







