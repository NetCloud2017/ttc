<template>
  <div class="page-import-project sk-table-no-scrollbar-y">
    <div class="baseDiv">
      <el-form :model="projectForm" ref="projectForm" class="projectForm">
        <el-form-item label="客户" prop="ownerName">
          <search-select style="width: 260px" :disabledSelect="disableSelect" :inputValue="projectForm.ownerName"
                         httpType="POST"
                         v-model="projectForm.ownerName" :params="searchparams" @blur="handleBlur"
                         :url="'malisk/client/owner/listOwner'" labelKey="ownerName" valueKey="id"
                         :queryParam="queryParam" queryKey="ownerName" @changeSelect="handleSelect"></search-select>
        </el-form-item>
        <el-form-item class="el-form-item-right" label="业务类型" prop="tradeType">
          <el-select style="width: 260px !important" v-model="projectForm.tradeType" placeholder="选择订单状态"
                     class="pc-input3-col5">
            <el-option v-for="item in tradeTypeOption" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冷库" prop="storageName">
          <search-select style="width: 260px" :disabledSelect="disableSelect" :inputValue="projectForm.storageName"
                         httpType="POST"
                         v-model="projectForm.storageName" :params="storeageparams" @blur="handleStorageBlur"
                         :url="'malisk/client/storage/listStorage'" labelKey="storageName" valueKey="id"
                         :queryParam="queryStoreageParam" queryKey="storageName"
                         @changeSelect="handleStorageSelect"></search-select>
        </el-form-item>
        <el-form-item class="el-form-item-right" label="融资天数" prop="tradeDays">
          <el-input maxlength="4" @keyup.native="verifyInteger(projectForm, 'tradeDays')"
                    v-model="projectForm.tradeDays" placeholder="请填写" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table class="product-table importFomfix" border :header-cell-style="getHeaderCellClass" :data="productList" height="183"
              style="width: 100%;" :summary-method="getSummaries">
      <el-table-column prop="mainProductName" label="产品" v-bind:width="100">
        <template slot-scope="scope">
          <span class="product-name-class" @click="showSelect($event, scope.$index, productList)">{{scope.row.mainProductName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mainStandard" label="主标准" show-overflow-tooltip v-bind:width="100">
      </el-table-column>
      <el-table-column prop="subStandard" label="二级标准" show-overflow-tooltip v-bind:width="100">
      </el-table-column>

      <el-table-column prop="tradeUnitPrice" label="单价(RMB)" v-bind:width="90">
        <template slot-scope="scope">
          <el-input maxlength="10" size="mini" v-model="scope.row.tradeUnitPrice"
                    @blur="calculate(scope.row, 'tradeUnitPrice')"
                    @keyup.native="verifyDecimal(scope.row, 'tradeUnitPrice')"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="tradeVolume" label="数量(KG)" v-bind:width="80">
        <template slot-scope="scope">
          <el-input maxlength="10" @keyup.native="verifyDecimal(scope.row, 'tradeVolume')" size="mini"
                    v-model="scope.row.tradeVolume" @blur="calculate(scope.row, 'tradeVolume')"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="总价" v-bind:width="120">
        <template slot-scope="scope">
          <span>{{scope.row.totalPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discountRate" label="申报折率(%)" v-bind:width="95">
        <template slot-scope="scope">
          <el-input maxlength="7" size="mini" v-model="scope.row.discountRate"
                    @keyup.native="verifyRate(scope.row, 'discountRate')"
                    @blur="calculate(scope.row, 'discountRate')"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="discountPrice" label="折后单价" show-overflow-tooltip v-bind:width="80">
        <template slot-scope="scope">
          <span>{{scope.row.discountPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discountTotalPrice" label="折后总价" show-overflow-tooltip v-bind:width="100">
        <template slot-scope="scope">
          <span>{{scope.row.discountTotalPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" v-bind:width="60">
        <template slot-scope="scope">
          <el-button v-if="scope.$index == 0" @click.native.prevent="addRow(productList)" type="text"
                     class="icon maliiconfont maliicon-img_comm_plus icon_right"
                     size="small">
          </el-button>
          <el-button v-else @click.native.prevent="deleteRow(scope.$index, productList)" type="text"
                     class="icon maliiconfont maliicon-img_comm_reduce icon_right"
                     size="small">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="margin-top-20">
      <span>合计数量：{{totalWeight}}</span>
      <span class="margin-left-20">合计总价：{{totalAmount}}</span>
      <span class="margin-left-20">合计折后总价：{{amount}}</span>
    </div>
    <multi-select v-if="showMultiSelect" :data="productData" :position="position"
                  @close="showMultiSelect = false" @selected="getResult">

    </multi-select>
  </div>
</template>
<script type="text/ecmascript-6">
  import multiSelect from '@/components/multi-select/multiSelect';
  import searchSelect from 'components/search-select/searchSelect';
  import maValidate from 'utils/common-method/validate/index';
  // import {validateTips} from 'utils/tips';
  export default {
    components: {
      multiSelect,
      searchSelect
    },
    props: {
      id: [String, Number] // 编辑项目的ID
    },
    data() {
      return {
        projectForm: {
          id: this.$props.id, // 项目ID
          marketDataNo: null, // 行情数据编号(即产品唯一编号) ,
          ownerId: null, // 货权主体ID ,
          ownerName: null, // 货权主体名称 ,
          ownerNo: null, // 货权主体代码 ,
          projectProductDtos: [], // (Array[项目录入dto], optional): 项目产品
          status: null, // 审核状态 ,
          storageId: null, // 冷库主体ID ,
          storageName: null, // 冷库主体名称 ,
          storageNo: null, // 冷库主体代码 ,
          tradeDays: null, // 融资天数 ,
          tradeType: null, // 业务类型(1.现货质押 2.贸易融资 3.商贸模式) ,
          version: null // 项目版本号
        },
        searchparams: [
          {
            title: '公司名称',
            key: 'ownerName',
            style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '联系人',
            key: 'contactName',
            style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '联系人电话',
            key: 'contactPhone',
            style: 'float: left; width: 10rem; color: #8492a6; font-size: 13px; text-align: right'
          }
        ],
        storeageparams: [
          {
            title: '公司名称',
            key: 'storageName',
            style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '联系人',
            key: 'contactName',
            style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '联系人电话',
            key: 'contactPhone',
            style: 'float: left; width: 10rem; color: #8492a6; font-size: 13px; text-align: right'
          }
        ],
        queryParam: { // 搜索数据参数
          ownerName: ''
        },
        queryStoreageParam: { // 搜索数据参数
          storageName: ''
        },
        tradeTypeOption: [ // 业务类型(1.现货质押 2.贸易融资 3.商贸模式) ,
          {
            value: 1,
            label: '现货质押'
          },
          {
            value: 2,
            label: '贸易融资'
          },
          {
            value: 3,
            label: '商贸模式'
          }
        ],
        // 产品列表
        productList: [
          {
            id: null, // 项目产品id ,
            tradeUnitPrice: null, // 交易单价(KG) ,
            tradeVolume: null, // 交易数量(KG) ,
            discountPrice: null, // 折后单价 ,
            discountRate: null, // 申报折率(例:12.34%=0.1234) ,
            discountTotalPrice: null, // 折后总价 ,
            mainProductName: null, // 产品 ,
            mainStandard: null, // 主标准 ,
            mainStandardCountry: null, // 主标准国家 ,
            mainStandardPlant: null, // 主标准厂号 ,
            marketDataNo: null, // 行情数据编号(即产品唯一编号) ,
            subProductName: null, // 二级标准 ,
            subStandard: null, // 二级标准 ,
            totalPrice: null // 总价
          },
          {
            id: null, // 项目产品id ,
            tradeUnitPrice: null, // 交易单价(KG) ,
            tradeVolume: null, // 交易数量(KG) ,
            discountPrice: null, // 折后单价 ,
            discountRate: null, // 申报折率(例:12.34%=0.1234) ,
            discountTotalPrice: null, // 折后总价 ,
            mainProductName: null, // 产品 ,
            mainStandard: null, // 主标准 ,
            mainStandardCountry: null, // 主标准国家 ,
            mainStandardPlant: null, // 主标准厂号 ,
            marketDataNo: null, // 行情数据编号(即产品唯一编号) ,
            subProductName: null, // 二级标准 ,
            subStandard: null, // 二级标准 ,
            totalPrice: null // 总价
          },
          {
            id: null, // 项目产品id ,
            tradeUnitPrice: null, // 交易单价(KG) ,
            tradeVolume: null, // 交易数量(KG) ,
            discountPrice: null, // 折后单价 ,
            discountRate: null, // 申报折率(例:12.34%=0.1234) ,
            discountTotalPrice: null, // 折后总价 ,
            mainProductName: null, // 产品 ,
            mainStandard: null, // 主标准 ,
            mainStandardCountry: null, // 主标准国家 ,
            mainStandardPlant: null, // 主标准厂号 ,
            marketDataNo: null, // 行情数据编号(即产品唯一编号) ,
            subProductName: null, // 二级标准 ,
            subStandard: null, // 二级标准 ,
            totalPrice: null // 总价
          }
        ],
        totalWeight: 0, // 合计数量
        totalAmount: 0, // 合计总价
        amount: 0, // 合计折后总价
        productData: [],
        position: {x: 0, y: 0},
        showMultiSelect: false,
        mulText: [],
        productIndex: 0 // 选择产品的行索引
      };
    },
    computed: {
      disableSelect() {
        console.log('id' + this.id + 'disableSelect: ' + (this.id && this.id !== null));
        return (this.id && this.id !== null);
      }
    },
    mounted() {
      if (this.id) {
        this.getData();
      }
    },
    methods: {
      getData() {
        let that = this;
        // console.log('getData--------: param: ' + param);
        this.ajax({
          type: 'GET',
          url: 'malisk/client/project/projectDetail/' + this.id,
          loading: true,
          success: (res) => {
            setTimeout(() => {
              that.$pcNProgress.done();
            }, 300);
            // console.log('getData--------: res: ' + JSON.stringify(res));
            that.projectForm = res.result;
            that.projectForm.projectProductDtos = res.result.productDetails;
            that.productList = res.result.productDetails;
            that.getTotal();
          }
        });
      },
      // 定义表头的样式
      getHeaderCellClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background: #ffffff; height: 34px; text-align: center !important; color: #1a1a1a !important;';
        } else {
          return '';
        }
      },
      // 搜索下拉选择客户回调函数
      handleSelect(data) {
        console.log('handleSelect------data: ' + JSON.stringify(data));
        if (data) {
          this.projectForm.ownerId = data.id;
          this.projectForm.ownerName = data.ownerName;
          this.projectForm.ownerNo = data.ownerNo;
        } else {
          this.projectForm.ownerId = null;
          this.projectForm.ownerName = null;
          this.projectForm.ownerNo = null;
        }
      },
      // 用户失去焦点后的回调函数
      handleBlur(val) {
        console.log('handleBlur------val: ' + val);
//        console.log('handleBlur------projectForm: ' + JSON.stringify(this.projectForm));
        this.projectForm.ownerName = val;
        this.projectForm.ownerId = null;
        this.projectForm.ownerNo = null;
      },
      // 冷库失去焦点后的回调函数
      handleStorageBlur(val) {
        this.projectForm.storageName = val;
        this.projectForm.storageId = null;
        this.projectForm.storageNo = null;
      },
      // 搜索下拉选择客户回调函数
      handleStorageSelect(data) {
        if (data) {
          this.projectForm.storageId = data.id;
          this.projectForm.storageName = data.storageName;
          this.projectForm.storageNo = data.storageNo;
        } else {
          this.projectForm.storageId = null;
          this.projectForm.storageName = null;
          this.projectForm.storageNo = null;
        }
      },
      // 校验小数
      verifyInteger(val, prop) {
        maValidate.verifyInteger(val, prop);
      },
      // 校验小数
      verifyDecimal(val, prop) {
        maValidate.verifyDecimal(val, prop);
      },
      // 校验申报折率
      verifyRate(val, prop) {
        maValidate.verifyDecimal(val, prop);
        // 如果输入0或非数字和小数点以外的字符且不是0.00时不校验申报折率是否大于0且小于100
        if (maValidate.stringIsNullOrEmpty(val[prop]) || (val[prop].toString().indexOf('0.') !== -1 && val[prop].toString() !== '0.00')) {
          return;
        }
        let rate = Number(val[prop]);
        if (!isNaN(rate) && (rate >= 100 || rate <= 0)) {
          this.errorTip('申报折率应大于0且小于100');
          val[prop] = null;
        }
      },
      /**
       * 输入框失去焦点后计算相应的数据
       * @param row 每一行产品的数据
       * @param prop 列的属性名
       */
      calculate(row, prop) {
        // 当申报折率输入框失去焦点且输入的申报折率为0时校验申报折率是否大于0且小于100
        if (prop === 'discountRate' && row[prop] !== null && row[prop] !== '' && Number(row[prop]) === 0) {
          this.errorTip('申报折率应大于0且小于100');
          row[prop] = null;
        }
        if (row.tradeUnitPrice === null || isNaN(row.tradeUnitPrice)) {
          row.discountPrice = null; // 折后单价 ,
          row.discountTotalPrice = null; // 折后总价 ,
          row.totalPrice = null; // 总价
          this.getTotal();
          return;
        }
        if (row.tradeVolume === null || isNaN(row.tradeVolume)) {
          row.discountTotalPrice = null; // 折后总价 ,
          row.totalPrice = null; // 总价
        } else {
          row.discountTotalPrice = isNaN(row.discountRate) ? null : Number((row.tradeVolume * row.tradeUnitPrice * (row.discountRate / 100)).toFixed(2)); // 折后总价 ,
          row.totalPrice = Number((row.tradeVolume * row.tradeUnitPrice).toFixed(2)); // 总价
          row.totalPrice = this.thousandBitSeparator(row.totalPrice);
        }
        if (row.discountRate === null || isNaN(row.discountRate)) {
          row.discountPrice = null; // 折后单价 ,
          row.discountTotalPrice = null; // 折后总价 ,
        } else {
          row.discountPrice = Number(((row.discountRate / 100) * row.tradeUnitPrice).toFixed(2)); // 折后单价 ,
          row.discountTotalPrice = isNaN(row.discountRate) ? null : Number((row.tradeVolume * row.tradeUnitPrice * (row.discountRate / 100)).toFixed(2)); // 折后总价 ,
          row.discountTotalPrice = this.thousandBitSeparator(row.discountTotalPrice);
        }
        this.getTotal();
        console.log('calculate----row: ' + JSON.stringify(row));
      },
      // 计算总金额、折算总金额、总重量
      getTotal() {
        this.totalAmount = this.getSummaries({prop: 'totalPrice', data: this.productList}); // 计算总价
        this.totalWeight = this.getSummaries({prop: 'tradeVolume', data: this.productList}); // 计算总重量
        this.amount = this.getSummaries({prop: 'discountTotalPrice', data: this.productList}); // 计算折后总价
      },
      // 删除一行产品数据
      deleteRow(index, rows) {
        rows.splice(index, 1);
        this.getTotal();
      },
      // 添加一行产品数据
      addRow(tableData, event) {
        this.productList.push({
          id: null, // 项目产品id ,
          tradeUnitPrice: null, // 交易单价(KG) ,
          tradeVolume: null, // 交易数量(KG) ,
          discountPrice: null, // 折后单价 ,
          discountRate: null, // 申报折率(例:12.34%=0.1234) ,
          discountTotalPrice: null, // 折后总价 ,
          mainProductName: null, // 产品 ,
          mainStandard: null, // 主标准 ,
          mainStandardCountry: null, // 主标准国家 ,
          mainStandardPlant: null, // 主标准厂号 ,
          marketDataNo: null, // 行情数据编号(即产品唯一编号) ,
          subStandard: null, // 二级标准 ,
          totalPrice: null // 总价
        });
      },
      showSelect(e, index, arr) {
        console.log('showSelect-------: ' + index);
        console.log(e);
        this.productIndex = index;
        var x = 20;
        var y = e.clientY + e.layerY + 46;
        this.position.x = x + 'px';
        this.position.y = y + 'px';
        this.productData = arr[index];
        console.log(this.productData);
        this.showMultiSelect = true;
      },
      getResult(res) {
        console.log('getResult-----res: ' + JSON.stringify(res));
        this.showMultiSelect = false;
        this.mulText = res;
        this.productList[this.productIndex].id = null;
        this.productList[this.productIndex].marketDataNo = res.marketDataNo;
        this.productList[this.productIndex].mainProductName = res.mainProductName;
        this.productList[this.productIndex].mainStandard = res.mainStandard;
        this.productList[this.productIndex].subStandard = res.subStandard;
//        this.productList.splice(this.productIndex, 1, res);
      },
      rowClick(row, event, column) {
        console.log(JSON.stringify(row) + ' --event: ' + JSON.stringify(event) + ' column' + JSON.stringify(column));
      },
      // 计算合计值的函数
      getSummaries(param) {
        const { prop, data } = param;
        let sums;
        // 将表格中的每行数字数据相加
//        const values = data.map(item => Number(item[prop].toString().replace(',', '')));
        const values = data.map(item => {
          if (maValidate.stringIsNullOrEmpty(item[prop])) {
            return Number(item[prop]);
          }
          // console.log('item[prop].toString().replace: ' + item[prop].toString().replace(/,/g, '') + ' --item[prop]: ' + item[prop]);
          return Number(item[prop].toString().replace(/,/g, '')); // 替换字符串中所有的"，"
        });
        if (!values.every(value => isNaN(value))) {
          sums = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // 对小数保留两位有效数字，四舍五入
          sums = Number(sums.toFixed(2));
        } else {
        }
        // console.log('getSummaries----sums: ' + sums);
        return this.thousandBitSeparator(sums);
      },
      /**
       * 千位分隔符
       * @param num 待处理的数字
       */
      thousandBitSeparator(num) {
        let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g;
        let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g;
        return num && num.toString().replace(DIGIT_PATTERN, (num) => num.replace(MILI_PATTERN, ','));
      }
    }
  };
</script>
<style>
  .page-import-project {
    background-color: #ffffff;
    width: 100%
  }

  .page-import-project .baseDiv {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    background-color: white

  }

  .page-import-project .baseDiv .el-form-item {
    display: inline-block;
    width: 400px;
    margin-right: 20px;
    margin-bottom: 10px;
  }

  .page-import-project .el-select-dropdown .el-popper {
    width: 260px;
  }

  .page-import-project .baseDiv .el-form-item-right {
    float: right;
  }

  .page-import-project .baseDiv .el-form-item .expect-area {
    width: 100%;
    display: flex;
    flex-wrap: wrap
  }

  .page-import-project .product-table .el-table__body-wrapper {
    background: #ffffff !important;
  }

  .page-import-project .product-table .el-table--small td {
    text-align: center;
    background: #ffffff !important;
  }

  .page-import-project .el-table td {
    background: #ffffff !important;
  }

  .page-import-project .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 2px;
    padding-right: 2px;
  }

  .page-import-project .product-table .el-table th {
    background-color: #fff !important;
  }

  .page-import-project .product-table .el-table--small td {
    padding: 3px 0 !important;
  }

  .page-import-project .product-table .el-table tr {
    background-color: #fff !important;
  }

  .page-import-project .product-table .cell {
    line-height: 20px !important;
    text-align: center !important;
    color: #1a1a1a !important;
  }

  .page-import-project .baseDiv .el-input {
    width: 260px !important;
  }

  .page-import-project .baseDiv .el-popper {
    z-index: 6000 !important;
  }

  .page-import-project .baseDiv .el-popper[x-placement^=bottom] {
    margin-top: 12px;
    width: 260px !important;
    z-index: 6000 !important;
  }

  .page-import-project .product-table .el-input__inner {
    text-align: center !important;
    height: 24px;
    line-height: 24px;
    border-color: #99a3bb;
    border-radius: 2px;
  }

  .page-import-project .goods-title {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    width: 100%;
    margin-top: 20px;
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    background: white
  }

  .page-import-project .projectForm {
    width: 100%;
  }

  .page-import-project .margin-top-20 {
    color: #1a1a1a;
    margin-top: 20px;
  }

  .page-import-project .margin-left-20 {
    margin-left: 20px;
  }

  .page-import-project .product-name-class {
    display: block;
    width: 100%;
    height: 24px;
    line-height: 24px;
    border: 1px #99a3bb solid;
    border-radius: 2px;
  }

  .el-form-item .el-form-item__error {
    /*padding-top: 36px;*/
    /*margin-left: -60px;*/
  }

  .page-import-project .btnFrameClass {
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: center;
  }

  .page-import-project .singleBtnClass {
    width: 140px;
    height: 40px;
  }

  .page-import-project .maliiconfont {
    color: #808080;
  }
  .sk .page-project .page-import-project .product-table.importFomfix .el-table__body tr.hover-row>td {
     background:#fff!important;
  }
</style>
