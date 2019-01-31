<template>
  <div class="multi-wrap">
    <div class="multi-select-mask" @click="close"></div>
    <div class="multi-select-box" :style="{left: position.x, top: position.y}">
      <ul class="multi-title">
        <li v-if="level >= 0" @click="getLevel(0)">
          <span v-if="titleData.mainProductName!= '' && titleData.mainProductName!= null" class="title-select">{{titleData.mainProductName}}</span>
          <span v-else>选择主产品名</span>
        </li>
        <li v-if="level >= 1" @click="getLevel(1)">
          <span v-if="titleData.mainStandardCountry!= '' && titleData.mainStandardCountry!= null" class="title-select">{{titleData.mainStandardCountry}}</span>
          <span v-else>选择国家</span>
        </li>
        <li v-if="level >= 2" @click="getLevel(2)">
          <span v-if="titleData.mainStandardPlant!= '' && titleData.mainStandardPlant!= null " class="title-select">{{titleData.mainStandardPlant}}</span>
          <span v-else>选择厂号</span>
        </li>
        <li v-if="level >= 3" @click="getLevel(3)">
          <span v-if="titleData.subProductName!= '' && titleData.subProductName!= null " class="title-select">{{titleData.subProductName}}</span>
          <span v-else>选择二级标产品</span>
        </li>
        <li v-if="level >= 4" @click="getLevel(4)">
          <span v-if="titleData.subStandard!= '' && titleData.subStandard!= null " class="title-select">{{titleData.subStandard}}</span>
          <span v-else>选择二级标</span>
        </li>
      </ul>
      <div class="multi-con-wrap">
        <ul class="multi-con">
          <li v-for="(item, index) in conData" @click="getData(index,item)" >
            <span v-if="conItemIndex === index" class="multi-selected">{{item}}</span>
            <span v-else>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['data', 'position'],
    data () {
      return {
        titleData: [],
        conData: [],
        level: 0,
        name: '',
        emitData: {
          'mainProductName': '', // 主产品名
          'mainStandard': '',
          'mainStandardCountry': '', // 主标准_国家
          'mainStandardPlant': '', // 主标准_厂号
          'marketDataNo': '',
          'marketPrice': 0,
          'subProductName': '', // 二级产品名
          'subStandard': '' // 二级标
        },
        level4: [],
        conItemIndex: null
      };
    },
    mounted () {
      this.titleData = this.data;
      if (this.titleData.subStandard) {
        this.level = 4;
        this.name = this.titleData.subProductName;
      } else {
        this.level = 0;
        this.name = '';
      }
      this.getAjax(this.level, this.name);
    },
    methods: {
      close() {
        this.$emit('close');
      },
      getData(index, name) {
        if (this.level === 0) {
          this.titleData.mainProductName = name;
        }
        if (this.level === 1) {
          this.titleData.mainStandardCountry = name;
          this.titleData.mainStandardPlant = '';
        }
        if (this.level === 2) {
          this.titleData.mainStandardPlant = name;
          this.titleData.subProductName = '';
        }
        if (this.level === 3) {
          this.titleData.subProductName = name;
          this.titleData.subStandard = '';
        }
        if (this.level === 4) {
          this.titleData.subStandard = name;
          this.$emit('selected', this.level4[index]);
          this.close();
        }
        this.level++;
        this.getAjax(this.level, name);
      },
      getAjax(level) {
        let param = {
          'level': 0,
          'mainProductName': null,
          'mainStandardCountry': null,
          'mainStandardPlant': null,
          'subProductName': null,
          'subStandard': null
        };
        param.level = level;
        param.mainProductName = this.titleData.mainProductName;
        param.mainStandardCountry = this.titleData.mainStandardCountry;
        param.mainStandardPlant = this.titleData.mainStandardPlant;
        param.subProductName = this.titleData.subProductName;
        param.subStandard = this.titleData.subStandard;
        var that = this;
        that.ajax({
          url: 'malisk/client/project/marketDetailList',
          data: param,
          loading: true,
          success: (res) => {
            console.log(res);
            if (res.code === 200) {
              if (level === 4) {
                that.level4 = res.result;
                console.log('level4---------------');
                console.log(res.result);
              };
              that.handleConData(level, res.result);
            }
          }
        });
      },
      handleConData(level, data) {
        var that = this;
        that.conData = [];
        var hash = [];
        if (data.length > 0) {
          data.forEach(function(item) {
            if (level === 0) {
              hash.push(item.mainProductName);
            }
            if (level === 1) {
              hash.push(item.mainStandardCountry);
            }
            if (level === 2) {
              hash.push(item.mainStandardPlant);
            }
            if (level === 3) {
              hash.push(item.subProductName);
            }
            if (level === 4) {
              hash.push(item.subStandard);
            }
          });
          that.conData = that.unique(hash);
          that.handleConItemIndex(level, that.conData);
        }
      },
      unique(arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr.indexOf(arr[i]) === i) {
            hash.push(arr[i]);
          }
        }
        return hash;
      },
      getLevel(level) {
        var temp = {};
        temp = this.titleData;
        this.titleData = {};
        this.titleData.mainProductName = null;
        this.titleData.mainStandardCountry = null;
        this.titleData.mainStandardPlant = null;
        this.titleData.subProductName = null;
        this.titleData.subStandard = null;
        if (level === 0) {
//          this.titleData.mainProductName = temp.mainProductName;
        }
        if (level === 1) {
          this.titleData.mainProductName = temp.mainProductName;
//          this.titleData.mainStandardCountry = temp.mainStandardCountry;
        }
        if (level === 2) {
          this.titleData.mainProductName = temp.mainProductName;
          this.titleData.mainStandardCountry = temp.mainStandardCountry;
//          this.titleData.mainStandardPlant = temp.mainStandardPlant;
        }
        if (level === 3) {
          this.titleData.mainProductName = temp.mainProductName;
          this.titleData.mainStandardCountry = temp.mainStandardCountry;
          this.titleData.mainStandardPlant = temp.mainStandardPlant;
//          this.titleData.subProductName = temp.subProductName;
        }
        if (level === 4) {
          this.titleData.mainProductName = temp.mainProductName;
          this.titleData.mainStandardCountry = temp.mainStandardCountry;
          this.titleData.mainStandardPlant = temp.mainStandardPlant;
          this.titleData.subProductName = temp.subProductName;
//          this.titleData.subStandard = temp.subStandard;
        }
        this.level = level;
        this.getAjax(this.level);
      },
      handleConItemIndex(level, arr) {
        var compareName = '';
        if (level === 0) {
          compareName = this.titleData.mainProductName;
        }
        if (level === 1) {
          compareName = this.titleData.mainStandardCountry;
        }
        if (level === 2) {
          compareName = this.titleData.mainStandardPlant;
        }
        if (level === 3) {
          compareName = this.titleData.subProductName;
        }
        if (level === 4) {
          compareName = this.titleData.subStandard;
        }
        var that = this;
        for (var i = 0; i < that.conData.length; i++) {
          if (that.conData[i] === compareName) {
            that.conItemIndex = i;
            return;
          } else {
            that.conItemIndex = null;
          }
        }
      }
    }
  };
