<template>
  <div>
    <div class="confirm-dialog" :style="customStyle">
      <div class="confirm-dialog-title">
        <span class="dialog-title">{{title}}</span>
        <i class="icon maliiconfont maliicon-img_comm_cancel dialog-close" src="../../static/ibs/img_comm_close.png" @click.stop="cancel"></i>
      </div>
      <div class="message-body">
        <slot name="bodySlot">
          <span class="dialog-message">{{dialogMessage}}</span>
        </slot>
      </div>
      <div class="dialog-option">
        <span class="dialog-confirm" @click.stop="confirmSelect(1)">{{confirmText}}</span>
        <span class="dialog-cancel" @click.stop="confirmSelect(2)">{{cancelText}}</span>
      </div>
    </div>
    <div class="uni-mask" @click.stop="cancel"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      // 对话框样式
      customStyle: String,
      // 对话框的图标
      icon: {
        type: String,
        defalut: ''
      },
      // 标题文字
      titleIcon: {
        type: String,
        default: ''
      },
      // 标题文字
      title: {
        type: String,
        default: ''
      },
      // 对话框提示消息
      dialogMessage: {
        type: String,
        default: ''
      },
      // 对话框的确认按钮显示的文字
      confirmText: {
        type: String,
        default: '确定'
      },
      // 对话框的取消按钮显示的文字
      cancelText: {
        type: String,
        default: '取消'
      },
      // 是否显示取消按钮
      showCancel: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      // 点击确定按钮
      confirmSelect (type) {
        this.$emit('confirm', type);
      },
      // 点击取消x号
      cancel () {
        this.$emit('cancel');
      }
    }
  };
</script>
<style>
  /* 遮罩层 */
  .uni-mask {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1800;
  }
  .confirm-dialog {
    position: fixed;
    z-index: 1801;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #FFFFFF;
    width: 970px;
    height: 480px;
    border-radius: 4px;
  }
  .confirm-dialog .confirm-dialog-title {
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    background-color: #990808;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .confirm-dialog .dialog-title {
    width: 100%;
    font-size: 16px;
    text-align: left;
    color: #ffffff;
  }
  .confirm-dialog .dialog-title-icon {
    width: 48px;
    height: 48px;
  }
  .confirm-dialog .dialog-close {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    float: right;
  }
  .confirm-dialog .message-body {
    border-top: 1px #e5e5e5 solid;
  }
  .confirm-dialog .dialog-message {
    line-height: 24px;
    font-size: 14px;
    color: #1a1a1a;
  }
  .confirm-dialog .dialog-icon {
    height: 110px;
    width: 110px;
    text-align: center;
    margin-top: 74px;
    margin-bottom: 60px;
  }
  .confirm-dialog .dialog-option {
    position: fixed;
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-top: 1px #e5e5e5 solid;
    bottom: 0;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: space-around;

  }
  .confirm-dialog .dialog-confirm {
    width: 100px;
    height:30px;
    line-height: 30px;
    color: #ffffff;
    background-color: #990808;
    font-size: 14px;
    border-radius: 2px;
  }
  .confirm-dialog .dialog-cancel {
    width: 100px;
    height: 30px;
    line-height: 30px;
    margin-left: 20px;
    color: #545966;
    background-color: #ffffff;
    font-size: 14px;
    border-radius: 2px;
    border: 1px #99a3bb solid;
  }
</style>
