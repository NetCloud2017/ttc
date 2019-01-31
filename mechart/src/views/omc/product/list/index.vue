<template>
  <div>
    <el-form :inline="true" :model="productForm" ref="productForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="productForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model.trim="productForm.name" clearable class="pc-input3-col5" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button @click="resetFromFn('productForm')">重置</el-button>
        </el-form-item>
      </div>
      <div class="pc-addBtn-panel">
        <el-button size="small" type="primary" @click="loadPage('AddProduct')">添加商品</el-button>
      </div>
    </el-form>
    <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="index" label="序号" min-width="65"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="65">
        <template slot-scope="scope">
          {{scope.row.status | getProductStatusName}}
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="商品编码" min-width="150"></el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="350"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" min-width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="text" class="pc-textBtn" @click="loadPage('ProductDetail', {id: scope.row.id})">查看</el-button>
          <el-button type="text" class="pc-textBtn" @click="loadPage('EditProduct', {id: scope.row.id})">修改</el-button>
          <el-button type="text" class="pc-textBtn-danger" @click="deleteProductFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="pageUrl.queryProductList" :queryData="productForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
  </div>
</template>
<script>
  //  import Bus from 'src/vueBus.js';
  import PcPagination from 'components/form/pagination';
  export default {
    data () {
      return {
        productForm: {
          status: '',
          productCode: '',
          productName: ''
        },
        statusOption: [{
          value: 1,
          label: '在售'
        }, {
          value: 2,
          label: '下架'
        }, {
          value: 3,
          label: '删除'
        }],
        tableData: [],
        emptyText: '',
        currentPage: 5,
        pageUrl: {
          queryProductList: '/mdc/product/queryProductListWithPage'
        }
      };
    },
    components: {
      PcPagination
    },
    methods: {
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      },
      deleteProductFn(product) {
        let confirmMsg = '确定删除' + product.name + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, `/mdc/product/deleteProductById/${product.id}`, null, () => {
          this.queryDataFn();
        });
      }
    }
  };
</script>
