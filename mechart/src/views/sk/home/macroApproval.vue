 <template>
  <div class="macroSection">
    <header class="macroHead">
      <span>{{'宏观数据'}}</span>
    </header>
    <div class="dataChart">
      <div @click.stop="gotoMacroMarket" class="contain">
        <div class="chartView" id="macroDataBar"></div>
      </div>
    </div>
  </div>
 </template>
 <script>
 import Echarts from 'echarts';
 //  Echarts没解决显示多个轴，开始描绘点向右偏移，x,y轴颜色；
 export default {
   props: ['refresh'],
   data () {
     return {
       macroData: {}
     };
   },
   beforeMount () {
     this.reqBeefChartData();
   },
   updated () {
     this.renderMacroData();
   },
   methods: {
     initData () {
       // 初始化数据
       this.macroData = {};
       this.reqBeefChartData();
     },
     renderMacroData () {
       let {seriesArray, xaxisArray, title} = this.macroData;
       let options = {
         title: {
           text: title,
           textStyle: {
             color: '#fff',
             fontSize: 16
           }
         },
         tooltip: {
           show: true
         },
         grid: {
           left: 65
         },
         xAxis: {
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
       let macroChart = Echarts.init(document.getElementById('macroDataBar'));
       macroChart.setOption(options);
     },
     gotoMacroMarket () {
       this.$router.replace('/skclient/macroIndex');
     },
     reqBeefChartData () {
       this.ajax({
         type: 'POST',
         url: 'malisk/client/echarts/getMtEcharts',
         success: res => {
           setTimeout(() => {
             this.$pcNProgress.done();
           }, 300);
           if (res.code === 200) {
             this.macroData = res.result;
           } else {
             this.errorTip(res.message);
           }
         }
       });
     }
   },
   watch: {
     macroData: {
       handler: function () {
         this.renderMacroData();
       }
     },
     refresh: {
       handler: function () {
         this.initData();
       }
     }
   }
 };
 </script>
 <style lang="less" rel="stylesheet/less" scoped>
 .macroSection{
    width: 580px;
    height: 437px;
    padding: 0 10px;
    background: #1f2533;
    cursor: pointer;
    .macroHead{
      height: 34px;
      font-size: 14px;
      line-height: 34px;
    }
    .dataChart{
      width: 560px;
      height: 380px;
      border: 1px solid #303541;
      .contain{
        width: 520px;
        height: 318px;
        margin: 40px 20px 20px 20px;
        .chartView{
          width: 100%;
          height: 100%;
        }
      }

    }
  }
 </style>
