<template>
  <div class='page-project'>
    <div class='egrid-class'>
      <div class='project-title-bar' style='height: 34px; line-height: 34px;'>
        <span>冷库主体</span>
        <div class='project-title-bar' style='height: 560px'>
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
        height='325'
        v-loadmore='loadMore'
        highlight-current-row
        :slot-append='true'
        :default-sort="{prop: 'points', order: 'descending'}"
        :data='Data'
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
      noMore: false,
      Data: [],
      // 项目库数据
      currentRow: {}, // 当前定位行的数据
      columns: [
        {
          label: '主体代码',
          prop: 'storageNo',
          customStyle: 'color:#1383f2'
        },
        {
          label: '主体',
          prop: 'storageName'
        },
        {
          label: '技术手段',
          prop: 'techTypeDisplay'
        },
        {
          label: '违约记录',
          prop: 'totalViolateTime',
          customStyle: 'color: replace-riskRateColor'
        },
        {
          label: '冷库规模（吨）',
          prop: 'totalVolume'
        },
        {
          label: '历史交易量MT',
          prop: 'totalTradeVolume'
        },
        {
          label: 'MIG信用评级',
          prop: 'migGrade',
          customStyle: 'color:#e63453'
        }
      ],
      columnsSchema: {
        主体代码: {
          minWidth: 100,
          align: 'center',
          sortable: true,
          component: EgridCellView
        },
        主体: { minWidth: 140, align: 'center', sortable: true },
        违约记录: {
          minWidth: 120,
          align: 'center',
          sortable: true,
          component: EgridCellView
        },
        历史交易量MT: { minWidth: 120, align: 'center', sortable: true },
        '冷库规模（吨）': {
          minWidth: 120,
          align: 'center',
          sortable: true,
          component: EgridCellView
        },
        技术手段: {
          minWidth: 100,
          align: 'center',
          component: EgridCellView,
          sortable: false, // 是否排序
          filters: [
            // 1.人工单据 2.电子单据
            { text: '人工单据', value: 1 },
            { text: '电子单据', value: 2 }
          ],
          filterMethod: this.filterData
        },
        MIG信用评级: {
          minWidth: 100,
          align: 'center',
          component: EgridCellView,
          sortable: false, // 是否排序
          filters: [
            // 1.人工单据 2.电子单据
            { text: 'AAA', value: 'AAA' },
            { text: 'AA', value: 'AA' },
            { text: 'A', value: 'A' },
            { text: 'BBB', value: 'BBB' },
            { text: 'BB', value: 'BB' },
            { text: 'B', value: 'B' }
          ],
          filterMethod: this.filterDataMig
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
    // let arr=[];
    this.ajax({
      type: 'POST',
      url: `/malisk/client/storage/gradeStorageList`,
      data: {},
      loading: true,
      success: res => {
        setTimeout(() => {
          this.$pcNProgress.done();
        }, 300);
        if (res.code === 200) {
          res.result.forEach((item, index) => {
            if (item.totalViolateTime !== 0) {
              item.riskRateColor = '#e63453';
            }
          });
          this.Data = res.result;
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
      return row.techType === value;
    },
    /**
     * 技术手段筛选
     */
    timeout() {
      // console.log(this.arr);
      this.ajax({
        type: 'POST',
        url: `/malisk/client/storage/gradeStorageList`,
        data: { techType: this.arr },
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
            // this.projectData = res.result;
            // console.log(res.result);
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    filterDataMig(value, row, column) {
      clearTimeout(this.time);
      this.time = 'null';
      // console.log('filterData---value: ' + value + ' row: ' + JSON.stringify(row));
      // const property = column['property'];
      // console.log('filterData---value: ' + value + 'filterData---row[property]: ' + row[property] + ' property: ' + property);
      this.arr.push(value);
      this.arr = Array.from(new Set(this.arr));
      this.time = setTimeout(() => {
        this.timeoutt();
      }, 1000);
      return row.migGrade === value;
    },
    /**
     * MIG信用评级筛选
     */
    timeoutt() {
      // console.log(this.arr);
      this.ajax({
        type: 'POST',
        url: `/malisk/client/storage/gradeStorageList`,
        data: { migGrade: this.arr },
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
            // this.projectData = res.result;
            // console.log(res.result);
          } else {
            this.errorTip(res.message);
          }
        }
      });
    },
    /**
     * 加载更多数据
     */
    loadMore() {
      var start = this.projectData.length + 10;
      // console.log('loadmore');
      if (start < this.listTotal) {
        this.pageIndex++;
        var sliceIndex = this.pageIndex;
        var aList = this.projectData.slice(0, sliceIndex * 10);
        this.projectData = this.projectData.concat(aList);
      } else {
        this.noMore = true;
      }
    },
    reFresh(page) {
      // console.log(page);
    },
    /**
     * 搜索返回数据
     */
    searchData(data) {
      // console.log(data);
      this.ajax({
        type: 'POST',
        url: `/malisk/client/storage/gradeStorageList`,
        data: { storageName: data },
        loading: true,
        success: res => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 300);
          if (res.code === 200) {
            res.result.forEach((item, index) => {
              if (item.totalViolateTime !== 0) {
                item.riskRateColor = '#e63453';
              }
            });
            this.Data = res.result;
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
      // console.log('setCurrent: ' + row);
      this.rowData = row;
      this.$refs.projectTable.setCurrentRow(row);
    },
    /**
     * 选中行的回调函数
     */
    handleCurrentChange(val) {
      this.currentRow = val;
      this.$emit('on-clock', this.currentRow.id);
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
