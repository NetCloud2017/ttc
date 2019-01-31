<template>
  <div class="accept-container">
    <el-tabs v-model="docId" tab-position="top" @tab-click="clickTab">
      <div v-for="item in swaggerList">
        <el-tab-pane :label="item.label" :name="item.name">
          <iframe :style="{width:rightContentWidth, minHeight: mainContentHeight}" frameborder=0 scrolling=auto :src="item.link"></iframe>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'swagger-ui',
    data () {
      return {
        docId: 'swagger-wms-id',
        swaggerList: [
          {
            label: '用户中心-接口文档',
            name: 'swagger-uac-id',
            link: process.env.API_ROOT + 'uac/swagger-ui.html' // 'http://api.malicloud.net:8080/uac/swagger-ui.html'
          },
          {
            label: '数据中心-接口文档',
            name: 'swagger-mdc-id',
            link: process.env.API_ROOT + 'mdc/swagger-ui.html'
          },
          {
            label: '对接中心-接口文档',
            name: 'swagger-opc-id',
            link: process.env.API_ROOT + 'opc/swagger-ui.html'
          },
          {
            label: '仓单系统-接口文档',
            name: 'swagger-wms-id',
            link: process.env.API_ROOT + 'maliwms/swagger-ui.html'
          }
        ]
      };
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
