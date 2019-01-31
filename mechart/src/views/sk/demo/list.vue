<template>
  <div class="table-box">
    <el-table
      :data="tableList"
      height="400"
      v-loadmore="loadMore"
      style="width: 100%;" >
      <el-table-column
        prop="createdTime"
        label="日期"
        :default-sort = "{prop: 'createdTime', order: 'descending'}"
        sortable
        width="280">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="姓名"
        :filters="creatorFilterArr"
        :filter-method="filterHandlerCreator"
        width="280">
      </el-table-column>
      <el-table-column
        prop="points"
        label="points"
        :default-sort = "{prop: 'points', order: 'descending'}"
        sortable
        width="280">
      </el-table-column>
      <el-table-column
        prop="author"
        label="地址">
      </el-table-column >
      <div slot="append" v-if="noMore" class="no-more">没有更多数据了</div>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list: [],
        creatorFilterArr: [
          {text: '风险系统管理员', value: '风险系统管理员'},
          {text: '超级管理员', value: '超级管理员'}
        ],
        pageIndex: 0,
        noMore: false,
        tableList: [],
        listTotal: 0
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      filterHandlerCreator (value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      getData() {
        console.log('getData');
        let param = {};
        param.pageNum = 1;
        param.pageSize = 60;
        var that = this;
        that.ajax({
          url: '/uac/user/queryListWithPage',
          data: param,
          loading: true,
          success: (res) => {
            if (res.code === 200) {
              if (res.result.list.length) {
                that.list = res.result.list;
                that.listTotal = res.result.total;
                var len = that.list.length;
                if (len <= 10) {
                  that.tableList = that.list;
                } else {
                  that.tableList = that.list.splice(0, 10);
                }
              }
            }
          }
        });
      },
      loadMore() {
        var start = this.tableList.length + 10;
        console.log('loadmore');
        if (start < this.listTotal) {
          this.pageIndex++;
          var sliceIndex = this.pageIndex;
          var aList = this.list.slice(0, sliceIndex * 10);
          this.tableList = aList;
        } else {
          this.noMore = true;
        }
      }
    }
  };
</script>
<style>
.no-more{
  background: #000;
  line-height:40px;
  text-align:center;
  color:#fff;
}
  .table-box{
    width:100%;
    overflow-x:hidden;
  }
.table-box .el-table{
  width:105%;
}
</style>
