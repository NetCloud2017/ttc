<template>
  <div>
    <div class="item-input" v-for="(item,index) in mulTextArr">
      <input type="text" :placeholder="'首页' + index" @click="showSelect($event,index,mulTextArr)" >
      <span>{{item.mainProductName}}</span>
      <span>{{item.mainStandardCountry}}</span>
      <span>{{item.mainStandardPlant}}</span>
      <span>{{item.subProductName}}</span>
      <span>{{item.subStandard}}</span>
    </div>
    <multi-select v-if="showMultiSelect" :data="multiInitData" :position="position" @close="showMultiSelect = false" @selected="getResult"></multi-select>
  </div>
</template>
<script>
  import multiSelect from '@/components/multi-select/multiSelect';
  export default {
    data () {
      return {
        showMultiSelect: false,
        mulText: [],
        mulTextArr: [
          {
            'mainProductName': '', // 主产品名
            'mainStandard': '',
            'mainStandardCountry': '', // 主标准_国家
            'mainStandardPlant': '', // 主标准_厂号
            'marketDataNo': '',
            'marketPrice': 0,
            'subProductName': '', // 二级产品名
            'subStandard': '' // 二级标
          },
          {
            'mainProductName': '', // 主产品名
            'mainStandard': '',
            'mainStandardCountry': '', // 主标准_国家
            'mainStandardPlant': '', // 主标准_厂号
            'marketDataNo': '',
            'marketPrice': 0,
            'subProductName': '', // 二级产品名
            'subStandard': '' // 二级标
          }
        ],
        multiInitData: [],
        position: {x: 0, y: 0}
      };
    },
    created () {
      var that = this;
      that.$pcBus.$on('reFresh', function(page) {
        if (page.path === 'home') {
          that.reFresh(page);
        }
      });
    },
    methods: {
      reFresh(page) {
        console.log(page);
      },
      showSelect(e, index, arr) {
        var x = e.clientX - e.offsetX + 2;
        var y = e.clientY - e.offsetY + 30;
        this.position.x = x + 'px';
        this.position.y = y + 'px';
        this.multiInitData = arr[index];
        console.log(this.multiInitData);
        this.showMultiSelect = true;
      },
      getResult(res) {
        this.showMultiSelect = false;
        this.mulText = res;
      }
    },
    components: {multiSelect}
  };
</script>
<style>
  .item-input{
    margin-bottom:20px;
  }
</style>
