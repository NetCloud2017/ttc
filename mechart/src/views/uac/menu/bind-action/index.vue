<template>
  <div>
    <el-form :inline="true">
      <div class="pc-addBtn-panel">
        <el-button size="small" type="primary" @click="batchBindActionFn">批量绑定</el-button>
      </div>
    </el-form>
    <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" stripe @selection-change="handleSelectionChange" :empty-text='emptyText'>
      <el-table-column type="selection" width="55px"></el-table-column>
      <el-table-column prop="actionName" label="权限名称">
        <template slot-scope="scope">
          {{scope.row.actionName}}
        </template>
      </el-table-column>
      <el-table-column prop="actionCode" label="权限编码" min-width="100"></el-table-column>
      <el-table-column prop="url" label="URL地址" min-width="100"></el-table-column>
      <el-table-column prop="menuName" label="菜单名称" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.id !== 1">
            <el-button type="text" class="pc-textBtn" @click="bindActionFn(scope.row, true)">绑定</el-button>
            <el-button type="text" class="pc-textBtn-danger" @click="bindActionFn(scope.row, false)">取消绑定</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {validateTips} from 'utils/tips';
  export default {
    props: {
      menuId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        bindActionIdArr: [],
        tableData: [],
        menuIdList: [],
        emptyText: '',
        checkDisabled: false
      };
    },
    created () {
      this.queryListWithPageFn();
      this.changeUserIdArr = [];
    },
    methods: {
      handleSelectionChange(actionList) {
        this.bindActionIdArr = [];
        actionList.forEach((item) => {
          this.bindActionIdArr.push(item.id);
        });
        this.checkDisabled = this.bindActionIdArr.length < 1;
      },
      batchBindActionFn() {
        alert('批量绑定');
      },
      bindActionFn(action, flag) {
        alert('绑定');
      },
      queryListWithPageFn () {
        if (!this.menuId) {
          alert(validateTips.BIND_MENU);
          return;
        }
        this.ajax({
          url: '/uac/action/queryListByMenuId',
          data: {
            menuId: this.menuId
          },
          loading: true,
          success: (res) => {
            setTimeout(() => {
              this.$pcNProgress.done();
            }, 300);
            this.tableData = res.result.list;
          }
        });
      }
    }
  };
</script>
