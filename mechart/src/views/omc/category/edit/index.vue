<style rel="stylesheet/scss" lang="scss">
  .categoryForm .fa-user {
    position: absolute;
    top: 0;
    margin-right: 0;
  }
</style>
<template>
  <el-form :model="formData" :rules="editRules" ref="categoryForm" label-width="80px" class="categoryForm">
    <el-form-item label="父级分类">
      <el-input v-model="formData.parentCategoryName" clearable
                :disabled="true"
                class="pc-input-readonly-color pc-input-col3">
      </el-input>
    </el-form-item>
    <el-form-item label="分类编码" prop="categoryCode">
      <el-input v-model="formData.categoryCode" clearable
                :disabled="type === 'UPDATE' || type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="分类名称" prop="name">
      <el-input v-model="formData.name" clearable
                :disabled="type === 'VIEW'" placeholder="请输入中文汉字"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="分类排序" prop="sortOrder">
      <el-input v-model.number="formData.sortOrder" clearable
                :disabled="type === 'VIEW'"
                placeholder="请输入整数"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button type="primary" v-if="type !== 'VIEW'" @click="submitForm('categoryForm')">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/ecmascript-6">
  import {validateTips} from 'utils/tips';
  export default {
    props: {
      data: {
        type: Object
      },
      type: {
        type: String,
        required: true
      }
    },
    watch: {
      data (newData) {
        this.formData = newData;
      }
    },
    created () {
      this.formData = this.data;
      console.info(this.formData);
    },
    methods: {
      submitForm () {
        this.$refs['categoryForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveCategoryFn();
        });
      },
      saveCategoryFn () {
        this.ajax({
          url: '/mdc/category/save',
          data: this.formData || '',
          loading: true,
          success: () => {
            this.$emit('on-submit');
          }
        });
      }
    },
    data () {
      let checkNumber = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[0-9]*$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.ONLY_INT_NUM));
          } else {
            callback();
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      let checkRules = {
        categoryId: [
          {min: 1, max: 30, message: validateTips.LESS_30, trigger: 'blur'}
        ],
        name: [
          {min: 1, max: 30, message: validateTips.LESS_30, trigger: 'blur'}
        ],
        sortOrder: [
          {type: 'number', message: validateTips.LESS_2, trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
        ]
      };
      return {
        formData: this.data,
        editRules: checkRules
      };
    }
  };
</script>
