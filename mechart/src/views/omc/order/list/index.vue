<template>
  <div>
    <el-form :inline="true" :model="orderForm" ref="orderForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="orderForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="orderNo">
          <el-input v-model.trim="orderForm.orderNo" clearable class="pc-input3-col5" placeholder="订单编码"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button @click="resetFromFn('orderForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="index" label="序号" min-width="65"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="65">
        <template slot-scope="scope">
          {{scope.row.status | getOrderStatusName}}
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="200"></el-table-column>
      <el-table-column prop="payment" label="金额" min-width="150">
        <template slot-scope="scope">
          {{scope.row.payment | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="receiverName" label="收货人" min-width="150"></el-table-column>
      <el-table-column prop="creator" label="创建人" min-width="150"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" min-width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="text" class="pc-textBtn-danger" @click="loadPage('OrderDetail', {orderNo: scope.row.orderNo})">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryOrderList" :queryData="orderForm" @on-query="queryCallBackFn">
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
        orderForm: {
          status: '',
          orderCode: '',
          orderName: ''
        },
        statusOption: [{
          value: 0,
          label: '已取消'
        }, {
          value: 10,
          label: '未付款'
        }, {
          value: 20,
          label: '已付款'
        }, {
          value: 40,
          label: '已发货'
        }, {
          value: 50,
          label: '交易成功'
        }, {
          value: 60,
          label: '交易关闭'
        }],
        tableData: [],
        emptyText: '',
        currentPage: 5,
        pageUrl: {
          queryOrderList: '/omc/order/queryOrderListWithPage'
        }
      };
    },
    components: {
      PcPagination
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
