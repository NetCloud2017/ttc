<style rel="stylesheet/scss" lang="scss">
  .menuForm .fa-user {
      position: absolute;
      top: 0;
      margin-right: 0;
  }
</style>
<template>
  <el-form :model="formData" :rules="editRules" ref="menuForm" label-width="80px" class="menuForm">
    <el-form-item label="父级菜单">
      <el-input v-model="formData.parentMenuName" clearable
                :disabled="true"
                class="pc-input-readonly-color pc-input-col3">
      </el-input>
    </el-form-item>
    <el-form-item label="菜单编码" prop="menuCode">
      <el-input v-model="formData.menuCode" clearable
                :disabled="type === 'UPDATE' || type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="Icon编码" prop="icon">
      <el-input v-model="formData.icon" clearable
                  :icon="formData.icon"
                  :disabled = "type === 'VIEW'"
                  :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="菜单名称" prop="menuName">
      <el-input v-model="formData.menuName" clearable
                :disabled="type === 'VIEW'" placeholder="请输入中文汉字"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="菜单排序" prop="number">
      <el-input v-model.number="formData.number" clearable
                :disabled="type === 'VIEW'"
                placeholder="请输入整数"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="菜单地址" prop="url">
      <el-input v-model="formData.url" clearable
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="备注说明" prop="remark">
      <el-input type="textarea" v-model="formData.remark" clearable
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button type="primary" v-if="type !== 'VIEW'" @click="submitForm('menuForm')">保 存</el-button>
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
      data(newData) {
        this.formData = newData;
      }
    },
    created () {
      this.formData = this.data;
    },
    methods: {
      submitForm() {
        this.$refs['menuForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveMenuFn();
        });
      },
      saveMenuFn() {
        this.ajax({
          url: '/uac/menu/save',
          data: this.formData || '',
          loading: true,
          success: () => {
            this.$emit('on-submit');
          }
        });
      }
    },
    data() {
      let checkMenuCode = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[A-Za-z0-9_]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.NUM_WORDS));
          } else {
            let param = {};
            param.menuCode = value;
            param.menuId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/menu/checkMenuCode',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error(validateTips.GROUP_CODE_EXIST));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入菜单编码'));
        }
      };
      let checkMenuName = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[\u4e00-\u9faf]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('菜单名称只能为汉字'));
          } else {
            let param = {};
            param.menuName = value;
            param.menuId = this.formData.id;
            param.pid = this.formData.pid;
            this.$http({
              method: 'POST',
              url: '/uac/menu/checkMenuName',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('菜单名称已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
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
          callback(new Error(validateTips.ONLY_INT_NUM));
        }
      };
      let checkUrl = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[/]/ || /^[a-zA-Z0-9_]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.FORMAT_ERROR));
          } else {
            let param = {};
            param.url = value;
            param.menuId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/menu/checkMenuUrl',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error(validateTips.EXIST));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(validateTips.ONLY_INT_NUM));
        }
      };
      let checkRules = {
        menuCode: [
          { min: 1, max: 30, message: validateTips.LESS_30, trigger: 'blur' },
          { validator: checkMenuCode, trigger: 'blur' }
        ],
        iconCode: [
          {required: true, message: validateTips.NOT_EMPTY, trigger: 'change'}
        ],
        menuName: [
          { min: 1, max: 30, message: validateTips.LESS_30, trigger: 'blur' },
          { validator: checkMenuName, trigger: 'blur' }
        ],
        number: [
          { type: 'number', message: validateTips.LESS_2, trigger: 'blur' },
//          { min: 0, max: 1, message: '菜单序号长度不能大于2个字符', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ],
        url: [
          { min: 0, max: 100, message: validateTips.WORD_LESS_100, trigger: 'blur' },
          { validator: checkUrl, trigger: 'blur' }
        ],
        remark: [
          { min: 0, max: 200, message: validateTips.WORD_LESS_150, trigger: 'blur' }
        ]
      };
      return {
        formData: this.data,
        editRules: checkRules
      };
    }
  };
</script>
