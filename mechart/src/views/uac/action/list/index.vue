<template>
  <div>
    <el-form :inline="true" :model="actionForm" ref="actionForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="menuIdList">
          <el-cascader
            size="small"
            placeholder="请选择权限"
            :options="menuTreeData"
            filterable
            clearable
            change-on-select
            v-model="actionForm.menuIdList"
            :props="menuProps"
            class="pc-input-col3">
          </el-cascader>
        </el-form-item>
        <el-form-item label="" prop="actionCode">
          <el-input size="small" clearable v-model="actionForm.actionCode" class="pc-input3-col5" placeholder="权限编码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="actionName">
          <el-input size="small" clearable v-model="actionForm.actionName" class="pc-input3-col5" placeholder="权限名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="url">
          <el-input size="small" clearable v-model="actionForm.url" class="pc-input3-col5" placeholder="权限URL"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" @click="queryDataFn">筛选</el-button>
          <el-button size="small" type="primary" @click="refresh('actionForm')">刷新</el-button>
        </el-form-item>
        <el-button size="small" type="primary" @click="toAddActionFn">添加权限</el-button>
        <el-button size="small" type="danger" :disabled="checkDisabled" @click="batchDeleteActionFn">批量删除</el-button>
      </div>
      <!--<div class="pc-addBtn-panel">-->
        <!--<el-button size="small" type="primary" @click="toAddActionFn">添加权限</el-button>-->
        <!--<el-button size="small" type="danger" :disabled="checkDisabled" @click="batchDeleteActionFn">批量删除</el-button>-->
      <!--</div>-->
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData" resizable   border ref="multipleTable" tooltip-effect="dark" stripe @selection-change="handleSelectionChange" :empty-text='emptyText'>
      <el-table-column type="index" label="序号" width="75"></el-table-column>
      <el-table-column prop="status" label="状态" width="75">
        <template slot-scope="scope">
          {{scope.row.status | statusToChinese}}
        </template>
      </el-table-column>
      <el-table-column prop="actionName" label="权限名称" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">
          {{scope.row.actionName}}
        </template>
      </el-table-column>
      <el-table-column prop="actionCode" label="权限编码" show-overflow-tooltip min-width="160"></el-table-column>
      <el-table-column prop="url" label="URL地址" show-overflow-tooltip min-width="160"></el-table-column>
      <el-table-column prop="menuName" label="菜单名称" min-width="120"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="120"></el-table-column>
      <el-table-column prop="lastOperator" label="操作人" min-width="120"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.id !== 1">
            <el-button type="danger" plain v-if="scope.row.status === 'ENABLE'"  @click="disabledActionFn(scope)">禁用</el-button>
            <el-button type="primary" plain v-if="scope.row.status === 'DISABLE'"@click="enableActionFn(scope)">启用</el-button>
            <el-button type="primary" plain  @click="toModifyActionFn(scope.row)">修改</el-button>
            <el-button type="danger" plain  @click="deleteActionFn(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryActionList" :queryData="actionForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
    <el-dialog :title="dialogName" :visible.sync="isShowEditDialog" size="tiny" @close="isShowEditDialog = false">
      <pc-edit-action :type="methodType" :menuTreeData="menuTreeData" :formData="editActionData" v-if="isShowEditDialog" ref="editActionForm"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="$store.getters.getButtonLoading" type="primary" @click="saveActionFn">确认</el-button>
        <el-button size="small" @click="isShowEditDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  //  import Bus from 'src/vueBus.js';
  import PcPagination from 'components/form/pagination';
  import PcButton from 'components/form/button';
  import PcEditAction from '../edit/index.vue';

  export default {
    data () {
      return {
        fit: false,
        menuTreeData: [],
        menuProps: {
          value: 'id',
          label: 'menuName',
          children: 'subMenu'
        },
        actionId: '', // 当前操作的权限ID
        isShowEditDialog: false,
        deleteActionIdArr: [],
        checkDisabled: true, // 批量删除是否可用
        methodType: '',
        editActionData: {
          actionCode: '',
          actionName: '',
          remark: '',
          status: 'ENABLE',
          menuIdList: []
        },
        actionForm: {
          status: '',
          actionCode: '',
          actionName: '',
          menuIdList: [],
          url: ''
        },
        dialogName: '',
        tableData: [],
        emptyText: '',
        disabledDialog: false,
        enableDialog: false,
        disabledActionName: '',
        deleteDialog: false,
        pageUrl: {
          queryActionList: '/uac/action/queryListWithPage'
        }
      };
    },
    components: {
      PcPagination, PcEditAction, PcButton
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
      this.initMenuTree();
    },
    methods: {
      refresh (formName) {
        this.$refs[formName].resetFields();
        this.queryDataFn();
      },
      disabledActionFn (scope) {
        let confirmMsg = '确定禁用' + scope.row.actionName + '吗?';
        this.confirmModel(confirmMsg, '/uac/action/modifyStatus', {
          'status': 'DISABLE',
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableActionFn (scope) {
        let confirmMsg = '确定启用' + scope.row.actionName + '吗?';
        this.confirmModel(confirmMsg, '/uac/action/modifyStatus', {
          'status': 'ENABLE',
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      initMenuTree() {
        this.ajax({
          url: '/uac/menu/getTree',
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.menuTreeData = data[0].subMenu;
          }
        });
      },
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      },
      saveActionFn() {
        this.$refs.editActionForm.submitForm((res) => {
          this.isShowEditDialog = false;
          this.queryDataFn();
        });
      },
      toAddActionFn () {
        this.editActionData = {
          status: 'ENABLE',
          parentActionName: ''
        };
        this.dialogName = '添加权限';
        this.methodType = 'ADD';
        this.isShowEditDialog = true;
      },
      toModifyActionFn (action) {
        this.isShowEditDialog = true;
        this.methodType = 'UPDATE';
        this.dialogName = '编辑权限';
        this.editActionData = action;
        if (action.menuId) {
          let menuIdList = [];
          menuIdList.push(action.menuId);
          this.editActionData.menuIdList = menuIdList;
          console.info('this.editActionData', this.editActionData);
          this.$set(this.editGroupFormData, 'menuIdList', menuIdList);
        }
      },
      deleteActionFn (action) {
        let confirmMsg = '确定删除' + action.actionName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/uac/action/deleteActionById/${action.id}`, null, () => {
          this.queryDataFn();
        });
      },
      batchDeleteActionFn() {
        let confirmMsg = '删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/uac/action/batchDeleteByIdList`, this.deleteActionIdArr, () => {
          this.queryDataFn();
        });
      },
      closeEditDialog (attr) {
        this[attr] = false;
      },
      handleSelectionChange(actionList) {
        this.deleteActionIdArr = [];
        actionList.forEach((item) => {
          this.deleteActionIdArr.push(item.id);
        });
        this.checkDisabled = this.deleteActionIdArr.length < 1;
      }
    }
  };
</script>
