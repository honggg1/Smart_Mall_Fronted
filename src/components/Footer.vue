<template>
  <van-tabbar v-model="active" route active-color="#ee0a24">
    <van-tabbar-item to="/index" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/cart" icon="cart-o">购物车</van-tabbar-item>
    <van-tabbar-item to="/orders" icon="records">订单</van-tabbar-item>
    <van-tabbar-item to="/mine" icon="user-circle-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const tabMap = ['/index', '/cart', '/orders', '/mine'];

const active = ref(tabMap.indexOf(route.path));

watch(
  () => route.path,
  (path) => {
    const idx = tabMap.indexOf(path);
    if (idx !== -1) active.value = idx;
  }
);
</script>

<style scoped>
</style>
