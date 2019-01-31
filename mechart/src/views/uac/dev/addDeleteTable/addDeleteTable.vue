<template>
  <div>
    <el-form label-width="130px" size="small">
      <el-form-item label="动态添加列表"  prop="servin" >
        <template>
          <el-table border :data="infiledList" style="width: 100%" >
            <el-table-column prop="fildna" label="名称" style="width:6vw;" >
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.fildna"  ></el-input>
              </template>
            </el-table-column>
            <el-table-column  prop="fildtp" label="类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.fildtp" clearable  >
                  <el-option
                    v-for="item in fildtps"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.remark"  ></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right"  label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.$index == 0" @click.native.prevent="addRow(infiledList)" size="small"> 新增 </el-button>
                <el-button v-else @click.native.prevent="deleteRow(scope.$index, infiledList)" size="small"> 移除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
    </el-form>

    <!--Egrid使用指南 http://nlush.com/egrid/#/?id=egrid-->
    <div class="tableContent">
    <egrid border
           max-height="500"
           column-type="selection"
           :column-key-map="{ label: 'name' }"
           :data="data"
           :columns="columns"
           propSpan="date"
           :columns-schema="columnsSchema"
           :columns-props="columnsProps"
           :columns-handler="columnsHandler"
           @selection-change="selectionChange">
    </egrid>
    </div>
    <div class="img-content">
      <FileUpload :titleImg='"商检单"' :maxImg=5 :typeImg=1  :fileUrlsArray="this.fileUrlsArray"  @getFileUrls="getFileUrls" ></FileUpload>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Data from 'src/components/Egrid/data';
  import Btn from 'src/components/Egrid/cell-btn.vue';
  import Editor from 'src/components/Egrid/cell-editor.vue';
  import FileUpload from 'src/views/uac/dev/file/file.vue';
  export default {
    components: {
      FileUpload
    },
    data () {
      return {
        infiledList: [{ fildna: '33', fildtp: '44', remark: '55'
        }],
        fildtps: [{text: '字符', value: '1'}, {text: '数字', value: '2'}],
        fileUrls: [],
        fileUrlsArray: [
          {
            name: '商检单',
            url: 'http://i.imgur.com/CqmBjo5.jpg'
          }
//          {
//            name: '唛头照片',
//            url: 'http://i.imgur.com/zkaAooq.jpg'
//          },
//          {
//            name: '唛头照片',
//            url: 'http://i.imgur.com/0gqnEaY.jpg'
//          }
//          {
//            name: '唛头照片',
//            link: 'http://i.imgur.com/zkaAooq.jpg'
//          },
//          {
//            name: '唛头照片',
//            link: 'http://i.imgur.com/0gqnEaY.jpg'
//          }
        ],
        data: Data.data,
        columns: Data.columns,
        // columnsProps 用于定义所有 columns 公共的属性，
        // 这里属性可以参考这里： http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
        columnsProps: {
          width: 120,
          // 定义表格列如何渲染
          component: Editor
        },

        // columnsSchema 可以用来单独定义 columns 的某一列，这里的设置会覆盖 columnsProps 的配置属性
        columnsSchema: {
          '地址': {
            width: 'auto',
            // propsHandler 可用于转换传给自定义组件的 props
            propsHandler ({ col, row }) {
              return { address: row[col.prop] };
            },
            component: Vue.extend({
              props: ['address'],
              render (h) {
                return h('span', {
                  style: { color: '#20A0FF' }
                }, this.address);
              }
            })
          },
          '姓名': {
            width: 'auto',
            // propsHandler 可用于转换传给自定义组件的 props
            propsHandler ({ col, row }) {
              return { name: row[col.prop] };
            },
            component: Vue.extend({
              props: ['name'],
              render (h) {
                return h('span', {
//                style: { color: '#20A0FF' }
                }, this.name);
              }
            })
          }
//          '邮编': {
//            formater (row, col) {
//              return row[col.prop] + '...';
//            }
//          }
        },
        selecetedRows: [],
        propsSpan: ['date']
      };
    },
    methods: {
      getFileUrls(typeImg, fileUrlArray) {
        this.fileUrls = fileUrlArray;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },

      addRow(tableData, event) {
        tableData.push({
          fildna: '', fildtp: '', remark: ''
        });
      },
      // columnsHandler 可用于在现有的 columns 进行操作，对 columns 进行增删改，这里新增了操作列
      columnsHandler (cols) {
        return cols.concat({
          // fixed: 'right',
          label: '操作',
          align: 'left',
          component: Btn,
          // listeners 可用于监听自定义组件内部 $emit 出的事件
          listeners: {
            'row-edit' (row) {
              // console.log('row-edit', row);
            }
          }
        });
      },

      selectionChange (rows) {
        this.selecetedRows = rows;
        // console.log('selected', rows);
      },

      clearSelection () {
        const { egrid } = this.$refs;
        if (egrid && egrid.clearSelection) {
          egrid.clearSelection();
        }
      }
    }
  };
</script>
<style scoped>
  .img-content{
    white-space: nowrap;
  }
</style>
