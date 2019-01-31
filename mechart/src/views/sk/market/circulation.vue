<template>
  <SwitchHead @changeTag="switchTag" title="流通数据" :subTitle="'历史折率'">
    <div class="circulPage">
      <div class="chartContaine"> 
        <div v-show="paintOne === 'cirData'" class="chartView" id="cirDataChart"></div>
        <div v-show="paintOne === 'pastRate'" class="chartView" id="pastRateDataChart"></div>
      </div>
    </div>
  </SwitchHead>
</template>
<script>
import SwitchHead from './specialHead';
import Echarts from 'echarts';
import {mapState} from 'vuex';
export default {
  data () {
    return {
      paintOne: 'cirData',
      circulData: {},
      pastRateData: {}
    };
  },
  mounted () {
    this.paintOne === 'cirData' ? this.paintCirData() : this.paintPastData();
  },
  updated () {
    this.paintOne === 'cirData' ? this.paintCirData() : this.paintPastData();
  },
  methods: {
    switchTag (tag) {
      this.paintOne = tag;
    },
    paintCirData () {
      // 流通系数
      let {title, xaxisArray, seriesArray} = this.circulData;
      let cirDataOptions = {
        title: {
          text: title,
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        xAxis: [
          {
            type: 'category',
            data: xaxisArray,
            axisLabel: {
              rotate: 90,
              color: function () {
                return '#fff';
              },
              fontSize: 14
            },
            axisTick: {
              show: false
            }
          }
        ],
        tooltip: {
          show: true
        },
        yAxis: [
          {
            type: 'value',
            min: 2,
            max: 4.00,
            interval: 0.5,
            splitLine: {
              lineStyle: {
                color: '#303541'
              }
            },
            axisLabel: {
              color: function () {
                return '#fff';
              },
              fontSize: 14
            },
            axisTick: {
              show: false
            }
          }
        ],
        dataZoom: {
          type: 'inside',
          textStyle: {
            color: '#ffffff'
          }
        },
        series: [
          {
            data: seriesArray,
            type: 'line',
            smooth: true
          }
        ]
      };
      let cirChartView = Echarts.init(document.getElementById('cirDataChart'));
      cirChartView.setOption(cirDataOptions);
    },
    paintPastData () {
       // 历史折率
      let {title, xaxisArray, seriesArray} = this.pastRateData;
      let pastRateOptions = {
        title: {
          text: title,
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        xAxis: {
          type: 'category',
          data: xaxisArray,
          axisLabel: {
            rotate: 90,
            color: function () {
              return '#fff';
            },
            fontSize: 14
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          max: 1,
          min: 0.5,
          splitLine: {
            lineStyle: {
              color: '#303541'
            }
          },
          axisLabel: {
            color: function () {
              return '#fff';
            },
            fontSize: 14,
            formatter: function (value, index) {
              return value * 100 + '%';
            }
          },
          axisTick: {
            show: false
          }
        },
        tooltip: {
          show: true
        },
        dataZoom: {
          type: 'inside',
          textStyle: {
            color: '#ffffff'
          }
        },
        series: [{
          data: seriesArray,
          type: 'line',
          smooth: true
        }]
      };
      let pastChartView = Echarts.init(document.getElementById('pastRateDataChart'));
      pastChartView.setOption(pastRateOptions);
    },
    getCirculationChart (data, levelCode) {
       // 获取流通系数的Echart数据；
      this.ajax({
        type: 'POST',
        url: `malisk/client/echarts/getMtEcharts/${levelCode}`,
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.circulData = res.result;
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    getPastChart (data, levelCode) {
      //  历史折率的Echart数据；
      this.ajax({
        type: 'POST',
        url: `malisk/client/echarts/getHistoryDiscountEcharts/${levelCode}`,
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.pastRateData = res.result;
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    getOneChart () {
      let str = this.paintOne;
      let currentTime = {
        endDate: '',
        startDate: ''
      };
      if (this.row) {
        str === 'pastRate' && this.getPastChart(currentTime, this.row.subLevelCode);
        str === 'cirData' && this.getCirculationChart(currentTime, this.row.subLevelCode);
      }
    }
  },
  watch: {
    paintOne: {
      handler: function () {
        this.getOneChart();
      }
    },
    row: {
      handler: function () {
        this.$nextTick(() => {
          this.getOneChart();
        });
      }
    },
    circulData: {
      deep: true,
      handler: function () {
        this.paintCirData();
      }
    },
    pastRateData: {
      deep: true,
      handler: function () {
        this.paintPastData();
      }
    }
  },
  computed: {
    ...mapState(['skHomeData']),
    row () {
      return this.skHomeData.tagItemRow;
    }
  },
  components: {
    SwitchHead
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .circulPage{
    height: 251px;
    width: 100%;
    border: 1px solid #303541;
    overflow: hidden;
    .chartContaine{
      margin: 10px 20px;
      width: 720px;
      height: 230px;
      .chartView{
        width: 720px;
        height: 230px;
      }
    }
  }
</style>