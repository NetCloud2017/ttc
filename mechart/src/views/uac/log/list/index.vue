<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="menuIdList">
          <el-cascader
            size="small"
            placeholder="请选择菜单"
            :options="menuTreeData"
            filterable
            clearable
            change-on-select
            v-model="searchForm.menuIdList"
            :props="menuProps"
            class="pc-input-col3">
          </el-cascader>
        </el-form-item>
        <el-form-item label="" prop="creator">
          <el-select size="small" class="pc-input3-col5" v-model="searchForm.logType" filterable placeholder="日志类型">
            <el-option v-for="item in logTypeList" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="actionCode">
          <el-input size="small" clearable v-model="searchForm.actionCode" class="pc-input3-col5" placeholder="权限编码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="actionName">
          <el-input size="small" v-model="searchForm.actionName" class="pc-input3-col5" placeholder="权限名称"></el-input>
        </el-form-item>
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
        <el-form-item label="" prop="ip">
          <el-input size="small" clearable v-model="searchForm.ip" class="pc-input3-col5" placeholder="登录IP"></el-input>
        </el-form-item>
        <el-form-item label="" prop="location">
          <el-input size="small" clearable v-model="searchForm.location" class="pc-input3-col5" placeholder="登录城市"></el-input>
        </el-form-item>
        <el-form-item label="" prop="creator">
          <el-input size="small" clearable v-model="searchForm.creator" class="pc-input3-col5" placeholder="操作人"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" type="primary" @click="queryDataFn">筛选</el-button>
          <el-button size="small" @click="resetFromFn('searchForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData"  border tooltip-effect="dark" stripe max-height="450" style="width: 100%">
          <el-table-column
            label="序号"
            width="70">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="location"
            label="操作位置"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="logName"
            label="日志类型"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="actionName"
            label="业务类型"
            min-width="190">
          </el-table-column>
          <el-table-column
            prop="os"
            label="操作系统"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="browser"
            label="浏览器"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP地址"
            min-width="130">
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="组织名称"
            min-width="120">
          </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始执行时间"
        min-width="170">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="截至执行时间"
        min-width="170">
      </el-table-column>
          <el-table-column
            prop="excuteTime"
            label="执行时间"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop="creator"
            label="操作人"
            min-width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="createdTime"
            label="操作时间"
            min-width="170">
          </el-table-column>
        </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryActionList" :queryData="searchForm" @on-query="queryCallBackFn" />
    </div>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  export default {
    data () {
      return {
        fit: false,
        menuTreeData: [],
        createTimeQuery: '',
        menuProps: {
          value: 'id',
          label: 'menuName',
          children: 'subMenu'
        },
        searchForm: {
          status: '',
          actionCode: '',
          actionName: '',
          menuIdList: [],
          creator: '',
          startQueryTime: '',
          endQueryTime: '',
          logType: '',
          ip: '',
          location: ''
        },
        createTimeOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
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
          queryActionList: '/uac/log/queryListWithPage'
        },
        logTypeList: [
          {
            type: '10',
            name: '操作日志'
          },
          {
            type: '20',
            name: '登录日志'
          },
          {
            type: '30',
            name: '异常日志'
          }
        ]
      };
    },
    components: {
      PcPagination
    },
    filters: {
      statusToChinese (val) {
        let state = '';
        switch (val) {
          case 'ENABLE': {
            state = '启用';
            break;
          }
          case 'DISABLE': {
            state = '禁用';
            break;
          }
        }
        return state;
      }
    },
    created () {
      this.initMenuTree();
    },
    methods: {
      initMenuTree() {
        this.ajax({
          url: '/uac/menu/getTree',
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.menuTreeData = data[0].subMenu;
          }
        });
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
