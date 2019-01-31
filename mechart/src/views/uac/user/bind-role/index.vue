<template>
  <el-transfer
    v-model="alreadyBindRoleIdArr"
    :props="{
      key: 'roleId',
      label: 'roleName'
    }"
    @change="handleChange"
    :data="allRoleArr"
    filterable
    :render-content="renderFunc"
    :titles="['未绑定角色', '已绑定角色']"
    :footer-format="{
      noChecked: '共 ${total} 个角色',
      hasChecked: '选中 ${checked} / ${total} 个角色'
    }">
  </el-transfer>
</template>

<script>
  export default {
    props: {
      userId: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        allRoleArr: [],
        disabledRoleIdArr: [], // 禁用的角色Id集合
        alreadyBindRoleIdArr: [],
        changeRoleIdArr: [],
        renderFunc (h, option) {
          return <span>{ option.roleCode } - { option.roleName }</span>;
        }
      };
    },
    created () {
      this.initPanel();
      this.changeRoleIdArr = [];
    },
    methods: {
      initPanel() {
        // 后台请求数据
        this.ajax({
          url: '/uac/user/getBindRole/' + this.userId,
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            let allRoleSet = data.allRoleSet;
            let alreadyBindRoleIdSet = data.alreadyBindRoleIdSet;
            if (allRoleSet) {
              allRoleSet.forEach((item) => {
                if (item.disabled) {
                  this.disabledRoleIdArr.push(item.userId);
                }
                this.allRoleArr.push(item);
              });
            }
            if (alreadyBindRoleIdSet) {
              alreadyBindRoleIdSet.forEach((id) => {
                this.alreadyBindRoleIdArr.push(id);
              });
            }
          }
        });
      },
      submitForm(fn) {
        let alreadyBindRoleIdArr = this.alreadyBindRoleIdArr;
        this.disabledRoleIdArr.forEach((item) => {
          alreadyBindRoleIdArr = alreadyBindRoleIdArr.filter((viceItem) => {
            return viceItem !== item;
          });
        });
        this.ajax({
          url: '/uac/user/bindRole',
          data: {
            userId: this.userId,
            roleIdList: alreadyBindRoleIdArr
          },
          loading: true,
          success: (res) => {
            fn && fn(res);
          }
        });
      },
      handleChange(value, direction, movedKeys) {
        // 如果元素不存在则加入 存在删除
        movedKeys.forEach((item) => {
          let index = this.changeRoleIdArr.indexOf(item);
          if (index >= 0) { // 存在
            this.changeRoleIdArr = this.changeRoleIdArr.filter((viceItem) => {
              return viceItem !== item;
            });
          } else {
            this.changeRoleIdArr.push(item);
          }
        });
      }
    },
    watch: {
      changeRoleIdArr() {
        console.info('this.changeRoleIdArr.length', this.changeRoleIdArr.length);
        if (this.changeRoleIdArr.length < 1) {
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
