<template>
  <van-tabbar v-model="active" active-color="#ee0a24">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="cart-o">购物车</van-tabbar-item>
    <van-tabbar-item icon="records">订单</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';
import { Tabbar, TabbarItem } from 'vant';
import 'vant/lib/index.css';

const active = ref(0);
</script>

<style scoped>
</style>
