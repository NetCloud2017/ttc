/**
 * Created by zengdd on 2019/1/21.
 */
/**
 * 各种画echarts图表的方法都封装在这里
 */
import echarts from 'echarts';
const install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 画一条简单的线折线图
          line1: function (id, seriesArray, xaxisArray) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            const optionData = {
              title: {
                text: null,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 16
                },
                x: '20px',
                y: '40px'
              },
              dataZoom: {
                show: true,
                realtime: true,
                type: 'inside',
                y: 355,
                height: 15,
                start: 0,
                end: 100,
                textStyle: {
                  color: '#ffffff'
                }
              },
              grid: {
                x: 70,
                y: 110,
                x2: 70,
                y2: 60
              },
              tooltip: {
                trigger: 'axis'
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: xaxisArray,
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: '#ffffff'
                    },
                    rotate: 90
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                      color: '#ffffff'
                    }
                  }
                }
              ],
              series: [
                {
                  // 显示数值
                  itemStyle: {normal: {label: {show: false}, lineStyle: {color: '#ffff00'}}},
                  type: 'line',
                  data: seriesArray
                }
              ]
            };
            this.chart.setOption(optionData);
          },
          // 饼图
          pic: function (id, legendArray, seriesArray) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            const optionData = {
              // 标题
              title: {
                text: null,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 16
                },
                x: '125px',
                y: '20px'
              },
              tooltip: {   // 弹窗，响应鼠标指向，显示具体细节
                trigger: 'item', // 以具体项目触发弹窗
                /*
                 内容格式器，一共有abcd四个代号，例如在饼图中，{a}指系列，即流量来源，{b}指数据项目，如搜索引擎，{c}指数值，如
                 value，{d}百分比。{x}本身代表了相应字符，可以和其他字符拼凑，在弹窗中显示
                 */
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              // 图例，选择要显示的项目
              legend: {
                orient: 'vertical',
                left: '75%',
                top: 40,
                textStyle: {
                  color: '#c8c8d0'
                },
                data: legendArray  // 注意要和数据的name相对应
              },
              series: [
                {
                  name: '进口份额',
                  type: 'pie',
                  radius: '60%',
                  center: ['33%', '52%'],
                  // avoidLabelOverlap: false,
                  data: seriesArray,
                  itemStyle: {
                    normal: {
                      label: {
                        show: true
                        // formatter: '{b} : {c} ({d}%)'
                      },
                      labelLine: {show: true}
                    }
                  }
                }
              ]
            };
            this.chart.setOption(optionData);
          },
          // 上月进口量柱状图
          graphic: function (id, seriesArray, xaxisArray) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            const graphicOptionData = {
              title: {
                text: null,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 16
                },
                x: '20px',
                y: '40px'
              },
              tooltip: {
                show: true
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: xaxisArray,
                  axisLabel: {
                    textStyle: {
                      color: '#ffffff'
                    },
                    rotate: 90
                  },
                  axisTick: {
                    show: false
                  }
                }
              ],
              grid: {
                x: 70,
                y: 110,
                x2: 70,
                y2: 60,
                borderWidth: 1
              },
              dataZoom: {
                show: true,
                realtime: true,
                type: 'inside',
                y: 355,
                height: 15,
                start: 1,
                end: 100,
                textStyle: {
                  color: '#ffffff'
                }
              },
              yAxis: {
                interval: 20000,
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
              series: {
                type: 'bar',
                data: seriesArray,
                // barGap: '20%',
                barCategoryGap: '10%',
                barWidth: 5,
                itemStyle: {
                  normal: {
                    color: function () {
                      return '#e63453';
                    }
                  }
                }
              }
            };
            this.chart.setOption(graphicOptionData);
          },
          // 年化月均增数柱状图
          graphiczhu (id, seriesArray, xaxisArray) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            const graphiczhuOptionData = {
              title: {
                text: null,
                textStyle: {
                  color: '#ffffff',
                  fontStyle: 'normal',
                  fontSize: 16
                },
                x: '20px',
                y: '40px'
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  data: xaxisArray,
                  boundaryGap: true,
                  axisLabel: {
                    textStyle: {
                      color: '#ffffff'
                    }
                  },
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              grid: {
                x: 70,
                y: 110,
                x2: 70,
                y2: 60,
                borderWidth: 1
              },
              dataZoom: {
                show: true,
                realtime: true,
                type: 'inside',
                y: 355,
                height: 15,
                start: 0,
                end: 10,
                textStyle: {
                  color: '#ffffff'
                }
              },
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: '#ffffff'
                    }
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  type: 'bar',
                  barGap: 2,
                  barWidth: 15,
                  data: seriesArray,
                  itemStyle: {
                    normal: {
                      label: {
                        show: true,
                        position: 120,
                        formatter: '{c}%',
                        rotate: 90
                      },
                      color: function(params) {
                        if (params.dataIndex === xaxisArray.length - 1) {
                          return 'green';
                        } else {
                          return '#e63453';
                        }
                      }
                    }
                  }
                }
              ]
            };
            this.chart.setOption(graphiczhuOptionData);
          },
          // 流通数据指数
          line2 (id, seriesArray, xaxisArray) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.clear();
            const line2OptionData = {
              title: {
                text: null,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 16
                },
                x: '20px',
                y: '40px'
              },
              grid: {
                x: 70,
                y: 110,
                x2: 70,
                y2: 60,
                borderWidth: 1
              },
              tooltip: {
                // trigger: 'axis'
              },
              dataZoom: {
                show: true,
                realtime: true,
                type: 'inside',
                y: 355,
                height: 15,
                start: 0,
                end: 50,
                textStyle: {
                  color: '#ffffff'
                }
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: xaxisArray,
                  axisLabel: {
                    show: true,
                    textStyle: {
                      color: '#ffffff'
                    },
                    rotate: 70
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  interval: 3,
                  scale: true,
                  // precision: 1,
                  // splitNumber: 20,
                  // boundaryGap: [0.01],
                  // splitArea: { show: true },
                  axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                      color: '#ffffff'
                    }
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  // 显示数值
                  itemStyle: {normal: {label: {show: true}}},
                  type: 'line',
                  data: seriesArray
                }
              ]
            };
            this.chart.setOption(line2OptionData);
          }
        };
      }
    }
  });
};

export default {
  install
};
