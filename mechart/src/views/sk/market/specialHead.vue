<template>
<div>
  <div class="commont">
   <header class="comHead">
      <div class="qoutTitleBox">
        <span @click.stop="mainTag" :class="[tag ? 'mainTitle' : 'subTitle']">{{title}}</span>
        <span @click.stop="subTag" v-if="subTitle" :class="[ !tag ? 'mainTitle' : 'subTitle']">{{subTitle}}</span>
      </div>
   </header>
   <div>
     <slot>empty</slot>
   </div>
 </div>
</div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    showSearch: {
      type: Boolean
    },
    subTitle: {
      type: String
    }
  },
  data () {
    return {
      tag: true
    };
  },
  methods: {
    mainTag () {
      this.tag = true;
      this.$emit('changeTag', 'cirData');
    },
    subTag () {
      this.tag = false;
      this.$emit('changeTag', 'pastRate');
    }
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.commont{
  padding: 0 10px 20px;
  margin-bottom: 10px;
  background: #1f2533;
  .comHead{
    height: 34px;
    font-size: 14px;
    line-height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .qoutTitleBox{
      .mainTitle{
        color: #fff;
      }
      .subTitle{
        color: #99a3bb;
      }
      span:nth-child(2){
        margin-left: 30px;
      }
    }

  }
}
</style>