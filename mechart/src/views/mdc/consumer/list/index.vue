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
          <el-table v-if="scope.row.mqTopicVoList && scope.row.mqTopicVoList.length > 0" :data="scope.row.mqTopicVoList">
            <el-table-column prop="status" label="状态" min-width="65">
              <template slot-scope="props">
                {{props.row.status | statusToChinese}}
              </template>
            </el-table-column>
            <el-table-column label="topic编码" prop="topicCode" min-width="150"></el-table-column>
            <el-table-column label="topic名称" prop="topicName" min-width="150"></el-table-column>
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
      <el-table-column prop="consumerName" label="消费者名称" min-width="100">
        <template slot-scope="scope">
          {{scope.row.consumerName}}
        </template>
      </el-table-column>
      <el-table-column prop="consumerCode" label="消费者编码" min-width="150"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="150"></el-table-column>
      <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="175">
        <template slot-scope="scope">
          <el-button type="danger" plain v-if="scope.row.status === 10"  @click="disabledConsumerFn(scope)">禁用</el-button>
          <el-button type="primary" plain v-if="scope.row.status === 20"  @click="enableConsumerFn(scope)">启用</el-button>
          <el-button type="danger" plain @click="deleteConsumerFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      deleteConsumerFn (consumer) {
        let confirmMsg = '确定删除' + consumer.consumerName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.deleteConsumerById + '/' + `${consumer.id}`, null, () => {
          this.queryDataFn();
        });
      },
      queryDataFn () {
        this.ajax({
          url: this.$store.getters.getAjaxUrl.tpc.mq.queryConsumerListWithPage,
          data: this.consumerForm,
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
