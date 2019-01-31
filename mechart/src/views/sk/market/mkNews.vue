<template>
  <common :show-search="true" @search="searchNews" title="新闻NEWS">
    <div class="marketNews">
      <article class="newsContainer">
        <ul v-if="mkNews.length" class="newsContent">
          <li class="newsList" v-for="(item, index) in mkNews" :key="index">
            <span>{{item.publishTime}}</span>
            <span>{{item.mainTypeName}}</span>
            <span class="newCaption" @click.stop="watchNews(item.id)">{{item.title}}</span>
          </li>
        </ul>
        <div v-else class="emptyNewsTips">
          <div>
            <span class="newsIcon icon maliiconfont">&#xe697;</span>
            <h3 class="tipsTitle">无相关新闻</h3>
          </div>
        </div>        
      </article>
    </div>
    <pc-dialog v-if="newsDialog" :title="'新闻详情'" customStyle="width: 800px; height: 680px"  @cancel="newsDialog = false" >
      <detail-news :newsContent="newsContent" />
    </pc-dialog>
  </common>
</template>
<script>
import Common from './common.vue';
import PcDialog from '../../../components/dialog/newsCenterDalog';
import DetailNews from '../home/detailNews';
import {mapState} from 'vuex';
export default {
  props: ['newMarket'],
  data () {
    return {
      newsDialog: false,
      newsContent: '',
      mkNews: []
    };
  },
  beforeMount () {
    this.reqMkNews();
  },
  methods: {
    initData () {
      this.newsContent = '';
      this.newsDialog = false;
      this.mkNews = [];
    },
    watchNews (id) {
      this.reqDetailNews(id);
      this.newsDialog = true;
    },
    reqMkNews (data = {mainLevelCode: '', mainProductName: '', title: ''}) {
      this.ajax({
        type: 'POST',
        url: 'malisk/client/market/newsList',
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.mkNews = res.result;
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    reqDetailNews (id) {
      let _this = this;
      this.ajax({
        type: 'GET',
        url: `malisk/client/market/newsDetail/${id}`,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            _this.newsContent = res.result.content.replace(/\\/g, '').replace(/<img/g, '<img style="max-width:100%;height:auto;"');
          } else {
            _this.errorTip(res.message);
          }
        }
      });
    },
    searchNews (data) {
      this.reqMkNews(data);
    }
  },
  computed: {
    ...mapState(['skHomeData']),
    twoRow () {
      return this.skHomeData.tagItemRow;
    }
  },
  watch: {
    newMarket: {
      handler: function () {
        this.initData();
      }
    }
  },
  components: {
    Common,
    PcDialog,
    DetailNews
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .marketNews{
    width: 760px;
    height: 130px;
    border: 1px solid #303541;
    .newsContainer{
      height: 105px;
      width: 735px;
      margin: 20px 0px 20px 20px;
      overflow: hidden;
      .newsContent{
        height: 120px;
        overflow-y: auto;
        padding-bottom: 10px;
        &::-webkit-scrollbar {
          width: 16px;  /*滚动条宽度*/
          height: 8px;  /*滚动条高度*/
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          border-radius: 0px;  /*滚动条的背景区域的圆角*/
          background-color: #000000;/*滚动条的背景颜色*/
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 0px;  /*滚动条的圆角*/
          box-shadow: inset 0 0 6px rgba(0,0,0,.3);
          background-color: #171c28;  /*滚动条的背景颜色*/
        }
        .newsList{
          margin-bottom: 12px;
          span{
            display: inline-block;
            &:nth-child(1){
              width: 150px;
            }
            &:nth-child(2){
              width: 100px;
            }
          }
          .newCaption{
            cursor: pointer;
          }
        }
      }
     .emptyNewsTips{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        div{
          text-align: center;
          .newsIcon{
            font-size: 40px;
            color: #99a3bb;
          }
          .tipsTitle{
            margin: 15px 0;
          }     
        }
      }
    }
  }
</style>
