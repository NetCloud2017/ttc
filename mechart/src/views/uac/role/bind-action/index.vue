<style rel="stylesheet/scss" lang="scss">
  .el-tree {
    max-height: 450px;
    margin-bottom:15px;
    overflow: auto;
  }
</style>

<template>
  <div class="pc-page-content">
    <div class="pc-page-header">
      <p>
        分配权限
      </p>
    </div>
    <el-form :inline="true" :model="roleForm" ref="roleForm" label-width="100px">
      <el-form-item label="角色名称">
        <el-input v-model="roleForm.roleName" clearable class="pc-input-readonly-color pc-input-col3" :readonly=true></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="roleForm.roleCode" clearable class="pc-input-readonly-color pc-input-col3" :readonly=true></el-input>
      </el-form-item>
      <el-tree ref="tree" :data="treeData" show-checkbox node-key="id"
               :default-expanded-keys="defaultExpandedKeys"
               :default-checked-keys="defaultCheckedKeys"
               :props="defaultProps">
      </el-tree>
      <el-form-item label=" ">
        <el-button type="primary" @click="submit">保 存</el-button>
        <el-button @click="goBack">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        roleForm: this.$route.query,
        treeData: [],
        defaultExpandedKeys: [],
        defaultCheckedKeys: [],
        defaultProps: {
          children: 'subMenu',
          label: 'menuName'
        }
      };
    },
    created() {
      this.initAuthTree();
    },
    methods: {
      initAuthTree() {
        this.ajax({
          url: `/uac/role/getActionTreeByRoleId/${this.roleForm.id}`,
          loading: true,
          success: (res) => {
            if (res.code === 500) {
              this.goBack();
            }
            let data = res.result;
            if (!data) {
              return;
            }
            this.treeData = data.authTree;
            this.defaultCheckedKeys = data.checkedAuthList;
            this.defaultExpandedKeys.push(this.treeData[0].id);
          }
        });
      },
      submit() {
        let confirmMsg = '确定保存' + this.roleForm.roleName + '的权限吗?';
        let param = {};
        let actionIdList = [];
        let menuIdList = [];
        param.roleId = this.roleForm.id;
        let checkedNodeList = this.$refs.tree.getCheckedNodes(true);
        checkedNodeList.forEach((item) => {
          if (item.remark === 'menu') {
            menuIdList.push(item.id);
          } else {
            actionIdList.push(item.id);
          }
        });
        param.actionIdList = actionIdList;
        param.menuIdList = menuIdList;
        this.confirmModel(confirmMsg, '/uac/role/bindAction', param, () => {
          this.goBack();
        });
      }
    }
  };
</script>
