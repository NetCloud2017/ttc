<template>
  <div>
    <el-form :inline="true" :model="shippingForm" ref="shippingForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="receiverMobileNo">
          <el-input v-model.trim="shippingForm.receiverMobileNo" clearable class="pc-input3-col5" placeholder="收货人手机号"></el-input>
        </el-form-item>
        <el-form-item label="" prop="receiverName">
          <el-input v-model.trim="shippingForm.receiverName" clearable class="pc-input3-col5" placeholder="收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button @click="resetFromFn('shippingForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="index" label="序号" min-width="65"></el-table-column>
      <el-table-column prop="receiverName" label="收货人" min-width="100"> </el-table-column>
      <el-table-column prop="receiverZipCode" label="收货人邮编" min-width="100"></el-table-column>
      <el-table-column prop="receiverZipCode" label="收货人地址" min-width="300">
        <template slot-scope="scope">
          {{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.streetName}}/{{scope.row.detailAddress}}
        </template>
      </el-table-column>
      <el-table-column prop="defaultAddress" label="是否默认地址" min-width="150">
        <template slot-scope="scope">
          {{scope.row.defaultAddress | getDefaultAddressName}}
        </template>
      </el-table-column>
      <el-table-column prop="receiverMobileNo" label="收货人手机号" min-width="150"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" min-width="150"></el-table-column>
    </el-table>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryShippingList" :queryData="shippingForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
  </div>
</template>
<script>
  //  import Bus from 'src/vueBus.js';
  import PcPagination from 'components/form/pagination';
  export default {
    data () {
      return {
        shippingForm: {
          status: '',
          shippingCode: '',
          shippingName: ''
        },
        statusOption: [{
          value: 1,
          label: '启用'
        }, {
          value: 2,
          label: '禁用'
        }],
        tableData: [],
        emptyText: '',
        currentPage: 5,
        pageUrl: {
          queryShippingList: '/omc/shipping/queryShippingListWithPage'
        }
      };
    },
    components: {
      PcPagination
    },
    filters: {
      getDefaultAddressName(state) {
        let statusName = '';
        switch (state) {
          case 0: {
            statusName = '是';
            break;
          }
          case 1: {
            statusName = '否';
            break;
          }
        }
        return statusName;
      }
    },
    methods: {
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      }
    }
  };
</script>
