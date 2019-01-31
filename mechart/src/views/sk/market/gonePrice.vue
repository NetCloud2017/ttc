<template>
  <common :show-search="false" title="历史价值">
    <div class="historyPrice">
      <div class="pastChart">
        <div class="pastPriceCanvas" id="pastPriceChart"></div>
      </div>
    </div>
  </common>

</template>
<script>
import Common from './common';
import Echarts from 'echarts';
import {mapState} from 'vuex';
export default {
  data () {
    return {
      priceData: {}
    };
  },
  mounted () {
    this.renderHistoryData();
  },
  updated () {
    this.renderHistoryData();
  },
  methods: {
    renderHistoryData (da) {
      let {seriesArray, title, xaxisArray} = this.priceData;
      let priceOptions = {
        title: {
          text: title,
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        type: 'bar',
        barWidth: 2,
        tooltip: {},
        legend: {
          show: false,
          data: ['价格线', '价格柱']
        },
        xAxis: [
          {
            type: 'category',
            data: xaxisArray,
            axisLabel: {
              rotate: 45,
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
        yAxis: [
          {
            type: 'value',
            min: 30,
            max: 50,
            interval: 2,
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
          },
          {
            min: 30,
            max: 50,
            name: 'rmb',
            show: false,
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
            type: 'line',
            name: '价格线',
            yAxisIndex: 1,
            data: seriesArray
          },
          {
            type: 'bar',
            name: '价格柱',
            data: seriesArray,
            itemStyle: {
              normal: {
                color: function () {
                  return '#e63453';
                }
              }
            }
          }
        ]
      };
      let macroChart = Echarts.init(document.getElementById('pastPriceChart'));
      macroChart.setOption(priceOptions);
    },
    getPriceChart () {
      let data = {
        endDate: '',
        startDate: ''
      };
      if (this.twoRow && this.twoRow.subLevelCode) {
        let levelCode = this.twoRow.subLevelCode;
        this.ajax({
          type: 'POST',
          url: `malisk/client/echarts/getHistoryPriceEcharts/${levelCode}`,
          data: data,
          success: res => {
            setTimeout(() => {
              this.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              this.priceData = res.result;
            } else {
              this.errorTip(res.message);
            }
          }
        });
      }
    }
  },
  computed: {
    ...mapState(['skHomeData']),
    twoRow () {
      return this.skHomeData.tagItemRow;
    }
  },
  watch: {
    twoRow: {
      handler () {
        this.$nextTick(() => {
          this.getPriceChart();
        });
      }
    },
    priceData: {
      handler: function () {
        this.renderHistoryData();
      }
    }
  },
  components: {
    Common
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .historyPrice{
    width: 1070px;
    height: 446px;
    border: 1px solid #303541;
    .pastChart{
      width: 1030px;
      height: 406px;
      margin: 20px;
      .pastPriceCanvas{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