</script>
<style >
.multi-select-box{
  width:720px;
  height:192px;
  box-sizing: border-box;
  background: #f5f7fa;
  -moz-box-shadow:1px 1px 5px #B2B2B2;
  -webkit-box-shadow:1px 1px 5px #B2B2B2;
  box-shadow:1px 1px 5px #B2B2B2;
  border:1px solid #cccccc;
  position:fixed;
  top:0;
  left:0;
  margin: 0 auto;
  z-index:1000;
}
.multi-select-box .multi-title{
  border-bottom: 1px solid #cccccc;
  height:34px;
  line-height:34px;
  display: flex;
  justify-content: flex-start;
}
.multi-select-box .multi-title li{
  flex-basis: 144px;
  color: #990808;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
.multi-select-box .multi-con{
  /*display:flex;*/
  /*justify-content: flex-start;*/
  /*flex-wrap:wrap;*/
}
.multi-con-wrap{
  width:718px;
  height:156px;
  overflow:hidden;
}
.multi-select-box .multi-con{
  width:740px;
  overflow-y:scroll;
  height:156px;
  padding-bottom:10px;
}
.multi-select-box .multi-con li{
  display:inline-block;
  width:143px;
  /*flex-basis: 143px;*/
  color: #1a1a1a;
  font-size:14px;
  text-align:center;
  line-height:14px;
  /*flex-shrink: 0;*/
  margin-top: 20px;
  cursor: pointer;
}
.multi-select-box .multi-con li .multi-selected{
    color:#990808;
}
  .title-select{
    color:#1a1a1a;
    position:relative;
  }
.title-select:before{
  content:'';
  width:4px;
  height:4px;
  position:absolute;
  top:5px;
  left:-10px;
  border-radius:4px;
  background:#1a1a1a;
}
  .multi-select-mask{
    width:100vw;
    height:100vh;
    background:transparent;
    position:fixed;
    top:0;
    left:0;
    z-index:999;
  }
  .multi-wrap{
    /*width:100vw;*/
    /*height:100vh;*/
    position:relative;
  }
</style>
