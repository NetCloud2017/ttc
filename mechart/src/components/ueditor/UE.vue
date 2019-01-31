<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'ue',
    data () {
      return {
        editor: null
      };
    },
    props: {
      value: '',
      config: {}
    },
    mounted () {
      this.editor = window.UE.getEditor('editor', this.config);
      this.editor.addListener('ready', () => {
        this.editor.setContent(this.value);
      });
    },
    methods: {
      getUEContent () {
        return this.editor.getContent();
      },
      getUEAllHtml() {
        return this.editor.getAllHtml();
      },
      setUEContent(value) {
        this.editor.setContent(value);
      }
    },
    destroyed () {
      this.editor.destroy();
    }
  };
</script>
