<template>
  <div>
    <el-form :inline="true" :model="topicForm" ref="topicForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="topicForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="topicCode">
          <el-input v-model="topicForm.topicCode" clearable class="pc-input3-col3" placeholder="Topic编码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="topicName">
          <el-input  v-model="topicForm.topicName" clearable class="pc-input3-col3" placeholder="Topic名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button type="primary" @click="refresh('topicForm')">刷新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData"  border ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table v-if="scope.row.tagVoList && scope.row.tagVoList.length > 0" :data="scope.row.tagVoList">
            <el-table-column prop="status" label="状态" min-width="65">
              <template slot-scope="props">
                {{props.row.status | statusToChinese}}
              </template>
            </el-table-column>
            <el-table-column label="tag编码" prop="tagCode" min-width="150"></el-table-column>
            <el-table-column label="tag名称" prop="tagName" min-width="150"></el-table-column>
            <el-table-column prop="updateTime" label="操作时间" min-width="150"></el-table-column>
            <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="75"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="65">
        <template slot-scope="scope">
          {{scope.row.status | statusToChinese}}
        </template>
      </el-table-column>
      <el-table-column prop="topicName" label="Topic名称" min-width="100">
        <template slot-scope="scope">
          {{scope.row.topicName}}
        </template>
      </el-table-column>
      <el-table-column prop="topicCode" label="Topic编码" min-width="150"></el-table-column>
      <el-table-column prop="updateTime" label="操作时间" min-width="150"></el-table-column>
      <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="310">
        <template slot-scope="scope">
          <el-button type="danger" plain v-if="scope.row.status === 10"  @click="disabledTopicFn(scope)">禁用</el-button>
          <el-button type="primary" plain v-if="scope.row.status === 20" class="pc-textBtn" @click="enableTopicFn(scope)">启用</el-button>
          <el-button type="primary" plain @click="toApplyReleaseFn(scope.row)">申请发布</el-button>
          <el-button type="danger" plain  @click="toApplySubscribeFn(scope.row)">申请订阅</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  import {validateTips} from 'utils/tips';
  export default {
    data () {
      return {
        topicForm: {
          topicCode: '',
          topicName: '',
          status: ''
        },
        statusOption: [{
          value: 10,
          label: '启用'
        }, {
          value: 20,
          label: '禁用'
        }],
        tableData: [],
        emptyText: ''
      };
    },
    components: {
      PcPagination
    },
    created() {
      this.queryDataFn();
    },
    filters: {
      statusToChinese (val) {
        let state = '';
        switch (val) {
          case 10: {
            state = '启用';
            break;
          }
          case 20: {
            state = '禁用';
            break;
          }
        }
        return state;
      }
    },
    methods: {
      refresh (formName) {
        this.$refs[formName].resetFields();
        this.queryDataFn();
      },
      disabledTopicFn (scope) {
        let confirmMsg = '确定禁用' + scope.row.topicName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyTopicStatusById, {
          'status': 20,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableTopicFn (scope) {
        let confirmMsg = '确定启用' + scope.row.topicName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyTopicStatusById, {
          'status': 10,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      toApplyReleaseFn() {
        this.errorTip(validateTips.NOT_OPEN);
      },
      toApplySubscribeFn() {
        this.errorTip(validateTips.NOT_OPEN);
      },
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.ajax({
          url: this.$store.getters.getAjaxUrl.tpc.mq.queryTopicListWithPage,
          data: this.topicForm,
          loading: true,
          success: (res) => {
            setTimeout(() => {
              this.$pcNProgress.done();
            }, 300);
            this.tableData = res.result;
          }
        });
      }
    }
  };
</script>
