<template>
  <el-table class="egrid"
    :data="data" ref="grid"
    :span-method="objectSpanMethod"
    v-bind="tableBind"
    v-on="$listeners">
    <template v-for="tp in typesColumns">
      <el-table-column
        v-if="tp.type === 'expand'"
        v-bind="tp.props"
        type="expand"
        :key="tp.type">
        <template slot-scope="props">
          <slot name="expand" v-bind="props"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else
        :key="tp.type"
        :type="tp.type"
        v-bind="tp.props">
      </el-table-column>
    </template>
    <el-table-column v-for="col in renderColumns"
      :key="col.label" v-bind="getColBind(col)">
      <template slot-scope="scope">
        <component :is="col.component"
          v-bind="getCptBind(scope, col)"
          v-on="col.listeners">
        </component>
      </template>
    </el-table-column>
    <template v-if="slotAppend" slot="append">
      <slot name="append"></slot>
    </template>
  </el-table>
</template>

<script type="text/ecmascript-6">
import ElTable from 'element-ui/lib/table';
import ElTableColumn from 'element-ui/lib/table-column';
import methods from './methods';
import Text from './text';

const BOOLEAN_KEYS = [
  'fit',
  'stripe',
  'border',
  'show-header',
  'highlight-current-row',
  'default-expand-all',
  'show-summary'
];

const COLUMN_PROPS = {
  align: 'left',
  component: Text
};

const TYPES = ['selection', 'expand', 'index'];

const COLUMN_KEY_MAP = {
  label: 'label',
  prop: 'prop'
};

