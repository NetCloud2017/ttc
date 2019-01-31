<template>
    <div>
      <div class="echart-title">
        <span>{{indexMIGCCTitle}}</span>
        <span @click="explainOpen"><img class="echart-img" src= '../../../assets/images/sk/img_comm_question.png'/></span>
      </div>
      <div id="line2" style="width: 560px;height: 383px;"></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      indexMIGCCList: [],
      indexMIGCCTitle: '',
      indexMIGCCSeries: [],
      indexMIGCCXaxis: []
    }/* eslint-disable semi */
  },
  props: {
  },
  created() {
    this.getindexMIGCCData();
  },
  mounted() {
  },
  methods: {
    getLin2 () {
      this.$chart.line2('line2', this.indexMIGCCSeries, this.indexMIGCCXaxis); // 折线图
    },
    explainOpen() {
      this.$emit('messageexplainOpen', true);
    },
    getindexMIGCCData() {
      this.ajax({
        url: '/malisk/client/echarts/getMigccEcharts',
        type: 'POST',
        success: (res) => {
          if (res.code === 200) {
            this.indexMIGCCList = res.result;
            this.indexMIGCCTitle = this.indexMIGCCList.title;
            this.indexMIGCCSeries = this.indexMIGCCList.seriesArray;
            this.indexMIGCCXaxis = this.indexMIGCCList.xaxisArray;
            this.getLin2();
          }
        }
      });
    }
  }
}
</script>
