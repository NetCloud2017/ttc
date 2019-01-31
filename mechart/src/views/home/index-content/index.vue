<template>
<div>
  <div class="pc-page-content">
    <div class="index-con">
      <div class="index-chart">
        <div class="con-title">
          <div class="title">库存/质押货物趋势图</div>
          <div></div>
          <div class="operate" @mouseover="echart.isShow=true" @mouseout="echart.isShow=false">
              <span class="calendar-year">周期：<span>{{echart.curTxt}}</span><i class="fa fa-angle-down"></i>
                  <ul class="dropmenu" v-show="echart.isShow">
                      <li v-for="(option,index) in echart.selectType"  :class="{'active':index == echart.cur }" @click="Select(1,index)">{{option.label}}</li>
                  </ul>
              </span>
          </div>
        </div>
        <div class="con-des">
          <span><i class="c-blue"></i>库存重量</span>
          <span><i class="c-sky"></i>质押重量</span>
          <span><i class="c-red"></i>质押物估值</span>
        </div>
        <div class="con-box">
          <div id="trendDiv" class="trend-echart"></div>
        </div>
      </div>
      <div class="index-calendar">
        <div class="con-title">
          <div class="title">出入库日历</div>
          <div class="operate" @mouseover="calendar.isShow=true" @mouseout="calendar.isShow=false">
            <span class="calendar-year">{{calendar.curYear}}</span>年：<span class="con-text calendar-month">{{calendar.curMonth}}</span>月<i class="fa fa-angle-down"></i>
            <ul class="dropmenu" v-show="calendar.isShow">
              <li v-for="(option,index) in calendar.selectType" :class="{'active':index == calendar.cur }" @click="Select(2,index)">{{option.label}}</li>
            </ul>
          </div>
        </div>
        <div class="con-des">
          <span><i class="c-green"></i>入库预约</span>
          <span><i class="c-red"></i>出库预约</span>
        </div>
        <div class="data-calenda con-des">
          <table>
            <thead>
              <tr>
                <th v-for="(item, index) in calendar.week">{{item}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="week in theweek()">
                <td v-for="item in week" :class="{'gray': item.prevmonth || item.nextmonth}">
                  <div>
                    <span class="date" :class="{'today': item.today }">{{item.day}}</span>
                    <!-- <ul class="date-dropmenu">
                      <li><i class="dot-red"></i><p title=''></p></li>
                      <li><i class="dot-green"></i><p title=''></p></li>
                    </ul> -->
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="pc-copyrights">
    <p>© 2018 - 2019 Powered by malicloud 赣ICP备17003208号</p>
  </div>
</div>

</template>
<script type="text/ecmascript-6">
  import echarts from 'echarts';
  let trendOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        crossStyle: {
          color: '#999'
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#7b7b7b', // 左边线的颜色
            width: '1' // 坐标线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#666666' // 坐标值得具体的颜色
          }
        }
      }
    ],
    yAxis: [
      {
        color: '#333',
        type: 'value',
        name: 'KG',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ',
          textStyle: {
            color: '#666666' // 坐标值得具体的颜色
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#7b7b7b', //  左边线的颜色
            width: '1' // 坐标线的宽度
          }
        }
      },
      {
        type: 'value',
        name: '元',
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: '{value} ',
          textStyle: {
            color: '#666666' // 坐标值得具体的颜色
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#7b7b7b', // 左边线的颜色
            width: '1' // 坐标线的宽度
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#f2f4f5',
            type: 'solid',
            width: '1' // 坐标线的宽度
          }
        } // 去除网格线
      }
    ],
    series: [
      {
        name: '库存重量',
        type: 'bar',
        data: []
        // data:data.seriers1
      },
      {
        name: '质押重量',
        type: 'bar',
        data: []
        // data:data.seriers2
      },
      {
        name: '质押物估值',
        type: 'line',
        yAxisIndex: 1,
        data: []
        // data:data.seriers3
      }
    ],
    color: ['#179aff', '#cadcff', '#ff6e88']
  };
  export default {
    data () {
      return {
        echart: {
          selectType: [
            {label: '日'},
            {label: '月'},
            {label: '年'}
          ],
          cur: 0,
          curTxt: '日',
          isShow: false,
          url: ''
        },
        calendar: {
          selectType: [
            {label: '上个月'},
            {label: '本月'},
            {label: '下个月'}
          ],
          cur: 1,
          isShow: false,
          curMonth: '',
          curYear: '',
          week: ['日', '一', '二', '三', '四', '五', '六'],
          dayarr: []
        }
      };
    },
    created () {
      let date = new Date();
      this.calendar.curYear = date.getFullYear();
      this.calendar.curMonth = date.getMonth() + 1;
      this.getOriginCalendar();
    },
    mounted () {
//      this.drawLine();
      this.$router.push({path: '/skclient/home'});
    },
    methods: {
      Select(type, index) {
        if (type === 1) {
          this.echart.cur = index;
          this.echart.isShow = false;
          this.echart.curTxt = this.echart.selectType[index].label;
        }
        if (type === 2) {
          this.calendar.cur = index;
          this.calendar.isShow = false;
          let date = new Date();
          this.calendar.curYear = date.getFullYear();
          this.calendar.curMonth = date.getMonth() + 1;
          if (index === 0) {
            let date2 = new Date(this.calendar.curYear, this.calendar.curMonth - 2);
            this.calendar.curYear = date2.getFullYear();
            this.calendar.curMonth = date2.getMonth() + 1;
          }
          if (index === 2) {
            let date2 = new Date(this.calendar.curYear, this.calendar.curMonth);
            this.calendar.curYear = date2.getFullYear();
            this.calendar.curMonth = date2.getMonth() + 1;
          }
          this.getOriginCalendar();
        }
      },
      drawLine() {
        let trendDiv = document.getElementById('trendDiv');
        let myChart = echarts.init(trendDiv);
        myChart.setOption(trendOptions);
        let param = {};
        param.type = this.echart.cur;
//        this.ajax({
//          url: this.echart.url,
//          data: param,
//          loading: true,
//          success: (res) => {
//            setTimeout(() => {
//              this.$pcNProgress.done();
//            }, 300);
//            if (res.code !== 0) {
//              myChart.hideLoading();
//              return;
//            }
//            var res = res.data;
//            $('.index-chart .con-title .title').html(res.title)
//            trendOptions.xAxis[0].data = res.xAxis;
//            trendOptions.yAxis[0].max = res.leftYAxis;
//            trendOptions.yAxis[0].interval = res.leftInterval;
//            trendOptions.yAxis[0].name = res.leftYName;
//            trendOptions.yAxis[1].max = res.rightYAxis;
//            trendOptions.yAxis[1].interval = res.rightInterval;
//            trendOptions.yAxis[1].name = res.rightYName;
//            trendOptions.series[0] = res.seriers1;
//            trendOptions.series[1] = res.seriers2;
//            trendOptions.series[2] = res.seriers3;
//            trendOptions.series[2].yAxisIndex = 1;
//            myChart.hideLoading();
//            myChart.setOption(trendOptions);
//          }
//        });
      },
      getOriginCalendar() {
        let year = this.calendar.curYear;
        let month = this.calendar.curMonth;
        let themonth1stday = (new Date(year, month - 1, 1)).getDay(); // 该月第一天是星期几
        // 本月有多少天，这个月的最后一天就是下个月的最后一天减去一毫秒
        let y = month === 12 ? year + 1 : year;
        let m = month === 12 ? 1 : month;
        let themonthdaysamount = new Date(new Date(y, m, 1) - 1).getDate();
        // 上个月有多少天
        let prevmonthlastday = new Date(new Date(year, month - 1, 1) - 1).getDate();
        this.calendar.dayarr = [];
        while (themonth1stday-- > 0) {
          this.calendar.dayarr.unshift({
            'day': prevmonthlastday--,
            'prevmonth': true,
            'dateObj': year + '-' + (month - 1)
          });
        }
        // 本月的日期
        let count = 0;
        while (themonthdaysamount--) {
          let date = new Date();
          let today = date.getDate();
          let todayMonth = date.getMonth() + 1;
          let isToday = false;
          if (today === (count + 1) && todayMonth === this.calendar.curMonth) {
            isToday = true;
          } else {
            isToday = false;
          }
          this.calendar.dayarr.push({
            'day': ++count,
            'today': isToday,
            'dateObj': year + '-' + month
          });
        };
        let c = 42 - this.calendar.dayarr.length;
        let count2 = 1;
        while (c-- > 0) {
          this.calendar.dayarr.push({
            'day': count2++,
            'nextmonth': true,
            'dateObj': year + '-' + (month + 1)
          });
        }
        this.theweek();
      },
      theweek() {
        let _arr = [];
        for (let i = 0; i < 6; i++) {
          let _week = [];
          for (let j = 0; j < 7; j++) {
            _week.push(this.calendar.dayarr[i * 7 + j]);
          }
          _arr.push(_week);
        }
        return _arr;
      }
    },
    components: {}
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped="">
  $borderColor:#e2e2e2;
  .pc-copyrights {
    position:absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #1F2D3D;
  }
  .pc-copyrights p {
    font-size: 14px;
    line-height: 36px;
    text-align: center;
  }
  .index-con{
    margin-top:20px;
  }
  .index-con .index-chart{
    float: left;
    background-color: #fff;
    width: 700px;
    height: 420px;
    padding-top: 6px;
    -moz-box-shadow:2px 2px 2px $borderColor; -webkit-box-shadow:2px 2px 2px $borderColor; box-shadow:2px 2px 2px $borderColor;
    border:1px solid $borderColor;
  }
  .index-con .index-calendar{
    float:left;
    background-color:#fff;
    height:420px;
    width:480px;
    margin-left:20px;
    padding-top:6px;
    -moz-box-shadow:2px 2px 2px $borderColor; -webkit-box-shadow:2px 2px 2px $borderColor; box-shadow:2px 2px 2px $borderColor;
    border:1px solid $borderColor;
  }
  .index-con .con-title{
    display: flex;
    justify-content: space-between;
    align-items:center;
    height:40px;
    padding-top:11px;
    padding-bottom:8px;
    padding-left:30px;
    padding-right:30px;
  }
  .index-con .con-title.flex-start{
    justify-content:flex-start;
  }
  .index-con .con-des{
    padding-left:30px;
    padding-right:30px;
    padding-top: 6px;
  }
  .index-con .con-title .title{
    color:#333333;
    font-size:18px!important;
    margin-top:10px;
  }
  .index-con .con-title .operate{
    font-size:16px!important;
    position: relative;
    padding-top:8px;
    display: inline-block;
    line-height: 24px;
  }
  .index-con .con-title .operate .maliicon-push-up{
    position: relative;
    top: 1px;
    margin-left: 2px;
    cursor: pointer;
  }
  .index-con .con-title .operate .dropmenu{
    position: absolute;
    top:30px;
    right:0;
    width:90px;
    border-radius:4px;
    -webkit-box-shadow: 0 5px 8px 0 rgba(0,0,0,.15);
    -moz-box-shadow: 0 5px 8px 0 0 rgba(0,0,0,.15);
    box-shadow: 0 5px 8px 0 0 rgba(0,0,0,.15);
    background-color:#fff;
    text-align: center;
    display: none;
    z-index:999;

  }
  .index-con .con-title .operate .dropmenu li{
    line-height:32px;
    cursor: pointer;
    color:#666666;
    font-size:16px!important;;
  }
  .index-con .con-title .operate .dropmenu li.active{
    color:#333333;
    background-color:#f5f6f7;
  }
  .index-con .con-title .operate .calendar-year{
    font-size: 16px !important;
    line-height: 20px;
  }
  .index-con .con-title .operate .calendar-year>span{
    font-size:16px!important;
  }
  .con-des>span{
    color:#666666;
    font-size:14px!important;
    margin-right:12px;
  }
  .con-des span i{
    display: inline-block;
    width:8px;
    height:8px;
    border-radius:50%;
    margin-right:6px;
  }
  .con-des span i.c-blue{
    background-color:#179aff
  }
  .con-des span i.c-sky{
    background-color:#cadcff
  }
  .con-des span i.c-red{
    background-color:#ff6e88
  }
  .con-des span i.c-green{
    background-color:#01dcab
  }
  .con-des span i.c-green-s{
    background-color:#0dd1e3;
  }
  .index-con .con-title .operate:hover .dropmenu{
    display: block;
  }
  .fa-angle-down{
    font-size:18px!important;
  }
  .operate .con-text.calendar-month{
    font-size:16px!important;
  }
  .trend-echart {
    width: 100%;
    height: 370px;
    top: 0;
  }
  table tr th{
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    width: 60px;
  }
  table tr td{
    white-space: nowrap;
    height: 40px;
    width: 60px;
    text-align: center;
  }
  table tr td>div span.date {
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    line-height: 32px;
    cursor: pointer;
  }

  table tr td>div span.today,table tr td>div:hover span.date {
    border-radius: 50%;
    background-color: #179aff;
    color: #fff;
  }
  table tr td.gray span.date,table tr td.gray:hover span.date{
    color:#b2b2b2;
    background-color: #fff;
    cursor: default;
  }
  table tr td>div{
    position: relative;
  }
  table tr td>div ul.date-dropmenu{
    position: absolute;
    top: 32px;
    left: 16px;
    -moz-box-shadow:2px 2px 2px $borderColor; -webkit-box-shadow:2px 2px 2px $borderColor; box-shadow:2px 2px 2px $borderColor;
    border:1px solid $borderColor;
    width:160px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding:10px 20px;
    display: none;
    background-color: #fff;
    z-index:10;
    text-align:left;
  }
  table tr td>div:hover ul.date-dropmenu{
    display: block;
  }
  table tr td>div:hover ul.date-dropmenu li .dot-red{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background-color: #ff6e88;
  }
  table tr td>div:hover ul.date-dropmenu li .dot-green{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background-color: #01dcab;
  }
  table tr td>div:hover ul.date-dropmenu li{
    position: relative;
  }
  table tr td>div:hover ul.date-dropmenu li p{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left:16px;
    line-height:20px;
    width:100%;
    overflow:hidden;
    text-overflow: ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    white-space:normal;
  }
  table tr td>div:hover ul.date-dropmenu li i{
    position: absolute;
    top:5px;
    left:0;
  }
  table tr td.gray>div:hover ul.date-dropmenu{
    display: none;
  }
  body{
    background:red;
  }
</style>
