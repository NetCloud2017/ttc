<template>
  <div>
    <el-form :model="message" label-width="80px">
      <el-form-item label="messageId" prop="applicationName">
        <el-input readonly size="small" v-model="message.id"></el-input>
      </el-form-item>
      <el-form-item label="messageTopic" prop="creator">
        <el-input readonly size="small" v-model="message.messageTopic"></el-input>
      </el-form-item>
      <el-form-item label="messageTag" prop="messageSimpleName">
        <el-input readonly size="small" v-model="message.messageTag"></el-input>
      </el-form-item>
      <el-form-item label="messageKey" prop="messageSimpleName">
        <el-input readonly size="small" v-model="message.messageKey"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createdTime">
        <el-input readonly size="small" v-model="message.createdTime"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-input readonly size="small" v-model="message.updateTime"></el-input>
      </el-form-item>
      <el-form-item label="消息详情" prop="messageStack">
        <el-input readonly type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="message.messageBody"></el-input>
      </el-form-item>
      <el-form-item label="消息详情" prop="messageBody">
        <tree-view :data="message.messageBody  | formatCode" :options="{maxDepth: 3}"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import Vue from 'vue';
  import TreeView from 'vue-json-tree-view';
  Vue.use(TreeView);
  export default {
    props: {
      formData: {
        type: Object
      }
    },
    data() {
      return {
        message: {}
      };
    },
    filters: {
      formatCode(val) {
        return JSON.parse(val);
      }
    },
    methods: {
      showFn(ex) {
        this.message = ex;
      }
    }
  };
</script>
