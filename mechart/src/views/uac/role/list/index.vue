<template>
  <div>
    <el-form :inline="true" :model="roleForm" ref="roleForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="roleForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>



          <el-form-item label="" prop="roleCode" v-if="isshowMore">
            <el-input v-model="roleForm.roleCode" clearable clearable class="pc-input3-col5" placeholder="角色编码"></el-input>
          </el-form-item>
          <el-form-item label="" prop="roleName" v-if="isshowMore">
            <el-input  v-model="roleForm.roleName" clearable clearable class="pc-input3-col5" placeholder="角色名称"></el-input>
          </el-form-item>


        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button type="primary" @click="refresh('roleForm')">刷新</el-button>
        </el-form-item>
        <el-button size="small" type="primary" @click="toAddRoleFn">添加角色</el-button>
        <el-button size="small" type="danger" :disabled="checkDisabled" @click="batchDeleteRoleFn">批量删除</el-button>
        <el-button @click="showMore()">{{showMoreText}}</el-button>
      </div>
      <!--<div class="pc-addBtn-panel">-->
        <!--<el-button size="small" type="primary" @click="toAddRoleFn">添加角色</el-button>-->
        <!--<el-button size="small" type="danger" :disabled="checkDisabled" @click="batchDeleteRoleFn">批量删除</el-button>-->
      <!--</div>-->
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData"  border ref="multipleTable" tooltip-effect="dark" stripe @selection-change="handleSelectionChange" :empty-text='emptyText'>
      <el-table-column
        :selectable="selectableFn"
        type="selection"
        width="38">
      </el-table-column>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="65">
        <template slot-scope="scope">
          {{scope.row.status | statusToChinese}}
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" min-width="100">
        <template slot-scope="scope">
          {{scope.row.roleName}}
        </template>
      </el-table-column>
      <el-table-column prop="roleCode" label="角色编码" min-width="150"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="150"></el-table-column>
      <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="555">
        <template slot-scope="scope">
          <div v-if="scope.row.id !== '1'">
            <el-button v-permission="['uac:role:modifyRoleStatusById']" type="danger" plain v-if="scope.row.status === 'ENABLE' && scope.row.id !== '1'"  @click="disabledRoleFn(scope)">禁用</el-button>
            <el-button v-permission="['uac:role:modifyRoleStatusById']" type="primary"  plain v-if="scope.row.status === 'DISABLE' && scope.row.id !== '1'"  @click="enableRoleFn(scope)">启用</el-button>
            <el-button v-permission="['uac:role:']" type="primary" plain  v-if="scope.row.id !== '1'" @click="toBindUserFn(scope.row)">绑定用户</el-button>
            <el-button v-permission="['uac:role:bindMenu']" type="primary" plain  v-if="scope.row.id !== '1'" @click="loadPage('BindMenu', scope.row)">分配菜单</el-button>
            <el-button v-permission="['uac:role:bindAction']" type="primary" plain  v-if="scope.row.id !== '1'" @click="loadPage('BindAction', scope.row)">分配权限</el-button>
            <el-button v-permission="['uac:role:edit']" type="primary" plain v-if="scope.row.id !== '1'" @click="toModifyRoleFn(scope.row)">修改</el-button>
            <el-button v-permission="['uac:role:delete']" type="danger" plain v-if="scope.row.id !== '1'" @click="deleteRoleFn(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryRoleList" :queryData="roleForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
    <el-dialog :title="dialogName" :visible.sync="isShowEditDialog" size="tiny" @close="isShowEditDialog = false">
      <pc-edit-role :type="methodType" :formData="editRoleData" v-if="isShowEditDialog" ref="editRoleForm"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="$store.getters.getButtonLoading" type="primary" @click="saveRoleFn">确认</el-button>
        <el-button size="small" @click="isShowEditDialog = false">取消</el-button>
        <!--<pc-button size="small" url="/uac/role/add/addRole" :param="editRoleData" type="primary" @click="saveRoleFn">确认</pc-button>-->
      </div>
    </el-dialog>

    <!--<el-dialog title="绑定用户" :visible.sync="isShowBindUserDialog" size="small" @close="isShowBindUserDialog = false">-->
      <!--<pc-bind-user @on-disabled="isShowBindUserDialogFn" :roleId="roleId" v-if="isShowBindUserDialog" ref="bindUserForm"/>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button size="small" :disabled="bindUserDisabled" :loading="$store.getters.getButtonLoading" type="primary" @click="bindUserFn">确认</el-button>-->
        <!--<el-button size="small" @click="isShowBindUserDialog = false">取消</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <pc-dialog :is-show="isShowBindUserDialog"  title ='绑定用户' @on-close="isShowBindUserDialog = false">
      <div>
        <pc-bind-user @on-disabled="isShowBindUserDialogFn" :roleId="roleId" v-if="isShowBindUserDialog" ref="bindUserForm"/>
        <div >
          <el-button size="small" :disabled="bindUserDisabled" :loading="$store.getters.getButtonLoading" type="primary" @click="bindUserFn">确认</el-button>
          <el-button size="small" @click="isShowBindUserDialog = false">取消</el-button>
        </div>
      </div>
    </pc-dialog>
  </div>
