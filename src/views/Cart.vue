<template>
  <div class="wrapper">
    <NavBar :title="title"></NavBar>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Footer from "@/components/Footer.vue";
import NavBar from "@/components/NavBar.vue";

const title = ref("购物车");
</script>

<style scoped>
</style>
