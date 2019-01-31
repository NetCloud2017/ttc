<template>
  <div class="pc-page-content">
    <el-form :model="formData" :rules="rules" ref="userForm" label-width="80px">
      <el-form-item label="登录名" :prop="formPropName('loginName')">
        <el-input size="small" clearable v-model="formData.loginName" :disabled="type === 'UPDATE'"
                  placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="手机号" :prop="formPropName('mobileNo')">
        <el-input size="small" maxlength="11" clearable v-model="formData.mobileNo" placeholder="请输入内容"
                  :disabled="type === 'UPDATE'"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="userName">
        <el-input size="small" maxlength="16" clearable v-model="formData.userName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="userCode">
        <el-input size="small" maxlength="20" clearable v-model="formData.userCode" :disabled="type === 'UPDATE'"
                  placeholder="6-16位数字字母"></el-input>
      </el-form-item>
      <el-form-item label="组织名称" v-if="type === 'ADD'" prop="groupIdList">
        <el-cascader
          size="small"
          placeholder="请选择组织名称"
          :options="groupTreeData"
          filterable
          clearabled
          change-on-select
          v-model="formData.groupIdList"
          :props="groupProps"
          :disabled="type === 'VIEW' || type === 'UPDATE'"
          class="menu-cascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="组织名称" prop="groupName" label-width="80px" v-if="type !== 'ADD'">
        <el-input size="small" clearable v-model="formData.groupName" :disabled="true" class="pc-input-auto"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="type === 'ADD'" prop="loginPwd">
        <el-input size="small" maxlength="20" clearable type="password" v-model="formData.loginPwd"
                  placeholder="请输入数字子母下划线组合"></el-input>
      </el-form-item>
      <!--<el-form-item label="状态">-->
      <!--<el-radio class="radio" v-model="formData.status" label="ENABLE">启用</el-radio>-->
      <!--<el-radio class="radio" v-model="formData.status" label="DISABLE">禁用</el-radio>-->
      <!--</el-form-item>-->
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import maValidate from 'utils/common-method/validate/index';
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
      let checkMobileNo = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^1\d{10}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.PHONE_LENGTH));
          } else {
            this.$http({
              method: 'POST',
              url: '/uac/user/checkUserPhone',
              data: {
                userId: this.formData.id,
                mobileNo: this.formData.mobileNo
              }
            }).then((res) => {
              if (res.result === false) {
                callback(new Error(validateTips.USERNAME_EXIST));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      let checkUserName = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[\u4e00-\u9faf]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.NOLY_CHINESE));
          } else {
            this.$http({
              method: 'POST',
              url: '/uac/user/checkUserName',
              data: {
                userId: this.formData.id,
                userName: this.formData.userName
              }
            }).then((res) => {
              if (res.result === false) {
                callback(new Error(validateTips.USERNAME_EXIST));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      let checkLoginPwd = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,14}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error(validateTips.NUM_WORDS));
          } else {
            callback();
          }
        } else {
          callback(new Error(validateTips.NOT_EMPTY));
        }
      };
      return {
        groupIdList: [],
        groupTreeData: [],
        groupProps: {
          children: 'subMenu',
          value: 'id',
          label: 'menuName'
        },
        rules: {
          loginName: [
            {required: true, message: validateTips.NOT_EMPTY, trigger: 'blur'},
            {validator: maValidate.checkLoginName, trigger: 'blur'}
          ],
          mobileNo: [
            {required: true, message: validateTips.NOT_EMPTY, trigger: 'blur'},
            {validator: checkMobileNo, trigger: 'blur'}
          ],
          userName: [
            {required: true, message: validateTips.NOT_EMPTY, trigger: 'blur'},
            {validator: checkUserName, trigger: 'blur'}
          ],
          loginPwd: [
            {required: true, message: validateTips.NOT_EMPTY, trigger: 'blur'},
            {min: 6, max: 14, message: validateTips.LESS_6_14, trigger: 'blur'},
            {validator: checkLoginPwd, trigger: 'blur'}
          ],
          groupIdList: [
            {
              required: true,
              message: validateTips.ORGANIZATION_IS_EMPTY,
              validator: maValidate.checkArray,
              trigger: 'blur'
            }
          ]
        }

      };
    },
    created () {
      if (this.type === 'ADD') {
        this.initGroupTree();
      }
    },
    computed: {
      formPropName(prop) {
        console.log('formPropName: ' + prop);
        return function (prop) {
          return this.type === 'UPDATE' ? '' : prop;
        };
      }
    },
    methods: {
      initGroupTree() {
        this.ajax({
          url: '/uac/group/getTree',
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            console.info('data', data);
            this.groupTreeData = data;
          }
        });
      },
      submitForm(fn) {
        console.log('submitForm--> groupIdList: ' + JSON.stringify(this.groupIdList));
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.saveUserFn(fn);
          } else {
            console.log('check falie submitForm--> groupIdList: ' + JSON.stringify(this.groupIdList));
            return false;
          }
        });
      },
      saveUserFn(fn) {
        console.log('saveUserFn--> groupIdList: ' + JSON.stringify(this.groupIdList));
        let groupIdList = this.formData.groupIdList;
        if (groupIdList && groupIdList.length > 0) {
          this.formData.groupId = groupIdList[groupIdList.length - 1];
        }
        console.info('this.formData', this.formData);
        this.ajax({
          url: '/uac/user/save',
          data: this.formData || '',
          loading: true,
          success: (res) => {
            fn && fn(res);
            if (res.code === 200) {
              this.successTip('操作成功');
            }
          }
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .menu-cascader {
    width: 100%;
    .el-cascader__label {
      line-height: 36px;
    }
  }
</style>
