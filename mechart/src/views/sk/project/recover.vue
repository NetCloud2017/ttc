<template>
  <div class="page-project sk-table-no-scrollbar-y">
    <div class="egrid-class">
      <div class="project-title-bar" style="height: 34px; line-height: 34px;">
        <span>回收站资产包（单位:RMB）</span>
        <div class="project-title-bar">
          <search style="margin-right: 0;" ref="search" placeholder="搜索" @resultMethod="searchData" searchKey="title"
                  remoteUrl="/wechat/bbs/topicList"></search>
        </div>
      </div>
      <egrid border
             ref="delProjectTable"
             column-type="index"
             class="page-list"
             height="450"
             v-loadmore="loadMore"
             highlight-current-row
             :slot-append=true
             :default-sort="{prop: 'points', order: 'descending'}"
             :data="projectData"
             :columns="columns"
             :columns-schema="columnsSchema"
             :columns-props="columnsProps"
             :columns-handler="columnsHandler"
             @current-change="handleCurrentChange">
        <div slot="append" v-if="noMore" class="no-more">没有更多数据了</div>
      </egrid>
    </div>
    <div class="egrid-class" style="height: 340px">
      <div style="height: 34px; line-height: 34px;margin-top: 10px;">产品（单位:RMB）</div>
      <egrid border
             column-type="index"
             class="page-list"
             height="300"
             v-loadmore="loadMore"
             :slot-append=true
             :default-sort="{prop: 'points', order: 'descending'}"
             :data="productData"
             :columns="productColumns"
             :columns-schema="productColumnsSchema"
             :columns-props="productColumnsProps"
             :columns-handler="columnsHandler">
        <div slot="append" v-if="noMore" class="no-more">没有更多数据了</div>
      </egrid>
    </div>
    <center-dialog v-if="showRevertDialog" title="还原" :customStyle="customStyle"
                   :dialogMessage="revertMessage"  @confirm="confirmRevert" @cancel="closeDialog">
    </center-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import centerDialog from 'components/dialog/centerDalog.vue';
  import EgridCellView from 'components/wms/comm/EgridCellView';
  import search from 'components/search/search.vue';
  let that;
  // 操作按钮
  var Btn = {
    template: `<div style="display:flex; width: 100%;flex-wrap: wrap; justify-content: center;">
        <i v-if="hasPermission('sk:client:project:revertProject')" class="icon maliiconfont maliicon-img_comm_return padding-left-right-20" @click="revert(row)"></i>
      </div>`,
    props: ['row'],
    computed: {
    },
    methods: {
      // 编辑项目
      revert (val) {
//        console.log('handle order------row: ' + JSON.stringify(val));
        this.$emit('revert', val);
      }
    }
  };
  export default {
    components: {
      centerDialog,
      EgridCellView,
      search
    },
    data() {
      return {
        allData: [], // 项目库所有数据
        projectData: [], // 项目库数据
        currentRow: {}, // 当前定位行的数据
        columns: [
          {
            label: '项目编号',
            prop: 'projectNo'
          },
          {
            label: '录入时间',
            prop: 'lastEditTime'
          },
          {
            label: '客户',
            prop: 'ownerName'
          },
          {
            label: '冷库',
            prop: 'storageName'
          },
          {
            label: '业务类型',
            prop: 'tradeType',
            convertProp: 'tradeTypeName' // 需要转换的列值的属性名
          },
          {
            label: '状态',
            prop: 'status',
            convertProp: 'statusName', // 需要转换的列值的属性名
            customStyle: 'color: #fdfe1f'
            // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '资产总额',
            prop: 'totalPriceDisplay'
          },
          {
            label: '申报折率',
            prop: 'discountRate'
          },
          {
            label: '折后总价',
            prop: 'totalDiscountPriceDisplay'
          },
          {
            label: '建议折率',
            prop: 'adviceRateString',
            customStyle: 'color: #e5962e' // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '风险系数',
            prop: 'riskRate',
            customStyle: 'background-color: replace-riskRateColor' // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '操作',
            minWidth: 100,
            fixed: 'right',
            align: 'center',
            component: Btn, // 'el-button'
            listeners: {
              'revert' (data) {
                that.optionData = data;
                that.revertMessage = '确定还原项目' + data.projectNo + '吗？';
                that.showRevertDialog = true;
              }
            },
            propsHandler: function ({ row, col, column }) {
              return {row, col, column};
            }
          }
        ],
        columnsSchema: {
          '项目编号': {minWidth: 100, sortable: false},
          '录入时间': {minWidth: 140, sortable: true, component: EgridCellView},
          '风险系数': {minWidth: 120, sortable: true, component: EgridCellView},
          '建议折率': {component: EgridCellView},
          '业务类型': {
            minWidth: 120,
            sortable: false, // 是否排序
            component: EgridCellView,
            filters: [
              {text: '现货质押', value: 1},
              {text: '贸易融资', value: 2},
              {text: '商贸模式', value: 3}
            ],
            filterMethod: this.filterData
          },
          '状态': {
            minWidth: 100,
            sortable: false, // 是否排序
            component: EgridCellView,
            filters: [ // 1.待审核 2.不通过 3.待定中 4.待执行 5.存续中 6.已完成 7.已逾期
              {text: '待审核', value: 1},
              {text: '不通过', value: 2},
              {text: '待定中', value: 3},
              {text: '待执行', value: 4},
              {text: '存续中', value: 5},
              {text: '已完成', value: 6},
              {text: '已逾期', value: 7}
            ],
            filterMethod: this.filterData,
            propsHandler: function ({ row, col, column }) {
              row.normal = row.status !== 1; // 根据项目状态判断是否使用正常的样式
              col.differProp = 'status';
              return {row, col, column};
            }
          },
          '客户': {
            minWidth: 220,
            sortable: false
            // 定义表格列如何渲染，用showOverflowTooltip: true代替
//            component: LongContentCol // 列内容过长内容展示组件（设置超出部分隐藏，鼠标移上去显示全部）
          },
          '冷库': {
            minWidth: 220,
            sortable: false
            // 定义表格列如何渲染, 用showOverflowTooltip: true代替
//            component: LongContentCol // 列内容过长内容展示组件（设置超出部分隐藏，鼠标移上去显示全部）
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
        productColumns: [
          {
            label: '编码',
            prop: 'mainLevelCode'
          },
          {
            label: '产品',
            prop: 'mainProductName'
          },
          {
            label: '主标准',
            prop: 'mainStandard'
          },
          {
            label: '二级标准',
            prop: 'subStandard'
          },
          {
            label: '市价',
            prop: 'marketPrice',
            customStyle: 'color: replace-adRatioColor'
          },
          {
            label: '涨跌',
            prop: 'adRatioString',
            customStyle: 'color: replace-adRatioColor'
          },
          {
            label: '建议折率',
            prop: 'adviceRateString',
            customStyle: 'color: #e5962e'
          },
          {
            label: '流通系数',
            prop: 'flowCoefficient',
            customStyle: 'color: #e5962e'
          },
          {
            label: '资产原值(单价)',
            prop: 'tradeUnitPrice'
          },
          {
            label: '数量KG',
            prop: 'tradeVolumeDisplay'
          },
          {
            label: '资产原值(总价)',
            prop: 'totalValueDisplay'
          },
          {
            label: '申报折率',
            prop: 'discountRateString'
          },
          {
            label: '折后总价',
            prop: 'discountTotalValueDisplay'
          },
          {
            label: '折后单价',
            prop: 'discountPrice'
          },
          {
            label: '安全价差',
            prop: 'securityDiffPrice',
            customStyle: 'background-color: replace-securityDiffPriceColor'
          },
          {
            label: '风险系数',
            prop: 'riskRate',
            customStyle: 'background-color: replace-riskRateColor'
          }
        ],
        productColumnsSchema: {
          '编码': {minWidth: 100, sortable: false},
          '资产原值(单价)': {minWidth: 150},
          '资产原值(总价)': {minWidth: 150},
          '风险系数': {minWidth: 120, sortable: true, component: EgridCellView},
          '建议折率': {component: EgridCellView},
          '安全价差': {minWidth: 120, component: EgridCellView},
          '流通系数': {minWidth: 120, component: EgridCellView},
          '涨跌': {minWidth: 100, component: EgridCellView},
          '市价': {minWidth: 100, component: EgridCellView},
          '产品': {
            minWidth: 100,
            sortable: false
            // 定义表格列如何渲染, 用showOverflowTooltip: true代替
//            component: LongContentCol // 列内容过长内容展示组件（设置超出部分隐藏，鼠标移上去显示全部）
          }
        },
        // columnsProps 用于定义所有 columns 公共的属性，
        // 这里属性可以参考这里： http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
        productColumnsProps: {
          height: 30,
          minWidth: 120,
          align: 'center',
          sortable: true, // 是否排序
          showOverflowTooltip: true
        },
        projectId: null, // 项目ID
        searchValue: null, // 搜索项目编号、客户和冷库关键字
        status: null, // 筛选状态
        tradeType: null, // 筛选业务类型
        pageIndex: 0,
        noMore: false,
        listTotal: 30,
        showImportDialog: false, // 是否显示导入项目对话框
        showAuditDialog: false, // 是否显示审核项目对话框
        showRevertDialog: false, // 是否显示还原项目对话框
        optionData: null, // 暂存编辑/审核/删除操作的数据
        customStyle: 'width: 400px !important; height: 234px !important;', // 审核/删除项目对话框样式
        revertMessage: null, // 还原项目message
        auditStatus: null, // 项目审核状态
        productData: [] // 产品列表数据
      };
    },
    created () {
      that = this;
      that.getData();
      that.$pcBus.$on('reFresh', function(page) {
        if (page.path === 'projectIndex') {
          that.searchValue = ''; // 清除搜索框的内容
          that.$refs.search.isShowClear = false; // 不显示右边的X
          that.tradeType = null; // 刷新清除筛选条件
          that.status = null; // 刷新清除筛选条件
          that.$refs.delProjectTable.clearFilter(); // 刷新清除筛选条件
          that.getData();
        }
      });
    },
    mounted () {
      // 默认选中第一条
      this.setCurrent(this.projectData[0]);
    },
    methods: {
      /**
       * 请求接口获取项目数据
       */
      getData() {
        let that = this;
        let param = {
          name: this.searchValue
        };
        this.ajax({
          url: 'malisk/client/project/deletedProjectList',
          data: param,
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            that.allData = res.result;
            that.listTotal = res.result.length;
            that.projectData = that.listTotal > 10 ? res.result.slice(0, 10) : res.result;
            that.productData = []; // 刷新数据清除选中项目的产品数据
            this.setCurrent(this.projectData[0]);
          }
        });
      },
      /**
       * 筛选交易类型/状态类型
       * @param value 筛选的值
       * @param row 行数据
       * @param column 列数据
       * @returns {boolean}
       */
      filterData(value, row, column) {
        // console.log(value);
        // console.log(row);
        // console.log(column);
        // console.log('filterData---value: ' + value + ' row: ' + JSON.stringify(row));
        const property = column['property'];
        if (property === 'status') {
          this.status = column.filteredValue;
        }
        if (property === 'tradeType') {
          this.tradeType = column.filteredValue;
        }
//        console.log('filterData---value: ' + value + 'filterData---row[property]: ' + row[property] + ' property: ' + property);
        return row[property] === value;
      },
      /**
       * 加载更多数据
       */
      loadMore() {
        var start = this.projectData.length + 10;
        console.log('loadmore');
        if (start < this.listTotal) {
          // this.pageIndex++;
          // var sliceIndex = this.pageIndex;
          var aList = this.allData.slice(this.projectData.length, start);
          this.projectData = this.projectData.concat(aList);
        } else {
          this.projectData = this.allData;
          this.noMore = true;
        }
      },
      reFresh(page) {
        console.log(page);
      },
      /**
       * 搜索返回数据
       */
      searchData(data) {
        this.searchValue = data;
        this.getData();
      },
      columnsHandler() {

      },
      /**
       * 设置指定行数据是否选中
       * @param row 行数据
       */
      setCurrent(row) {
        // console.log('setCurrent: ' + row);
        this.$refs.delProjectTable.setCurrentRow(row);
      },
      /**
       * 选中行的回调函数
       */
      handleCurrentChange(currentRow, oldCurrentRow) {
        if (!currentRow) {
          return;
        }
        this.currentRow = currentRow;
        this.getProductData(currentRow);
      },
      /**
       * 定位行的样式
       * @param row
       * @param rowIndex
       * @returns {*}
       */
      tableRowClassName({row, rowIndex}) {
        console.log('tableRowClassName: ' + row + ' rowIndex: ' + rowIndex);
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      /**
       * 获取项目相关的产品的数据
       * @param projectData
       */
      getProductData(projectData) {
        let that = this;
        this.ajax({
          type: 'GET',
          url: '/malisk/client/project/projectProductList/' + projectData.id,
          loading: false,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            that.productData = res.result;
          }
        });
      },
      /**
       * 确认恢复项目
       **/
      confirmRevert() {
        let that = this;
        // 调用接口提交数据给服务端
        this.ajax({
          url: 'malisk/client/project/revertProject',
          data: {
            id: this.optionData.id,
            version: this.optionData.version
          },
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.getData(); // 重新加载数据
              that.successTip('还原成功');
              that.showRevertDialog = false;
            } else {
              that.errorTip(res.message);
            }
          }
        });
      },
      // 取消并关闭dialog
      closeDialog() {
        this.showImportDialog = false;
        this.showRevertDialog = false;
        this.showAuditDialog = false;
      },
      /**
       * 审核项目状态发生变化时的回调函数
       * @param value 审核选择的状态值
       */
      auditChange(value) {
        this.auditStatus = value;
      },
      /**
       * 恢复项目
       * @param data 待恢复的项目数据
       */
      revertProject(data) {
        // 调用接口提交数据给服务端
        this.ajax({
          url: 'malisk/client/project/revertProject',
          data: {
            id: data.id,
            version: data.version
          },
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.getData(); // 重新加载数据
              that.successTip(res.message);
              that.showDeleteDialog = false;
            } else {
              that.errorTip(res.message);
            }
          }
        });
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
  .page-project .padding-left-right-20 {
    padding: 0 10px;
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
