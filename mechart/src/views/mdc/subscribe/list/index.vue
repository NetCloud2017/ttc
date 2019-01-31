<template>
  <div>
    <el-form :inline="true" :model="consumerForm" ref="consumerForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="consumerForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="topicCode">
          <el-input v-model="consumerForm.consumerCode" clearable class="pc-input3-col3" placeholder="消费者编码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="topicName">
          <el-input  v-model="consumerForm.consumerName" clearable class="pc-input3-col3" placeholder="消费者名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button type="primary" @click="refresh('consumerForm')">刷新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData" border  ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table v-if="scope.row.tagVoList && scope.row.tagVoList.length > 0" :data="scope.row.tagVoList">
            <el-table-column prop="status" label="状态" min-width="65">
              <template slot-scope="props">
                {{props.row.status | statusToChinese}}
              </template>
            </el-table-column>
            <el-table-column label="topic编码" prop="tagCode" min-width="150"></el-table-column>
            <el-table-column label="topic名称" prop="tagName" min-width="150"></el-table-column>
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
      <el-table-column prop="topicCode" label="topic编码" min-width="150"></el-table-column>
      <el-table-column prop="topicName" label="topic名称" min-width="150"></el-table-column>
      <el-table-column prop="consumerName" label="消费者名称" min-width="100">
        <template slot-scope="scope">
          {{scope.row.consumerName}}
        </template>
      </el-table-column>
      <el-table-column prop="consumerCode" label="消费者编码" min-width="150"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="150"></el-table-column>
      <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="102">
        <template slot-scope="scope">
          <el-button type="danger" plain  @click="toApplySubscribeFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="$store.getters.getAjaxUrl.tpc.mq.querySubscribeListWithPage" :queryData="consumerForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  export default {
    data () {
      return {
        consumerForm: {
          consumerCode: '',
          consumerName: '',
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
    created () {
    },
    methods: {
      refresh (formName) {
        this.$refs[formName].resetFields();
        this.queryDataFn();
      },
      disabledConsumerFn (scope) {
        let confirmMsg = '确定禁用' + scope.row.consumerName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyConsumerStatusById, {
          'status': 20,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableConsumerFn (scope) {
        let confirmMsg = '确定启用' + scope.row.consumerName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyConsumerStatusById, {
          'status': 10,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      toApplyReleaseFn() {
        alert('申请发布');
      },
      toApplySubscribeFn() {
        alert('申请订阅');
      },
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      }
    }
  };
</script>
