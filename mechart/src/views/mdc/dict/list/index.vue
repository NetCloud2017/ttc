<style rel="stylesheet/scss" lang="scss">
  .pc-dict-operation-panel {
    margin-bottom: 20px;
  }
  .pc-dict-tree {
    display: inline-block;
  }
  .pc-page-content .pc-dict-tree .el-tree-node__content {
    padding-right: 20px;
  }
  .pc-dict-edit-panel {
    display: inline-block;
    vertical-align: top;
  }
  .pc-dict-header {
    margin: 0 0 20px 30px;
  }
</style>
<template>
  <div class="pc-page-content">
    <div class="pc-dict-operation-panel operation-panel">
      <el-button round type="warning" v-if="editDictFormData.status === 10" :disabled="!currentId || currentId === '1'" @click="disabledDictFn">禁用</el-button><!--
      --><el-button round type="primary" v-if="editDictFormData.status === 20" :disabled="!currentId || currentId === '1'" @click="enableDictFn">启用</el-button><!--
      --><el-button round type="primary" :disabled="methodType === 'ADD'  || !currentId" @click="toAddDictFn">添加子节点</el-button><!--
      --><el-button round type="primary" :disabled="methodType === 'UPDATE' || !currentId || currentId === '1'" @click="toModifyDictFn">修改</el-button><!--
      --><el-button round type="danger" :disabled="!currentId || currentId === '1'" @click="deleteDictFn">删除</el-button>
      <el-button round type="danger" @click="refreshDictFn">刷新字典</el-button>
    </div>
    <div class="pc-dict-tree pc-tree">
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
    <div class="pc-dict-edit-panel" v-show="isShowEditForm">
      <div class="pc-page-header pc-dict-header">
        <p>
          编辑字典
        </p>
      </div>
      <pc-edit-dict :type="methodType" :data="editDictFormData" v-if="isShowEditForm" @on-submit="addDictFn" ref="editDictForm"/>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import PcEditDict from '../edit/index.vue';
  export default {
    data() {
      return {
        filterText: '',
        isShowEditForm: false,
        isShowBindForm: false,
        treeData: [],
        methodType: '',
        currentId: '',
        editDictFormData: {
        },
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'dictName'
        }
      };
    },
    components: {
      PcEditDict
    },
    watch: {
      filterText(val) {
        this.$refs.elTree.filter(val);
      }
    },
    created () {
      this.initDictTree();
    },
    methods: {
      toBindActionFn() {
        this.queryDictInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editDictFormData = data;
          this.isShowEditForm = false;
          this.isShowBindForm = true;
        });
      },
      deleteDictFn() {
        let confirmMsg = '确定删除' + this.editDictFormData.dictName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/mdc/dict/deleteById/` + this.currentId, null, () => {
          this.initDictTree();
        });
      },
      disabledDictFn () {
        let confirmMsg = '确定禁用' + this.editDictFormData.dictName + '吗?';
        this.confirmModel(confirmMsg, '/mdc/dict/modifyStatus', {
          'status': 20,
          'id': this.currentId
        }, () => {
          this.editDictFormData.status = 20;
        });
      },
      enableDictFn () {
        let confirmMsg = '确定启用' + this.editDictFormData.dictName + '吗?';
        this.confirmModel(confirmMsg, '/mdc/dict/modifyStatus', {
          'status': 10,
          'id': this.currentId
        }, () => {
          this.editDictFormData.status = 10;
        });
      },
      addDictFn() {
        this.initDictTree();
      },
      toAddDictFn() {
        this.queryDictInfo((res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.editDictFormData = {};
          this.editDictFormData.parentDictName = data.dictName;
          this.editDictFormData.pid = data.id;
          this.methodType = 'ADD';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
          console.info(this.editDictFormData);
        });
      },
      toModifyDictFn() {
        this.methodType = 'UPDATE';
        if (this.methodType !== 'VIEW') {
          this.queryDictInfo((res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.editDictFormData = data;
            this.isShowEditForm = true;
            this.isShowBindForm = false;
          });
        }
      },
      initDictTree() {
        this.ajax({
          url: '/mdc/dict/getTree',
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
        this.queryDictInfo((res) => {
          let data = res.result;
          console.info('data', data);
          if (!data) {
            return;
          }
          // 显示组织信息面板
          this.editDictFormData = data;
          this.methodType = 'VIEW';
          this.isShowEditForm = true;
          this.isShowBindForm = false;
        });
      },
      queryDictInfo(resolve) {
        this.ajax({
          url: `/mdc/dict/queryById/` + this.currentId,
          success: resolve
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        console.info(value, data);
        return data.dictName.indexOf(value) !== -1;
      },
      // 刷新字典缓存数据
      refreshDictFn() {
        this.ajax({
          type: 'GET',
          url: `/maliwms/dict/cleanDictCache`,
          success: (res) => {
            if (res.code === 200) {
              this.successTip(res.message, 3000);
            }
          }
        });
      }
    }
  };
</script>
