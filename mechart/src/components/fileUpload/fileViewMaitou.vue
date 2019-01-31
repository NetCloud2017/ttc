<template>
  <div  class="frameClass">
    <div class="sonFrameClass">
      <div class="picTitleClass">
        <span>{{this.$props.picTitle}}</span>
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
      headSonTitle: {
        type: String
      },
      picTitle: {
        type: String
      },
      fileUrlsArray: {
        type: Array
      },
      fileType: {
        type: String
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        uploadImageUrl: ''
      };
    },
    methods: {
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
        if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'doc' || fileExtension === 'docx') {
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
  .borderBottom
  {
    border-bottom: 1px dashed #e3e4e5;
  }
  .frameClass
  {
    width: 958px;
    height: 220px;
    margin-top: 5px;
    background-color: white;
    border: 1px solid #e3e4e5;
  }
  .sonFrameClass
  {
    margin-top: 10px;
    margin-left: 20px;
    height: 40px;
    width: 900px;
    background-color: white;
  }
  .headTitleClass
  {
    margin-left: 20px;
    margin-top: 10px;
    font-size: 14px;
    color: #333333;
  }
  .picTitleClass
  {
    margin-left: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #333333;
  }
  .headTitleClass .headSonTitleClass
  {
    height: 30px;
    font-size: 12px;
    color: #b2b2b2;
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
