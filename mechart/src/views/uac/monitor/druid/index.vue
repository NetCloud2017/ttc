<template>
  <div class="accept-container">
    <el-tabs :value="docId" tab-position="top" @tab-click="clickTab">
      <div v-for="(item, index) in druidList" :key="docId">
        <el-tab-pane :key="index" :label="item.label" :name="item.name">
          <iframe :style="{width:rightContentWidth, minHeight: mainContentHeight}" frameborder=0 scrolling=auto :src="item.link"></iframe>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'druid-ui',
    data () {
      return {
        docId: 'druid-mdc-id',
        druidList: [
          {
            label: '用户中心-数据源',
            name: 'druid-uac-id',
            link: process.env.API_ROOT + 'uac/druid/index.html'
          },
          {
            label: '数据中心-数据源',
            name: 'druid-mdc-id',
            link: process.env.API_ROOT + 'mdc/druid/index.html'
          },
          {
            label: '对接中心-数据源',
            name: 'druid-opc-id',
            link: process.env.API_ROOT + 'opc/druid/index.html'
          }
        ]
      };
    },
    created () {
    },
    methods: {
      clickTab(targetTab) {
        this.docId = targetTab.name;
      }
    },
    computed: {
      rightContentWidth () {
        return this.$store.getters.getRightContentWidth;
      },
      mainContentHeight () {
        return this.$store.getters.getMainContentHeight;
      }
    }
  };
</script>
