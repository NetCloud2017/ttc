<template>
  <div>
    <el-form ref="orderDetailForm" label-width="80px">
      <el-form-item label="订单号" prop="orderNo">
        {{orderVo.orderNo}}
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        {{orderVo.createTime}}
      </el-form-item>
      <el-form-item label="收件人" prop="receiverName">
        {{orderVo.receiverName}}
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        {{orderVo.status | getOrderStatusName}}
      </el-form-item>
      <el-form-item label="支付方式" prop="stock">
        {{orderVo.paymentTypeDesc}}
      </el-form-item>
    </el-form>
    <el-table :data="orderVo.orderItemVoList" ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="index" label="序号" min-width="65"></el-table-column>
      <el-table-column prop="productName" label="商品信息" min-width="350"></el-table-column>
      <el-table-column prop="currentUnitPrice" label="单价" min-width="200">
        <template slot-scope="scope">
          {{scope.row.currentUnitPrice | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" min-width="150"></el-table-column>
      <el-table-column prop="receiverName" label="小计" min-width="150">
        <template slot-scope="scope">
          {{scope.row.totalPrice | formatMoney}}
        </template>
      </el-table-column>


    </el-table>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        orderVo: {}
      };
    },
    created() {
      this.queryOrderItemVoList();
    },
    methods: {
      queryOrderItemVoList() {
        this.ajax({
          url: `/omc/order/queryUserOrderDetail/` + this.$route.query.orderNo,
          success: (res) => {
            if (res.code === 200) {
              this.orderVo = res.result;
            }
          }
        });
      }
    }
  };
</script>
