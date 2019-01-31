<template>
  <common :show-search="false" title="二级标">
    <div class="seachTag">
      <el-table
        border
        height="380"
        ref="tagSingleTable"
        :data="twoTag"
        highlight-current-row
        @row-click="selectCurrentRow"
        class="sk-table-black"
      >
        <el-table-column
          prop="subLevelCode"
          label="项目编号"
        >
        </el-table-column>
        <el-table-column
          prop="mainProductName"
          label="产品"
        >
        </el-table-column>
        <el-table-column
          prop="subStandard"
          label="二级标"
        >
        </el-table-column>
        <el-table-column
          prop="marketPrice"
          label="市价"
        >
          <template slot-scope="scope">
            <price-cell :row="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          prop="adRatioString"
          label="涨跌"
        >
          <template slot-scope="scope">
            <adr-cell :row="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          prop="discountRateString"
          label="建议折率"
        >
          <template slot-scope="scope">
            <dis-cell :row="scope.row" />
          </template>
        </el-table-column>
        <el-table-column
          prop="flowCoefficient"
          label="流通系数"
        >
          <template slot-scope="scope">
            <flow-cell :row="scope.row" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </common>
</template>
<script>
import Common from './common';
import {mapState} from 'vuex';
let priceCell = {
  template: `<div :style="{color: textColor}">{{row.marketPrice}}</div>`,
  props: ['row'],
  computed: {
    textColor () {
      return this.row.adRatioColor;
    }
  }
};
let adrCell = {
  template: `<div :style="{color: textColor}">{{row.adRatioString}}</div>`,
  props: ['row'],
  computed: {
    textColor () {
      return this.row.adRatioColor;
    }
  }
};
let disCell = {
  template: `<div :style="{color: textColor}">{{row.discountRateString}}</div>`,
  props: ['row'],
  computed: {
    textColor () {
      return this.row.adRatioColor;
    }
  }
};
let flowCell = {
  template: `<div :style="{color: textColor}">{{row.flowCoefficient}}</div>`,
  props: ['row'],
  computed: {
    textColor () {
      return this.row.adRatioColor;
    }
  }
};
export default {
  beforeUpdate () {
    this.selectCurrentRow(this.twoTag[0]);
  },
  methods: {
    selectCurrentRow (row, event, column) {
      this.$refs.tagSingleTable.setCurrentRow(row);
      this.$store.dispatch('sendToTagRow', row);
    },
    defaultItem () {
      this.selectCurrentRow(this.twoTag[0]);
    }
  },
  computed: {
    ...mapState(['skHomeData']),
    twoTag () {
      return this.skHomeData.twoTag;
    }
  },
  watch: {
    twoTag: {
      handler: function () {
        this.$nextTick(() => {
          this.defaultItem();
        });
      }
    }
  },
  components: {
    Common,
    priceCell,
    adrCell,
    disCell,
    flowCell
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .seachTag{
    width: 1070px;
    height: 376px;
  }
</style>
