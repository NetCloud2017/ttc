<template>
  <el-button :type="type" :size="size" @click="submitFn">
    <slot></slot>
  </el-button>
</template>

<script type="text/ecmascript-6">
  import Bus from 'src/vueBus.js';
  export default {
    props: {
      type: {
        type: String,
        default: 'button'
      },
      size: {
        type: String,
        default: 'small'
      },
      param: {
        type: Object,
        required: false
      },
      url: {
        type: String,
        required: true
      },
      isMask: {
        type: Boolean,
        default: false
      },
      msgType: {
        type: String,
        default: 'warning'
      },
      cancelButtonText: {
        type: String,
        default: '取消'
      },
      confirmButtonText: {
        type: String,
        default: '确认'
      },
      msgTitle: {
        type: String,
        default: '提示'
      },
      msgConfirm: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        messageType: 'success'
      };
    },
    methods: {
      submitFn() {
        if (this.isMask) {
          this.ajaxBox({
            url: this.url,
            data: this.param || '',
            message: this.msgConfirm,
            success: (res) => {
              Bus.$emit('on-submit', res);
            }
          });
        } else {
          this.ajax({
            url: this.url,
            data: this.param || '',
            success: (res) => {
              Bus.$emit('on-submit', res);
            }
          });
        }
      }
    }
  };
</script>
