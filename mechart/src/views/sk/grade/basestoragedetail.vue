
<template>
  <div>
    <div class='content-body'>
      <div class='content-body-one'>
        <div class='content-one-title'>
          <!-- <span>
            平台交易次数：
            <span class='content-one-text'>{{Data.result.totalTradeTime}}</span>
          </span>-->
          <span>
            违规次数：
            <span style='color:#e63453; font-size: 14px;'>{{Data.result.violateTime}}</span>
          </span>
        </div>
        <div class='content-one-main'>
          <div class='content-one-mi'>
            <div class='content-one-chi'>
              <span class='textt'>主体代码</span>
            </div>
            <div class='content-one-chi'>
              <span class='textt'>主体名称</span>
            </div>
            <div class='content-one-chi'>
              <span class='textt'>技术手段</span>
            </div>
            <div class='content-one-chi'>
              <span class='textt'>冷库规模（吨）</span>
            </div>
            <div class='content-one-chi'>
              <span class='textt'>履约率</span>
            </div>
            <div class='content-one-chi'>
              <span class='textt'>主体在平台历史交易量MIT</span>
            </div>
          </div>
          <div class='content-one-mz'>
            <div class='content-one-chil'>
              <span class='textright' v-if='Data.result.storageNo'>{{Data.result.storageNo}}</span>
              <span class='textright' v-else>-</span>
            </div>
            <div class='content-one-chil'>
              <span class='textright' v-if='Data.result.storageName'>{{Data.result.storageName}}</span>
              <span class='textright' v-else>-</span>
            </div>
            <div class='content-one-chil'>
              <span class='textright' v-if='Data.result.techTypeName'>{{Data.result.techTypeName}}</span>
              <span class='textright' v-else>-</span>
            </div>
            <div class='content-one-chil'>
              <span class='textright' v-if='Data.result.totalVolume'>{{Data.result.totalVolume}}</span>
              <span class='textright' v-else>-</span>
            </div>
            <div class='content-one-chil'>
              <span class='textright' v-if='Data.result.performanceRateString'>{{Data.result.performanceRateString}}</span>
              <span class='textright' v-else>-</span>
            </div>
            <div class='content-one-chil'>
              <span class='textright' v-if='Data.result.historyTradeVolume'>{{Data.result.historyTradeVolume}}</span>
              <span class='textright' v-else>-</span>
            </div>
          </div>
        </div>
      </div>
      <div class='content-body-two'>
        <div class='content-two-title'>
          <span class='content-two-titlel'>MIG提供参考资料</span>
          <span @click='returnstorage' class='content-two-titler'>返回</span>
        </div>
        <div class='content-two-body'>
          <div class='content-two-text'>
            <p class='content-two-p'>{{Data.result.migReference}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class='bottom'>
      <div class='bottom-body-one'>
        <div class='page-project'>
          <div class='egrid-class' style='width: 100%; height: 365px'>
            <div
              class='project-title-bar'
              style=' width: 97%;height: 34px;margin-top: 20px; line-height: 34px;'
            >
              <span>历史交易记录</span>
            </div>
            <egrid
              border
              column-type='index'
              class='page-list sk-table-black hisfix'
              height='320'
              v-loadmore='lkloadMore'
              :slot-append='true'
              :default-sort="{prop: 'points', order: 'descending'}"
              :data='Data.result.tradeRecordVos'
              :columns='productColumns'
              :columns-schema='productSchema'
              :columns-props='productProps'
              :row-class-name='tableRowClassName'
              :columns-handler='columnsHandler'
            >
              <div slot='append' v-if='lknoMore' class='no-more'>没有更多数据了</div>
            </egrid>
          </div>
        </div>
      </div>
      <div class='bottom-body-two'>
        <div class='bottom-two-title'>MIG Credit Rating</div>
        <div class='bottom-two-body'>{{Data.result.migGrade}}</div>
      </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import EgridCellView from 'components/wms/comm/EgridCellView';
let that;
// 求购编号链接详情
export default {
  props: {
    storageId: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      ishow: false,
      id: '',
      num: 5,
      requestList: [],
      // 项目库数据
      Data: {}, // 项目库数据
      currentRow: {}, // 当前定位行的数据
      productColumns: [
        {
          label: '订单编号',
          prop: 'projectNo'
        },
        {
          label: '产品',
          prop: 'subProductName'
        },
        {
          label: '类型',
          prop: 'tradeTypeName'
        },
        {
          label: '执行折扣率',
          prop: 'discountRate'
        },
        {
          label: '仓储地',
          prop: 'city'
        },
        {
          label: '融资期（天）',
          prop: 'tradeDays'
        },
        {
          label: '开始时间',
          prop: 'performDate'
        },
        {
          label: '订单状态',
          prop: 'statusName'
        },
        {
          label: '履约状态',
          prop: 'isViolate',
          customStyle: 'color: replace-riskRateColor'
        }
      ],
      productSchema: {
        订单编号: { minWidth: 100, sortable: false, component: EgridCellView },
        产品: { minWidth: 280, sortable: false, component: EgridCellView },
        类型: { minWidth: 120, sortable: false, component: EgridCellView },
        执行折扣率: { minWidth: 80, sortable: false, component: EgridCellView },
        仓储地: { minWidth: 120, sortable: false, component: EgridCellView },
        开始时间: { minWidth: 100, sortable: false, component: EgridCellView },
        订单状态: { minWidth: 80, sortable: false, component: EgridCellView },
        履约状态: { minWidth: 80, sortable: false, component: EgridCellView },
        '融资期（天）': { minWidth: 80, sortable: false }
      },
      // columnsProps 用于定义所有 columns 公共的属性，
      // 这里属性可以参考这里： http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
      productProps: {
        height: 40,
        minWidth: 120,
        align: 'center',
        sortable: true, // 是否排序
        showOverflowTooltip: true
      },

      projectId: null, // 项目ID
      pageIndex: 0,
      noMore: false,
      lknoMore: false,
      listTotal: 30,
      showImportDialog: false // 是否显示导入项目对话框
    };
  },
  created() {
    that = this;
    that.$pcBus.$on('reFresh', function(page) {
      if (page.path === 'projectIndex') {
        that.reFresh(page);
      }
    });

    // 数据请求
    this.ajax({
      type: 'GET',
      url: `/malisk/client/storage/storageDetail/${this.storageId}`,
      data: {},
      loading: true,
      success: res => {
        setTimeout(() => {
          this.$pcNProgress.done();
        }, 300);
        if (res.code === 200) {
          // alert(res)
          res.result.tradeRecordVos.forEach((item, index) => {
            if (item.isViolate !== '正常') {
              item.riskRateColor = '#e63453';
            }
          });
          this.Data = res;
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
    returnstorage() {
      this.$emit('on-child');
    },
    submit() {
      if (event.keyCode === 13) {
      }
    },
    // 跳转
    // tableRowClassName() {
    //   this.$emit('on-clock', 0, this.projectData.result);
    // },
    /**
     * 筛选交易类型/状态类型
     * @param value 筛选的值
     * @param row 行数据
     * @param column 列数据
     * @returns {boolean}
     */
    filterData(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /**
     * 加载更多数据
     */
    lkloadMore() {
      var start = this.projectData.length + 10;
      if (start < this.listTotal) {
        this.pageIndex++;
        var sliceIndex = this.pageIndex;
        var aList = this.projectData.slice(0, sliceIndex * 10);
        this.projectData = this.projectData.concat(aList);
      } else {
        this.lknoMore = true;
      }
    },
    reFresh(page) {},
    /**
     * 搜索返回数据
     */
    searchData(data) {},
    columnsHandler() {},
    /**
     * 设置指定行数据是否选中
     * @param row 行数据
     */
    setCurrent(row) {
      // 'setCurrent: ' + row;
      this.$refs.projectTable.setCurrentRow(row);
    },
    /**
     * 选中行的回调函数
     */
    handleCurrentChange(val) {
      this.currentRow = val;
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

<style scoped>
.content-two-p {
  width: 100%;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
.content-two-titler {
  position: absolute;
  right: 20px;
  margin-right: 20px;
}
.bottom-two-body {
  width: 90%;
  height: 200px;
  text-align: center;
  line-height: 200px;
  background: #252a36;
  font-size: 48px;
  margin-top: 30px;
  margin-left: 20px;
  font-weight: bold;
}
.bottom-two-title {
  color: #990808;
  font-size: 48px;
  margin-top: 40px;
  margin-left: 20px;
  font-weight: bold;
}

.content-two-text > p {
  line-height: 25px;
}
.content-two-text {
  width: 90%;
  height: 380px;
  margin-top: 15px;
  margin-left: 20px;
}
.content-two-body {
  width: 97%;
  height: 388px;
  margin-left: 15px;
  border: 1px solid #303541;
}
.content-two-title {
  position: relative;
  margin-left: 15px;
  width: 97%;
  height: 34px;
  line-height: 34px;
}
.textright {
  margin-right: 20px;
}
.content-one-chil {
  height: 30px;
  margin-top: 10px;
  flex-grow: 1;
  text-align: left;
  line-height: 30px;
  text-align: right;
}
.textt {
  margin-left: 20px;
}
.content-one-chi {
  height: 30px;
  margin-top: 10px;
  flex-grow: 1;
  text-align: left;
  line-height: 30px;
}
.content-one-mz {
  flex-grow: 1;
  height: 388px;
  background: #252a36;
  width: 256px;
  display: flex;
  flex-direction: column;
}
.content-one-mi {
  flex-grow: 1;
  width: 256px;
  height: 388px;
  display: flex;
  flex-direction: column;
}
.content-one-text {
  color: #1383f2;
  font-size: 14px;
}
.content-one-title {
  margin-left: 20px;
  line-height: 20px;
  margin-top: 5px;
  height: 20px;
}
.content-one-main {
  width: 95%;
  margin-left: 15px;
  border: 1px solid #303541;
  display: flex;
  flex-wrap: nowrap;
  height: 388px;
}
.content-body-two {
  /* flex-grow: 2; */
  width: 75%;
  margin-left: 10px;
  background: #181d29;
  /* border: 2px solid blue; */
}
.content-body-one {
  width: 35%;
  /* flex-grow: 1; */
  background: #181d29;
  /* border: 2px solid blanchedalmond; */
}
.bottom-body-two {
  width: 35%;
  margin-left: 10px;
  background: #181d29;
  /* border: 2px solid blue; */
}
.bottom-body-one {
  /* width: 600px; */
  width: 65%;
  background: #181d29;
  /* border: 2px solid blanchedalmond; */
}
.content-body {
  width: 100%;
  height: 440px;
  display: flex;
  flex-wrap: nowrap;
  /* background: #181d29; */
  /* border: 2px solid yellow; */
}
.bottom {
  width: 100%;
  height: 380px;
  margin-top: 10px;
  display: flex;
  margin-bottom: 40px;
  flex-wrap: nowrap;
  /* background: #181d29; */
  /* border: 2px solid yellow; */
}

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
.page-list.sk-table-black.hisfix .el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #181d29;
  border-bottom-width: 1px;
  background: #181d29!important;
}
</style>
