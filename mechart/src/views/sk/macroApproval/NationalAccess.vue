<template>
  <div>
    <div class='futures-wrap-center'>
      <div class='futures-cover-center' v-if='isShow' @click.stop='closeMyself'></div>
      <transition name='dropc'>
        <!-- title -->
        <div class='NationalAccess-content-center' :style='[futuresSize]' v-if='isShow'>
          <div class='top-title-center' :style='{width:futuresSize.width}'>
            {{title}}
            <span class='futures-close-center' @click.stop='closeMyself'>x</span>
          </div>
          <!-- content -->
            <div class="searchWrp">
                <span>选择国家</span>
                <select class="search-select" v-model="country">
                    <option :value="item.countryOrigin" v-for="(item,index) in countryList" :key='index'>{{item.countryOrigin}}</option>

                </select>
                <button class="search-button" @click="searchData" id="btn">搜索</button>
            </div>
          <div class='contentt'>
              <el-table
                :data="NationalAccessList"
                border
                max-height="565"
                align='center'>
                <el-table-column
                prop="countryOrigin"
                label="国家">
                </el-table-column>
                <el-table-column
                prop="approvalNo"
                label="注册编号Approval No">
                </el-table-column>
                <el-table-column
                prop="plantName"
                label="企业名称 Name of plant">
                </el-table-column>
                <el-table-column
                prop="activities"
                label="生产方式 Activties">
                </el-table-column>
                <el-table-column
                prop="approvalProducts"
                label="注册品种 Products for Approval">
                </el-table-column>
                <el-table-column
                prop="remark"
                label="备注 Remark">
                </el-table-column>
            </el-table>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: '1200'
    },
    height: {
      type: [String, Number],
      default: '740'
    }
  },
  data() {
    return {
      futuresSize: {
        width: this.width + 'px',
        height: this.height + 'px'
      },
      country: '',
      NationalAccessList: [],
      countryList: []
    };
  },
  created() {
  },
  mounted() {
    this.ajax({
      url: '/malisk/client/macro/approvalCountryList',
      type: 'GET',
      success: (res) => {
        this.countryList = res.result;
        console.log(this.countryList);
      }
    });
  },
  methods: {
    closeMyself() {
      this.$emit('on-close');
      this.country = '';
      this.NationalAccessList = null;
    },
    btnClick() {
      // 解决快速点击button按钮
      let btn = document.getElementById('btn');
      btn.disabled = 'disabled';
      setTimeout(() => {
        btn.disabled = '';
      }, 3000);
    },
    // 搜索
    searchData() {
      if (this.country !== null && this.country !== '') {
        this.ajax({
          url: '/malisk/client/macro/approvalList',
          type: 'POST',
          data: {country: this.country},
          success: (res) => {
            this.NationalAccessList = res.result;
          }
        });
      } else {
        this.errorTip('请选择国家！');
        this.btnClick();
      }
    }
  }
};
</script>

<style>
.contentt{
  width: 1200px;
  height: 740px;
  margin-top: 30px;
  padding: 0 10px 0 10px;
}
 .contentt .el-table__empty-block{
    background-color:  #fff;
 }
.contentt el-table th div, .el-table th > .cell{
  color:#fff;
}
.contentt .el-table td, .el-table th{
    background-color:  #990808;
}
.contentt .el-table--small td{
  text-align: center;
  color:#1a1a1a;
  font-size:14px!important;
  font-family:"微软雅黑";
  border-color:#1a1a1a;
  background: #fff !important;
}
.contentt .el-table--enable-row-hover .el-table__body tr:hover>td{
  background: #fff !important;
}
.searchWrp{
    margin-left: 20px;
}
.searchWrp span{
    color:#1a1a1a;
    font-size: 14px;
}
.search-select{
    width: 200px;
    height: 34px;
}
.search-button{
    width: 100px;
    height: 34px;
    background-color: #990808;
    color: #fff;
    border-radius:2px;
    border: white;
}
.futures-wrap-center {
  position: fixed;
  width: 1px;
  height: 100%;
  z-index: 999;
  right: 0;
}
.futures-cover-center {
  background: #000;
  opacity: 0.4;
  position: fixed;
  z-index: 5;
  top: 0px;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.top-title-center {
  background: rgb(153, 8, 8);
  border-bottom: 1px solid #e3e4e6;
  height: 50px;
  line-height: 50px;
  font-size: 16px !important;
  color: #fff;
  text-indent: 20px;
  position: absolute;
  top: 0;
  right: 0 !important;
  width: 640px;
}
.NationalAccess-content-center {
  position: fixed;
  background: #fff;
  top: 12vh;
  right: 0;
  z-index: 1000;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding-left: 00px;
  padding-right: 00px;
  padding-top: 90px;
  overflow: hidden;
  box-sizing: border-box;
  left: 0;
  margin: 0 auto;
  border-radius: 4px;
}
.futures-close-center {
  position: absolute;
  right: 25px;
  top: 0;
  text-align: center;
  cursor: pointer;
  font-size: 16px !important;
}
.futures-close-center:hover {
  color: #4fc08d;
}
.dropc-enter-active {
  transition: all 0.3s ease;
}
.dropc-leave-active {
  transition: all 0.3s ease;
}
.dropc-enter {
  transform: translateY(-20vh);
}
.dropc-leave-active {
  transform: translateY(-20vh);
}

</style>
