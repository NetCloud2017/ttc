<template>
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageNum"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      queryData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizes: [10, 15, 20, 25]
      };
    },
    created() {
      this.queryListWithPageFn();
    },
    methods: {
      handleSizeChange (pageSize) {
        this.pageSize = pageSize;
        this.queryListWithPageFn(false);
      },
      handleCurrentChange (pageNum) {
        if (this.pageNum !== 0) {
          this.pageNum = pageNum;
        }
        this.queryListWithPageFn(false);
      },
      queryListWithPageFn (isRefresh) {
        if (isRefresh) {
          this.pageNum = 1;
        }
        let param = {};
        param.pageNum = this.pageNum;
        param.pageSize = this.pageSize;
        Object.assign(param, this.queryData);
        this.ajax({
          url: this.url,
          data: param,
          loading: true,
          success: (res) => {
            setTimeout(() => {
              this.$pcNProgress.done();
            }, 300);
            this.pageNum = res.result.pageNum;
            this.total = parseInt(res.result.total);
            // this.pageSize = res.result.pageSize;
            this.$emit('on-query', res);
          }
        });
      }
    }
  };
</script>
