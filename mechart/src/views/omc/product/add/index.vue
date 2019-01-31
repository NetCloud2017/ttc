<template>
  <div class="pc-page-content">
    <el-form :model="productForm" :rules="rules" ref="addProductForm" label-width="80px">
      <el-form-item label="商品名称" prop="name" class="required">
        <el-input size="small" clearable v-model="productForm.name"  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="subtitle" class="required">
        <el-input size="small"  clearable v-model="productForm.subtitle" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="productForm.status" :label=1>在售</el-radio>
        <el-radio v-model="productForm.status" :label=2>下架</el-radio>
        <el-radio v-model="productForm.status" :label=3>删除</el-radio>
      </el-form-item>
      <el-form-item label="商品价格" prop="price" class="required">
        <el-input size="small" clearable v-model.number="productForm.price" type="number" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品库存" prop="stock" class="required">
        <el-input size="small" clearable v-model.number="productForm.stock" type="number" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryIdList" class="required">
        <el-cascader
          size="small"
          placeholder="请选择商品分类"
          :options="categoryTreeData"
          filterable
          clearabled
          change-on-select
          v-model="productForm.categoryIdList"
          :props="categoryProps">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          :limit="uploadMaxCount"
          :headers="token"
          :action="uploadImageUrl"
          :data="this.uploadRequest"
          :file-list="imageList"
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
      <el-form-item label="商品详情" prop="detail">
        <div id="editorElem" class= "wang-editor"></div>
      </el-form-item>
      <!--http://www.wangeditor.com/index.html-->
      <el-form-item label="">
        <el-button type="primary" @click="submitFormFn">确认</el-button>
        <el-button type="" @click="loadPage('ProductList')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import WangEditor from 'wangeditor';
  import {validateTips} from 'utils/tips';
  export default {
    data() {
      return {
        uploadMaxCount: 4,
        token: {Authorization: 'Bearer ' + this.$store.getters.getAccessToken},
        uploadImageUrl: this.getApiHost() + '/zuul/opc/file/uploadFile',
        editorUploadImageUrl: this.getApiHost() + '/zuul/opc/file/uploadPictureWithWangEditor',
        productId: this.$route.query.id,
        dialogImageUrl: '',
        imageList: [],
        dialogVisible: false,
        productForm: {
          status: 1
        },
        uploadRequest: {
          fileType: 'picture',
          filePath: 'malicloud/picture/product/',
          bucketName: 'malicloud-oss-bucket'
        },
        categoryTreeData: [],
        categoryProps: {
          value: 'id',
          label: 'name',
          children: 'children'
        },
        rules: {
          name: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 50, message: validateTips.LESS_50, trigger: 'blur' }
          ],
          subtitle: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 50, message: validateTips.LESS_50, trigger: 'blur' }
          ],
          price: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' }
          ],
          stock: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' }
          ],
          categoryIdList: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.createEditorFn();
    },
    created() {
      this.initMenuTree();
    },
    methods: {
      submitFormFn() {
        this.$refs['addProductForm'].validate((valid) => {
          if (!valid) {
            return;
          }
          this.addProductFn();
        });
      },
      addProductFn() {
        let data = this.productForm;
        Object.assign(data, {
          attachmentIdList: this.productForm.attachmentIdList
        });
        this.ajax({
          url: `/mdc/product/save`,
          data: data,
          loading: true,
          success: (res) => {
            if (res.code === 200) {
              this.loadPage('ProductList');
            }
          }
        });
      },
      initMenuTree() {
        this.ajax({
          url: '/mdc/category/getTree',
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.categoryTreeData = data;
          }
        });
      },
      handelExceedFn(files, fileList) {
        this.errorTip('最多上传4个图片');
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isBMP = file.type === 'image/bmp';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!(isJPG || isPNG || isGIF || isBMP)) {
          this.errorTip(validateTips.IMG_FORMAT);
        }
        if (!isLt2M) {
          this.errorTip(validateTips.IMG_SIZE);
        }
        return (isJPG || isPNG || isGIF || isBMP) && isLt2M;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      checkSuccess(response, file, fileList) {
        if (response.code !== 200) {
          this.errorTip(response.message);
          return;
        }
        this.imageList = [];
        this.productForm.attachmentIdList = [];
        let _this = this;
        fileList.forEach((item, index) => {
          console.info('item:', item);
          _this.imageList.push(item);
          _this.productForm.attachmentIdList.push(item.attachmentId ? item.attachmentId : item.response.result);
        });
      },
      handleRemove(file, fileList) {
        this.productForm.attachmentIdList = [];
        this.imageList = [];
        let _this = this;
        fileList.forEach((item) => {
          _this.imageList.push(item);
          _this.productForm.attachmentIdList.push(item.attachmentId ? item.attachmentId : item.response.result);
        });
      },
      createEditorFn() {
        let _this = this;
        let editor = new WangEditor('#editorElem');
        editor.customConfig.uploadImgServer = this.editorUploadImageUrl;
        editor.customConfig.uploadImgMaxLength = 9;
        editor.customConfig.uploadImgHeaders = {
          'Authorization': 'Bearer ' + this.$store.getters.getAccessToken
        };
        editor.customConfig.uploadFileName = 'file';
        editor.customConfig.uploadImgParams = {
          fileType: 'picture',
          bucketName: 'open-img-bucket'
        };
        let result = {
          prevent: false,
          msg: '允许上传'
        };
        editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
            for (let file of files) {
              if (!_this.beforeAvatarUpload(file)) {
                result.prevent = true;
                result.msg = validateTips.IMG_SIZE;
                break;
              }
            }
            return result;
          },
          success: function (xhr, editor, result) {
            _this.successTip(validateTips.UPLOAD_SUCCESS);
          },
          fail: function (xhr, editor, result) {
            _this.errorTip(validateTips.UPLOAD_FAIL);
          },
          error: function (xhr, editor) {
            _this.errorTip(validateTips.UPLOAD_ERROR);
          },
          timeout: function (xhr, editor) {
            _this.errorTip(validateTips.UPLOAD_EXC_TIME);
          }
        };
        // editor.customConfig.showLinkImg = false;
        editor.customConfig.onchange = (html) => {
          this.productForm.detail = html;
        };
        editor.create();
      }
    },
    watch: {
      imageList() {
        if (this.imageList.length > 3) {
          document.querySelector('.el-upload').style.display = 'none';
        } else {
          document.querySelector('.el-upload').style.display = 'inline-block';
        }
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .pc-upload-img{
    .el-upload {
      display: none;
    }
  }
  .wang-editor {
    text-align:left !important;
    h1{ font-size:2em !important; margin: .67em 0 !important}
    h2{ font-size:1.5em !important; margin: .75em 0 !important}
    h3{ font-size:1.17em !important; margin: .83em 0 !important}
    h4, p,blockquote, ul,fieldset, form,ol, dl, dir,menu { margin: 1.12em 0 !important}
    h5 { font-size:.83em !important; margin: 1.5em 0 !important}
    h6{ font-size:.75em !important; margin: 1.67em 0 !important}
    b,strong  { font-weight: bolder !important}
  }
</style>
