<template>
  <div class="page-project">
    <div class="egrid-class">
      <div class="project-title-bar" style="height: 34px; line-height: 34px;">
        <span>回收站资产包（单位:RMB）</span>
        <div class="project-title-bar">
          <search style="margin-right: 0;" ref="search" placeholder="搜索" @resultMethod="searchData" searchKey="title"
                  remoteUrl="/wechat/bbs/topicList"></search>
        </div>
      </div>
      <egrid border
             ref="projectTable"
             column-type="index"
             class="page-list sk-table-black"
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
             :row-class-name="tableRowClassName"
             @current-change="handleCurrentChange">
        <div slot="append" v-if="noMore" class="no-more">没有更多数据了</div>
      </egrid>
    </div>
    <div class="egrid-product-title" >
      <div :class="productOrRedeemOption == 1?'link-class':'visited-class'" @click="productOption(1)" >产品（单位:RMB）</div>
      <div class="redeem" :class="productOrRedeemOption == 2?'link-class':'visited-class'" @click="productOption(2)" >赎单记录</div>
    </div>
    <div class="egrid-class" v-if="productOrRedeemOption == 1" style="height: 340px">
      <egrid border
             column-type="index"
             class="page-list sk-table-black"
             height="300"
             highlight-current-row
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
    <div  v-if="productOrRedeemOption == 2" class="redeem-egrid-box"  style="width: 100%" >
      <!--赎单记录-->
      <div class="egrid-class" style="width: 60vw"  >
        <div class="redeem-title" >
          <span>赎单记录</span>
        </div>
        <egrid border
               column-type="index"
               class="page-list sk-table-black"
               height="250"
               highlight-current-row
               :slot-append=true
               :data="redeemRecordList"
               :columns="redeemRecordColumns"
               :columns-schema="redeemRecordColumnsSchema"
               :columns-props="columnsProps"
               :columns-handler="columnsHandler"
               :row-class-name="tableRowClassName">
        </egrid>
      </div>
      <!--待赎单记录-->
      <div v-if="productOrRedeemOption == 2" class="egrid-class egrid-class-pdding10"   style="width: 40vw" >
        <div class="redeem-title" >
          <span>待赎单记录</span>
        </div>
        <egrid border
               column-type="index"
               class="page-list sk-table-black"
               height="250"
               highlight-current-row
               :slot-append=true
               :data="toRedeemRecordList"
               :columns="toRedeemRecordColumns"
               :columns-schema="toRedeemRecordColumnsSchema"
               :columns-props="columnsProps"
               :row-class-name="tableRowClassName">
        </egrid>
      </div>
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
        <i v-if="hasPermission('sk:client:project:addProject') || true" class="icon maliiconfont maliicon-img_comm_return padding-left-right-20" @click="revert(row)"></i>
      </div>`,
    props: ['row'],
    computed: {
    },
    mounted () {
      // 默认选中第一条
      this.setCurrent(this.projectData[0]);
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
        projectData: [],
        currentRow: {}, // 当前定位行的数据
        columns: [
          {
            label: '项目编号',
            prop: 'projectNo'
          },
          {
            label: '执行日期',
            prop: 'performDate'
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
            convertProp: 'statusName', // 需要转换的列值的属性
            customStyle: 'color: #fdfe1f'
            // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '资产总额',
            prop: 'totalPrice'
          },
          {
            label: '执行折率',
            prop: 'performRateString'
          },
          {
            label: '折后总价',
            prop: 'totalDiscountPrice'
          },
          {
            label: '待续资产',
            prop: 'leftAmount'
          },
          {
            label: '融资天数',
            prop: 'tradeDays'
          },
          {
            label: '剩余天数',
            prop: 'leftDays'
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
          '项目编号': {minWidth: 110, sortable: false},
          '执行日期': {minWidth: 140, sortable: true, component: EgridCellView},
          '风险系数': {minWidth: 120, sortable: true, component: EgridCellView},
          '剩余天数': {minWidth: 110, sortable: true, component: EgridCellView},
          '资产总额': {minWidth: 110, sortable: true},
          '融资天数': {minWidth: 110, sortable: true},
          '执行折率': {minWidth: 110, sortable: true, component: EgridCellView},
          '折后总价': {minWidth: 110, sortable: true},
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
            minWidth: 70,
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
            align: 'left',
            sortable: false
            // 定义表格列如何渲染，用showOverflowTooltip: true代替
//            component: LongContentCol // 列内容过长内容展示组件（设置超出部分隐藏，鼠标移上去显示全部）
          },
          '冷库': {
            minWidth: 200,
            align: 'left',
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
            prop: 'tradeVolume'
          },
          {
            label: '资产原值(总价)',
            prop: 'totalValue'
          },
          {
            label: '执行折率',
            prop: 'discountRateString'
          },
          {
            label: '折后总价',
            prop: 'discountTotalValue'
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
        productData: [],
        // 赎单记录
        redeemRecordColumns: [
          {
            label: '执行日期',
            prop: 'performDate'
          },
          {
            label: '赎单日期',
            prop: 'redeemDate'
          },
          {
            label: '实际融资天数',
            prop: 'tradeDays'
          },
          {
            label: '编码',
            prop: 'mainLevelCode'
          },
          {
            label: '产品',
            prop: 'subProductName'
          },
          {
            label: '主标准',
            prop: 'mainStandard'
          },
          {
            label: '二维标准',
            prop: 'subStandard'
          },
          {
            label: '出货数量KG',
            prop: 'redeemVolume'
          },
          {
            label: '赎单金额',
            prop: 'redeemAmount'
          }
        ],
        redeemRecordColumnsSchema: {
          '执行日期': {minWidth: 110, sortable: true},
          '赎单日期': {minWidth: 110, sortable: true},
          '实际融资天数': {minWidth: 110, sortable: false},
          '编码': {minWidth: 100, sortable: false},
          '产品': {minWidth: 140, sortable: false},
          '主标准': {minWidth: 100, sortable: false},
          '二维标准': {minWidth: 100, sortable: false},
          '出货数量KG': {minWidth: 130, sortable: true},
          '赎单金额': {minWidth: 110, sortable: true}
        },
        toRedeemRecordColumns: [
          {
            label: '编码',
            prop: 'mainLevelCode'
          },
          {
            label: '产品',
            prop: 'subProductName'
          },
          {
            label: '主标准',
            prop: 'mainStandard'
          },
          {
            label: '二维标准',
            prop: 'subStandard'
          },
          {
            label: '待赎数量KG',
            prop: 'leftVolume'
          },
          {
            label: '待赎资产',
            prop: 'leftAmount'
          }
        ],
        toRedeemRecordColumnsSchema: {
          '编码': {minWidth: 100, sortable: false},
          '产品': {sortable: false},
          '主标准': {minWidth: 70, sortable: false},
          '二维标准': {minWidth: 80, sortable: false},
          '待赎数量KG': {minWidth: 120, sortable: false},
          '待赎资产': {minWidth: 100, sortable: false}
        },
        projectId: null, // 项目ID
        searchValue: null, // 搜索项目编号、客户和冷库关键字
        status: null, // 筛选状态
        tradeType: null, // 筛选业务类型
        pageIndex: 0,
        assetType: 1, // 从首页资产管理点击跳转传值，1：资产列表，2：临期订单，3逾期订单，4：高风险订单
        noMore: false,
        listTotal: 30,
        productOrRedeemOption: 1, // 产品和赎单标记
        toRedeemRecordList: null, // 待赎单记录
        redeemRecordList: null, // 赎单记录
        customStyle: 'width: 400px !important; height: 234px !important;', // 审核/删除项目对话框样式
        revertMessage: null, // 还原项目message
        showRevertDialog: false // 恢复回收站对话框
      };
    },
    created () {
      that = this;
      that.getData(); // TODO 先注释掉
      that.$pcBus.$on('reFresh', function(page) {
        console.log('-------------page---------------', page);
        if (page.path === 'projectIndex') {
          that.searchValue = ''; // 清除搜索框的内容
          that.$refs.search.isShowClear = false; // 不显示右边的X
          that.getData(page);
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
          assetType: this.assetType,
          name: this.searchValue,
          status: this.status,
          tradeType: this.tradeType
        };
        this.ajax({
          url: '/malisk/client/asset/deletedAssetList',
          loading: true,
          data: param,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            that.allData = res.result;
            that.listTotal = res.result.length;
            that.projectData = that.listTotal > 10 ? res.result.slice(0, 10) : res.result;
            that.productData = []; // 刷新数据清除选中项目的产品数据
            that.toRedeemRecordList = []; // 清除
            that.redeemRecordList = []; // 清除
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
        console.log('filter-------------------');
        console.log(value);
        console.log(row);
        console.log(column);
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
          this.pageIndex++;
          var sliceIndex = this.pageIndex;
          var aList = this.projectData.slice(0, sliceIndex * 10);
          this.projectData = this.projectData.concat(aList);
        } else {
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
        that.searchValue = data;
        this.getData();
      },
      columnsHandler() {

      },
      /**
       * 设置指定行数据是否选中
       * @param row 行数据
       */
      setCurrent(row) {
        console.log('setCurrent: ' + row);
        this.$refs.projectTable.setCurrentRow(row);
      },
      /**
       * 选中行的回调函数
       */
      handleCurrentChange(currentRow, oldCurrentRow) {
        this.currentRow = currentRow;
        this.getProductData(currentRow);
        this.getRedeem(currentRow);  // 获取赎单记录
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
              that.successTip(res.message);
              that.showRevertDialog = false;
              that.setCurrent(this.projectData[0]);
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
          url: '/malisk/client/project/revertProject',
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
      },
      /**
       * 获取赎单记录
       **/
      getRedeem(projectData) {
        // 调用接口提交数据给服务端
        let that = this;
        this.ajax({
          url: 'malisk/client/asset/assetRecord/' + projectData.id,
          data: {},
          type: 'get',
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.redeemRecordList = res.result.recordListVos;

              that.toRedeemRecordList = res.result.leftListVos;
              console.log('----------------', that.toRedeemRecordList);
            } else {
              that.errorTip(res.message);
            }
          }
        });
      },
      productOption(type) {
        let that = this;
        that.productOrRedeemOption = type;
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
  .egrid-product-title {
    height: 34px;
    line-height: 34px;
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #181d29;
    padding-left: 10px;
  }
  .egrid-product-title .redeem{
    padding-left: 30px;
  }
  .redeem-egrid-box{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    background: #bd2c00;
  }
  .redeem-egrid-box .egrid-class .redeem-title{
    padding-left: 20px;
    height: 34px;
    line-height: 34px;
    border: 1px solid #303541;
    font-size: 14px;
  }
  .link-class {
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;

  }
  .visited-class {
    cursor: pointer;
    color: #99a3bb;
    font-size: 14px;
  }
</style>
