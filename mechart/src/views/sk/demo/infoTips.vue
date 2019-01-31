<template>
  <div>
    <div @click="infoWhite">infoTips black</div>
    <div @click="infoBlack">infoTips white</div>
  </div>
</template>
<script>
  export default {
    methods: {
      infoWhite() {
        this.$infoTip('项目录入成功', 'white');
      },
      infoBlack() {
        this.$infoTip('项目录入为空', 'black');
      }
    }
  };
</script>
