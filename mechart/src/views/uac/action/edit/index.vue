<template>
  <el-form slot="form" :model="formData" :rules="rules" ref="actionForm" label-width="80px">
    <el-form-item label="菜单名称" v-if="type === 'ADD'">
      <el-cascader
        size="small"
        placeholder="请选择组织地址"
        :options="menuTreeData"
        filterable
        clearabled
        change-on-select
        v-model="formData.menuIdList"
        :props="menuProps"
        :disabled="type === 'VIEW' || type === 'UPDATE'"
        class="menu-cascader">
      </el-cascader>
    </el-form-item>
    <el-form-item label="菜单名称"  prop="menuName" label-width="80px" v-if="type !== 'ADD'">
      <el-input size="small" clearable v-model="formData.menuName" :disabled="true" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="权限编码" prop="actionCode" label-width="80px">
      <el-input size="small" clearable v-model="formData.actionCode" :disabled="type === 'UPDATE'" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="权限名称"  prop="actionName" label-width="80px">
      <el-input size="small" clearable v-model="formData.actionName" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="权限地址"  prop="url">
      <el-input v-model="formData.url" size="small" clearable
                :readonly="type === 'VIEW'"
                class="pc-input-auto">
      </el-input>
    </el-form-item>
    <el-form-item label="权限说明" prop="remark" label-width="80px">
      <el-input size="small" clearable v-model="formData.remark" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-radio v-model="formData.status" label="ENABLE">启用</el-radio>
      <el-radio v-model="formData.status" label="DISABLE">禁用</el-radio>
    </el-form-item>
  </el-form>
</template>
<script>
  import { checkRoleName } from '../../../../utils/common-method/validate/index';
  import {validateTips} from 'utils/tips';
  export default {
    props: {
      formData: {
        type: Object
      },
      type: {
        type: String,
        required: true
      },
      menuTreeData: {
        type: Array
      }
    },
    data() {
      let checkUrl = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[/]/ || /^[a-zA-Z0-9_]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.RIGHT_FORMAT));
          } else {
            let param = {};
            param.url = value;
            param.actionId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/action/checkUrl',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error(validateTips.RULE_ADD_EXIST));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      let checkActionCode = (rule, actionCode, callback) => {
        if (actionCode !== '' && actionCode !== undefined && actionCode !== null) {
          let reg = /^[A-Za-z0-9:]+$/;
          let val = reg.test(actionCode);
          if (val !== true) {
            callback(new Error(validateTips.RIGHT_FORMAT));
          } else {
            let param = {};
            param.actionCode = actionCode;
            param.actionId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/action/checkActionCode',
              data: param
            }).then((res) => {
              if (res.result) {
                callback();
              } else {
                callback(new Error(validateTips.RULE_EXIST));
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      return {
        rules: {
          actionCode: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 50, message: validateTips.LESS_50, trigger: 'blur' },
            { validator: checkActionCode, trigger: 'blur' }
          ],
          actionName: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 50, message: validateTips.LESS_50, trigger: 'blur' },
            { validator: checkRoleName, trigger: 'blur' }
          ],
          url: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 100, message: validateTips.WORD_LESS_100, trigger: 'blur' },
            { validator: checkUrl, trigger: 'blur' }
          ],
          remark: [

            { min: 0, max: 150, message: validateTips.WORD_LESS_150, trigger: 'blur' }
          ]
        },
        menuProps: {
          value: 'id',
          label: 'menuName',
          children: 'subMenu'
        }
      };
    },
    methods: {
      submitForm(fn) {
        this.$refs['actionForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveActionFn(fn);
        });
      },
      saveActionFn(fn) {
        this.ajax({
          url: '/uac/action/save',
          data: this.formData || '',
          loading: true,
          success: (res) => {
            fn && fn(res);
          }
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .menu-cascader {
    width: 100%;
    .el-cascader__label{
      line-height: 36px;
    }
  }
</style>
