<template>
 <div class="newsDetail">
   <div v-html="newsContent"></div>
 </div>
</template>
<script>
export default {
  props: ['newsContent']
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .newsDetail{
    height: 580px;
    overflow-y: auto;
  }
</style>