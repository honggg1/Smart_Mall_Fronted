<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    left-arrow
    style="background: linear-gradient(to right,#fff1eb,#ace0f9)"
    @click-left="onClickLeft"
  />
</template>
<script setup>
defineProps({
  title: {
    type: String
  }
})

const onClickLeft = () => history.back()
</script>
<style scoped >
</style>
