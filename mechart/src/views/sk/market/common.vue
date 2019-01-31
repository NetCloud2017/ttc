<template>
<div>
  <div class="commont">
   <header class="comHead">
      <div class="qoutTitleBox">
        <span class="mainTitle">{{title}}</span>
        <span v-if="subTitle" class="subTitle">{{subTitle}}</span>
      </div>
      <div v-if="showSearch" class="newsSearch">
        <search ref="search" placeholder="搜索" @resultMethod="searchData" searchKey="title"
                remoteUrl="/wechat/bbs/topicList"></search>
      </div>
   </header>
   <div>
     <slot>empty</slot>
   </div>
 </div>
</div>
</template>
<script>
import search from '@/components/search/search.vue';
export default {
  props: {
    title: {
      type: String
    },
    showSearch: {
      type: Boolean
    },
    subTitle: {
      type: String
    }
  },
  data () {
    return {
      searchValue: ''
    };
  },
  components: {
    search
  },
  methods: {
    /**
     * 搜索返回数据
     */
    searchData(data) {
      this.searchValue = data;
      let query = {
        mainLevelCode: '',
        mainProductName: this.searchValue,
        title: this.searchValue
      };
      // 市场行情的新闻搜搜；
      this.$emit('search', query);
    }
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.commont{
  padding: 0 10px 20px;
  margin-bottom: 10px;
  background: #1f2533;
  .comHead{
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
      display: flex;
      align-items: center;
      margin-right: -20px;
    }
    .qoutTitleBox{
      .mainTitle{
        color: #fff;
      }
      .subTitle{
        color: #99a3bb;
        margin-left: 100px;
      }
    }
  }
}
</style>
