<template>
  <div v-if="this.$props.roleType===2&&this.$props.fromType!==1&&this.$props.fromType!==2"  class="frameClass">
    <div class="borderBottom">
      <div class="headTitleClass">
        <span>{{this.$props.headTitle}}</span>
        <div class="headSonTitleClass">
          <span>{{this.$props.headSonTitle}}</span>
        </div>
      </div>
    </div>
    <div class="sonFrameClass">
      <SingleFileContent :titleImg='"入库单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =0 :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.instoreFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"抄码单"' :fileType='".jpg,.jpeg,.png,.pdf,.csv,.xls,.xlsx,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =1 :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.scanFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"报关单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =2 :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.declarationFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"商检单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =3 :maxImg=5   :fileUrlsArray="this.$props.fileUrlsArray.inspectionFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"生产批次单"':fileType='".jpg,.jpeg,.png,.csv,.xls,.xlsx,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =4 :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.batchFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
    </div>
  </div>
  <div v-else-if="this.$props.roleType===3&&this.$props.fromType!==2"  class="frameClassOwner">
    <div class="borderBottom">
      <div class="headTitleClass">
        <span>{{this.$props.headTitle}}</span>
        <div class="headSonTitleClass">
          <span>{{this.$props.headSonTitle}}</span>
        </div>
      </div>
    </div>
    <div class="sonFrameClassOwner">
      <SingleFileContent :titleImg='"报关单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :maxImg=5 :queryNum =0   :fileUrlsArray="this.$props.fileUrlsArray.declarationFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"商检单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :maxImg=5 :queryNum =1  :fileUrlsArray="this.$props.fileUrlsArray.inspectionFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"生产批次单"' :fileType='".jpg,.jpeg,.png,.csv,.xls,.xlsx,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :maxImg=5 :queryNum =2  :fileUrlsArray="this.$props.fileUrlsArray.batchFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
    </div>
  </div>
  <div v-else-if="this.$props.roleType===2&&this.$props.fromType===1" class="frameClassOutStore">
    <div class="borderBottom">
      <div class="headTitleClass">
        <span>{{this.$props.headTitle}}</span>
        <div class="headSonTitleClass">
          <span>{{this.$props.headSonTitle}}</span>
        </div>
      </div>
    </div>
    <div class="sonFrameClass">
      <SingleFileContent :titleImg='"出库单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =0 :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.outStoreFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      <SingleFileContent :titleImg='"抄码单"' :fileType='".jpg,.jpeg,.png,.csv,.xls,.xlsx,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum =1 :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.scanFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
    </div>
  </div>
  <div v-else-if="this.$props.fromType===2">
    <div class="frameClassChoujian">
      <div class="borderBottom">
        <div class="headTitleClass">
          <span>{{this.$props.headTitle}}</span>
          <div class="headSonTitleClass">
            <span>{{this.$props.headSonTitle}}</span>
          </div>
        </div>
      </div>
      <div v-for="(item, index) in this.$props.fileUrlsArray.wmsWrGoodsFileList" :key="item.goodsId" class="sonFrameClassChoujian">
        <SingleFileContent   :fromType="2" :titleImg='item.goodsName' :fileType='".jpg,.jpeg,.png,.JPG,.JPEG,.bmp,.gif"' :queryNum = index :maxImg=5  :fileUrlsArray="item.wmsWrFileList"  @getFileUrls="getFileUrls" ></SingleFileContent>
      </div>
    </div>
    <div class="frameClassSuYuan">
      <div class="borderBottom">
        <div class="headTitleClass">
          <span>提交溯源文件</span>
          <div class="headSonTitleClass">
            <span>支持pdf,jpg,png,gif,bmp,xls,xlsx,csv(最多选择5张)</span>
          </div>
        </div>
      </div>
      <div class="sonFrameClassSuYuan">
        <SingleFileContent :titleImg='"报关单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum = this.declarationFilesLength :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.declarationFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
        <SingleFileContent :titleImg='"商检单"' :fileType='".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum = this.inspectionFilesLength :maxImg=5  :fileUrlsArray="this.$props.fileUrlsArray.inspectionFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
        <SingleFileContent :titleImg='"生产批次单"' :fileType='".jpg,.jpeg,.png,.csv,.xls,.xlsx,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"' :queryNum = this.batchFilesLength :maxImg=5 :fileUrlsArray="this.$props.fileUrlsArray.batchFiles"  @getFileUrls="getFileUrls" ></SingleFileContent>
      </div>
    </div>
  </div>
