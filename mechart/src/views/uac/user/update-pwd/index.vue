<template>
  <div class="pc-page-content">
    <el-form :model="modifyForm" :rules="rules" ref="userPwdForm" label-width="80px">
      <el-form-item label="原始密码" prop="oldPassword" required>
        <el-input  type="password" clearable class = "pc-input-col3" v-model="modifyForm.oldPassword" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" required>
        <el-input  type="password" clearable class = "pc-input-col3" v-model="modifyForm.newPassword" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd" required>
        <el-input type="password" clearable class = "pc-input-col3" v-model="modifyForm.confirmPwd" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {validateTips} from 'utils/tips';
  export default {
    props: {
      loginName: {
        type: String,
        required: true
      }
    },
    data() {
      let checkNewPwd = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^(?![0-9]+$)(?![a-zA-Z_]+$)[0-9A-Za-z]{6,14}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.LESS_6_14));
          } else {
            let param = {};
            param.newPassword = value;
            param.loginName = this.loginName;
            this.$http({
              method: 'POST',
              url: '/uac/user/checkNewPassword',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error(validateTips.PWD_RE_S));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };

      let checkConfirmPwd = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.LESS_6_14));
          } else {
            if (value !== this.modifyForm.newPassword) {
              callback(new Error(validateTips.PWD_RE));
            } else {
              callback();
            }
          }
        } else {
          callback(new Error(validateTips.CONFIRM_PWD));
        }
      };
      return {
        modifyForm: {
          oldPassword: '',
          newPassword: '',
          confirmPwd: ''
        },
        rules: {
          oldPassword: [
            {required: true, message: validateTips.NOT_EMPTY, trigger: 'blur'},
            { min: 6, max: 14, message: validateTips.LESS_6_14, trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { validator: checkNewPwd, trigger: 'blur' }
          ],
          confirmPwd: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { validator: checkConfirmPwd, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(fn) {
        this.$refs['userPwdForm'].validate((valid) => {
          if (valid) {
            this.modifyUserFn(fn);
          } else {
            return false;
          }
        });
      },
      modifyUserFn(fn) {
        this.modifyForm.loginName = this.loginName;
        this.ajax({
          url: '/uac/user/modifyUserPwd',
          data: this.modifyForm,
          loading: true,
          success: (res) => {
            fn && fn(res);
          }
        });
      }
    }
  };
</script>
