<template>

  <div v-if="this.$props.isBottom" class="fileContent borderBottom">
      <div class="sonFrameClass">
        <div class="headTitleClass">
          <span>{{this.$props.headTitle}}</span>
        </div>

        <el-upload v-bind:label="this.$props.titleImg"
           :file-list="this.$props.fileUrlsArray"
           :action="uploadImageUrl"
           :accept = "this.$props.fileType"
           list-type="picture-card"
                   :disabled = 'true'
           :on-preview="handlePictureCardPreview">
        </el-upload>

        <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
        <!--<el-carousel  indicator-position="outside">-->
          <!--<el-carousel-item v-for="item in this.fileUrlsArray" v-bind:key="item.url" :name="item.url">-->
            <!--&lt;!&ndash;组件使用说明 https://www.npmjs.com/package/vue-photo-preview &ndash;&gt;-->
            <!--<img  class="el-have&#45;&#45;picture-card" :src="item.urlM" :large="item.url" :preview="fileType" :preview-text="item.name"/>-->
          <!--</el-carousel-item>-->
        <!--</el-carousel>-->
      </div>
    </div>
  <div v-else class="fileContent">
    <div class="sonFrameClass">
      <div class="headTitleClass">
        <span>{{this.$props.headTitle}}</span>
      </div>
      <el-upload v-bind:label="this.$props.titleImg"
                 :file-list="this.$props.fileUrlsArray"
                 :action="uploadImageUrl"
                 :accept = "this.$props.fileType"
                 list-type="picture-card"
                  :disabled = 'true'
                 :on-preview="handlePictureCardPreview">
      </el-upload>

      <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" >
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    components: {
    },
    props: {
      headTitle: {
        type: String
      },
      fileUrlsArray: {
        type: Array
      },
      isBottom: {
        type: Boolean // 是否是最底部图片
      },
      fileType: {
        type: String
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        uploadImageUrl: '',
        pdfVisible: false,
        dialogVisible: false
      };
    },
    methods: {
      getFileUrls(typeImg, fileUrlArray) {
        this.fileUrls = fileUrlArray;
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
          this.exportFileFileType({type: 'POST',
            url: '/maliwms/file/downloadFile',
            data: {url: file.url, name: file.name},
            loading: true,
            fileNam: file.name
          });
        }
      }
    }
  };
</script>
<style scoped>
  .fileContent
  {
    width: 958px;
    height: 210px;
    background: white;
    border-right: 1px solid #e3e4e5;
    border-left: 1px solid #e3e4e5;
  }
  .borderBottom
  {
    border-bottom: 1px solid #e3e4e5;
    margin-bottom: 20px;
  }
  .headTitleClass
  {
    width: 928px;
    font-size: 14px;
    margin-left: 10px;
    margin-top: 20px;
    height: 20px;
    color: #333333;
  }
  .sonFrameClass
  {
    width: 928px;
    height: 148px;
    padding-top: 2px;
    margin-left: 20px;
    /*border-bottom: 1px solid #e3e4e5;*/
  }
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
