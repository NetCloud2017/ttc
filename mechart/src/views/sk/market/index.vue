<template>
 <div class="mkQuotation">
   <div class="leftPart">
     <quotation :newMarket="newMarket" />
     <mk-news :newMarket="newMarket" />
     <circulation />
   </div>
   <div class="rightPart">
     <second-tag :newMarket="newMarket" />
     <gone-price />
   </div>
 </div>
</template>
<script>
import Quotation from './quotation.vue';
import SecondTag from './secondTag.vue';
import gonePrice from './gonePrice.vue';
import Circulation from './circulation.vue';
import MkNews from './mkNews.vue';
export default {
  data () {
    return {
      newMarket: false
    };
  },
  created () {
    let _this = this;
    this.$pcBus.$on('reFresh', function(page) {
      // 这里执行了四次，要防抖
      if (page.path === 'marketIndex') {
        _this.newMarket = !_this.newMarket;
      }
    });
  },
  components: {
    MkNews,
    Circulation,
    gonePrice,
    SecondTag,
    Quotation
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .mkQuotation{
    display: flex;
    background: #0d121c;
    padding-bottom: 30px;
    .leftPart{
      width: 780px;
      margin-right: 10px;
    }
    .rightPart{
      width: 1090px;
    }
  }
</style>
