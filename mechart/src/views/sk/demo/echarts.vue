<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div id="chart1" style="width:100%;height: 45vh;"></div>
      </el-col>
      <el-col :span="12">
        <div id="picEchart" style="width:100%; height: 45vh;"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="graphicEchart" style="width:100%;height: 45vh;"></div>
      </el-col>
      <el-col :span="12">
        <div id="picEchart1" style="width:100%; height: 45vh;"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {};
    },
    mounted() {
      // 配置网址：https://echarts.baidu.com/echarts2/doc/option.html#line-itemstyle1~xAxis-i(value).splitNumber
      // 示例网址：https://echarts.baidu.com/echarts2/doc/example.html
      var title = '流通指数';
      var pLinexAxisData = ['Jan-21', 'Feb-21', 'Mar-20', 'Mar-21', 'Apr-18',
        'May-2',
        'Jun-30', 'Jul-15', 'Aug-16', 'Sep-19', 'Oct-23', 'Nov-17',
        'Nov-18', 'Nov-19',
        'Dec-26'];
      var pLineSeriesData = [11, 23, 85, 45, 69, 74, 23, 58, 45, 96, 200, 78, 88,
        105, 301];
      this.$chart.line1('chart1', title, pLinexAxisData, pLineSeriesData); // 折线图
      this.$chart.pic('picEchart'); // 饼图
      this.$chart.graphic('graphicEchart'); // 柱状图
    }
  };
</script>