</template>
<script>
//  import Bus from 'src/vueBus.js';
  import PcPagination from 'components/form/pagination';
  import PcButton from 'components/form/button';
  import PcEditRole from '../edit/index.vue';
  import PcBindUser from '../bind-user/index.vue';
  import PcDialog from 'components/dialog';

  export default {
    data () {
      return {
        isshowMore: false,
        showMoreText: '更多',
        dialogName: '',
        roleId: '', // 当前操作的角色ID
        isShowEditDialog: false,
        isShowBindUserDialog: false,
        deleteRoleIdArr: [],
        checkDisabled: true, // 批量删除是否可用
        bindUserDisabled: true, // 绑定用户
        methodType: '',
        editRoleData: {
          roleCode: '',
          roleName: '',
          remark: '',
          status: 'ENABLE'
        },
        roleForm: {
          status: '',
          roleCode: '',
          roleName: ''
        },
        statusOption: [{
          value: 'ENABLE',
          label: '启用'
        }, {
          value: 'DISABLE',
          label: '禁用'
        }],
        tableData: [],
        emptyText: '',
        currentPage: 5,
        disabledDialog: false,
        enableDialog: false,
        disabledRoleName: '',
        deleteDialog: false,
        pageUrl: {
          queryRoleList: '/uac/role/queryRoleListWithPage'
        }
      };
    },
    components: {
      PcPagination, PcEditRole, PcButton, PcBindUser, PcDialog
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
      }
    },
    created () {
    },
    methods: {
      showMore () {
        this.isshowMore = !this.isshowMore;
        if (this.isshowMore) {
          this.showMoreText = '收起';
        } else {
          this.showMoreText = '更多';
        }
      },
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
      saveRoleFn() {
        this.$refs.editRoleForm.submitForm((res) => {
          this.isShowEditDialog = false;
          this.queryDataFn();
        });
      },
      toAddRoleFn () {
        this.editRoleData = {
          status: 'ENABLE'
        };
        this.dialogName = '添加角色';
        this.methodType = 'ADD';
        this.isShowEditDialog = true;
      },
      toBindUserFn (role) {
        this.roleId = role.id;
        this.isShowBindUserDialog = true;
      },
      toModifyRoleFn (role) {
        this.isShowEditDialog = true;
        this.methodType = 'UPDATE';
        this.dialogName = '编辑角色';
        this.editRoleData = role;
      },
      disabledRoleFn (scope) {
        let confirmMsg = '确定禁用' + scope.row.roleName + '吗?';
        this.confirmModel(confirmMsg, '/uac/role/modifyRoleStatusById', {
          'status': 'DISABLE',
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableRoleFn (scope) {
        let confirmMsg = '确定启用' + scope.row.roleName + '吗?';
        this.confirmModel(confirmMsg, '/uac/role/modifyRoleStatusById', {
          'status': 'ENABLE',
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      deleteRoleFn (role) {
        let confirmMsg = '确定删除' + role.roleName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/uac/role/deleteRoleById/${role.id}`, null, () => {
          console.info('deleteRoleFn callback');
          this.queryDataFn();
        });
      },
      batchDeleteRoleFn() {
        let confirmMsg = '删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/uac/role/batchDeleteByIdList`, this.deleteRoleIdArr, () => {
          console.info('batchDeleteRoleFn callback');
          this.queryDataFn();
        });
      },
      bindUserFn() {
        this.$refs.bindUserForm.submitForm((res) => {
          this.isShowBindUserDialog = false;
        });
      },
      closeEditDialog (attr) {
        this[attr] = false;
      },
      handleSelectionChange(roleList) {
        this.deleteRoleIdArr = [];
        roleList.forEach((item) => {
          this.deleteRoleIdArr.push(item.id);
        });
        this.checkDisabled = this.deleteRoleIdArr.length < 1;
      },
      isShowBindUserDialogFn(result) {
        // true 禁用, false 可用
        console.info('result', result);
        this.bindUserDisabled = result;
      },
      selectableFn(row, index) {
        // console.info(row);
        return row.id !== '1';
      }
    }
  };
</script>
