
<template>
  <div>
    <el-form :inline="true" :model="actionForm" ref="actionForm">
    <div class="block" style="margin-top: 20px">
        <el-form-item label="" prop="menuIdList">
          <span class="demonstration">默认 click 触发子菜单(接口数据)</span>
          <el-cascader
            size="small"
            placeholder="请选择权限"
            :options="menuTreeData"
            filterable
            clearable
            change-on-select
            v-model="actionForm.menuIdList"
            :props="menuProps"
            @change="handleChange"
            class="pc-input-col3">
          </el-cascader>
        </el-form-item>
    </div>

      <div class="block" style="margin-left: 22px">
        <span class="demonstration">hover 触发子菜单(本地数据)</span>
        <el-cascader
          size="medium"
          expand-trigger="hover"
          :options="options"
          placeholder="请选择城市"
          clearable
          v-model="selectedOptions2"
          @change="handleChangeCity"
          class="pc-input-col3">
        </el-cascader>
      </div>
    </el-form>
  </div>
</template>
<script>

export default
{
  component: {
  },
  data() {
    return {
      menuTreeData: [],
      actionForm: {
        status: '',
        actionCode: '',
        actionName: '',
        menuIdList: [],
        url: ''
      },
      menuProps: {
        value: 'id',
        label: 'menuName',
        children: 'subMenu'
      },
      options: [{
        value: 'beijing',
        label: '北京',
        children: [{
          value: 'dongcheng',
          label: '东城区',
          children: [{
            value: 'donghuamen',
            label: '东华门街道'
          }, {
            value: 'jingshan',
            label: '景山街道'
          }, {
            value: 'andingmen',
            label: '安定门街道'
          }, {
            value: 'chaoyangmen',
            label: '朝阳门街道'
          }]
        }, {
          value: 'xicheng',
          label: '西城区',
          children: [{
            value: 'xichangan',
            label: '西长安街街道'
          }, {
            value: 'yuetan',
            label: '月坛街道'
          }]
        }]
      }],
      selectedOptions: [],
      selectedOptions2: []
    };
  },
  created () {
    this.initMenuTree();
  },
  methods: {
    initMenuTree() {
      this.ajax({
        url: '/uac/menu/getTree',
        loading: true,
        success: (res) => {
          let data = res.result;
          if (!data) {
            return;
          }
          this.menuTreeData = data[0].subMenu;
        }
      });
    },
    handleChange(value) {
      // console.log('actionValue----' + value);
    },
    handleChangeCity(value) {
      // console.log('cityValue----' + value);
    }
  }
};
</script>
