<template>
  <div>
    <el-form :model="exception" ref="exDetailForm" label-width="80px">
      <el-form-item label="系统名称" prop="applicationName">
        {{exception.applicationName}}
      </el-form-item>
      <el-form-item label="异常名称" prop="exceptionSimpleName">
        {{exception.exceptionSimpleName}}
      </el-form-item>
      <el-form-item label="操作人" prop="creator">
        {{exception.creator}}
      </el-form-item>
      <el-form-item label="操作时间" prop="createTime">
        {{exception.createTime}}
      </el-form-item>
      <el-form-item label="异常详情" prop="exceptionStack">
        <el-input readonly type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="exception.exceptionStack"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    props: {
      formData: {
        type: Object
      }
    },
    data() {
      return {
        exception: {}
      };
    },
    methods: {
      showFn(ex) {
        this.exception = ex;
      }
    }
  };
</script>
