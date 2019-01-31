<template>
  <div class='page-project'>
    <div class='egrid-class'>
      <div class='project-title-bar' style='height: 34px; line-height: 34px;'>
        <span>货权主体</span>
        <div class='project-title-bar' style='height: 600px'>
          <search
            placeholder='搜索'
            @resultMethod='searchData'
            searchKey='title'
            remoteUrl='/wechat/bbs/topicList'
          ></search>
        </div>
      </div>
      <egrid
        border
        ref='projectTable'
        column-type='index'
        class='page-list sk-table-black'
        height='425'
        v-loadmore='loadMore'
        highlight-current-row
        :slot-append='true'
        :default-sort="{prop: 'points', order: 'descending'}"
        :data='projectData'
        :columns='columns'
        :columns-schema='columnsSchema'
        :columns-props='columnsProps'
        :columns-handler='columnsHandler'
        :row-class-name='tableRowClassName'
        @current-change='handleCurrentChange'
      >
        <div slot='append' v-if='noMore' class='no-more'>没有更多数据了</div>
      </egrid>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import search from 'components/search/search.vue';
import EgridCellView from 'components/wms/comm/EgridCellView';

// 操作按钮

export default {
  components: {
    search
  },
  data() {
    return {
      projectData: [],
      noMore: false,
      // 项目库数据
      currentRow: {}, // 当前定位行的数据
      columns: [
        {
          label: '主体代码',
          prop: 'ownerNo',
          customStyle: 'color:#1383f2'
        },
        {
          label: '主体',
          prop: 'ownerName'
        },
        {
          label: '类别',
          prop: 'ownerTypeDisplay'
        },
        {
          label: '注册资本',
          prop: 'registCapital'
        },
        {
          label: '年营业额',
          prop: 'annualTurnover'
        },
        {
          label: '法人',
          prop: 'legalPerson'
        },
        {
          label: '历史交易次数',
          prop: 'totalTradeTime'
        },
        {
          label: '履约率',
          prop: 'performRate',
          customStyle: 'color: replace-riskRateColor'
        },
        {
          label: '历史交易金额',
          prop: 'totalTradeAmount'
        },
        {
          label: 'MIG信用评级',
          prop: 'migGrade',
          customStyle: 'color:#e63453'
        }
      ],
      columnsSchema: {
        主体代码: { minWidth: 100, align: 'center', sortable: false, component: EgridCellView },
        主体: { minWidth: 140, align: 'center', sortable: true, component: EgridCellView },
        注册资本: { minWidth: 120, align: 'center', sortable: true, component: EgridCellView },
        年营业额: { minWidth: 120, align: 'center', sortable: true, component: EgridCellView },
        法人: { minWidth: 120, align: 'center', sortable: true, component: EgridCellView },
        历史交易次数: { minWidth: 140, align: 'center', sortable: true, component: EgridCellView },
        履约率: { minWidth: 120, align: 'center', sortable: true, component: EgridCellView },
        历史交易金额: { minWidth: 140, align: 'center', sortable: true, component: EgridCellView },
        MIG信用评级: {
          minWidth: 130,
          sortable: true,
          component: EgridCellView
        },
        类别: {
          minWidth: 100,
          sortable: false, // 是否排序
          component: EgridCellView,
          filters: [
            // 1.贸易企业 2.经销企业 3.终端企业；仅评级查询用
            { text: '贸易企业', value: 1 },
            { text: '经销企业', value: 2 },
            { text: '终端企业', value: 3 }
          ],
          filterMethod: this.filterData
        }
      },
      // columnsProps 用于定义所有 columns 公共的属性，
      // 这里属性可以参考这里： http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
      columnsProps: {
        height: 40,
        minWidth: 120,
        align: 'center',
        sortable: true, // 是否排序
        showOverflowTooltip: true
      },
      qwe: false,
      isShow: true,
      time: '',
      arr: []
    };
  },
  created() {
    var that = this;
    that.$pcBus.$on('reFresh', function(page) {
      if (page.path === 'projectIndex') {
        that.reFresh(page);
      }
    });
    this.ajax({
      type: 'POST',
      url: `/malisk/client/owner/gradeOwnerList`,
      data: {},
      loading: true,
      success: res => {
        setTimeout(() => {
          this.$pcNProgress.done();
        }, 300);
        if (res.code === 200) {
          // this.$refs.pcPagination.queryListWithPageFn(false);
          res.result.forEach((item, index) => {
            if (item.performRate !== 1) {
              item.riskRateColor = '#e5962e';
            }
          });
          this.projectData = res.result;
        } else {
          this.errorTip(res.message);
        }
      }
    });
  },
  mounted() {
    // 默认选中第一条
    this.setCurrent(this.projectData[0]);
  },
  methods: {
    /**
     * 筛选交易类型/状态类型
     * @param value 筛选的值
     * @param row 行数据
     * @param column 列数据
     * @returns {boolean}
     */
    filterData(value, row, column) {
      clearTimeout(this.time);
      this.time = 'null';
      this.arr.push(value);
      this.arr = Array.from(new Set(this.arr));
      this.time = setTimeout(() => {
        this.timeout();
      }, 1000);
      return row.ownerType === value;
    },
    /**
     * 类别删选
     */
    timeout() {
      this.ajax({
        type: 'POST',
        url: `/malisk/client/owner/gradeOwnerList`,
        data: { ownerType: this.arr },
        loading: true,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            this.arr = [];
            res.result.forEach((item, index) => {
              if (item.performRate !== 1) {
                item.riskRateColor = '#e5962e';
              }
            });
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    loadMore() {
      var start = this.projectData.length + 10;
      if (start < this.listTotal) {
        this.pageIndex++;
        var sliceIndex = this.pageIndex;
        var aList = this.projectData.slice(0, sliceIndex * 10);
        this.projectData = this.projectData.concat(aList);
      } else {
        this.noMore = true;
      }
    },
    reFresh(page) {},
    /**
     * 搜索返回数据
     */
    searchData(data) {
      this.ajax({
        type: 'POST',
        url: `/malisk/client/owner/gradeOwnerList`,
        data: { ownerName: data },
        loading: true,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            // this.$refs.pcPagination.queryListWithPageFn(false);
            res.result.forEach((item, index) => {
              if (item.performRate !== 1) {
                item.riskRateColor = '#e5962e';
              }
            });
            this.projectData = res.result;
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    columnsHandler() {},
    /**
     * 设置指定行数据是否选中
     * @param row 行数据
     */
    setCurrent(row) {
      this.rowData = row;
      this.$refs.projectTable.setCurrentRow(row);
    },
    /**
     * 选中行的回调函数
     */
    handleCurrentChange(val) {
      this.currentRow = val;
      if (this.qwe) {
        this.$emit('on-clock', this.currentRow.id);
      }
      this.qwe = true;
    },
    /**
     * 定位行的样式
     * @param row
     * @param rowIndex
     * @returns {*}
     */
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    addProject() {
      this.showImportDialog = true;
    },
    /**
     * 确认导入项目
     **/
    confirmImport() {
      this.showImportDialog = false;
    },
    // 取消并关闭dialog
    closeDialog() {
      this.showImportDialog = false;
    }
  }
};
</script>
<style>
.page-project {
  overflow-y: hidden;
}
.page-project .project-title-bar {
  height: 34px;
  line-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-project .no-more {
  background: #000;
  line-height: 40px;
  text-align: center;
  color: #fff;
}

.page-project .egrid-class {
  background-color: #181d29;
  padding: 0 10px 10px;
}

.page-project .margin-5 {
  margin-right: 5px;
}

.table-box {
  width: 100%;
  overflow-x: hidden;
}

.table-box .el-table {
  width: 105%;
}
</style>
