<template>
  <div class="search-box">
<!--
    <image class="input-view-search" src="../../static/ibs/img_comm_search.png" mode=""></image>
-->
    <i class="icon maliiconfont maliicon-img_comm_seek search-box-icon" ></i>
    <input @input="debouncedSearch" class="input" type="text" v-model="searchValue"
           :placeholder="placeholder" confirm-type="search"/>
<!--
    <image class="search-clear" v-if="isShowClear" src="../../static/ibs/img_comm_empty.png" @tap="clear"></image>
-->
    <i class="icon maliiconfont maliicon-img_detailse_not search-box-icon" v-if="isShowClear" @click="clear"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  import debounce from 'throttle-debounce/debounce';
  // import { enums } from '../../utils/';
  export default {
    props: {
      placeholder: {
        type: String,
        default: '输入关键字'
      },
      resultMethod: Function, // 搜索到数据的回调函数
      // 延时搜索时间
      debounceTime: {
        type: Number,
        default: 500
      },
      searchKey: String, // 搜索关键字传递给后端的字段名
      remoteUrl: String, // 服务端接口地址
      requestMethod: { // 请求接口的方式，默认‘GET’
        type: String,
        default: 'POST'
      }
    },
    data() {
      return {
        searchValue: null,
        isShowClear: false
      };
    },
    created () {
      let that = this;
      // 延时搜索
      this.debouncedSearch = debounce(this.debounceTime, () => {
        if (that.searchValue) {
          that.isShowClear = true;
        }
        that.searchData();
      });
    },
    computed: {},
    methods: {
      /**
       * 根据关键字搜索数据
       */
      searchData() {
        var params = {};
        params[this.searchKey] = this.searchValue;
        console.log(JSON.stringify(params));
        let that = this;
        // 修改搜索方法
        that.$emit('resultMethod', this.searchValue);
      },
      // 清除按钮
      clear() {
        let that = this;
        that.searchValue = null;
        that.isShowClear = false;
        that.debouncedSearch();
      }
    }
  };
</script>
<style>

  .input-view-search {

  }

  .search-box {
    /* 宽高 */
    width: 140px;
    height: 26px;
    line-height: 26px;
    background-color: #181d29;
    padding: 0 10px;
    margin-right: 20px;
    /* Flex容器布局 */
    display: flex;
    /* 边框线 */
    border: #99a3bb 1px solid;
    border-radius: 2px;
    /* 交叉轴上的对齐方式 */
    align-items: center;
  }

  .search-box .input {
    /* 宽高 */
    height: 24px;
    line-height: 24px;
    margin: 0 5px;
    width: 100%;
    flex: 1;
    /* 字体大小 */
    font-size: 14px;
    color: #99a3bb;
    background-color: #181d29;
    border: 0;
    outline: none;
  }
  .search-box .search-box-icon {
    color: #99a3bb;
  }

  .search-clear {
    width: 16px;
    height: 16px;
    padding-right: 10px;

  }
</style>
