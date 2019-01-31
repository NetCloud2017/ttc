<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="createTimeQuery">
          <el-date-picker class="pc-input-col3"
                          v-model="searchForm.createTimeQuery"
                          type="daterange"
                          :editable="false"
                          :picker-options="createTimeOptions"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right" @change="changeCreateTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="messageStatus">
          <el-select v-model="searchForm.messageStatus" filterable placeholder="状态" class="pc-input3-col5">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="messageTopic">
          <el-input size="small" clearable v-model="searchForm.messageTopic" class="pc-input3-col5" placeholder="messageTopic"></el-input>
        </el-form-item>
        <el-form-item label="" prop="messageKey">
          <el-input size="small" clearable v-model="searchForm.messageKey" class="pc-input3-col5" placeholder="messageKey"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" @click="queryDataFn">筛选</el-button>
          <el-button type="primary" @click="refresh('searchForm')">刷新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData" border tooltip-effect="dark" stripe max-height="450" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table v-if="scope.row.mqConfirmVoList && scope.row.mqConfirmVoList.length > 0" :data="scope.row.mqConfirmVoList">
            <el-table-column prop="status" label="状态" min-width="65">
              <template slot-scope="props">
                {{props.row.status | getConfirmStatusToChinese}}
              </template>
            </el-table-column>
            <el-table-column label="CID" prop="consumerCode" min-width="150"></el-table-column>
            <el-table-column label="消费次数" prop="consumeCount" min-width="150"></el-table-column>
            <el-table-column prop="createdTime" label="创建时间" min-width="150"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" min-width="150"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="75"></el-table-column>
      <el-table-column prop="messageTopic" label="Topic" min-width="150"></el-table-column>
      <el-table-column prop="messageTag" label="Tag" min-width="265"></el-table-column>
      <el-table-column prop="messageKey" show-overflow-tooltip  label="Key" min-width="100"></el-table-column>
      <el-table-column prop="producerGroup" label="PID" min-width="150"></el-table-column>
      <el-table-column prop="messageStatus" label="状态" min-width="150">
        <template slot-scope="scope">
          {{scope.row.messageStatus | statusToChinese}}
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" min-width="170"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="170"></el-table-column>
      <el-table-column prop="resendTimes" label="重发次数" min-width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" plain  @click="showMessageLog(scope.row)">查看</el-button>
            <el-button type="danger" plain   v-if="scope.row.messageStatus !== 30" @click="resendMessageLog(scope.row)">重发</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryActionList" :queryData="searchForm" @on-query="queryCallBackFn" />
    </div>

    <el-dialog :title="detailTitle" fullscreen :visible.sync="isShowDetailDialog" size="tiny" @close="isShowDetailDialog = false" @open="showDetailFn">
      <reliable-message-detail ref="reliableMessageDetailForm" v-if="detailIndex > -1" :formData="tableData[detailIndex]" />
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="detailIndex === 0" size="small" type="primary" @click="detailIndex = detailIndex - 1">上一页</el-button>
        <el-button :disabled="detailIndex === tableData.length - 1" size="small" @click="detailIndex = detailIndex + 1">下一页</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  import ReliableMessageDetail from '../detail/index.vue';
  export default {
    data () {
      return {
        fit: false,
        detailIndex: -1,
        detailTitle: '消息详情',
        isShowDetailDialog: false,
        searchForm: {
          messageTopic: '',
          messageKey: '',
          startQueryTime: '',
          endQueryTime: ''
        },
        createTimeOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableData: [],
        emptyText: '',
        pageUrl: {
          queryActionList: '/tpc/message/queryReliableListWithPage'
        },
        statusOption: [{
          value: 10,
          label: '未发送'
        }, {
          value: 20,
          label: '已发送'
        }, {
          value: 30,
          label: '已完成'
        }]
      };
    },
    filters: {
      getConfirmStatusToChinese(val) {
        let state = '';
        switch (val) {
          case 10: {
            state = '未确认';
            break;
          }
          case 20: {
            state = '已确认';
            break;
          }
          case 30: {
            state = '已消费';
            break;
          }
        }
        return state;
      },
      statusToChinese (val) {
        let state = '';
        switch (val) {
          case 10: {
            state = '未发送';
            break;
          }
          case 20: {
            state = '已发送';
            break;
          }
          case 30: {
            state = '已完成';
            break;
          }
        }
        return state;
      }
    },
    components: {
      PcPagination,
      ReliableMessageDetail
    },
    watch: {
      detailIndex(index) {
        this.isShowDetailDialog = true;
        if (this.$refs.reliableMessageDetailForm) {
          this.$refs.reliableMessageDetailForm.showFn(this.tableData[this.detailIndex]);
        }
      }
    },
    methods: {
      refresh (formName) {
        this.$refs[formName].resetFields();
        this.queryDataFn();
      },
      showDetailFn() {
        // 临时解决 https://segmentfault.com/q/1010000008757348/a-1020000009542281
        this.$nextTick(() => {
          this.$refs.reliableMessageDetailForm.showFn(this.tableData[this.detailIndex]);
        });
      },
      resendMessageLog (message) {
        let confirmMsg = '确定重发' + message.messageKey + '吗?';
        this.confirmModel(confirmMsg, '/tpc/message/resendMessageById/' + message.id, null, (res) => {
          if (res && res.code === 200) {
            this.queryDataFn();
          }
        });
      },
      showMessageLog (message) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === message.id) {
            this.detailIndex = i;
            break;
          }
        }
      },
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      },
      changeCreateTime (createdTimeList) {
        console.info('createdTimeList', createdTimeList);
        if (createdTimeList[0] !== undefined && createdTimeList[0] !== null) {
          let date = new Date(createdTimeList[0]);
          this.searchForm.startQueryTime = this.dateFormat(date) + ' 00:00:00';
          date = new Date(createdTimeList[1]);
          this.searchForm.endQueryTime = this.dateFormat(date) + ' 23:59:59';
        }
      },
      dateFormat (date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
      }
    }
  };
</script>
