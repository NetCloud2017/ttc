<template>
    <div>
      <div class="echart-title">
              <span>{{incrementMAVGTitle}}</span>
              <span @click="explainOpen"><img class="echart-img" src= '../../../assets/images/sk/img_comm_question.png'/></span>
      </div>
      <div id="graphiczhu" style="width: 560px;height: 383px;"></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      incrementMAVGList: [],
      incrementMAVGTitle: '',
      incrementMAVGSeries: [],
      incrementMAVGXaxis: []
    }/* eslint-disable semi */
  },
  props: {
  },
  created() {
    this.getIncrementMAVGData();
  },
  mounted() {
  },
  methods: {
    getGraphiczhu () {
      this.$chart.graphiczhu('graphiczhu', this.incrementMAVGSeries, this.incrementMAVGXaxis); // 柱状图
    },
    explainOpen() {
      this.$emit('messageexplainOpen', true);
    },
    getIncrementMAVGData() {
      this.ajax({
        url: '/malisk/client/echarts/getMavgEcharts',
        type: 'POST',
        success: (res) => {
          if (res.code === 200) {
            this.incrementMAVGList = res.result;
            this.incrementMAVGTitle = this.incrementMAVGList.title;
            this.incrementMAVGSeries = this.incrementMAVGList.seriesArray;
            this.incrementMAVGXaxis = this.incrementMAVGList.xaxisArray;
            this.getGraphiczhu();
          }
        }
      });
    }
  }
}
</script>
