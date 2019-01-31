<template>
  <div v-if="!showRcover" class="page-project">
    <div class="egrid-class">
      <div v-if="showProject" class="project-title-bar" style="height: 34px; line-height: 34px;">
        <span>资产包（单位:RMB）</span>
        <div class="project-title-bar">
          <search ref="search" placeholder="搜索" @resultMethod="searchData" searchKey="title"
                  remoteUrl="/wechat/bbs/topicList"></search>
          <div v-permission="['sk:client:project:addProject']" style="margin-right: 20px" @click="addProject">
            <i class="icon maliiconfont maliicon-img_comm_Import margin-5"></i>
            <span>录入项目</span>
          </div>
          <div v-permission="['sk:client:project:exportProject']" @click="exportData()">
            <i class="icon maliiconfont maliicon-img_comm_export margin-5"></i>
            <span>导出</span>
          </div>
        </div>
      </div>
      <div v-if="showAsset" class="project-title-bar" style="height: 34px; line-height: 34px;">
        <span>资产包（单位:RMB）</span>
        <div class="project-title-bar">
          <div style="margin-right: 20px">
            <span class="color-fdfe1f">临期订单：{{periodCount}}</span>
            <span class="margin-left-20 color-e63453">逾期订单：{{overDueCount}}</span>
            <span class="margin-left-20 color-e63453">高风险订单：{{highRiskCount}}</span>
            <span class="margin-left-20">全部订单：{{allCount}}</span>
          </div>
          <search ref="search" placeholder="搜索" @resultMethod="searchData" searchKey="title"
                  remoteUrl="/wechat/bbs/topicList"></search>
          <div v-permission="['sk:client:asset:entrustAsset']" @click="exportData()">
            <i class="icon maliiconfont maliicon-img_comm_export margin-5"></i>
            <span>导出</span>
          </div>
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
             @current-change="handleCurrentChange"
             @cell-click="cellClick" >
        <div slot="append" v-if="noMore" class="no-more">没有更多数据了</div>
      </egrid>
    </div>

      <div class="egrid-product-title" >
        <div v-if="fromPage == 2"  >产品（单位:RMB）</div>
        <div v-if="fromPage == 1" :class="productOrRedeemOption == 1?'link-class':'visited-class'" @click="productOption(1)" >产品（单位:RMB）</div>
        <div class="redeem" v-if="fromPage == 1" :class="productOrRedeemOption == 2?'link-class':'visited-class'" @click="productOption(2)" >赎单记录</div>
      </div>
      <div  v-if="productOrRedeemOption == 1" class="egrid-class" style="height: 340px">
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
      <div  v-if="fromPage == 1 && productOrRedeemOption == 2" class="redeem-egrid-box"  style="width: 100%" >
      <!--赎单记录-->
       <div class="egrid-class" style="width: 60vw" >
          <div class="redeem-title" >
            <span>赎单记录</span>
          </div>
          <egrid border
                 column-type="index"
                 class="page-list sk-table-black"
                 height="280"
                 highlight-current-row
                 :slot-append=true
                 :data="redeemRecordList"
                 :columns="redeemRecordColumns"
                 :columns-schema="redeemRecordColumnsSchema"
                 :columns-props="columnsProps"
                 :columns-handler="columnsHandler">
          </egrid>
       </div>
        <!--待赎单记录-->
        <div v-if="fromPage == 1 && productOrRedeemOption == 2" class="egrid-class egrid-class-pdding10" style="width: 40vw" >
          <div class="redeem-title" >
            <span>待赎单记录</span>
          </div>
          <egrid border
                 column-type="index"
                 class="page-list sk-table-black"
                 height="280"
                 highlight-current-row
                 :slot-append=true
                 :data="toRedeemRecordList"
                 :columns="toRedeemRecordColumns"
                 :columns-schema="toRedeemRecordColumnsSchema"
                 :columns-props="columnsProps"
                 :columns-handler="columnsHandler"
                 :row-class-name="tableRowClassName">
          </egrid>
        </div>
      </div>

    <center-dialog v-if="showImportDialog" title="录入项目"  @confirm="confirmImport" @cancel="closeDialog">
      <import-project ref="importProject" slot="bodySlot" :id="projectId">

      </import-project>
    </center-dialog>
    <!--删除项目对话框-->
    <center-dialog v-if="showDeleteDialog" title="删除" :customStyle="customStyle"
                   :dialogMessage="deleteMessage"  @confirm="confirmDelete" @cancel="closeDialog">
    </center-dialog>
    <!--审核项目对话框-->
    <center-dialog v-if="showAuditDialog" title="审核" :customStyle="customStyle"  @confirm="confirmAudit" @cancel="closeDialog">
      <el-radio-group slot="bodySlot" v-model="auditStatus" @change="auditChange">
        <el-radio :label="4">审核通过</el-radio>
        <el-radio :label="2">审核不通过</el-radio>
        <el-radio v-show="optionData.status !== 3" :label="3">待定</el-radio>
      </el-radio-group>
    </center-dialog>
    <!--执行对话框-->
    <center-dialog v-if="showPerformDialog"  title="执行" confirmText="提交" customStyle="width:460px;height:274px"  @confirm="confirmPerform" @cancel="closeDialog">
      <perform  ref="perform" slot="bodySlot" :id="projectId">
      </perform>
    </center-dialog>
    <!--委托资产对话框-->
    <center-dialog v-if="showEntrustAssetDialog" ref="perform" title="委托处置" confirmText="委托处置" customStyle="width:460px;height:274px"  @confirm="confirmEntrustAsset" @cancel="closeDialog">
      <entrust slot="bodySlot" :id="projectId">
      </entrust>
    </center-dialog>
    <!--委托成功对话框-->
    <no-operation-dalog v-if="showEntrustSuccessDialog"  title="委托处置" confirmText="委托处置" customStyle="width:460px;height:274px"  @cancel="closeDialog">
      <entrust-success slot="bodySlot">
      </entrust-success>
    </no-operation-dalog>
    <!--赎单对话框-->
    <center-dialog v-if="showRedeemDialog"  title="赎单" confirmText="提交" customStyle="width:970px;height:480px"  @confirm="confirmRedeem" @cancel="closeDialog">
      <redeem ref="redeem"  slot="bodySlot" :id="projectId" :performDate="performDate">
      </redeem>
    </center-dialog>
  </div>
  <!-- 回收站 -->
  <recover v-else-if="showRcover && fromPage === 2"></recover>
  <assetRecover v-else-if="showRcover && fromPage === 1"></assetRecover>
