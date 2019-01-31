<template>
  <div class="">
    <el-form :model="productForm">
      <div v-if="this.$props.fromType===2">
        <div style="width: 700px;text-align: left">
          {{this.$props.titleImg}}
        </div>
        <div style="min-height: 158px;margin-top: 10px;overflow:hidden">
          <el-upload
            :limit="this.$props.maxImg"
            :headers="token"
            :action="uploadImageUrl"
            :data="this.uploadRequest"
            :file-list="this.$props.fileUrlsArray"
            :accept="this.$props.fileType"
            list-type="picture-card"
            :before-upload="beforeAvatarUpload"
            :on-success="checkSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-progress="handleProcess"
            :on-exceed="handelExceedFn">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
      <div v-else>
        <div v-if="this.$props.titleImg=='入库单' || this.$props.titleImg=='出库单'"
             style="width: 10%;margin-top: 80px;margin-left: -10px">
          <i class="icon maliiconfont maliicon-img_details_required"></i>
          {{this.$props.titleImg}}
        </div>
        <div v-else style="width: 10%;margin-top: 70px;margin-left:-30px;text-align: right">
          {{this.$props.titleImg}}
        </div>
        <div
          style="min-height: 158px;margin-left: 70px;width: 90%;margin-top: -84px;overflow:hidden">
          <div style="margin-top: 5px;">
            <el-upload
              :limit="this.$props.maxImg"
              :headers="token"
              :action="uploadImageUrl"
              :data="this.uploadRequest"
              :file-list="this.$props.fileUrlsArray"
              :accept="this.$props.fileType"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-success="checkSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-progress="handleProcess"
              :on-exceed="handelExceedFn">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
      </div>
      <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
      <el-dialog :append-to-body="true" :visible="pdfVisible" :before-close="handleClosePdf">
        <iframe :src="'/static/pdf/web/viewer.html?file=' + pdfurls" height="560" width="100%">
        </iframe>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
  import {validateTips} from 'utils/tips';
  export default {
    props: {
      maxImg: { // 最大上传个数
        type: Number,
        default: 1
      },
      queryNum: { // 根据这个变量 查找 第几个上传
        type: Number
      },
      titleImg: {
        type: String
      },
      fileType: {
        type: String
      },
      fileUrlsArray: {
        type: Array
      },
      fromType: {
        type: Number
      }
    },
    data() {
      return {
        pdfurls: '',
        imageNameList: [],
        imageUrlList: [],
        editor: {},
//        uploadMaxCount: 4,
        token: {Authorization: 'Bearer ' + this.$store.getters.getAccessToken},
        uploadImageUrl: 'http://upload.malicn.com/uploadFile/',
        dialogImageUrl: '',
        dialogVisible: false,
        pdfVisible: false,
        productForm: {
          status: 1
        },
        uploadRequest: {
//          fileType: 'picture',
//          filePath: 'malicloud/picture/product/',
//          bucketName: 'malicloud-oss-bucket',
//          file_id: 0
        }
      };
    },
    mounted: function () {
      if (((this.$props.maxImg === 1) && (this.$props.fileUrlsArray.length === 1)) || ((this.$props.maxImg === 5) && (this.$props.fileUrlsArray.length === 5)) || ((this.$props.maxImg === 9) && (this.$props.fileUrlsArray.length === 9)) || ((this.$props.maxImg === 10) && (this.$props.fileUrlsArray.length === 10))) {
        document.querySelectorAll('.el-upload')[this.$props.queryNum].style.display = 'none';
      } else {
        document.querySelectorAll(
          '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
      }
    },
    methods: {
      handleClosePdf() {
        this.pdfVisible = false;
      },
      handelExceedFn(files, fileList) {
        this.errorTip(validateTips.UPLOAD_IMG_NUM);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 30;
        if (!isLt2M) {
          this.errorTip(validateTips.IMG_SIZE);
        }
        return isLt2M;
      },
      handlePictureCardPreview(file, $event) {
        this.dialogImageUrl = file.url;
        let fileExtension = '';
        if (file.response == null) {
          fileExtension = file.url.substring(file.url.lastIndexOf('.') + 1);
        } else {
          fileExtension = file.response.data.substring(file.response.data.lastIndexOf('.') + 1);
        }
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'JPG' || fileExtension === 'JPEG' || fileExtension === 'png' || fileExtension === 'gif' || fileExtension === 'bmp') {
          this.dialogVisible = true;
          this.pdfVisible = false;
        }
        if (fileExtension === 'pdf') {
          let link = document.createElement('a');
          link.style.display = 'none';
          window.open(this.dialogImageUrl);
          link.setAttribute('download', file.name);
          document.body.appendChild(link);
          link.click();
        }
        if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'doc' || fileExtension === 'docx' || fileExtension === 'csv') {
          this.exportFileFileType({
            type: 'POST',
            url: '/maliwms/file/downloadFile',
            data: {url: file.url, name: file.name},
            loading: true,
            fileNam: file.name
          });
        }
      },
      checkSuccess(response, file, fileList) {
        document.querySelectorAll(
          '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
        if (response.code !== 0) {
          this.errorTip(response.msg);
          fileList.splice(fileList.indexOf(file), 1);
          return;
        } else {
        }
        this.imageNameList = [];
        this.imageUrlList = [];
        this.productForm.attachmentIdList = [];
        fileList.forEach((item, index) => {
          this.imageNameList.push(item.name);
          if (item.response == null) {
            this.imageUrlList.push(item.url);
          } else {
            this.imageUrlList.push(item.response.data);
          }
        });
        if (this.imageUrlList.length === this.$props.maxImg) {
          document.querySelectorAll('.el-upload')[this.$props.queryNum].style.display = 'none';
        } else {
          document.querySelectorAll(
            '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
        }
        ;
        this.$emit('getFileUrls', this.$props.titleImg, this.imageNameList, this.imageUrlList);
      },
      handleRemove(file, fileList) {
        this.productForm.attachmentIdList = [];
        this.imageNameList = [];
        this.imageUrlList = [];
        fileList.forEach((item) => {
          this.imageNameList.push(item.name);
          if (item.response == null) {
            this.imageUrlList.push(item.url);
          } else {
            this.imageUrlList.push(item.response.data);
          }
        });
        document.querySelectorAll(
          '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
        if (this.imageUrlList.length === this.$props.maxImg) {
          document.querySelectorAll('.el-upload')[this.$props.queryNum].style.display = 'none';
        } else {
          document.querySelectorAll(
            '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
        }
        ;
        this.$emit('getFileUrls', this.$props.titleImg, this.imageNameList, this.imageUrlList);
      },
      handleProcess(event, file, fileList) {
        document.querySelectorAll('.el-upload')[this.$props.queryNum].style.display = 'none';
      }
    },
    watch: {
      imageUrlList() {
        if (this.imageUrlList.length === this.$props.maxImg) {
          document.querySelectorAll('.el-upload')[this.$props.queryNum].style.display = 'none';
        } else {
          document.querySelectorAll(
            '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
        }
      },
      fileUrlsArray() {
        if (((this.$props.maxImg === 5) && (this.$props.fileUrlsArray.length === 5)) || ((this.$props.maxImg === 9) && (this.$props.fileUrlsArray.length === 9)) || ((this.$props.maxImg === 10) && (this.$props.fileUrlsArray.length === 10))) {
          document.querySelectorAll('.el-upload')[this.$props.queryNum].style.display = 'none';
        } else {
          document.querySelectorAll(
            '.el-upload')[this.$props.queryNum].style.display = 'inline-block';
        }
      }
    }
  };
</script>
<style scoped>
  i.icon {
    color: #ff6c2b;
    font-size: 22px;
  }
</style>
