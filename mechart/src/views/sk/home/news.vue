<template>
 <div class="newsSection">
   <header class="newsHead">
    <span>{{'新闻NEWS'}}</span>
    <div class="newsSearch">
      <span @click.stop="searchNews" class="searchIcon el-icon-search"></span>
      <span class="searchInput">
        <input class="inputItem" v-model="searchValue" type="text" @keyup.enter="searchNews" placeholder="搜索">
      </span>
    </div>
   </header>
   <article class="newsContainer">
     <ul class="newsContent">
       <li class="newsList" v-for="(item) in newsList" :key="item.id">
         <span>{{item.publishTime}}</span>
         <span>{{item.subTypeName}}</span>
         <span v-if="item.mainType === 1" @click.stop="watchNews(item.id)">{{item.title}}</span>
         <a :href="item.fileUrl" class="downloadLink" target="_brank" v-if="item.mainType === 2" :download="item.title + '.pdf'" >{{item.title}}</a>
       </li>
     </ul>
   </article>
   <pc-dialog v-if="newsDialog" :title="'新闻详情'" customStyle="width: 800px; height: 680px"  @cancel="newsDialog = false" >
     <detail-news :newsContent="newsContent" />
   </pc-dialog>
 </div>
</template>
<script>
import PcDialog from '../../../components/dialog/newsCenterDalog';
import DetailNews from './detailNews.vue';
export default {
  data () {
    return {
      searchValue: '',
      newsDialog: false,
      newsList: [],
      newsContent: ''
    };
  },
  beforeMount () {
    this.reqNewsData({});
  },
  methods: {
    watchNews (id) {
      this.newsId = id;
      this.reqDetailNews(id);
      this.newsDialog = true;
    },
    searchNews () {
      // 新闻支持回车搜索，和点击搜索图标搜索；
      let keyword = {title: this.searchValue};
      this.reqNewsData(keyword);
    },
    reqNewsData (data) {
      //  新闻加载和搜索；
      let _this = this;
      this.ajax({
        type: 'POST',
        url: 'malisk/client/home/homeNewsList',
        data: data,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            _this.newsList = res.result;
          } else {
            _this.errorTip(res.message);
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
    }
  },
  components: {
    PcDialog,
    DetailNews
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .newsSection{
    width: 780px;
    height: 360px;
    padding: 0 10px;
    background: #1f2533;
    .newsHead{
      height: 34px;
      font-size: 14px;
      line-height: 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .newsSearch{
        width: 138px;
        height: 24px;
        line-height: 24px;
        border: 1px solid #99a3bb;
        display: flex;
        align-items: center;
        .searchInput{
          line-height: 24px;
          .inputItem{
            -webkit-appearance: none;
            outline: none;
            border: none;
            box-sizing: content-box;
            height: 24px;
            line-height: 24px;
            background: inherit;
            width: 100px;
            color: #fff !important;
          }
        }
        .searchIcon{
          font-size: 16px;
          color: #99a3bb;
          line-height: 24px;
        }
      }
    }
    .newsContainer{
      width: 740px;
      height: 304px;
      border: 1px solid #303541;
      overflow: hidden;
      .newsContent{
        margin: 20px;
        overflow-y: auto;
        height: 300px;
        padding-bottom: 20px;
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
        }
        .downloadLink{
          color: #fff;
        }
      }

    }
  }
</style>
