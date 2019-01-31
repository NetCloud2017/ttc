<template>
  <div>
    <input style="border: 1px solid rgb(228, 228, 228);width: 130px;height: 30px;"
      v-show="row._edit" type="text"
      v-model="row[column.property]">
    <span v-show="!row._edit">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: ['row', 'column'],

  computed: {
    text () {
      return this.row[this.column.property];
    }
  }
};
</script>

