<template>
  <div>
    <el-button v-if="this.$props.row.markImg.length>0" type="primary" plain @click="viewDetailFn">唛头照片</el-button>
    <el-button v-if="this.$props.row.checkImg.length>0" type="primary" plain @click="viewChoujianDetailFn">抽检照片</el-button>
    <div>
      <pc-dialog :is-show="isShowViewDialog" style="text-align: left" title ='唛头照片详情' @on-close="isShowViewDialog = false">
        <div>
          <view-maitou :headTitle="'提交唛头照片'" :fileType='".jpg,.jpeg,.png,.JPG,.JPEG,.bmp,.gif"' :fileUrlsArray="this.$props.row.markImg" :picTitle="this.$props.row.goodsName" :headSonTitle="'支持pdf,jpg,png,gif,bmp,xls,xlsx,csv,doc,docx'">
          </view-maitou>
        </div>
      </pc-dialog>
      <pc-dialog :is-show="isShowViewCHoujianDialog" style="text-align: left"  title ='抽检照片详情' @on-close="isShowViewCHoujianDialog = false">
        <div>
          <view-maitou :headTitle="'提交抽检照片'" :fileType='".jpg,.jpeg,.png,.JPG,.JPEG,.bmp,.gif"' :fileUrlsArray="this.$props.row.checkImg" :picTitle="this.$props.row.goodsName" :headSonTitle="'支持pdf,jpg,png,gif,bmp,xls,xlsx,csv,doc,docx'">
          </view-maitou>
        </div>
      </pc-dialog>
    </div>
  </div>
</template>

<script>
  import PcDialog from 'components/dialog';
  import viewMaitou from 'src/components/fileUpload/fileViewMaitou.vue';
  export default {
    components: {
      PcDialog,
      viewMaitou
    },
    props: {
      headTitle: {
        type: String
      },
      row: {
        type: Object
      }
    },
    data() {
      return {
        isShowViewDialog: false,
        isShowViewCHoujianDialog: false // 显示抽检
      };
    },
    methods: {
      viewDetailFn() {
        this.isShowViewDialog = true;
        this.isShowViewCHoujianDialog = false;
      },
      viewChoujianDetailFn() {
        this.isShowViewDialog = false;
        this.isShowViewCHoujianDialog = true;
      }
    }
  };
</script>
