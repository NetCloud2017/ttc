<template>
  <div class="breadcrumb-con">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-if="item.meta.name" v-for="item in $route.matched" :key="item.id">
            <!--<router-link :to="item.path">{{item.meta.name}}</router-link>-->
            <span>{{item.meta.name}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