export default {
  name: 'Egrid',

  mixins: [methods],

  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },

    columns: {
      type: Array,
      default () {
        return [];
      }
    },
    columnType: [String, Array],

    columnTypeProps: Object,

    columnKeyMap: Object,

    columnsProps: Object,

    columnsSchema: Object,

    columnsHandler: Function,

    slotAppend: Boolean,

    propSpan: String,
    deleteEmptyColumn: Boolean // 是否需要去掉数据都是空的列
  },

  data() {
    return {
      showColumns: this.columns, // 需要显示的列
      spanArr: [],
      count: 0
    };
  },

  created() {
    this.getSpanArr(this.data, this.columns, this.propSpan);
  },
  watch: {
    /*
     监听传入表格的数据（data）的变化，重新计算合并行的规则
     @param val 新数据
     @param oldVal 旧数据
     */
    data(val, oldVal) {
      this.getSpanArr(this.data, this.columns, this.propSpan);
      // 判断是否需要去掉数据都是空的列
      if (this.deleteEmptyColumn) {
        this.getNotEmptyColumns(this.data);
      }
    },
    /*
     监听传入表格的列的参数（columns）的变化
     @param newCols 新数据
     @param oldCols 旧数据
     */
    columns(newCols, oldCols) {
      this.showColumns = newCols;
    }
  },
  computed: {
    // 处理 $attrs 里面 Boolean 类型的 prop 和统一 prop 命名
    tableBind () {
      const { $attrs } = this;
      const bind = {};
      Object.keys($attrs).forEach(key => {
        const v = $attrs[key];
        const uniformKey = key.replace(/([A-Z])/, '-$1').toLowerCase();
        bind[key] = ~BOOLEAN_KEYS.indexOf(uniformKey) && v === '' ? true : v;
      });
      return bind;
    },

    renderColumns () {
      const {
        showColumns,
        columnKeyMap,
        columnsHandler,
        columnsProps: props,
        columnsSchema: schema
      } = this;
      const map = Object.assign({}, COLUMN_KEY_MAP, columnKeyMap);
      const renderColumns = showColumns.map(col => {
        const mix = (schema && schema[col[map.label]]) || {};
        const it = Object.assign({}, COLUMN_PROPS, props, col, mix);
        it.label = it[map.label];
        it.prop = it[map.prop];
        return it;
      });
      return (columnsHandler && columnsHandler(renderColumns)) || renderColumns;
    },

    // 用于渲染特殊列
    typesColumns () {
      const { columnType: type, columnTypeProps } = this;
      let typeColums = [];
      if (typeof type === 'string' && ~TYPES.indexOf(type)) {
        typeColums = [type];
      }
      if (Array.isArray(type)) {
        typeColums = type.filter(it => ~TYPES.indexOf(it));
      }
      const map = columnTypeProps || {};
      return typeColums.map(type => {
        return {
          type,
          props: map[type]
        };
      });
    }
  },

  methods: {
    // 合并行数
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      let colLength = this.columns.length;
      // 判断是否设置了用于支持功能特殊的功能列（多选、索引、折叠行）如果是合并行时需要排除掉用于支持功能特殊的功能列
      if (this.columnType && this.columnType !== '') {
        if (columnIndex === 0) {
          return;
        } else {
          columnIndex = columnIndex - 1;
        }
      }
/*      if (columnIndex > 0 &&
        ((this.columns[columnIndex - 1].merge))) { */

      if (columnIndex < colLength && this.columns[columnIndex].merge) {
        const _row = this.spanArr[columnIndex][rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 因为要合并的行数是不固定的，此函数是实现合并随意行数的功能
    getSpanArr (data, columns, prop) {
      this.spanArr = [];
      let showRowSpan = true;
      // 判断是否需要合并行或者表格列数是否undefine，如果是则不需要合并行
      if (!this.propSpan || !this.columns) {
        showRowSpan = false;
        return;
      }
/*      // 找到第一列，实现合并随机出现的行数
      let colLength = this.columns.length;
      // 判断合并行的关键字段知否在表格中
      for (let i = 0; i < colLength; i++) {
        if (this.propSpan === this.columns[i].prop) {
          showRowSpan = true;
          break;
        }
      } */
      if (!showRowSpan) {
        return;
      }
      let colLen = columns.length; // 获取表格的列数
      for (let col = 0; col < colLen; col++) {
        let colSpanArr = []; // 列合并规则
        let isLastColumn = false; // 判断是否是最后一列且是操作列
        if (!columns[col].merge) {
          this.spanArr.push(colSpanArr);
          continue;
        }
        if (col === colLen - 1 && (!columns[col].prop || columns[col].prop === '')) {
          isLastColumn = true;
        }
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            colSpanArr.push(1);
            this.pos = 0;
          } else {
            if (data[i][this.propSpan] === data[i - 1][this.propSpan] &&
              (data[i][prop] === data[i - 1][prop] || isLastColumn)) {
              // 如果useName相等就累加，并且push 0
              colSpanArr[this.pos] += 1;
              colSpanArr.push(0);
            } else {
              // 不相等push 1
              colSpanArr.push(1);
              this.pos = i;
            }
          }
        }
        this.spanArr.push(colSpanArr);
      }
    },

    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background: white';
      } else {
        return '';
      }
    },
    getColBind (col) {
      const bind = Object.assign({}, col);
      delete bind.component;
      delete bind.listeners;
      delete bind.propsHandler;
      return bind;
    },

    getCptBind ({ row, column }, col) {
      const props = { row, col, column };
      const handler = col.propsHandler;
      return (handler && handler(props)) || props;
    },
    // 遍历表格的数据，获取有数据的列，去掉数据为空的列
    getNotEmptyColumns(data) {
      let computeColumn = []; // 保存有数据的列
      let emptyColumns = true; // 判断是否是空数据列
      let colLen = this.columns.length; // 获取表格的列数
      let dataLen = data.length;
      for (let col = 0; col < colLen; col++) {
        let column = this.columns[col];
        emptyColumns = true; // 默认列数据都为空
        // 判断是否是最后一列且是操作列
        if (col === colLen - 1 && (!column.prop || column.prop === '')) {
          emptyColumns = false;
          computeColumn.push(column);
          continue;
        }
        for (var i = 0; i < dataLen; i++) {
          let item = data[i][column.prop];
          // 判断数据是否不为空
          if (item && item !== '') {
            emptyColumns = false;
            break;
          }
          // 判断数据是否不为或不为0
          if (item && item !== 0) {
            emptyColumns = false;
            break;
          }
        }
        if (!emptyColumns) {
          computeColumn.push(column);
        }
      }
      this.showColumns = computeColumn;
    }
  },

  components: {
    [ElTable.name]: ElTable,
    [ElTableColumn.name]: ElTableColumn
  }
};
</script>
