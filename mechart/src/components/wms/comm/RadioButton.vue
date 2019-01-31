<template>
  <el-radio class="radio" :label="row.id" v-model="radio" @change.native="getCurrentRow(row)" >&nbsp;</el-radio>
</template>
<script type="text/ecmascript-6">
  export default {
    props: ['row'],
    data() {
      return {
        radio: null
      };
    },
    computed: {

    },
    methods: {
      getCurrentRow(val) {
        this.radio = val.id;
        this.$emit('select-row', val);
      }
    }
  };
</script>
<style>
  .radio {
    width: 16px;
    height: 16px;
  }
</style>
