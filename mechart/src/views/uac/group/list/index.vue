<style rel="stylesheet/scss" lang="scss">
  .pc-group-operation-panel {
    margin-bottom: 20px;
  }
  .pc-group-tree {
    display: inline-block;
  }
  .pc-page-content .pc-group-tree .el-tree-node__content {
    padding-right: 20px;
  }
  .pc-group-edit-panel {
    display: inline-block;
    vertical-align: top;
  }
  .pc-group-header {
    margin: 0 0 20px 30px;
  }
</style>
<template>
  <div class="pc-page-content">
    <div class="pc-group-operation-panel operation-panel">
         <el-button round type="primary" :disabled="methodType === 'ADD'  || !currentId" @click="toAddGroupFn">添加子节点</el-button>
      <el-button round type="primary" :disabled="!currentId" @click="toBindUserFn">绑定用户</el-button>
    </div>
    <div class="pc-group-tree pc-tree">
      <el-input clearable placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :default-expanded-keys = "defaultExpandedKeys"
        :highlight-current=true
        :expand-on-click-node = false
        :filter-node-method="filterNode"
        accordion
        @node-click="handleNodeClick"
        ref="elTree">
      </el-tree>
    </div>
    <div class="pc-group-edit-panel" v-show="isShowEditForm">
      <div class="pc-page-header pc-group-header">
        <p>
          编辑组织
        </p>
      </div>
      <pc-edit-group :type="methodType" :formData="editGroupFormData" v-show="isShowEditForm" @on-submit="addGroupFn" ref="editGroupForm"></pc-edit-group>
    </div>
    <div class="pc-group-edit-panel" v-show="isShowBindForm">
      <div class="pc-page-header pc-group-header">
        <p>
          绑定用户
        </p>
      </div>
      <pc-bind-user :groupId="currentId" v-if="isShowBindForm"></pc-bind-user>
    </div>
  </div>
</template>
<script>
  import PcEditGroup from '../edit/index.vue';
  import PcBindUser from '../bind-user/index.vue';
  import validate from 'utils/common-method/validate/index';
  export default {
    data() {
      return {
        filterText: '',
        isShowEditForm: false,
        isShowBindForm: false,
        treeData: [],
        methodType: '',
        currentId: '',
        editGroupFormData: {
        },
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'subMenu',
          label: 'menuName'
        }
      };
    },
    components: {
      PcEditGroup, PcBindUser
    },
    watch: {
      filterText(val) {
        this.$refs.elTree.filter(val);
      }
    },
    created () {
      this.initGroupTree();
    },
    computed: {
      // 是否是Admin用户
      isAdmin() {
        return this.$store.getters.getLoginName === 'admin';
      }
    },
    methods: {
      toBindUserFn() {
        this.queryGroupInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editGroupFormData = data;
          this.isShowEditForm = false;
          this.isShowBindForm = true;
        });
      },
      deleteGroupFn() {
        let confirmMsg = '确定删除' + this.editGroupFormData.groupName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/uac/group/deleteById/` + this.currentId, null, () => {
          this.initGroupTree();
        });
      },
      disabledGroupFn () {
        let confirmMsg = '确定禁用' + this.editGroupFormData.groupName + '吗?';
        this.confirmModel(confirmMsg, '/uac/group/modifyStatus', {
          'status': 1,
          'id': this.currentId
        }, () => {
          this.editGroupFormData.status = 1;
        });
      },
      enableGroupFn () {
        let confirmMsg = '确定禁用' + this.editGroupFormData.groupName + '吗?';
        this.confirmModel(confirmMsg, '/uac/group/modifyStatus', {
          'status': 0,
          'id': this.currentId
        }, () => {
          this.editGroupFormData.status = 0;
        });
      },
      addGroupFn() {
        this.initGroupTree();
      },
      /**
       * 新增组织根节点
       */

      toAddGroupFn() {
        this.queryGroupInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.$refs.editGroupForm.resetValidate();
          this.editGroupFormData = {
          };
          this.editGroupFormData.parentGroupName = data.groupName;
          this.editGroupFormData.pid = data.id;
          this.$set(this.editGroupFormData, 'type', '1');
          this.$set(this.editGroupFormData, 'status', 0);
          this.methodType = 'ADD';
          this.isShowBindForm = false;
          this.isShowEditForm = true;
        });
      },
      toModifyGroupFn() {
        this.methodType = 'UPDATE';
        if (this.methodType !== 'VIEW') {
          this.queryGroupInfo((res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.$refs.editGroupForm.resetValidate();
            this.editGroupFormData = data;
            this.isShowEditForm = true;
            this.isShowBindForm = false;
          });
        }
      },
      initGroupTree() {
        this.ajax({
          url: '/uac/group/getTree',
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.treeData = data;
            this.defaultExpandedKeys.push(this.treeData[0].id);
          }
        });
      },
      handleNodeClick(data) {
        if (!data.id) {
          return;
        }
        this.currentId = data.id;
        this.editGroupFormData = data;
        this.queryGroupInfo((res) => {
          let data = res.result;
          console.info('data', data);
          if (!data) {
            return;
          }
          // 显示组织信息面板
          this.editGroupFormData = data;
          this.methodType = 'VIEW';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
          this.$refs.editGroupForm.resetValidate();
        });
      },
      queryGroupInfo(resolve) {
        if (validate.stringIsNullOrEmpty(this.currentId)) {
          this.currentId = '0';
        }
        this.ajax({
          url: `/uac/group/queryById/` + this.currentId,
          success: resolve
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        console.info(value, data);
        return data.menuName.indexOf(value) !== -1;
      }
    }
  };
</script>
