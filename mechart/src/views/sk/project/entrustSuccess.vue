<template>
  <div class="page-assets-entrust">
    <div class="baseDiv">
      <div class="title">
        <img class="successImg" src="/static/image/img_comm_success.svg"/>
        <div class="title-text">已经收到您的委托处置请求</div>
      </div>
      <div class="content1">我们的专业团队将在2小时内与您联络(工作时间: 周一至周五 </div>
      <div class="content2">9:00-18:00)</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
    },
    data() {
      return {
      };
    },
    methods: {
    }
  };
</script>
<style>
  .page-assets-entrust {
    background-color: #ffffff;
    width: 100%
  }

  .page-assets-entrust .baseDiv {
    width: 100%;
    height: auto;
    background-color: white;
    color: #1a1a1a;
  }
  .page-assets-entrust .baseDiv .title {
    color: #1a1a1a;
    font-size: 16px;
    padding-top: 20px;
    display: flex;
    justify-content: flex-start;
    height: 18px;
    align-items: center;
    padding-left: 0px;
  }
  .page-assets-entrust .baseDiv .successImg {
    width: 18px;
    height: 18px;
  }
  .page-assets-entrust .baseDiv .title .title-text {
    padding-left: 8px;
  }
  .page-assets-entrust .baseDiv .content1 {
    color: #1a1a1a;
    font-size: 14px;
    padding-top: 20px;
  }
  .page-assets-entrust .baseDiv .content2 {
    color: #1a1a1a;
    font-size: 14px;
    padding-top: 10px;
  }

</style>
