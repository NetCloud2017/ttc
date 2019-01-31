<template>
  <div>
    <!-- 货权主体 -->
    <div v-if='isshow'>
      <base-owner @on-clock='controlo'/>
      <basestorage @on-clock='controls' style='margin-top:10px'/>
    </div>
    <!-- 货权详情 -->
    <div v-if='controlwner'>
      <basedwnerdetail :ownerId='ownerId' @on-child='returnowner'/>
    </div>
    <!-- 冷库详情 -->
    <div v-if='controlstorage'>
      <basestoragedetail :storageId='storageId' @on-child='returnstorage'/>
    </div>
  </div>
</template>
<script>
import BaseOwner from '@/views/sk/grade/baseowner.vue'; // 货权
import basestorage from '@/views/sk/grade/basestorage.vue'; // 冷库
import basestoragedetail from '@/views/sk/grade/basestoragedetail.vue'; // 冷库详情
import basedwnerdetail from '@/views/sk/grade/baseownerdetail.vue'; // 货权详情
export default {
  data() {
    return {
      isshow: true,
      controlwner: false,
      controlstorage: false,
      // 数据
      ownerId: '',
      storageId: ''
    };
  },
  components: {
    BaseOwner,
    basestorage,
    basedwnerdetail,
    basestoragedetail
  },
  created () {
    this.watchRoute();
  },
  watch: {
    '$route': 'watchRoute'
  },
  methods: {
    controlo(val) {
      this.ownerId = val;
      this.isshow = false;
      this.controlwner = true;
    },
    controls(val) {
      this.storageId = val;
      console.log('1234567889067643-------------adf', val);
      this.isshow = false;
      this.controlstorage = true;
    },
    returnstorage() {
      this.isshow = true;
      this.controlstorage = false;
    },
    returnowner() {
      this.isshow = true;
      this.controlwner = false;
    },
    watchRoute() {
      let param = this.$route.query;
      if (param.controlwner || param.controlstorage) {
        this.isshow = false;
        this.ownerId = param.ownerId;
        this.controlwner = param.controlwner ? param.controlwner : false;
        this.storageId = param.storageId;
        this.controlstorage = param.controlstorage ? param.controlstorage : false;
      }
    }
  }
};
</script>
