<template>
  <span :title="row[col.prop]"
        style="width: 100%; overflow: hidden; display: block; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;">{{row[col.prop]}}</span>
</template>
<script >
  export default{
    props: ['row', 'col'],
    methods: {
    }
  };
</script>
