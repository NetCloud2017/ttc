<template>
  <div class="dialog-table-page">
    <div class="mesg-content ">
      <div v-if="noticeInfos && noticeInfos.length > 0">
        <div class="item" v-for="(noticeItem,index) in noticeInfos" @click="toDetail(noticeItem.url)">
          <p class="item-top">
            <i :class="noticeItem.showCss" ></i>
            <span class="item-top-title">{{noticeItem.content}}</span>
            <span v-if="noticeItem.reader === null" class="redPoint"></span>
          </p>
          <p class="item-time">{{noticeItem.createTime}}</p>
        </div>
      </div>

      <div v-if="noticeInfos === null || noticeInfos.length <= 0" class="empty">
        <img src="../../../assets/images/header/img_comm_available.png" alt="">
        <p>没有系统消息</p>
      </div>

    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  /* eslint-disable */
  export default {
    data() {
      return {
        noticeInfos: [{
            noticeId: 1,
            content: '入库预约20180612150343850已通过审核',
            url: '',
            showCss: 'el-icon-success',
            createTime: '2018-09-11 14:40:28',
            reader: null
          }, {
            noticeId: 2,
            content: '入库预约20180612150383565已通过审核',
            url: '',
            showCss: 'el-icon-success',
            createTime: '2018-09-11 14:40:22',
            reader: null
          }, {
            noticeId: 3,
            content: '制单申请,rfid编号20180901104已经签发',
            url: '',
            showCss: 'el-icon-success',
            createTime: '2018-09-07 17:42:49',
            reader: null
          }
        ]
      }
    },
    method: {
      toDetail(url) {

      }
    }
  }
</script>
<style scoped>
  .dialog-table-page{
    margin: 0 auto;
    padding:0 20px 20px;
    font-size:14px;
  }
  .mesg-content{

  }

  .item {
    line-height: 30px;
    cursor:pointer;
    margin-bottom: 27px;
  }

  .item .item-top {
    position: relative;
  }

  .item i {
    font-size:20px;
    vertical-align:middle;
  }

  .item .i-pass {
    color: #00cc0e;
  }

  .item .i-nopass {
    color: #808080;
  }

  .item .redPoint {
    background-color: #ff6c2b;
    display: inline-block;
    width: 8px;
    height: 8px;
    line-height: 8px;
    border-radius: 4px;

    margin-bottom: 10px;
    margin-left: -5px;
  }

  .item .item-top-title {
    margin-left: 10px;
    max-width: 285px;
    display: inline-block;
    line-height: 30px;
    vertical-align: middle;

    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item .item-time {
    color: #808080;
    font-size: 14px;
    margin-left: 34px;
    line-height: 15px;
  }

  /* 空 */
  .empty {
    text-align: center;
  }

  .empty p {
    margin-top: 10px;
    color: #808080;
  }

  .empty img {
    margin-top: 50px;
  }
</style>
