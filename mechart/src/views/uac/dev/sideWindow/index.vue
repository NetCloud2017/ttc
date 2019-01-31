<template>
  <div class="block" style="margin-top: 20px">
    <el-button type="text" class="pc-textBtn" @click="openDialog()">打开wms弹出框</el-button>
    <my-dialog :is-show="isShowPayDialog"  title ='测试title' @on-close="hidePayDialog">
      <table class="buy-dialog-table">
        <tr>
          <th>购买数量</th>
          <th>产品类型</th>
          <th>有效时间</th>
          <th>产品版本</th>
          <th>总价</th>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>
            3
          </td>
          <td>5</td>
        </tr>
      </table>
      <div style="height:1200px; width:100%;background:skyblue;">
        sddd
      </div>
      <div>222</div>
      <div style="height:1200px; width:100%;background:skyblue;">
        sddd2
      </div>
      <div>333</div>
      <div style="height:1200px; width:100%;background:skyblue;">
        sddd3
      </div>
      <div>444</div>
    </my-dialog>
  </div>
</template>
<script>
  import Dialog from 'components/dialog';
  export default {
    data() {
      return {
        isShowPayDialog: false
      };
    },
    methods: {
      openDialog() {
        this.isShowPayDialog = true;
      },
      hidePayDialog() {
        this.isShowPayDialog = false;
      }

    },
    components: {
      MyDialog: Dialog
    }
  };
</script>
<style>
</style>
