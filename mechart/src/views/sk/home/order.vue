<template>
  <common title="订单统计" :showSearch="false">
    <div class="orderSection">
      <div class="kindName">
        <div v-for="(i,index) in tableData" :key="index">{{i.typeName}}</div>
      </div>
      <div class="acount">
        <div>{{counts.totalAmount}}</div>
        <div>{{counts.assetCount}}</div>
        <div class="periodCount" @click="gotoAssetManage(2)">{{counts.periodCount}}</div>
        <div class="dangerColor" @click="gotoAssetManage(3)">{{counts.overDueCount}}</div>
        <div class="dangerColor" @click="gotoAssetManage(4)">{{counts.highRiskCount}}</div>
      </div>
    </div>
  </common>
</template>
<script>
import Common from '../market/common';
import {mapState} from 'vuex';
export default {
  data () {
    return {
      tableData: [
        {
          typeName: '资产总额'
        },
        {
          typeName: '资产数量'
        },
        {
          typeName: '临期订单'
        },
        {
          typeName: '预期订单'
        },
        {
          typeName: '高风险订单'
        }
      ]
    };
  },
  methods: {
    gotoAssetManage (query) {
      // 选择接着发给资产管理，让其查询相应的数据；
      this.$router.replace(`/skclient/projectIndex?fromPage=1&assetType=${query}`);
    }
  },
  computed: {
    ...mapState(['skHomeData']),
    counts () {
      return this.skHomeData.assetsManagement;
    }
  },
  components: {
    Common
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.mystyle {
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 1px solid #303541;
}
.orderSection{
  width: 480px;
  height: 146px;
  border-top: 1px solid #303541;
  border-left: 1px solid #303541;
  border-right: 1px solid #303541;
  display: flex;
  .kindName{
    width: 180px;
    border-right: 1px solid #303541;
    & > div{
      .mystyle();
    }
  }
  .acount{
    & > div{
      width: 300px;
      cursor: pointer;
      .mystyle();
    }
    .periodCount{
      color: #fdfe1f;
    }
    .dangerColor{
      color: #e63453;
    }
  }
}
</style>
