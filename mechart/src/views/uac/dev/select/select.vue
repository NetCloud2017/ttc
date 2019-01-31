<template>
  <div>
    <h3>单选：</h3>
    <el-select v-model="value8" clearable  placeholder="请选择">
      <el-option
        v-for="item in signleoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <h3>多选：</h3>

    <el-select v-model="value5" multiple clearable  placeholder="请选择">
      <el-option
        v-for="item in multipleoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <h3>带搜索单选：</h3>
    <el-select v-model="value8" clearable filterable placeholder="请选择">
      <el-option
        v-for="item in signleoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <h3>带搜索多选：</h3>

    <el-select v-model="value5" multiple clearable filterable placeholder="请选择">
      <el-option
        v-for="item in multipleoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <h3>带搜索单选下拉框列表：</h3>
    <el-select class="selectclass" v-model="value6" clearable filterable placeholder="请选择">
      <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
        <span style="float: left; width: 30rem;">{{ item.label }}</span>
        <span style="float: left; width: 40rem; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        <span style="float: right; width: 30rem; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
      </el-option>
    </el-select>

    <h3>带搜索单选下拉框列表：</h3>
    <el-select class="selectclass" v-model="value7" clearable filterable placeholder="请选择">
      <el-option :key="title.value" :label="title.label" :value="title.value" :disabled="title.disabled">
        <span style="float: left; width: 30rem; color: #1a1a1a; font-size: 1.0rem">{{ title.label }}</span>
        <span style="float: left; width: 30rem; color: #1a1a1a; font-size: 1.0rem">{{ title.value }}</span>
        <span style="float: right; width: 30rem; color: #1a1a1a; font-size: 1.0rem">{{ title.shortName }}</span>
      </el-option>
      <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">

        <!--<li v-for="field in fields" style="float: left; width: 30rem;">{{ field }}</li>-->
        <span style="float: left; width: 30rem;">{{ item.label }}</span>
        <span style="float: left; width: 30rem; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        <span style="float: right; width: 30rem; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
      </el-option>
    </el-select>

    <h3>带搜索多选下拉框列表：</h3>
    <el-select class="selectclass" v-model="value9" multiple clearable filterable placeholder="请选择">
      <el-option :key="title.value" :label="title.label" :value="title.value" :disabled="title.disabled">
        <span style="float: left; width: 30rem; color: #1a1a1a; font-size: 1.0rem">{{ title.label }}</span>
        <span style="float: left; width: 30rem; color: #1a1a1a; font-size: 1.0rem">{{ title.value }}</span>
        <span style="float: right; width: 30rem; color: #1a1a1a; font-size: 1.0rem">{{ title.shortName }}</span>
      </el-option>
      <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">

        <!--<li v-for="field in fields" style="float: left; width: 30rem;">{{ field }}</li>-->
        <span style="float: left; width: 30rem;">{{ item.label }}</span>
        <span style="float: left; width: 30rem; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        <span style="float: right; width: 30rem; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
      </el-option>
    </el-select>


    <h3>远程搜索单选下拉框列表：</h3>
    <el-select v-model="value10" multiple filterable="" remote="" reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
      <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>

    <h3>远程搜索单选下拉框列表：</h3>
    <el-select class="selectclass" v-model="value11" :remote=true clearable reserve-keyword filterable="" placeholder="请输入关键词"
               :remote-method="search" :loading="loading" no-match-text>
            <el-option  v-if="showTitle" :disabled="title.disabled">
              <li v-for="param in params" :style="param.style">{{ param.title }}</li>
              <!--<span style="float: left; width: 15rem;">序号</span>-->
              <!--<span style="float: left; width: 30rem; color: #8492a6; font-size: 13px">角色名称</span>-->
              <!--<span style="float: left; width: 30rem; color: #8492a6; font-size: 13px">角色编码</span>-->
              <!--<span style="float: right; width: 15rem; color: #8492a6; font-size: 13px">状态</span>-->
            </el-option>
      <el-option v-for="item in roleList" :key="item.roleName" :label="item.roleCode" :value="item.roleName">

        <!--<li v-for="field in fields" style="float: left; width: 30rem;">{{ field }}</li>-->
        <li v-for="param in params" :style="param.style">{{ item[param.key] }}</li>
        <!--<span style="float: left; width: 15rem;">{{ item.id }}</span>-->
        <!--<span style="float: left; width: 30rem; color: #8492a6; font-size: 13px">{{ item.roleName }}</span>-->
        <!--<span style="float: left; width: 30rem; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>-->
        <!--<span style="float: right; width: 15rem; color: #8492a6; font-size: 13px">{{ item.status }}</span>-->
      </el-option>
    </el-select>
    <div>
      <h3>远程搜索单选下拉框列表：</h3>
      <search-select :params="searchparams" labelKey="roleCode" valueKey="id"></search-select>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import debounce from 'throttle-debounce/debounce';
  import searchSelect from 'components/search-select/searchSelect';
  export default {
    components: {
      searchSelect
    },
    data() {
      return {
        signleoptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value8: '',
        multipleoptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '诸葛烤鱼'
        }, {
          value: '选项6',
          label: '小龙虾'
        }, {
          value: '选项7',
          label: '烤全羊'
        }, {
          value: '选项8',
          label: '北京烤鸭'
        }, {
          value: '选项9',
          label: '烤鸡腿'
        }, {
          value: '选项10',
          label: '铁板基围虾'
        }, {
          value: '选项11',
          label: '烤羊排'
        }, {
          value: '选项12',
          label: '清蒸鲈鱼'
        }, {
          value: '选项13',
          label: '水煮鱼片'
        }, {
          value: '选项14',
          label: '水煮活鱼'
        }, {
          value: '选项15',
          label: '酸菜鱼'
        }],
        value5: [],
        cities: [
          {
            value: 'Beijing',
            label: '北京',
            shortName: '京'
          }, {
            value: 'Shanghai',
            label: '上海',
            shortName: '沪'
          }, {
            value: 'Nanjing',
            label: '南京',
            shortName: '南京'
          }, {
            value: 'Chengdu',
            label: '成都',
            shortName: '成都'

          }, {
            value: 'Shenzhen',
            label: '深圳',
            shortName: '深'
          }, {
            value: 'Guangzhou',
            label: '广州',
            shortName: '广'
          }],
        title: {
          value: '英文名',
          label: '中文名',
          shortName: '简称',
          disabled: true
        },
        fields: [
          'item.label',
          'item.value',
          'item.shortName'
        ],
        value6: '',
        value7: '',
        value9: '',
        options4: [],
        value10: [],

        list: [],
        loading: false,
        states: ["Alabama", "Alaska", "Arizona",
          "Arkansas", "California", "Colorado",
          "Connecticut", "Delaware", "Florida",
          "Georgia", "Hawaii", "Idaho", "Illinois",
          "Indiana", "Iowa", "Kansas", "Kentucky",
          "Louisiana", "Maine", "Maryland",
          "Massachusetts", "Michigan", "Minnesota",
          "Mississippi", "Missouri", "Montana",
          "Nebraska", "Nevada", "New Hampshire",
          "New Jersey", "New Mexico", "New York",
          "North Carolina", "North Dakota", "Ohio",
          "Oklahoma", "Oregon", "Pennsylvania",
          "Rhode Island", "South Carolina",
          "South Dakota", "Tennessee", "Texas",
          "Utah", "Vermont", "Virginia",
          "Washington", "West Virginia", "Wisconsin",
          "Wyoming"],
        value11: [],
        roleList: [],
        showTitle: false,
        params:[],
        paramsValue: [{
          title: '序号',
          key: 'id',
          style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
        },
        {
          title: '角色名称',
          key: 'roleName',
          style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
        },
        {
          title: '角色代码',
          key: 'roleCode',
          style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
        },
        {
          title: '状态',
          key: 'status',
          style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
        }],
        debounce: 500,
        searchparams: [{
            title: '序号',
            key: 'id',
            style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '角色名称',
            key: 'roleName',
            style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '角色代码',
            key: 'roleCode',
            style: 'float: left; width: 30rem; color: #8492a6; font-size: 13px'
          },
          {
            title: '状态',
            key: 'status',
            style: 'float: left; width: 15rem; color: #8492a6; font-size: 13px'
          }
        ]
      }
    },
    mounted() {
      this.list = this.states.map(item => {
          return { value: item, label: item };
    });
      this.debouncedSearch = debounce(this.debounce, this.searchRole);
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
          this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
        });
        }, 2000);
        } else {
          this.options4 = [];
        }
      },
      search(queryString) {
//        this.loading = true;
        this.debouncedSearch(queryString);
      },
      searchRole(query) {
        if (query !== '') {
          this.loading = true;
          let param = {};
          param.pageNum = 1;
          param.pageSize = 100;
          let roleForm = {
            status: '',
            roleCode: query,
            roleName: ''
          };
          Object.assign(param, roleForm);
          this.ajax({
            url: '/uac/role/queryRoleListWithPage',
            data: param,
            loading: true,
            success: (res) => {
//            setTimeout(() => {
//            this.loading = false;
//        }, 300);
            this.loading = false;
            this.roleList = res.result.list;
            this.params = this.roleList.length > 0 ? this.paramsValue : [];
            this.showTitle = this.roleList.length > 0;
        }
        });
        } else {
          this.loading = false;
          this.roleList = [];
          this.params = []
          this.showTitle = false;
        }
      }
    }
  };
</script>
<style>
  h3 {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  .selectclass {
    width: 30rem;
  }
</style>