</template>
<script type="text/ecmascript-6">
  import centerDialog from 'components/dialog/centerDalog.vue';
  import EgridCellView from 'components/wms/comm/EgridCellView';
  import importProject from '@/views/sk/project/importProject';
  import recover from '@/views/sk/project/recover.vue';
  import search from 'components/search/search.vue';
  import perform from '@/views/sk/project/perform.vue';
  import entrust from '@/views/sk/project/entrust.vue';
  import noOperationDalog from 'components/dialog/noOperationDalog.vue';
  import entrustSuccess from '@/views/sk/project/entrustSuccess.vue';
  import redeem from '@/views/sk/project/redeem.vue';
  import assetRecover from '@/views/sk/project/assetRecover.vue';
  import validate from 'utils/common-method/validate/index';
  import {validateTips} from 'utils/tips';
  let that;
  // 操作按钮
  var Btn = {
    template: `<div style="display:flex; width: 100%;flex-wrap: wrap; justify-content: center;">
        <i v-if="showEdit && hasPermission('sk:client:project:addProject')" class="icon maliiconfont maliicon-img_comm_edit padding-left-right-20" @click="editProject(row)"></i>
        <i v-if="showDelete && hasPermission('sk:client:project:deleteProject')" class="icon maliiconfont maliicon-img_comm_cancel1 padding-left-right-20" @click="deleteProject(row)"></i>
        <i v-if="showAudit && hasPermission('sk:client:project:auditProject')" class="icon maliiconfont maliicon-img_details_examine padding-left-right-20" @click="auditProject(row)"></i>
        <i v-if="showExecute && hasPermission('sk:client:asset:executeAsset')" class="icon maliiconfont maliicon-img_comm_play padding-left-right-20" @click="executeProject(row)"></i>
        <i v-if="showAssetDelete && hasPermission('sk:client:project:deleteAsset')" class="icon maliiconfont maliicon-img_comm_cancel1 padding-left-right-20" @click="deleteProject(row)"></i>
        <i v-if="showRedeem && hasPermission('sk:client:project:projectProductList:projectId')" class="icon maliiconfont maliicon-img_comm_capital padding-left-right-20" @click="redeemProject(row)"></i>
        <i v-if="showDisposal && hasPermission('sk:client:asset:entrustAsset')" class="icon maliiconfont maliicon-img_comm_Disposal padding-left-right-20" @click="disposalProject(row)"></i>
      </div>`,
    props: ['row'],
    computed: {
      // 1.待审核 2.不通过 3.待定中 4.待执行 5.存续中 6.已完成 7.已逾期
      showEdit() {
        return this.row.status === 1 || this.row.status === 3;
      },
      showAudit() {
        return this.row.status === 1 || this.row.status === 3;
      },
      showDelete() {
        return this.row.status === 1 || this.row.status === 2 || this.row.status === 3;
      },
      // 是否显示执行按钮
      showExecute() {
        return this.row.status === 4;
      },
      // 是否显示删除资产管理页面的按钮
      showAssetDelete() {
        return this.row.status === 4 || this.row.status === 6;
      },
      // 是否显示赎回按钮
      showRedeem() {
        return this.row.status === 5 || this.row.status === 7;
      },
      // 判断是否显示委托处置的按钮
      showDisposal() {
        return this.row.status === 5 || this.row.status === 7;
      }
    },
    methods: {
      // 编辑项目
      editProject (val) {
//        console.log('handle order------row: ' + JSON.stringify(val));
        this.$emit('edit', val);
      },
      // 删除项目
      deleteProject (val) {
        this.$emit('delete', val);
      },
      // 审核项目
      auditProject(val) {
        this.$emit('audit', val);
      },
      // 执行项目
      executeProject (val) {
//        console.log('handle order------row: ' + JSON.stringify(val));
        this.$emit('execute', val);
      },
      // 赎回项目
      redeemProject (val) {
        this.$emit('redeem', val);
      },
      // 委托处置项目
      disposalProject(val) {
        this.$emit('disposal', val);
      }
    }
  };
  export default {
    components: {
      centerDialog,
      EgridCellView,
      importProject,
      recover,
      search,
      perform,
      entrust,
      noOperationDalog,
      entrustSuccess,
      redeem,
      assetRecover
    },
    data() {
      return {
        fromPage: this.$route.query.fromPage, // 当前是项目页面还是资产库 （1. 资产， 2 项目）
        allData: [], // 项目库所有数据
        allCount: 100, // 所有订单数 ,
        highRiskCount: 1, // 高风险订单数 ,
        overDueCount: 1, // 逾期订单数 ,
        periodCount: 10, // 临期订单数
        projectData: [ ], // 项目库数据
        currentRow: {}, // 当前定位行的数据
        baseColumns: [
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
            customStyle: 'color: #fdfe1f' // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '资产总额',
            prop: 'totalPrice'
          },
          {
            label: '申报折率',
            prop: 'discountRate'
          },
          {
            label: '折后总价',
            prop: 'totalDiscountPrice'
          },
          {
            label: '风险系数',
            prop: 'riskRate',
            customStyle: 'background-color: replace-riskRateColor' // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '操作',
            minWidth: 150,
            fixed: 'right',
            align: 'center',
            component: Btn, // 'el-button'
            listeners: {
              'edit' (data) {
                that.optionData = data;
                that.projectId = data.id;
                that.showImportDialog = true;
              },
              'delete' (data) {
//                that.customStyle = 'width: 400px !important; height: 234px !important;';
                that.optionData = data;
                that.deleteMessage = '确定删除项目' + data.projectNo + '吗？';
                that.showDeleteDialog = true;
              },
              'audit' (data) {
                that.optionData = data;
//                that.customStyle = 'width: 400px !important; height: 234px !important;';
                that.showAuditDialog = true;
              },
              // 执行项目
              execute (data) {
                // that.projectId = data.id;
                that.projectId = data.id;
                that.version = data.version;
                that.showPerformDialog = true;
              },
              // 赎回项目
              redeem (data) {
                that.projectId = data.id;
                that.performDate = data.performDate;
                that.showRedeemDialog = true;
              },
              // 委托处置项目
              disposal(data) {
                that.projectId = data.id;
                that.showEntrustAssetDialog = true;
              }
            },
            propsHandler: function ({ row, col, column }) {
              return {row, col, column};
            }
          }
        ],
        columns_back: [
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
            customStyle: 'color: #fdfe1f' // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '资产总额',
            prop: 'totalPrice'
          },
          {
            label: '申报折率',
            prop: 'discountRate'
          },
          {
            label: '折后总价',
            prop: 'totalDiscountPrice'
          },
          {
            label: '建议折率',
            prop: 'adviceRateString',
            customStyle: 'color: #e5962e'
          },
          {
            label: '风险系数',
            prop: 'riskRate',
            customStyle: 'background-color: replace-riskRateColor' // 自定义的样式，每个属性值用后端返回的颜色值字段名+前缀‘replace-’代替，如果不是用后端返回的属性值则直接用正确的属性值
          },
          {
            label: '操作',
            minWidth: 150,
            fixed: 'right',
            align: 'center',
            component: Btn, // 'el-button'
            listeners: {
              'edit' (data) {
                that.optionData = data;
                that.projectId = data.id;
                that.showImportDialog = true;
              },
              'delete' (data) {
//                that.customStyle = 'width: 400px !important; height: 234px !important;';
                that.optionData = data;
                that.deleteMessage = '确定删除项目' + data.projectNo + '吗？';
                that.showDeleteDialog = true;
              },
              'audit' (data) {
                that.optionData = data;
//                that.customStyle = 'width: 400px !important; height: 234px !important;';
                that.showAuditDialog = true;
              },
              // 执行项目
              execute (data) {
                that.projectId = data.id;
                that.version = data.version;
                that.showPerformDialog = true;
              },
              // 赎回项目
              redeem (data) {
                that.projectId = data.id;
                that.showRedeemDialog = true;
              },
              // 委托处置项目
              disposal(data) {
                that.projectId = data.id;
                that.showEntrustAssetDialog = true;
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
          '执行日期': {minWidth: 110, sortable: true, component: EgridCellView},
          '剩余天数': {minWidth: 110, sortable: true, component: EgridCellView},
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
              let needWaring = row.status === 5 && row.leftDays <= 3; // 判断是否是存续中且剩余天数小于等于3天的项目
              row.normal = row.status !== 1 && row.status !== 7 && !needWaring; // 根据项目状态判断是否使用正常的样式
              col.differProp = 'status';
              row.statusColor = row.status === 7 ? '#e63453' : '#fdfe1f'; // 如果是已逾期的订单则颜色改成红色
              col.customStyle = 'color: replace-statusColor';
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
            minWidth: 220,
            align: 'left',
            sortable: false
            // 定义表格列如何渲染, 用showOverflowTooltip: true代替
//            component: LongContentCol // 列内容过长内容展示组件（设置超出部分隐藏，鼠标移上去显示全部）
          }
        },
        // columnsProps 用于定义所有 columns 公共的属性，
        // 这里属性可以参考这里： http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
        columnsProps: {
          height: 30,
          minWidth: 120,
          align: 'center',
          sortable: true, // 是否排序
          showOverflowTooltip: true
        },
        baseProductColumns: [
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
            prop: 'tradeVolume'
          },
          {
            label: '资产原值(总价)',
            prop: 'totalValue'
          },
          {
            label: '申报折率',
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
          '风险系数': {minWidth: 120, component: EgridCellView},
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
          showOverflowTooltip: true
        },
        productData: [
        ],
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
          '编码': {minWidth: 100, sortable: true},
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
          '编码': {minWidth: 100, sortable: true},
          '产品': {minWidth: 120, sortable: false},
          '主标准': {minWidth: 80, sortable: false},
          '二维标准': {minWidth: 100, sortable: false},
          '待赎数量KG': {minWidth: 130, sortable: true},
          '待赎资产': {minWidth: 110, sortable: true}
        },
        projectUrl: 'malisk/client/project/projectList', // 项目库/资产库url地址
        projectId: null, // 项目ID
        version: null, // 项目version
        searchValue: null, // 搜索项目编号、客户和冷库关键字
        assetType: null, // 从首页资产管理点击跳转传值，1：资产列表，2：临期订单，3逾期订单，4：高风险订单
        status: null, // 筛选状态
        tradeType: null, // 筛选业务类型
        pageIndex: 0,
        noMore: false,
        listTotal: 30,
        showImportDialog: false, // 是否显示导入项目对话框
        showAuditDialog: false, // 是否显示审核项目对话框
        showDeleteDialog: false, // 是否显示删除项目对话框
        optionData: null, // 暂存编辑/审核/删除操作的数据
        customStyle: 'width: 400px !important; height: 234px !important;', // 审核/删除项目对话框样式
        deleteMessage: null, // 删除项目message
        auditStatus: 4, // 项目审核状态
        showRcover: false, // 是否显示回收站
        showPerformDialog: false, // 执行对话框
        showEntrustAssetDialog: false, // 委托处置对话框
        showEntrustSuccessDialog: false, // 委托成功对话框
        showRedeemDialog: false, // 赎单对话框
        redeemRecordList: false, // 赎单记录
        toRedeemRecordList: null, // 待续单记录
        productOrRedeemOption: 1, // 产品或者赎单选项卡 1 产品显示 2 赎单记录显示
        performDate: ''  // 执行日期
      };
    },
    created () {
      that = this;
      // that.getData(); // TODO 先注释掉
      that.$pcBus.$on('reFresh', function(page) {
        if (page.path === 'projectIndex') {
          that.searchValue = ''; // 清除搜索框的内容
          that.$refs.search.searchValue = null; // 清除搜索框的内容
          that.$refs.search.isShowClear = false; // 不显示右边的X
          that.tradeType = null; // 刷新清除筛选条件
          that.status = null; // 刷新清除筛选条件
          that.$refs.projectTable.clearFilter(); // 刷新清除筛选条件
          that.projectData = [];
          that.allData = null;
          that.getData();
        }
      });
      // 注册控制回收站显示的回调函数
      that.$pcBus.$on('show-recover', function(isRcover) {
        // console.log('show-recover-------------------isRcover: ' + isRcover);
        if (!isRcover) { // 退出回收站刷新数据
          that.getData();
        }
        that.showRcover = isRcover;
      });
      this.rs();
    },
    mounted () {
      // 默认选中第一条
      this.setCurrent(this.projectData[0]);
    },
    watch: {
      '$route': 'rs'
    },
    computed: {
      // 判断是否是显示项目库
      showProject() {
        return this.fromPage === 2;
      },
      showAsset() {
        return this.fromPage === 1;
      },
      // 根据fromPage类型计算项目列表需要展示的列数据
      columns() {
        let columns = [].concat(this.baseColumns.slice(0, 9));
        console.log('befer ----- this.showAsset: ' + this.showAsset + ' this.showProject: ' + this.showProject);
        let affterColumns = [].concat(this.baseColumns.slice(9, this.baseColumns.length));
        let diffColumns = null;
        // 资产管理
        if (this.showAsset) {
          columns.splice(1, 1, {label: '执行日期', prop: 'performDate'}); // 替换第二列列属性
          columns.splice(7, 1, {label: '执行折率', prop: 'performRateString'}); // 替换第八列列属性
          // 限产管理多出的列
          diffColumns = [
            {
              label: '待赎资产',
              prop: 'leftAmount'
            },
            {
              label: '融资天数',
              prop: 'tradeDays'
            },
            {
              label: '剩余天数',
              prop: 'leftDays'
            }
          ];
          // console.log('---------showAsset ----- columns: ' + JSON.stringify(columns));
        }
        // 项目库
        if (this.showProject) {
          diffColumns = [
            {
              label: '建议折率',
              prop: 'adviceRateString',
              customStyle: 'color: #e5962e'
            }
          ];
        }
        if (diffColumns) {
          columns = columns.concat(diffColumns);
        }
        columns = columns.concat(affterColumns);
        return columns;
      },
      // 根据fromPage类型计算产品列表需要展示的列数据
      productColumns() {
        let columns = [].concat(this.baseProductColumns);
        console.log('befer ----- this.showAsset: ' + this.showAsset + ' this.showProject: ' + this.showProject);
        // let affterColumns = [].concat(this.baseColumns.slice(9, this.baseColumns.length));
        // let diffColumns = null;
        // 资产管理
        if (this.showAsset) {
          columns.splice(6, 1); // 替换第十列列属性
          columns.splice(10, 1, {label: '执行折率', prop: 'discountRateString'}); // 替换第十列列属性
          // console.log('---------showAsset ----- columns: ' + JSON.stringify(columns));
        }
        // columns = columns.concat(affterColumns);
        return columns;
      }
    },
    activated() {
      // this.rs();
    },
    methods: {
      // 监控请求地址变化
      rs() {
        let that = this;
        that.fromPage = parseInt(that.$route.query.fromPage);
        console.log('-------that.$route.query: ' + JSON.stringify(that.$route.query));
        this.assetType = that.$route.query.assetType;
        that.showRcover = false;
        if (that.fromPage === 2) {
          that.productOrRedeemOption = 1;
          that.projectUrl = 'malisk/client/project/projectList';
        } else if (that.fromPage === 1) {     // 资产管理页面
          that.projectUrl = 'malisk/client/asset/assetList';
          that.assetType = 1;
        }
        var assetType = parseInt(that.$route.query.assetType); // 判断是否通过首页跳转
        if (assetType) {
          that.assetType = assetType; //  2：临期订单，3逾期订单，4：高风险订单
        }
        that.getData(); // TODO 先注释掉
      },
      /**
       * 请求接口获取项目数据
       */
      getData() {
        let that = this;
        let param = {};
        param = {
          assetType: this.assetType,
          name: this.searchValue
        };
        // console.log('getData--------: param: ' + param);
        this.ajax({
          url: this.projectUrl,
          data: param,
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            // console.log('getData--------: res: ' + JSON.stringify(res));
            if (that.fromPage === 2) { // 项目库
              that.allData = res.result;
            } else { // 资产管理
              that.allData = res.result.assetListVos;
              that.periodCount = res.result.periodCount;
              that.overDueCount = res.result.overDueCount;
              that.highRiskCount = res.result.highRiskCount;
              that.allCount = res.result.allCount;
            }
            var id = that.$route.query.id;  // 判断是否首页跳转过来的页面
            if (id) {  //  如果ID不为空，需定位行
              for (var i = 0; i < that.allData.length; i++) {
                if (id.toString() === that.allData[i].id.toString()) {
                  that.setCurrent(that.allData[i]);  // 列表行的定位
                  setTimeout(function () {
                    var element = document.getElementsByClassName('el-table__row current-row')[0]; // 获取当前行
                    if (element) {
                      element.scrollIntoView({behavior: 'instant', block: 'center', inline: 'center'});  // 居中显示
                    }
                  }, 1000);
                }
              }
            } else {
              if (this.allData) {
                this.setCurrent(this.allData[0]);// 默认定位第一行
              }
            }
            if (that.allData) {
              that.listTotal = that.allData.length;
            }
            that.projectData = that.listTotal > 20 ? that.allData.slice(0, 20) : that.allData;
            that.productData = [];  // 刷新数据清除选中项目的产品数据
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
        this.$refs.projectTable.setCurrentRow(row);
      },
      /**
       * 选中行的回调函数
       */
      handleCurrentChange(currentRow, oldCurrentRow) {
        console.log('handleCurrentChange-----: ' + JSON.stringify(currentRow));
        if (!currentRow) {
          return;
        }
        this.currentRow = currentRow;
        this.getProductData(currentRow);
        if (that.fromPage === 1) {
          this.getRedeem(currentRow);  // 获取赎单记录
        }
      },
      // 表格单元格点击事件响应函数
      cellClick(row, column, cell, event) {
        if (column.property === 'ownerName' && row.isOwnerStatus === 2) { // 跳转到用户详情
          this.$router.push({path: '/skclient/gradeIndex', query: {ownerId: row.ownerId, controlwner: true}});
        }
        if (column.property === 'storageName' && row.isStorageStatus === 2) { // 跳转到冷库详情
          this.$router.push({path: '/skclient/gradeIndex', query: {storageId: row.storageId, controlstorage: true}});
        }
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
      addProject() {
        this.showImportDialog = true;
      },
      // 导出仓单数据
      exportData() {
        var url = '';
        var fileNameStart = '';
        if (that.fromPage === 1) { // 资产管理导出
          url = 'malisk/client/asset/exportAsset';
          fileNameStart = '资产';
        } else if (that.fromPage === 2) { // 项目管理导出
          url = 'malisk/client/project/exportProject';
          fileNameStart = '项目';
        }
        let param = { // 查询数据的参数
          name: this.searchValue,
          status: this.status,
          tradeType: this.tradeType
        };
        this.exportFile({type: 'POST',
          url: url,
          data: param,
          loading: true,
          fileNameStart: fileNameStart
        });
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
       * 确认导入项目
       **/
      confirmImport() {
        let importdata = this.$refs.importProject.projectForm;
        if (validate.stringIsNullOrEmpty(importdata.ownerId) && validate.stringIsNullOrEmpty(importdata.ownerName)) {
          this.errorTip('请填写客户!');
          return;
        }
        if (validate.stringIsNullOrEmpty(importdata.tradeType)) {
          this.errorTip('请选择业务类型!');
          return;
        }
        if (validate.stringIsNullOrEmpty(importdata.storageId) && validate.stringIsNullOrEmpty(importdata.storageName)) {
          this.errorTip('请填写冷库!');
          return;
        }
        if (validate.stringIsNullOrEmpty(importdata.tradeDays) && importdata.tradeDays !== 0) {
          this.errorTip('请填写融资天数!');
          return;
        }
        importdata.tradeDays = Number(importdata.tradeDays);
        if (importdata.tradeDays > 1000 || importdata.tradeDays <= 1) {
          this.errorTip('融资天数应是大于1且小于1000的整数!');
          return;
        }
        let productList = this.$refs.importProject.productList;
        let len = productList.length;
        importdata.projectProductDtos = [].concat(productList);
        let pass = true;
        for (let i = 0; i < len; i++) {
          let product = productList[i];
          if ((validate.stringIsNullOrEmpty(product.marketDataNo)) &&
            validate.stringIsNullOrEmpty(product.tradeUnitPrice) &&
            validate.stringIsNullOrEmpty(product.tradeVolume) && validate.stringIsNullOrEmpty(product.discountRate)) {
            let index = importdata.projectProductDtos.indexOf(product);
            importdata.projectProductDtos.splice(index, 1);
            continue;
          }
          if (validate.stringIsNullOrEmpty(product.marketDataNo)) {
            pass = false;
//            this.message('请填写产品', 'error', true);
            this.errorTip(validateTips.FILL_PRODUCT_DATA);
            break;
          }
          if (validate.stringIsNullOrEmpty(product.tradeUnitPrice) || product.tradeUnitPrice === 0) {
            pass = false;
//            this.message('请填写产品数量', 'error', true);
            this.errorTip(validateTips.FILL_PRODUCT_DATA);
            break;
          }
          if (validate.stringIsNullOrEmpty(product.tradeVolume) || product.tradeVolume === 0) {
            pass = false;
//            this.message('请填写产品重量', 'error', true);
            this.errorTip(validateTips.FILL_PRODUCT_DATA);
            break;
          }
          if (validate.stringIsNullOrEmpty(product.discountRate) || product.discountRate === 0) {
            pass = false;
//            this.message('请填写产品重量', 'error', true);
            this.errorTip(validateTips.FILL_PRODUCT_DATA);
            break;
          }
        }
        if (importdata.projectProductDtos.length <= 0) { // 判断产品列表数据是否是empty
          pass = false;
          this.errorTip(validateTips.FILL_PRODUCT_DATA);
        }

        if (!pass) {
          return;
        }
        // 调用接口提交数据给服务端
        this.ajax({
          url: 'malisk/client/project/addProject',
          data: importdata,
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.$infoTip(importdata.id ? '项目编辑成功' : '项目录入成功', 'white');
              that.getData(); // 重新加载数据
              that.projectId = null;
              that.showImportDialog = false;
            } else {
              that.errorTip(res.message);
            }
          }
        });
      },
      /**
       * 确认删除项目
       **/
      confirmDelete() {
        let that = this;
        // 调用接口提交数据给服务端
        this.ajax({
          url: '/malisk/client/project/deleteProject',
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
              that.successTip('删除成功');
              that.getData(); // 重新加载数据
              that.showDeleteDialog = false;
            } else {
              that.errorTip(res.message);
            }
          }
        });
      },
      /**
       * 确认审核项目
       **/
      confirmAudit() {
        // 调用接口提交数据给服务端
        this.ajax({
          url: 'malisk/client/project/auditProject',
          data: {
            id: this.optionData.id,
            status: this.auditStatus,
            version: this.optionData.version
          },
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.getData(); // 重新加载数据
              that.successTip('审核完成');
              that.showAuditDialog = false;
            } else {
              that.errorTip(res.message);
            }
          }
        });
      },
      // 取消并关闭dialog
      closeDialog() {
        this.projectId = null;
        this.auditStatus = 4; // 审核提示框默认审核状态
        this.showImportDialog = false;
        this.showDeleteDialog = false;
        this.showAuditDialog = false;
        this.showRedeemDialog = false;
        this.showEntrustSuccessDialog = false;
        this.showEntrustAssetDialog = false;
        this.showPerformDialog = false;
      },
      /**
       * 审核项目状态发生变化时的回调函数
       * @param value 审核选择的状态值
       */
      auditChange(value) {
        this.auditStatus = value;
      },
      /**
       * 确定执行
       **/
      confirmPerform() {
        let that = this;
        if (validate.stringIsNullOrEmpty(that.$refs.perform.performDate)) {
          that.errorTip(validateTips.DATE_IS_EMPTY);
          return false;
        }
        var param = {
          id: that.projectId,
          performDate: that.$refs.perform.performDate,
          version: that.version
        };
        that.ajax({
          url: 'malisk/client/asset/performAsset',
          data: param,
          loading: true,
          type: 'POST',
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.successTip(validateTips.EXECUTE_SUCCESSFULLY);
              that.showPerformDialog = false;
              that.getData(); // 重新加载数据
            }
          }
        });
      },
      /**
       * 确定委托处置
       **/
      confirmEntrustAsset() {
        let that = this;
        that.ajax({
          url: '/malisk/client/asset/entrustAsset/' + that.projectId,
          loading: true,
          type: 'GET',
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.successTip(validateTips.ENTRUST_SUCCESSFULLY);
              that.showEntrustAssetDialog = false;
              that.showEntrustSuccessDialog = true;
              // that.getData(); // 重新加载数据
            }
          }
        });
      },
      /**
       * 确定赎单处置
       **/
      confirmRedeem() {
        let that = this;
        var allData = that.$refs.redeem.allData; // 获取数据
        var redeemDate = that.$refs.redeem.redeemDate;
        if (validate.stringIsNullOrEmpty(redeemDate)) {
          that.errorTip(validateTips.REDEM_DATE_IS_EMPTY);
          return false;
        }
        if (!that.comparingDate(redeemDate, that.performDate)) {  // 赎单日期应该大于等于执行日期
          that.errorTip(validateTips.REDEM_PERFORM_DATE_IS_EMPTY);
          return false;
        }
        var listData = [];
        var redeemVolumeTag = 0;
        for (var i = 0; i < allData.productListVos.length; i++) {
          if (allData.productListVos[i].redeemVolume) {
            var obj = {
              productId: allData.productListVos[i].id,
              marketDataNo: allData.productListVos[i].marketDataNo,
              redeemAmount: allData.productListVos[i].redeemAmount,
              redeemVolume: allData.productListVos[i].redeemVolume,
              leftVolume: allData.productListVos[i].leftVolume
            };
            listData.push(obj);
            redeemVolumeTag = 1;
          }
        }
        if (redeemVolumeTag === 0) {
          that.errorTip(validateTips.REDEM_CONTENT_IS_EMPTY);
          return false;
        }
        var params = {
          id: that.projectId,
          redeemDate: redeemDate,
          version: allData.version,
          productDtos: listData
        };
        that.ajax({
          url: 'malisk/client/asset/redeemAsset',
          data: params,
          loading: true,
          type: 'POST',
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            if (res.code === 200) {
              that.successTip(validateTips.REDEM_ENTRY_SUCCESSFULLY);
              that.showRedeemDialog = false;
              that.getData(); // 重新加载数据
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
      /*
      // 判断两个日期大小
      //params data1 赎单日期，data2 执行日期
       */
      comparingDate(data1, data2) {
        var data1Str = new Date(data1);
        var data1StrFormat = data1Str.getTime(data1Str);
        var data2Str = new Date(data2);
        var data2StrFormat = data2Str.getTime(data2Str);
        if (data1StrFormat < data2StrFormat) {
          return false;
        }
        return true;
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
  .page-project .egrid-class-pdding10 {
    background-color: #181d29;
    padding: 0 0px 10px;
  }
  .page-project .margin-5 {
    margin-right: 5px;
  }

  .page-project .margin-left-20 {
    margin-left: 20px;
  }
  .page-project .color-fdfe1f {
    color: #fdfe1f;
  }
  .page-project .color-e63453 {
    color: #e63453;
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

  .page-project .el-table__body tr.current-row > td {
    background: #252a36 !important;
  }
  .sk .page-project .el-table__body tr.hover-row>td {
     background: #252a36 !important;
  }
  .sk .page-project .el-table--enable-row-hover .el-table__body tr.hover-row:hover > td {
    background: #252a36 !important;
  }
</style>
