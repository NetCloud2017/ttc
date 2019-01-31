<style rel="stylesheet/scss" lang="scss">
  .pc-category-operation-panel {
    margin-bottom: 20px;
  }
  .pc-category-tree {
    display: inline-block;
  }
  .pc-page-content .pc-category-tree .el-tree-node__content {
    padding-right: 20px;
  }
  .pc-category-edit-panel {
    display: inline-block;
    vertical-align: top;
  }
  .pc-category-header {
    margin: 0 0 20px 30px;
  }
</style>
<template>
  <div class="pc-page-content">
    <div class="pc-category-operation-panel operation-panel">
      <el-button round type="warning" v-if="editCategoryFormData.status === 1" :disabled="!currentId || currentId === '1'" @click="disabledCategoryFn">禁用</el-button><!--
      --><el-button round type="primary" v-if="editCategoryFormData.status === 2" :disabled="!currentId || currentId === '1'" @click="enableCategoryFn">启用</el-button><!--
      --><el-button round type="primary" :disabled="methodType === 'ADD'  || !currentId" @click="toAddCategoryFn">添加子节点</el-button><!--
      --><el-button round type="primary" :disabled="methodType === 'UPDATE' || !currentId || currentId === '1'" @click="toModifyCategoryFn">修改</el-button><!--
      --><el-button round type="danger" :disabled="!currentId || currentId === '1'" @click="deleteCategoryFn">删除</el-button>
    </div>
    <div class="pc-category-tree pc-tree">
      <el-input placeholder="输入关键字进行过滤" clearable v-model="filterText"> </el-input>
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
    <div class="pc-category-edit-panel" v-show="isShowEditForm">
      <div class="pc-page-header pc-category-header">
        <p>
          编辑分类
        </p>
      </div>
      <pc-edit-category :type="methodType" :data="editCategoryFormData" v-if="isShowEditForm" @on-submit="addCategoryFn" ref="editCategoryForm"/>
    </div>
  </div>
</template>
<script>
  import PcEditCategory from '../edit/index.vue';
  export default {
    data() {
      return {
        filterText: '',
        isShowEditForm: false,
        isShowBindForm: false,
        treeData: [],
        methodType: '',
        currentId: '',
        editCategoryFormData: {
        },
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      };
    },
    components: {
      PcEditCategory
    },
    watch: {
      filterText(val) {
        this.$refs.elTree.filter(val);
      }
    },
    created () {
      this.initCategoryTree();
    },
    methods: {
      toBindActionFn() {
        this.queryCategoryInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editCategoryFormData = data;
          this.isShowEditForm = false;
          this.isShowBindForm = true;
        });
      },
      deleteCategoryFn() {
        let confirmMsg = '确定删除' + this.editCategoryFormData.name + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/mdc/category/deleteById/` + this.currentId, null, () => {
          this.initCategoryTree();
        });
      },
      disabledCategoryFn () {
        let confirmMsg = '确定禁用' + this.editCategoryFormData.name + '吗?';
        this.confirmModel(confirmMsg, '/mdc/category/modifyStatus', {
          'status': 2,
          'id': this.currentId
        }, () => {
          this.editCategoryFormData.status = 2;
        });
      },
      enableCategoryFn () {
        let confirmMsg = '确定启用' + this.editCategoryFormData.name + '吗?';
        this.confirmModel(confirmMsg, '/mdc/category/modifyStatus', {
          'status': 1,
          'id': this.currentId
        }, () => {
          this.editCategoryFormData.status = 1;
        });
      },
      addCategoryFn() {
        this.initCategoryTree();
      },
      toAddCategoryFn() {
        this.queryCategoryInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editCategoryFormData = {};
          this.editCategoryFormData.parentCategoryName = data.name;
          this.editCategoryFormData.pid = data.id;
          this.methodType = 'ADD';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
          console.info(this.editCategoryFormData);
        });
      },
      toModifyCategoryFn() {
        this.methodType = 'UPDATE';
        if (this.methodType !== 'VIEW') {
          this.queryCategoryInfo((res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.editCategoryFormData = data;
            this.isShowEditForm = true;
            this.isShowBindForm = false;
          });
        }
      },
      initCategoryTree() {
        this.ajax({
          url: '/mdc/category/getTree',
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
        this.queryCategoryInfo((res) => {
          let data = res.result;
          console.info('data', data);
          if (!data) {
            return;
          }
          // 显示组织信息面板
          this.editCategoryFormData = data;
          this.methodType = 'VIEW';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
        });
      },
      queryCategoryInfo(resolve) {
        this.ajax({
          url: `/mdc/category/queryById/` + this.currentId,
          success: resolve
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        console.info(value, data);
        return data.name.indexOf(value) !== -1;
      }
    }
  };
</script>
