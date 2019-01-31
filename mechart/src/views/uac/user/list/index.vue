<template>
  <div>
    <el-form :inline="true" ref="filterFrom" :model="filterModel">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select size="small" v-model="filterModel.status" filterable placeholder="用户状态">
            <el-option v-for="item in userState" :key="item.value" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="loginName">
          <el-input size="small" clearable v-model="filterModel.loginName" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="userName">
          <el-input size="small" clearable v-model="filterModel.userName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="mobileNo">
          <el-input size="small" clearable v-model="filterModel.mobileNo" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small" @click="queryDataFn">筛选</el-button>
          <el-button type="primary" size="small" @click="refresh('filterFrom')">刷新</el-button>
        </el-form-item>
        <el-button type="primary" size="small" @click="toAddUserFn" v-permission="['uas:user:add']">添加用户</el-button>
        <el-button type="info" size="small" @click="loadPage('OnLineList')" v-permission="['uas:user:onlUser']">在线用户</el-button>
      </div>
    </el-form>
    <!--<div class="pc-addBtn-panel">-->
      <!--<el-button type="primary" size="small" @click="toAddUserFn">添加用户</el-button>-->
      <!--<el-button type="info" size="small" @click="loadPage('OnLineList')">在线用户</el-button>-->
    <!--</div>-->
    <div class="page-list-table">
      <el-table :data="tableData" stripe resizable  border>
        <el-table-column type="index" label="序号" width="80px"></el-table-column>
        <el-table-column prop="loginName" label="登录名" min-width="120">
          <template slot-scope="scope">
            <router-link class="pc-router-link" :to="{ name:'userView', query: {'loginName': scope.row.loginName}}">
              {{scope.row.loginName}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template slot-scope="scope">
            {{scope.row.status | statusToChinese}}
          </template>
        </el-table-column>
        <el-table-column prop="mobileNo" label="联系电话" min-width="130"></el-table-column>
        <el-table-column prop="userCode" label="工号" min-width="120"></el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="groupName" label="组织名称" min-width="120"></el-table-column>
        <el-table-column prop="createdTime" label="注册时间" min-width="170"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="170"></el-table-column>
        <el-table-column prop="lastLoginTime" label="上次登录时间" min-width="170"></el-table-column>
        <el-table-column fixed="right" label="操作" width="380">
          <template slot-scope="scope">
            <el-button  type="danger" size="small" plain v-if="scope.row.status === 'ENABLE' && scope.row.id != 1 && hasPermission('uac:user:modifyUserStatusById')" @click="disableFn(scope.row)">禁用</el-button>
            <el-button  type="primary" size="small" plain v-if="scope.row.status === 'DISABLE' && scope.row.id != 1 && hasPermission('uac:user:modifyUserStatusById')" @click="enableFn(scope.row)">启用</el-button>
            <el-button  type="primary" size="small" plain v-if="scope.row.id != 1 && scope.row.groupName !== null && hasPermission('uac:user:save')" @click="toModifyUserFn(scope.row)" >修改</el-button>
            <el-button  type="primary" size="small" plain   v-if="hasPermission('uas:user:bindRole')" @click="toBindBtnFn(scope.row)">角色绑定</el-button>
            <el-button  type="danger" size="small" plain  v-if="hasPermission('uac:role:resetLoginPwd')" @click="resetLoginPwdFn(scope.row)" >重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryPageUrl" :queryData="filterModel" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
    <el-dialog :title="dialogName" :visible.sync="isShowEditDialog" size="tiny" @close="isShowEditDialog = false" class="dialogArea">
      <pc-edit-user :type="methodType" :formData="editUserData" v-if="isShowEditDialog" ref="editUserForm"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="$store.getters.getButtonLoading" type="primary" @click="saveUserFn">确认</el-button>
        <el-button size="small" @click="isShowEditDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="绑定角色" :visible.sync="isShowBindRoleDialog" size="small" @close="isShowBindRoleDialog = false">
      <pc-bind-role @on-disabled="isShowBindRoleDialogFn" :userId="userId" v-if="isShowBindRoleDialog" ref="bindRoleForm"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :disabled="bindRoleDisabled" :loading="$store.getters.getButtonLoading" type="primary" @click="bindRoleFn">确认</el-button>
        <el-button size="small" @click="isShowBindRoleDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PcPagination from 'components/form/pagination';
  import PcEditUser from '../edit/index.vue';
  import PcBindRole from '../bind-role/index.vue';
  export default {
    data () {
      return {
        isShowEditDialog: false,
        userId: '',
        isShowBindRoleDialog: false,
        bindRoleDisabled: true, // 绑定用户
        dialogName: '',
        methodType: '',
        pageUrl: {
          queryPageUrl: '/uac/user/queryListWithPage'
        },
        userState: [
          {
            code: 'ENABLE',
            value: '启用'
          },
          {
            code: 'DISABLE',
            value: '禁用'
          }
        ],
        filterModel: {
          type: '',
          status: '',
          loginName: '',
          userName: '',
          mobileNo: ''
        },
        tableData: [],
        editUserData: {
        }
      };
    },
    created () {
    },
    components: {
      PcPagination, PcEditUser, PcBindRole
    },
    filters: {
      statusToChinese (val) {
        let state = '';
        switch (val) {
          case 'ENABLE': {
            state = '启用';
            break;
          }
          case 'DISABLE': {
            state = '禁用';
            break;
          }
        }
        return state;
      },
      userSourceToChinese (val) {
        let source = '';
        switch (val) {
          case 'INSERT': {
            source = '添加';
            break;
          }
          case 'REGISTER': {
            source = '注册';
            break;
          }
        }
        return source;
      }
    },
    methods: {
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      },
      refresh (formName) {
        this.$refs[formName].resetFields();
        this.queryDataFn();
      },
      toAddUserFn () {
        this.editUserData = {
          status: 'ENABLE'
        };
        this.methodType = 'ADD';
        this.dialogName = '添加用户';
        this.isShowEditDialog = true;
      },
      toModifyUserFn (user) {
        this.isShowEditDialog = true;
        this.methodType = 'UPDATE';
        this.dialogName = '编辑用户';
        this.editUserData = user;
      },
      disableFn (user) {
        let confirmMsg = '确定禁用' + user.loginName + '吗?';
        this.confirmModel(confirmMsg, '/uac/user/modifyUserStatusById', {
          'status': 'DISABLE',
          'userId': user.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableFn (user) {
        let confirmMsg = '确定启用' + user.loginName + '吗?';
        this.confirmModel(confirmMsg, '/uac/user/modifyUserStatusById', {
          'status': 'ENABLE',
          'userId': user.id
        }, () => {
          this.queryDataFn();
        });
      },
      toBindBtnFn (user) {
        this.userId = user.id;
        this.isShowBindRoleDialog = true;
      },
      resetLoginPwdFn (user) {
        let confirmMsg = '确定重置' + user.loginName + '吗?';
        this.confirmModel(confirmMsg, '/uac/user/resetLoginPwd/' + user.id, null, () => {
          this.queryDataFn();
        });
      },
      isShowBindRoleDialogFn(result) {
        // true 禁用, false 可用
        this.bindRoleDisabled = result;
      },
      saveUserFn() {
        this.$refs.editUserForm.submitForm(() => {
          this.isShowEditDialog = false;
          this.queryDataFn();
        });
      },
      bindRoleFn() {
        this.$refs.bindRoleForm.submitForm((res) => {
          this.isShowBindRoleDialog = false;
          this.queryDataFn();
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .dialogArea .el-dialog{
    width:560px;
  }
</style>
