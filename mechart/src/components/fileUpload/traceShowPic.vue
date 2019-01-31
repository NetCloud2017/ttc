<template>
  <div >
    <div class="line_03"><b></b><span>溯源文件</span><b></b></div>
     <div style="display: table-cell">
       <div class="trace-images-group" v-for="item1  in this.$props.wmsWrTraceFileList" >
         <li class="trace-images-group-img" >
           <img  v-for="(item1_filesList,index1_filesList) in item1.wmsWrFileList"  v-show="index1_filesList==0" :src="item1_filesList.urlM" :large="item1_filesList.url" :preview="'p1'+item1_filesList.fileClass" preview-text="item1_filesList.goodsName">
         </li>
         <li class="trace-images-group-span">{{item1.fileClassDisplay}}</li>
       </div>
     </div>
    <div class="line_03"><b></b><span>货物照片</span><b></b></div>
      <div style="display: table-cell">
        <div class="trace-images-goods" v-for="(item2_filesList,index2_filesList)  in this.$props.wmsWrGoodsFileList[0].wmsWrFileList" >
          <li class="trace-images-goods-img" >
            <img style="display: inline-block; vertical-align: middle;" :src="item2_filesList.urlM" :large="item2_filesList.url" :preview="'p2'+item2_filesList.fileClass" preview-text="index2_filesList.goodsName">
          </li>
        </div>
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
      wmsWrTraceFileList: {
        type: Array
      },
      wmsWrGoodsFileList: {
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
    height: 100%;
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
  .trace-images-div
  {


    padding-top: 2px;
    margin-left: 20px;
    background: #FFFFFF;
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

  .trace-images-group{
    background-color: #FFFFFF;
    border: 1px solid #ddd;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 220px;
    height: 280px;
    margin-right: 20px;
    float: left;

  }
  .trace-images-group-img{
    vertical-align:middle;

    border: 1px solid #e6e6e6;
    text-align: center;
    height: 220px;
    line-height: 220px;
    width: 180px;
    margin: 20px;
    cursor: pointer;


  }
  .trace-images-group-img img{
    vertical-align: middle;
  }

  .trace-images-group-span{
    line-height: 20px;
    height: 20px;
    text-align: center;
    margin-top: -10px;
    font-size: 16px;

  }

  .trace-images-goods{
    background-color: #FFFFFF;
    border: 1px solid #ddd;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 170px;
    height: 220px;
    margin-right: 20px;
    float: left;

  }
  .trace-images-goods-img{
    text-align: center;
    margin: auto;
    height: 220px;
    line-height: 170px;
    width: 170px;
    vertical-align: middle;
    cursor: pointer;
    position: relative;

  }
  .trace-images-goods-img img {

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;



  }
  .headTitleClassBig
  {
    margin-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 25px;
    font-size: 18px;
    text-align: center;
  }
  .headTitleClassLine
  {
    margin-top: 15px;
    margin-bottom: 25px;
    text-align: center;
  }

  .line_03{

    margin-top: 30px;
    margin-bottom: 20px;
    text-align: center;
  }
  .line_03 b{
    background: #ddd;
    margin-top: 4px;
    display: inline-block;
    width: 280px;
    height: 1px;
    _overflow: hidden;
    vertical-align: middle;
  }
  .line_03 span{
    display: inline-block;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 18px;


    vertical-align: middle;
  }

</style>
