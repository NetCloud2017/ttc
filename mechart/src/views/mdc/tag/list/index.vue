<template>
  <div>
    <el-form :inline="true" :model="tagForm" ref="tagForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="tagForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="topicCode">
          <el-input v-model="tagForm.tagCode" clearable class="pc-input3-col3" placeholder="Tag编码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="topicName">
          <el-input  v-model="tagForm.tagName" clearable class="pc-input3-col3" placeholder="Tag名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button type="primary" @click="refresh('tagForm')">刷新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData" border  ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
        <el-table-column type="index" label="序号" width="75"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="65">
          <template slot-scope="scope">
            {{scope.row.status | statusToChinese}}
          </template>
        </el-table-column>
        <el-table-column prop="topicName" label="Topic名称" min-width="100"></el-table-column>
        <el-table-column prop="topicCode" label="Topic编码" min-width="150"></el-table-column>
        <el-table-column prop="tagName" label="Tag名称" min-width="120"></el-table-column>
        <el-table-column prop="tagCode" label="Tag编码" min-width="200"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="150"></el-table-column>
        <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180  ">
          <template slot-scope="scope">
            <el-button type="danger" plain v-if="scope.row.status === 10"  @click="disabledTagFn(scope)">禁用</el-button>
            <el-button type="primary" plain v-if="scope.row.status === 20"  @click="enableTagFn(scope)">启用</el-button>
            <el-button type="danger" plain @click="deleteTagFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="$store.getters.getAjaxUrl.tpc.mq.queryTagListWithPage" :queryData="tagForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  export default {
    data () {
      return {
        tagForm: {
          tagCode: '',
          tagName: '',
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
      disabledTagFn (scope) {
        let confirmMsg = '确定禁用' + scope.row.tagName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyTagStatusById, {
          'status': 20,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableTagFn (scope) {
        let confirmMsg = '确定启用' + scope.row.tagName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyTagStatusById, {
          'status': 10,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      deleteTagFn (tag) {
        let confirmMsg = '确定删除' + tag.tagName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.deleteTagById + '/' + `${tag.id}`, null, () => {
          this.queryDataFn();
        });
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
