<template>
  <el-form slot="form" :model="formData" :rules="rules" ref="roleForm" label-width="80px">
    <el-form-item label="角色编码"  prop="roleCode" label-width="80px">
      <el-input size="small" clearable v-model="formData.roleCode" :disabled="type === 'UPDATE'" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="角色名称"  prop="roleName" label-width="80px">
      <el-input size="small" clearable v-model="formData.roleName" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="角色说明" prop="remark" label-width="80px">
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
      }
    },
    data() {
      let checkRoleCode = (rule, roleCode, callback) => {
        if (roleCode !== '') {
          let reg = /^[A-Za-z0-9_]+$/;
          let val = reg.test(roleCode);
          if (val !== true) {
            callback(new Error(validateTips.NUM_WORDS));
          } else {
            let param = {};
            param.roleCode = roleCode;
            param.roleId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/role/checkRoleCode',
              data: param
            }).then((res) => {
              if (res.result) {
                callback();
              } else {
                callback(new Error(validateTips.ROLE_EXIST));
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      return {
        rules: {
          roleCode: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 20, message: validateTips.LESS_20, trigger: 'blur' },
            { validator: checkRoleCode, trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 0, max: 20, message: validateTips.LESS_20, trigger: 'blur' },
            { validator: checkRoleName, trigger: 'blur' }
          ],
          remark: [
            { min: 0, max: 150, message: validateTips.WORD_LESS_150, trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      // console.log(validateTips.NOT_EMPTY);
    },
    methods: {
      submitForm(fn) {
        this.$refs['roleForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveRoleFn(fn);
        });
      },
      saveRoleFn(fn) {
        this.ajax({
          url: '/uac/role/save',
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
