<template>
  <div>
    <el-form :inline="true" ref="filterFrom" :model="filterModel">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select size="small" v-model="filterModel.status" filterable placeholder="在线状态">
            <el-option v-for="item in userState" :key="item.value" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="loginName">
          <el-input size="small" clearable v-model="filterModel.loginName" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="userName">
          <el-input size="small" clearable v-model="filterModel.userName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="small" @click="queryDataFn('filterFrom')">筛选</el-button>
          <el-button size="small" @click="resetFromFn('filterFrom')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="page-list-table">
      <el-table :data="tableData" stripe  border>
        <el-table-column type="index" label="序号" width="75px"></el-table-column>
        <el-table-column prop="loginName" label="登录名" min-width="120">
          <template slot-scope="scope">
            <router-link class="pc-router-link" :to="{ name:'userView', query: {'loginName': scope.row.loginName}}">
              {{scope.row.loginName}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template slot-scope="scope">
            {{scope.row.status | statusToChinese}}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="groupName" label="组织名称" min-width="120"></el-table-column>
        <el-table-column prop="accessToken" label="accessToken" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column prop="refreshToken" label="refreshToken" show-overflow-tooltip width="130"></el-table-column>
        <el-table-column prop="loginIp" label="登录IP" min-width="130"></el-table-column>
        <el-table-column prop="loginLocation" label="登录地点" min-width="130"></el-table-column>
        <el-table-column prop="createdTime" label="登录时间" min-width="170"></el-table-column>
        <el-table-column prop="os" label="操作系统" min-width="150"></el-table-column>
        <el-table-column prop="browser" label="浏览器" min-width="150"></el-table-column>
        <el-table-column prop="expiresIn" label="过期时间(秒)" min-width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="danger" plain size="small" @click="offLineFn(scope.row)">强制退出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryPageUrl" :queryData="filterModel" @on-query="queryCallBackFn" />
    </div>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  import {validateTips} from 'utils/tips';
  export default {
    data () {
      return {
        userId: '',
        pageUrl: {
          queryPageUrl: '/uac/token/queryListWithPage'
        },
        userState: [
          {
            code: 0,
            value: '在线'
          },
          {
            code: 10,
            value: '刷新Token'
          },
          {
            code: 20,
            value: '离线'
          }
        ],
        filterModel: {
          status: 0,
          loginName: '',
          userName: ''
        },
        tableData: []
      };
    },
    created () {
    },
    components: {
      PcPagination
    },
    filters: {
      statusToChinese (val) {
        let state = '';
        switch (val) {
          case 0: {
            state = '在线';
            break;
          }
          case 10: {
            state = '刷新Token';
            break;
          }
          case 20: {
            state = '离线';
            break;
          }
        }
        return state;
      }
    },
    methods: {
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      },
      offLineFn (user) {
        this.errorTip(validateTips.NOT_OPEN);
      }
    }
  };
</script>
