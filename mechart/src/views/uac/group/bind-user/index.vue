<template>
  <div class="bind-user-box">
    <el-transfer
      v-model="alreadyBindUserIdArr"
      :props="{key: 'userId', label: 'userName'}"
      @change="handleChange"
      :data="allUserArr"
      filterable
      :render-content="renderFunc"
      :titles="['未绑定用户', '已绑定用户']"
      :footer-format="{noChecked: '共 ${total} 个用户', hasChecked: '选中 ${checked} / ${total} 个用户'}">
    </el-transfer>
    <el-button class="pc-group-bind-btn" type="primary" :disabled="bindUserDisabled" @click="submitBindForm">保 存</el-button>
  </div>
</template>

<script>
  export default {
    props: {
      groupId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        allUserArr: [],
        disabledUserIdArr: [], // 禁用的用户Id集合
        alreadyBindUserIdArr: [],
        changeUserIdArr: [],
        bindUserDisabled: true,
        renderFunc (h, option) {
          return <span>{ option.mobileNo } - { option.userName }</span>;
        }
      };
    },
    created () {
      this.initPanel();
      this.changeUserIdArr = [];
    },
    methods: {
      initPanel () {
        // 后台请求数据
        this.ajax({
          url: '/uac/group/getBindUser/' + this.groupId,
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            let allUserSet = data.allUserSet;
            let alreadyBindUserIdSet = data.alreadyBindUserIdSet;
            if (allUserSet) {
              allUserSet.forEach((item) => {
                if (item.disabled) {
                  this.disabledUserIdArr.push(item.userId);
                }
                this.allUserArr.push(item);
              });
            }
            if (alreadyBindUserIdSet) {
              alreadyBindUserIdSet.forEach((id) => {
                this.alreadyBindUserIdArr.push(id);
              });
            }
          }
        });
      },
      submitBindForm () {
        let alreadyBindUserIdArr = this.alreadyBindUserIdArr;
        this.disabledUserIdArr.forEach((item) => {
          alreadyBindUserIdArr = alreadyBindUserIdArr.filter((viceItem) => {
            return viceItem !== item;
          });
        });
        this.ajax({
          url: '/uac/group/bindUser',
          data: {
            groupId: this.groupId,
            userIdList: alreadyBindUserIdArr
          },
          loading: true,
          success: () => {
          }
        });
      },
      handleChange (value, direction, movedKeys) {
        console.info('handleChange', movedKeys);
        // 如果元素不存在则加入 存在删除
        movedKeys.forEach((item) => {
          let index = this.changeUserIdArr.indexOf(item);
          console.info(index);
          if (index >= 0) { // 存在
            this.changeUserIdArr = this.changeUserIdArr.filter((viceItem) => {
              return viceItem !== item;
            });
          } else {
            this.changeUserIdArr.push(item);
          }
        });
      }
    },
    watch: {
      changeUserIdArr () {
        console.info('this.changeUserIdArr.length', this.changeUserIdArr.length);
        this.bindUserDisabled = this.changeUserIdArr.length < 1;
      }
    }
  };
</script>
<style>
  .bind-user-box{
  }
  .bind-user-box .el-transfer-panel {
    width: 300px!important;
  }
</style>
