<template>
  <button @click="todo">{{ row._edit ? '完成' : '编辑' }}</button>
</template>

<script>
export default {
  props: ['row', 'column'],

  methods: {
    todo () {
      this.$emit('row-edit', this.row);
      this.$set(this.row, '_edit', !this.row._edit);
    }
  }
};
</script>

