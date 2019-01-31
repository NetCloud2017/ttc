<template>
   <div class="skHomePage">
     <div class="skContainer">
      <div class="sectionItem">
        <market :refresh="refresh" />
        <news :refresh="refresh" />
      </div>
      <div class="sectionItem">
        <project :refresh="refresh" />
        <div class="macroDataTable">
            <section class="macroSecton">
              <macro-approval :refresh="refresh" />
            </section>
            <section>
              <assets :refresh="refresh" />
              <order />
            </section>
        </div>
      </div>
     </div>
   </div>
 </template>
 <script>
 import Market from './market.vue';
 import News from './news.vue';
 import Project from './project.vue';
 import MacroApproval from './macroApproval.vue';
 import Order from './order.vue';
 import Assets from './assets.vue';

 export default {
   data () {
     return {
       refresh: false
     };
   },
   created () {
     let _this = this;
     this.$pcBus.$on('reFresh', function(page) {
       // 这里执行了四次，要防抖
       if (page.path === 'home') {
         _this.refresh = !_this.refresh;
       }
     });
   },
   components: {
     Market,
     News,
     Assets,
     Order,
     MacroApproval,
     Project
   }
 };
 </script>
 <style lang="less" rel="stylesheet/less" scoped>
  .skHomePage{
    padding-bottom: 30px;
    background: #181d29;
    .skContainer{
      background: #000;
      display: flex;
      .sectionItem:nth-child(1){
        margin-right: 10px;
      }
      .sectionItem:nth-child(2){
        .macroDataTable{
          display: flex;
          .macroSecton{
            margin-right: 10px;
          }
        }
      }
    }
  }
 </style>
