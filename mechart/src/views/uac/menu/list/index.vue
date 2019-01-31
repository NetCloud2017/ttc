<style rel="stylesheet/scss" lang="scss">
  .pc-menu-operation-panel {
    margin-bottom: 20px;
  }
  .pc-menu-tree {
    display: inline-block;
  }
  .pc-page-content .pc-menu-tree .el-tree-node__content {
    padding-right: 20px;
  }
  .pc-menu-edit-panel {
    display: inline-block;
    vertical-align: top;
  }
  .pc-menu-header {
    margin: 0 0 20px 20px;
  }
</style>
<template>
  <div class="pc-page-content">
    <div class="pc-menu-operation-panel operation-panel">
      <el-button round type="warning" v-if="editMenuFormData.status === 'ENABLE'" :disabled="!currentId || currentId === '1'" @click="disabledMenuFn">禁用</el-button><!--
      --><el-button round type="success" v-if="editMenuFormData.status === 'DISABLE'" :disabled="!currentId || currentId === '1'" @click="enableMenuFn">启用</el-button><!--
      --><el-button round type="primary" :disabled="methodType === 'ADD'  || !currentId" @click="toAddMenuFn">添加子节点</el-button><!--
      --><el-button round type="primary" :disabled="methodType === 'UPDATE' || !currentId || currentId === '1'" @click="toModifyMenuFn">修改</el-button><!--
      --><el-button round type="danger" :disabled="!currentId || currentId === '1'" @click="deleteMenuFn">删除</el-button>
      <!--<el-button type="text" :disabled="!currentId" @click="toBindActionFn">绑定权限</el-button>-->
    </div>
    <div class="pc-menu-tree pc-tree">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable> </el-input>
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
    <div class="pc-menu-edit-panel" v-show="isShowEditForm">
      <div class="pc-page-header pc-menu-header">
        <p>
          编辑菜单
        </p>
      </div>
      <pc-edit-menu :type="methodType" :data="editMenuFormData" v-if="isShowEditForm" @on-submit="addMenuFn" ref="editMenuForm"/>
    </div>
    <div class="pc-menu-edit-panel" v-show="isShowBindForm">
      <div class="pc-page-header pc-menu-header">
        <p>
          绑定权限
        </p>
      </div>
      <pc-bind-action :menuId="currentId" v-if="isShowBindForm"/>
    </div>
  </div>
</template>
<script>
  import PcEditMenu from '../edit/index.vue';
  import PcBindAction from '../bind-action/index.vue';
  export default {
    data() {
      return {
        filterText: '',
        isShowEditForm: false,
        isShowBindForm: false,
        treeData: [],
        methodType: '',
        currentId: '',
        editMenuFormData: {
        },
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'subMenu',
          label: 'menuName'
        }
      };
    },
    components: {
      PcEditMenu, PcBindAction
    },
    watch: {
      filterText(val) {
        this.$refs.elTree.filter(val);
      }
    },
    created () {
      this.initMenuTree();
    },
    methods: {
      toBindActionFn() {
        this.queryMenuInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editMenuFormData = data;
          this.isShowEditForm = false;
          this.isShowBindForm = true;
        });
      },
      deleteMenuFn() {
        let confirmMsg = '确定删除' + this.editMenuFormData.menuName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/uac/menu/deleteById/` + this.currentId, null, () => {
          this.initMenuTree();
        });
      },
      disabledMenuFn () {
        let confirmMsg = '确定禁用' + this.editMenuFormData.menuName + '吗?';
        this.confirmModel(confirmMsg, '/uac/menu/modifyStatus', {
          'status': 'DISABLE',
          'id': this.currentId
        }, () => {
          this.editMenuFormData.status = 'DISABLE';
        });
      },
      enableMenuFn () {
        let confirmMsg = '确定启用' + this.editMenuFormData.menuName + '吗?';
        this.confirmModel(confirmMsg, '/uac/menu/modifyStatus', {
          'status': 'ENABLE',
          'id': this.currentId
        }, () => {
          this.editMenuFormData.status = 'ENABLE';
        });
      },
      addMenuFn() {
        this.initMenuTree();
      },
      toAddMenuFn() {
        this.queryMenuInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editMenuFormData = {};
          this.editMenuFormData.parentMenuName = data.menuName;
          this.editMenuFormData.pid = data.id;
          this.$set(this.editMenuFormData, 'icon', '');
          this.methodType = 'ADD';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
          console.info(this.editMenuFormData);
        });
      },
      toModifyMenuFn() {
        this.methodType = 'UPDATE';
        if (this.methodType !== 'VIEW') {
          this.queryMenuInfo((res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.editMenuFormData = data;
            this.isShowEditForm = true;
            this.isShowBindForm = false;
          });
        }
      },
      initMenuTree() {
        this.ajax({
          url: '/uac/menu/getTree/',
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
        this.queryMenuInfo((res) => {
          let data = res.result;
          console.info('data', data);
          if (!data) {
            return;
          }
          // 显示组织信息面板
          this.editMenuFormData = data;
          this.methodType = 'VIEW';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
        });
      },
      queryMenuInfo(resolve) {
        this.ajax({
          url: `/uac/menu/queryById/` + this.currentId,
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
