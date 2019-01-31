<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="createTimeQuery">
          <el-date-picker class="pc-input-col3"
                          v-model="createTimeQuery"
                          type="daterange"
                          :editable="false"
                          :picker-options="createTimeOptions"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="right" @change="changeCreateTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="creator">
          <el-input size="small" clearable v-model="searchForm.creator" class="pc-input3-col5" placeholder="操作人"></el-input>
        </el-form-item>
        <el-form-item label="" prop="exceptionCause">
          <el-input size="small" clearable v-model="searchForm.exceptionCause" class="pc-input3-col5" placeholder="异常原因"></el-input>
        </el-form-item>
        <el-form-item label="" prop="exceptionStack">
          <el-input size="small" clearable v-model="searchForm.exceptionStack" class="pc-input3-col5" placeholder="异常信息"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" @click="queryDataFn">筛选</el-button>
          <el-button size="small" @click="resetFromFn('searchForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData"  border tooltip-effect="dark" stripe max-height="460" style="width: 100%">
      <el-table-column
        label="序号"
        width="70">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="applicationName"
        label="系统名称"
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="exceptionSimpleName"
        label="异常名称"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="操作人"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="操作时间"
        min-width="150">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="147">
        <template slot-scope="scope">
          <div>
            <el-button type="primary" plain @click="showExceptionLog(scope.row)">查看</el-button>
            <el-button type="danger" plain  @click="downloadExceptionLog(scope.row)">下载</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryActionList" :queryData="searchForm" @on-query="queryCallBackFn" />
    </div>

    <el-dialog :title="detailTitle" :visible.sync="isShowDetailDialog" size="tiny" @close="isShowDetailDialog = false" @open="showDetailFn">
      <pc-exception-detail ref="exceptionDetailForm" v-if="detailIndex > -1" :formData="tableData[detailIndex]" />
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="detailIndex === 0" size="small" type="primary" @click="detailIndex = detailIndex - 1">上一页</el-button>
        <el-button :disabled="detailIndex === tableData.length - 1" size="small" @click="detailIndex = detailIndex + 1">下一页</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  import PcExceptionDetail from '../detail/index.vue';
  import {validateTips} from 'utils/tips';
  export default {
    data () {
      return {
        fit: false,
        createTimeQuery: '',
        detailIndex: -1,
        detailTitle: '异常详情',
        isShowDetailDialog: false,
        searchForm: {
          exceptionCause: '',
          exceptionStack: '',
          creator: '',
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
          queryActionList: '/mdc/exception/queryListWithPage'
        }
      };
    },
    components: {
      PcPagination,
      PcExceptionDetail
    },
    watch: {
      detailIndex(index) {
        this.isShowDetailDialog = true;
        if (this.$refs.exceptionDetailForm) {
          this.$refs.exceptionDetailForm.showFn(this.tableData[this.detailIndex]);
        }
      }
    },
    methods: {
      showDetailFn() {
        // 临时解决 https://segmentfault.com/q/1010000008757348/a-1020000009542281
        this.$nextTick(() => {
          this.$refs.exceptionDetailForm.showFn(this.tableData[this.detailIndex]);
        });
      },
      downloadExceptionLog (exception) {
        this.errorTip(validateTips.NOT_OPEN);
      },
      showExceptionLog (exception) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id === exception.id) {
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
