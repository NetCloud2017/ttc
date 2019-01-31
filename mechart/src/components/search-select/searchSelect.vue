<template>
  <el-select v-model="selectValue" remote clearable reserve-keyword filterable="" :disabled="this.$props.disabledSelect"
             :value-key="valueKey" placeholder="请输入关键词" @blur="handleBlur"
             :remote-method="search" :loading="loading" @change="handleChange">
    <el-option :class="selectClass"  v-if="showTitle" value="title" :disabled="disabled">
      <li v-for="param in params" :style="param.style">{{ param.title }}</li>
    </el-option>
    <el-option :class="selectClass" v-for="(item, index ) in selectList" :key="index" :value="item" :label="item[labelKey]">
      <li v-for="param in params" :style="param.style">{{ item[param.key] }}</li>
    </el-option>
  </el-select>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable */
  import debounce from 'throttle-debounce/debounce';
  import Emitter from 'element-ui/src/mixins/emitter';
  import { valueEquals } from 'element-ui/src/utils/util';
  export default {
    mixins: [Emitter],
    inject: {
      elForm: {
        default: ''
      },

      elFormItem: {
        default: ''
      }
    },
    props: {
      debounce: {
        type: Number,
        default: 300
      },
      value: {
        required: true
      },
      inputValue: {
        type: String
      },
      url: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: true
      },
      disabledSelect: {
        type: Boolean,
        default: false
      },
      params: {
        type: Array
//        default: [{
//          title: '序号',
//          key: 'id',
//          style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
//        },
//        {
//          title: '角色名称',
//          key: 'roleName',
//          style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
//        },
//        {
//          title: '角色代码',
//          key: 'roleCode',
//          style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
//        },
//        {
//          title: '状态',
//          key: 'status',
//          style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
//        }]
      },
      valueKey: {
        type: String,
        default: 'id'
      },
      // 下拉选择框的样式
      selectClass: {
        type: String,
        default: ''
      },
      labelKey: String,
      queryParam: Object, // 请求搜索数据接口的参数
      queryKey: String,  // 搜索输入的关键字字段名
      // 请求的类型GET , POST
      httpType: {
        type:String,
        default: 'GET'
      }
    },
    data() {
      return {
        selectList: [],
        loading: false,
        showTitle: false,
        showNotMacth: false,
        selectValue: this.$props.inputValue,
        queryValue: null
      }
    },
    mounted() {
      this.debouncedSearch = debounce(this.debounce, this.searchData);
    },
    watch: {
      value(val, oldVal) {
        this.selectValue = val;
        if (!valueEquals(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val);
        }
      }
    },
    methods: {
      search(queryString) {
//        this.loading = true;
        this.debouncedSearch(queryString);
      },
      searchData(query) {
        if (query !== '') {
          this.queryValue = query;
          this.loading = true;
          let param = this.queryParam;
          param[this.queryKey] = query;
          let roleForm = {
            status: '',
            roleCode: query,
            roleName: ''
          };
          // 如果是GET请求则把参数拼到URL后面
          let httpUrl = this.$props.url;
          if (this.httpType === 'GET') {
            httpUrl = httpUrl + '?';
            // 遍历请求参数对象
            for (var item in param){
              httpUrl = httpUrl + item + '=' + param[item];
            }
            param = null;
          }
//          Object.assign(param, roleForm);
          this.ajax({
            type: this.httpType,
            url: httpUrl,
            data: param,
            loading: true,
            success: (res) => {
//            setTimeout(() => {
//            this.loading = false;
//        }, 300);
              this.loading = false;
              this.selectList = res.result;
//              this.params = this.selectList.length > 0 ? this.paramsValue : [];
              this.showNotMacth = !(this.selectList.length > 0);
              this.showTitle = this.selectList.length > 0;
            }
          });
        } else {
          this.loading = false;
          this.selectList = [];
//          this.params = [];
          this.showTitle = false;
        }
      },
      handleChange(val) {
        this.$emit('changeSelect', val);
      },
      // 失去焦点后的回调
      handleBlur(val) {
        // console.log('searchSelect ----handleBlur------this.queryValue: ' + this.queryValue);
        this.$emit('blur', this.queryValue);
      }
    }
  };
</script>
<style>
  .selectclass {
    width: 80rem;
  }
</style>
