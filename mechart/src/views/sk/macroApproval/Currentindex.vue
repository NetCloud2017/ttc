<template>
    <div>
       <div class="echart-title">
              <span>{{currentindexTitle}}</span>
              <span @click="explainOpen"><img class="echart-img" src= '../../../assets/images/sk/img_comm_question.png'/></span>
        </div>
        <div id="Line1" style="width: 560px;height: 383px;"></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      currentindexList: [],
      currentindexTitle: '',
      CurrentindexSeries: [],
      CurrentindexXaxis: []
    }/* eslint-disable semi */
  },
  props: {
  },
  created() {
    this.getCurrentindexData();
  },
  mounted() {
  },
  methods: {
    getLine1 () {
      this.$chart.line1('Line1', this.CurrentindexSeries, this.CurrentindexXaxis); // 折线图
    },
    explainOpen() {
      this.$emit('messageexplainOpen', true);
    },
    getCurrentindexData() {
      this.ajax({
        url: '/malisk/client/echarts/getCurrentIndexEcharts',
        type: 'POST',
        success: (res) => {
          if (res.code === 200) {
            this.currentindexList = res.result;
            this.currentindexTitle = this.currentindexList.title;
            this.CurrentindexSeries = this.currentindexList.seriesArray;
            this.CurrentindexXaxis = this.currentindexList.xaxisArray;
            console.log(this.currentindexList);
            this.getLine1();
          }
        }
      });
    }
  }
}
</script>
