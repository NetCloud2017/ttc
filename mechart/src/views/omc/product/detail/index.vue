<style rel="stylesheet/scss" lang="scss">
  .pc-upload-img{
    .el-upload {
      display: none;
    }
  }
</style>
<template>
  <div>
    <el-form :model="productForm" ref="productDetailForm" label-width="80px">
      <el-form-item label="商品名称" prop="name">
        {{productForm.name}}
      </el-form-item>
      <el-form-item label="商品描述" prop="subtitle">
        {{productForm.subtitle}}
      </el-form-item>
      <el-form-item label="状态">
        {{productForm.status | getProductStatusName}}
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        {{productForm.price | formatMoney}}
      </el-form-item>
      <el-form-item label="商品库存" prop="stock">
        {{productForm.stock}}
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryIdList">
        <el-cascader
          size="small"
          disabled
          clearabled
          :options="categoryTreeData"
          v-model="productForm.categoryIdList"
          :props="categoryProps">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          action="#"
          disabled
          class="pc-upload-img"
          :file-list="this.productForm.imgUrlList"
          :on-preview="handlePictureCardPreview"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-form-item label="商品详情" prop="detail">
        <div v-html="productForm.detail"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        productId: this.$route.query.id,
        dialogImageUrl: '',
        productForm: {},
        dialogVisible: false,
        categoryTreeData: [],
        categoryProps: {
          value: 'id',
          label: 'name',
          children: 'children'
        }
      };
    },
    created() {
      this.queryProductDetailFn();
      this.initMenuTree();
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      queryProductDetailFn() {
        this.ajax({
          url: `/mdc/product/getById/` + this.productId,
          loading: true,
          success: (res) => {
            this.productForm = res.result;
            // document.querySelector('.el-upload--picture-card').style.display = 'none';
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
      }
    }
  };
</script>