</template>
<script>
  import SingleFileContent from 'components/fileUpload/singleFileContent.vue';
  export default {
    components: {
      SingleFileContent
    },
    props: {
      headTitle: {
        type: String
      },
      headSonTitle: {
        type: String
      },
      roleType: {
        type: Number
      },
      fromType: {
        type: Number  // 1出库 2 资料补全
      },
      fileUrlsArray: {
        type: Object
      }
    },
    data() {
      return {
        declarationFilesLength: 0,
        inspectionFilesLength: 0,
        batchFilesLength: 0
      };
    },
    watch: {
      fileUrlsArray () {
        if (this.fromType === 2) {
          if (this.fileUrlsArray.wmsWrGoodsFileList.length === 0) {
            this.declarationFilesLength = 1;
          } else {
            this.declarationFilesLength = parseInt(this.fileUrlsArray.wmsWrGoodsFileList.length);
          }
          if (this.fileUrlsArray.wmsWrGoodsFileList.length === 0) {
            this.inspectionFilesLength = 2;
          } else {
            this.inspectionFilesLength = parseInt(this.fileUrlsArray.wmsWrGoodsFileList.length + 1);
          }
          if (this.fileUrlsArray.wmsWrGoodsFileList.length === 0) {
            this.batchFilesLength = 3;
          } else {
            this.batchFilesLength = parseInt(this.fileUrlsArray.wmsWrGoodsFileList.length + 2);
          }
        }
      }
    },
    methods: {
      getFileUrls(titleImg, fileNameArray, fileUrlArray) {
        this.$emit('getFileUrls', titleImg, fileNameArray, fileUrlArray);
      }
    }
  };
</script>
<style scoped>
  .borderBottom
  {
    border-bottom: 1px dashed #e3e4e5;
  }
  .frameClass
  {
    width: 958px;
    height: 900px;
    margin-top: 5px;
    background-color: white;
    border: 1px solid #e3e4e5;
  }
  .frameClassOwner
  {
    width: 958px;
    height: 580px;
    margin-top: 10px;
    background-color: white;
    border: 1px solid #e3e4e5;
  }
  .sonFrameClass
  {
    margin-top: 20px;
    margin-left: 20px;
    height: 0px;
    width: 900px;
    background-color: white;
  }
  .sonFrameClassOwner
  {
    padding-top: 18px;
    margin-left: 20px;
    width: 900px;
    height: auto;
    background-color: white;
  }
  .sonFrameClassSuYuan
  {
    padding-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    width: 900px;
    height: auto;
    background-color: white;
  }
  .sonFrameClassChoujian
  {
    margin-left: 30px;
    padding-top: 10px;
    width: 900px;
    height: auto;
    background-color: white;
  }
  .frameClassOutStore
  {
    width: 958px;
    height: 428px;
    margin-top: 10px;
    background-color: white;
    border: 1px solid #e3e4e5;
  }
  .frameClassChoujian
  {
    width: 958px;
    height: auto;
    margin-top: 20px;
    background-color: white;
    border: 1px solid #e3e4e5;
  }
  .frameClassSuYuan
  {
    width: 958px;
    height: auto;
    margin-top: 20px;
    margin-bottom: 40px;
    background-color: white;
    border: 1px solid #e3e4e5;
  }
  .headTitleClass
  {
    margin-left: 20px;
    margin-top: 20px;
    font-size: 14px;
    color: #333333;
  }
  .headTitleClass .headSonTitleClass
  {
    margin-left: 0px;
    margin-top: 10px;
    height: 30px;
    font-size: 12px;
    color: #b2b2b2;
  }
</style>
