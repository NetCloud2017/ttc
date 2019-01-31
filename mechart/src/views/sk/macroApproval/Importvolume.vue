<template>
    <div>
       <div class="echart-title">
              <span>{{importVolumeTitle}}</span>
              <span @click="explainOpen"><img class="echart-img" src= '../../../assets/images/sk/img_comm_question.png'/></span>
        </div>
        <div id="graphic" style="width: 560px;height: 383px;"></div>
    </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      importVolumeList: [],
      importVolumeTitle: '',
      importVolumeSeries: [],
      importVolumeXaxis: []
    }/* eslint-disable semi */
  },
  created() {
  },
  mounted() {
    this.getImportvolumeData();
  },
  updated() {
    this.getGraphic();
  },
  methods: {
    getGraphic () {
      this.$chart.graphic('graphic', this.importVolumeSeries, this.importVolumeXaxis); // 柱状图
    },
    explainOpen() {
      this.$emit('messageexplainOpen', true);
    },
    getImportvolumeData() {
      this.ajax({
        url: '/malisk/client/echarts/getMtEcharts',
        type: 'POST',
        success: (res) => {
          if (res.code === 200) {
            this.importVolumeList = res.result;
            this.importVolumeSeries = this.importVolumeList.seriesArray;
            this.importVolumeXaxis = this.importVolumeList.xaxisArray;
            this.importVolumeTitle = this.importVolumeList.title;
          }
        }
      });
    }
  }
}
</script>
