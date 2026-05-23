<template>
  <div>
    <NavBar :title="txt"></NavBar>
      <div style="margin-top:20vw">
        <van-form @submit="onLogin()">
          <van-cell-group inset>
            <van-field v-model="account.accountId" type="tel" label="手机号" />
            <van-field v-model="account.password" type="password" label="密码" />
            <van-field v-model="account.name" name="pattern" placeholder="正则校验" :rules="[{ pattern, message: '请输入正确内容' }]"/>
            <van-field name="radio" label="单选框">
              <template #input>
                <van-radio-group v-model="account.sex" direction="horizontal">
                <van-radio name="1">男</van-radio>
                <van-radio name="2">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </van-cell-group>
          <van-cell-group inset>
            <van-button color="#3cba92" block style="margin-top:5vw" native-type="submit">注册</van-button>
            <van-button color="#ace0f9" block style="margin-top:5vw">去登录</van-button>
          </van-cell-group>
        </van-form>
        </div>
    </div>

</template>

<script setup>
import { Form, Field, CellGroup, Button } from 'vant'
import Footer from "@/components/Footer.vue"
import NavBar from "@/components/NavBar.vue"
import { ref, reactive } from 'vue'

const txt = ref("用户注册")

const account=reactive({
  accountId: '',
  password: '',
  name: '',
  sex: ''
})  
</script>

<style scoped>

</style>
