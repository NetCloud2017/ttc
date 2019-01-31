<template>
  <div class="pc-page-content">
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户信息" name="first">
          <div class="info">
            <div class="infoImg">
              <img src="../../../../assets/images/user/info.jpg" alt="" />
              <p class="userName">{{userInfoTab.userName}}</p>
            </div>
            <div class="infoTab">
              <p>
                <span class="title">登录名</span>
                <span class="content">{{userInfoTab.loginName}}</span>
              </p>
              <p>
                <span class="title">姓名</span>
                <span class="content">{{userInfoTab.userName}}</span>
              </p>
              <p>
                <span class="title">工号</span>
                <span class="content">{{userInfoTab.userCode}}</span>
              </p>
              <p>
                <span class="title">状态</span>
                <span class="content">{{userInfoTab.status | getUserStatusName}}</span>
              </p>
              <p>
                <span class="title">所属组织</span>
                <span class="content">{{userInfoTab.groupName}}</span>
              </p>
              <p>
                <span class="title">电话号码</span>
                <span class="content">{{userInfoTab.mobileNo}}</span>
              </p>
              <p>
                <span class="title">最后登陆IP</span>
                <span class="content">{{userInfoTab.lastLoginIp}}</span>
              </p>
              <p>
                <span class="title">最后在线</span>
                <span class="content">{{userInfoTab.lastLoginTime}}</span>
              </p>
            </div>
            <div class="userLimit">
              <div class="pc-jurisdiction-panel-header">
                权限信息
              </div>
              <div class="pc-jurisdiction-panel-body">
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  node-key="id"
                  :default-expanded-keys = "defaultExpandedKeys"
                  :highlight-current=true
                  :expand-on-click-node = false
                  accordion>
                </el-tree>
              </div>
            </div>
          </div>
          <div class="role" v-if="userRole.length > 0">
            <div class="pc-page-header">
              <p>
                角色
              </p>
            </div>
            <div id="app">
              <div class="pricing-span-header">
                <div class="widget-box transparent">
                  <div class="widget-header">
                    <h5 class="widget-title smaller lighter">拥有的角色</h5>
                  </div>
                  <div class="widget-body">
                    <div>
                      <ul class="list-striped  pricing-table-header">
                        <li>角色名称</li>
                        <li>角色编码</li>
                        <li>角色状态</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pricing-span-body">
                <div class="pricing-span" v-for="(item, index) in userRole">
                  <div class="widget-box pricing-box-small widget-color-blue">
                    <div class="widget-header">
                      <h5 class="widget-title smaller lighter fontCol">{{item.roleName}}</h5>
                    </div>
                    <div class="widget-body">
                      <div>
                        <ul class="list-striped pricing-table">
                          <li>{{item.roleName}}</li>
                          <li>{{item.roleCode}}</li>
                          <li>{{item.status | getRoleStatusName}}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="second">
          <template>
            <el-table :data="initTable" fixed="left" border max-height="450" style="width: 100%">
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
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="browser"
                label="浏览器"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="ip"
                label="IP地址"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="groupName"
                label="组织名称"
                min-width="120">
              </el-table-column>
              <el-table-column
                prop="creator"
                label="操作人"
                min-width="100">
              </el-table-column>
              <el-table-column
                fixed="right"
                prop="createdTime"
                label="操作时间"
                min-width="150">
              </el-table-column>
            </el-table>
            <div class="pc-pagination-panel">
              <pc-pagination ref="pcPagination" url="/uac/user/queryUserLogListWithPage" :queryData="logQuery" @on-query="queryCallBackFn">
              </pc-pagination>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
  import PcPagination from 'components/form/pagination';
  export default {
    data() {
      return {
        logQuery: {},
        activeName: 'first',
        initTable: [],
        userInfoTab: [],
        defaultExpandedKeys: [],
        userRole: [],
        data: this.$route.query,
        treeData: [],
        loginName: '',
        defaultProps: {
          children: 'subMenu',
          label: 'menuName'
        }
      };
    },
    created() {
      this.loginName = this.$route.query.loginName;
      this.findUserInfoFn(this.loginName);
    },
    methods: {
      queryCallBackFn(res) {
        this.initTable = res.result.list;
      },
      findUserInfoFn(loginName) {
        this.$http({
          method: 'POST',
          url: `/uac/user/queryUserInfo/${loginName}`,
          data: ''
        }).then((res) => {
          this.userInfoTab = res.result;
          if (res.result.roles) {
            this.userRole = res.result.roles;
          }
          this.treeData = res.result.authTree;
          if (this.treeData && this.treeData.length > 0) {
            this.defaultExpandedKeys.push(this.treeData[0].id);
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    components: {
      PcPagination
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  li{
    list-style: none;
  }
  .pricing-span-header{
    width: 110px;
    float: left;
    clear: left;
  }
  .widget-box{
    padding: 0;
    box-shadow: none;
    margin: 5px 0;
    border: 1px solid #CCC;
  }
  .transparent{
    border-width: 0;
  }
  .widget-box.transparent > .widget-header{
    background: none;
    border-width: 0;
    border-bottom: 1px solid #DCE8F1;
    color: #4383B4;
    padding-left: 3px;
  }
  .widget-header{
    box-sizing: content-box;
    position: relative;
    min-height: 38px;
    border-bottom: 1px solid #DDD;
  }
  .widget-header > .widget-title{
    line-height: 36px;
    padding: 0;
    margin: 0;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fontCol{
    color: white;
  }

  h5.smaller{
    font-size: 14px;
  }
  .lighter{
    font-weight: lighter;
  }
  .widget-box.transparent > .widget-body{
    border-width: 0;
    background-color: transparent;
  }
  .widget-body{
    background-color: #FFF;
  }
  .pricing-table-header{
    padding-top: 0;
    margin-top: 0;
    text-align: left;
    padding-left: 0;
    list-style: none;
    margin-left: 0;
  }
  .list-striped > li:nth-child(odd){
    background-color: #FFF;
  }
  .pricing-table-header > li{
    padding: 11px 0 7px 11px;
    font-size: 13px;
  }
  .list-striped > li:nth-child(even){
    background-color: #EEE;
  }
  .pricing-span-body{
    float: left;width: 900px;
    min-height:200px;
    max-height: 580px;
    overflow: auto;
    padding:0 5px;
  }
  .pricing-span{
    margin: 0;
    width: 145px;
    max-width: 150px !important;
    min-width: 110px !important;
    float: left !important;
  }
  .pricing-box-small{
    box-shadow: none;
    margin-left: -2px;
    background-color: #FFF;
    position: relative;
    z-index: 10;
  }
  .pricing-span:hover .pricing-box-small{
    transform: scale3d(1.02,1.03,1.03);
    z-index: 100;
    -moz-box-shadow:0px 2px 2px #999;
    -webkit-box-shadow:0px 2px 2px #999;
    box-shadow:0px 2px 2px #999;
  }

  .widget-color-blue > .widget-header{
    background: #307ECC;
    border-right: #fff;
    text-align: center;
  }
  .pricing-table{
    margin:0;
    padding:0;
  }
  .pricing-table > li{
    text-align: center;
    padding: 7px 0;
    height: 30px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-transition: all 0.1s;
    -moz-transition: all 0.1s;
    transition: all 0.1s;
  }
  .pricing-span:hover .pricing-table > li{
    padding: 8px 0;
  }

  .info{
    overflow: hidden;
    min-height: 300px;
  }

  .infoImg{
    display: inline-block;
    width: 220px;
    float: left;
    margin: 0 20px;
  }

  .infoImg .userName{
    width: 100%;
    height: 30px;
    text-align: center;
    color: white;
    line-height: 30px;
    background: url("../../../../assets/images/user/bg.jpg");
    background-size: 100% 100%;
  }

  .infoImg img{
    width: 130px;
    height: 130px;
    margin: 50px 20%;
  }

  .infoTab{
    display: inline-block;
    width: 280px;
    min-height: 300px;
    float: left;
  }

  .userLimit{
    display: inline-block;
    width: 240px;
    height: 320px;
    background: #edf3f4;
    margin: 0 20px;
    border: 1px solid #dcebf7;
    position: relative;
  }

  .infoTab{
    border: 1px solid #dcebf7;
  }

  .infoTab p{
    height: 40px;
    width: 100%;
    border-bottom: 1px dotted #dcebf7;
    box-border: border-size;
  }
  .infoTab :last-child{
    border: none;
  }
  .infoTab p .title{
    display: inline-block;
    float: left;
    width: 35%;
    height: 39px;
    line-height: 40px;
    padding-left: 10px;
    background: #edf3f4;

  }
  .infoTab p .content{
    display: inline-block;
    float: right;
    height: 39px;
    width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 40px;
    padding-left: 10px;
  }

  .pc-jurisdiction-panel-header {
    height: 36px;
    padding: 0 15px;
    line-height: 36px;
    font-size: 14px !important;
    color: #ffffff;
    background-color: #337ab7;
  }

  .pc-jurisdiction-panel-body {
    height: 284px;
    overflow: auto;
  }

</style>
