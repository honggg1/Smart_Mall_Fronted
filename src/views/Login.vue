<template>
  <div>
    <NavBar :title="txt"></NavBar>
    <div style="margin-top:20vw">
      <van-form @submit="onLogin">
        <van-cell-group inset>
          <van-field v-model="account.accountId" type="tel" label="手机号" />
          <van-field v-model="account.password" type="password" label="密码" />
        </van-cell-group>
        <van-cell-group inset>
          <van-button color="#3cba92" block style="margin-top:5vw" native-type="submit">登录</van-button>
          <van-button color="#ace0f9" block style="margin-top:5vw">去注册</van-button>
        </van-cell-group>
      </van-form>
    </div>
    <Footer></Footer>
  </div>
</template>
<script setup>
import { Form, Field, CellGroup, Button, Notify } from 'vant';
import Footer from "@/components/Footer.vue";
import NavBar from "@/components/NavBar.vue";
import { ref, reactive } from 'vue';
import { post, get } from "@/api/index.js";
import { getSessionStorage, setSessionStorage } from "@/common.js";
import { useRouter, useRoute } from "vue-router";

const txt = ref("用户登录");
//获取路由对象，跳转页面
const router = useRouter();
//获取路由参数
const route = useRoute();

const account = reactive({
  accountId: '',
  password: ''
})

// 页面加载时检测是否已登录，已登录则跳转首页
if (getSessionStorage('account')) {
  router.push('/');
}

//执行登录操作方法
const onLogin = ()=>{
  let url = "/account/login";
  post(url,account,true).then((response)=>{
    if(response.data.code==20000){
      Notify({ 
        type: 'success', 
        message: '用户登录成功',
        duration: 2000,
        background:'#66cc99' 
     });
      //TODO: 将登录用户状态存储
      setSessionStorage('account',response.data.resultData);
      router.push('/');
   }else{
      Notify({ 
        type: 'danger', 
        message: response.data.message ,
        duration: 2000,
        background:'#FF9999'
     });
   }
 }).catch((e)=>{ console.log(e);});
}
</script>


<style scoped>
</style>
