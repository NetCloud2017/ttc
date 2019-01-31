<template>
  <div class="pc-page-content">
    <el-form :model="productForm" label-width="80px">
      <!--<el-form-item label="文件展示">-->
        <!--<el-carousel indicator-position="outside">-->
          <!--<el-carousel-item v-for="item in this.$props.fileUrlsArray" v-bind:key="item.url">-->
            <!--&lt;!&ndash;组件使用说明 https://www.npmjs.com/package/vue-photo-preview &ndash;&gt;-->
            <!--<img  class="el-have&#45;&#45;picture-card" v-bind:src="item.url"  preview="0" v-bind:preview-text="item.name"/>-->
          <!--</el-carousel-item>-->
        <!--</el-carousel>-->
      <!--</el-form-item>-->
      <el-form-item v-bind:label="this.$props.titleImg">
            <el-upload
              :limit="this.$props.maxImg"
              :headers="token"
              :action="uploadImageUrl"
              :data="this.uploadRequest"
              :file-list="this.$props.fileUrlsArray"
              accept = ".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.pdf,.JPG,.JPEG,.PDF,.bmp,.gif"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-success="checkSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-exceed="handelExceedFn">
              <i class="el-icon-plus"></i>
            </el-upload>
      </el-form-item>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-dialog :visible.sync="pdfVisible">
        <iframe  :src="'/static/pdf/web/viewer.html?file=' + pdfurls" height="560" width="100%">
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
      titleImg: {
        type: String,
        default: '报关单'
      },
      typeImg: { // 来自报关商检
        type: Number,
        default: 1
      },
      fileUrlsArray: {
        type: Array
      }
    },
    data() {
      return {
        pdfurls: '',
        imageList: [],
        imageUrlList: [],
        editor: {},
//        uploadMaxCount: 4,
        token: {Authorization: 'Bearer ' + this.$store.getters.getAccessToken},
//        uploadImageUrl: 'http://upload.malicn.com/uploadFile/',
//        editorUploadImageUrl: 'http://upload.malicn.com/uploadFile/',
        uploadImageUrl: 'http://api.malicloud.net:8080/opc/cos/upload',
        editorUploadImageUrl: 'http://api.malicloud.net:8080/opc/cos/upload',
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
    mounted: function() {
      if ((this.$props.maxImg === 1) && (this.$props.fileUrlsArray.length === 1)) {
        document.querySelector('.el-upload').style.display = 'none';
      } else {
        document.querySelector('.el-upload').style.display = 'inline-block';
      }
    },
    methods: {
      handelExceedFn(files, fileList) {
        this.errorTip(validateTips.UPLOAD_IMG_NUM);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
          this.errorTip(validateTips.IMG_SIZE);
        }
        return isLt2M;
      },
      handlePictureCardPreview(file, $event) {
        this.dialogImageUrl = file.url;
        // let fileExtension = file.response.data.substring(file.response.data.lastIndexOf('.') + 1);
        let fileExtension = file.response.result.attachmentUrl.substring(file.response.result.attachmentUrl.lastIndexOf('.') + 1);
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'JPG' || fileExtension === 'JPEG' || fileExtension === 'png' || fileExtension === 'gif' || fileExtension === 'bmp') {
          this.dialogVisible = true;
          this.pdfVisible = false;
        }
        if (fileExtension === 'pdf') {
          this.pdfVisible = true;
          this.dialogVisible = false;
          this.pdfurls = file.url;
        }
        if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'doc' || fileExtension === 'docx') {
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = this.dialogImageUrl;
          link.setAttribute('download', file.name);
          document.body.appendChild(link);
          link.click();
        }
      },
      checkSuccess(response, file, fileList) {
        if (response.code !== 200) {
          this.errorTip(response.message);
          fileList.splice(fileList.indexOf(file), 1);
          return;
        } else {
          this.successTip(response.message);
        }
        this.imageList = [];
        this.imageUrlList = [];
        this.productForm.attachmentIdList = [];
        let _this = this;
        fileList.forEach((item, index) => {
//          console.info('item:', JSON.stringify(item));
          _this.imageList.push(item);
          _this.imageUrlList.push(file.url);
//          _this.productForm.attachmentIdList.push(item.attachmentId ? item.attachmentId : item.response.result);
        });
        if (this.imageUrlList.length === this.$props.maxImg) {
          document.querySelector('.el-upload').style.display = 'none';
        } else {
          document.querySelector('.el-upload').style.display = 'inline-block';
        };
        this.$emit('getFileUrls', this.$props.typeImg, _this.imageUrlList);
      },
      handleRemove(file, fileList) {
        this.productForm.attachmentIdList = [];
        this.imageList = [];
        this.imageUrlList = [];
        let _this = this;
        fileList.forEach((item) => {
          _this.imageList.push(item);
          _this.imageUrlList.push(file.url);
//          _this.productForm.attachmentIdList.push(item.attachmentId ? item.attachmentId : item.response.result);
        });
        if (this.imageUrlList.length === this.$props.maxImg) {
          document.querySelector('.el-upload').style.display = 'none';
        } else {
          document.querySelector('.el-upload').style.display = 'inline-block';
        };
        this.$emit('getFileUrls', this.$props.typeImg, _this.imageUrlList);
      }
    },
    watch: {
//      imageUrlList() {
//        if (this.imageUrlList.length === this.$props.maxImg) {
//          document.querySelector('.el-upload').style.display = 'none';
//        } else {
//          document.querySelector('.el-upload').style.display = 'inline-block';
//        }
//      }
    }
  };
</script>
<style>
  /*已存在的图片样式*/
  .el-have--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    margin-left: 10px;
    vertical-align: top;
    white-space: nowrap;

  }
</style>
