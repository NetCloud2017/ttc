<template>
  <div class="bind-user-box">
    <el-transfer
      v-model="alreadyBindUserIdArr"
      :props="{
      key: 'userId',
      label: 'userName'
    }"
      @change="handleChange"
      :data="allUserArr"
      filterable
      :render-content="renderFunc"
      :titles="['未绑定用户', '已绑定用户']"
      :footer-format="{
      noChecked: '共 ${total} 个用户',
      hasChecked: '选中 ${checked} / ${total} 个用户'
    }">
    </el-transfer>
  </div>
</template>

<script>
  export default {
    props: {
      roleId: {
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
      initPanel() {
        // 后台请求数据
        this.ajax({
          url: '/uac/role/getBindUser/' + this.roleId,
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
                allUserSet.forEach((item) => {
                  if (id === item.userId) {
                    this.alreadyBindUserIdArr.push(id);
                  }
                });
              });
            }
          }
        });
      },
      submitForm(fn) {
        let alreadyBindUserIdArr = this.alreadyBindUserIdArr;
        this.disabledUserIdArr.forEach((item) => {
          alreadyBindUserIdArr = alreadyBindUserIdArr.filter((viceItem) => {
            return viceItem !== item;
          });
        });
        this.ajax({
          url: '/uac/role/bindUser',
          data: {
            roleId: this.roleId,
            userIdList: alreadyBindUserIdArr
          },
          loading: true,
          success: (res) => {
            fn && fn(res);
          }
        });
      },
      handleChange(value, direction, movedKeys) {
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
      changeUserIdArr() {
        console.info('this.changeUserIdArr.length', this.changeUserIdArr.length);
        if (this.changeUserIdArr.length < 1) {
          console.info('on-disabled', true);
          this.$emit('on-disabled', true);
        } else {
          console.info('on-disabled', false);
          this.$emit('on-disabled', false);
        }
      }
    }
  };
</script>
<style>
  .bind-user-box{
    margin-bottom:20px;
  }
  .bind-user-box .el-transfer-panel {
    width: 300px!important;
  }
</style>
