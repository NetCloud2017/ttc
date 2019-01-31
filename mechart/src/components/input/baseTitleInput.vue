<template>
  <div class="frameClass">
    <div class="headTitleClass">
       <span>{{this.$props.headTitle}}</span>
    </div>
      <div class="sonFrameClass">
          <el-input  type="textarea" v-model="inputVal" :value="postValue" maxlength="200" :rows="4" :placeholder="this.$props.headSonTitle"></el-input>
      </div>
  </div>
</template>
<script>
  export default {
    components: {
    },
    props: {
      headTitle: {
        type: String
      },
      headSonTitle: {
        type: String
      },
      inputValue: {
        type: String
      }
    },
    data() {
      return {
        inputVal: ''
      };
    },
    watch: {
      inputVal: function () {
        this.$emit('getInputVal', this.inputVal);
      }
    },
    computed: {
      getInputvalue: function () {
        return this.inputValue;
      },
      postValue: function () {
        this.inputVal = this.getInputvalue;
        return this.inputValue;
      }
    }
  };
</script>
<style scoped>
  .frameClass
  {
    width: 100%;
    height: 170px;
    margin-top: 20px;
    background-color: white;
    border: 1px solid #e4e4e4;
  }
  .frameClass .sonFrameClass
  {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    height: 60px;
    background-color: white;
  }
  .frameClass .headTitleClass
  {
    margin-left: 20px;
    margin-top: 20px;
    font-size: 14px;
    color: #333333;
  }
</style>
