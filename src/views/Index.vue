<template>
  <div class="wrapper">
    <!-- 标题 -->
    <van-nav-bar style="background: linear-gradient(to right,#fff1eb,#ace0f9)" fixed>
      <template #title>
      </template>
      <template #left>
        <van-icon v-if="isLogin()" name="bell" badge="99+" class="accountId-icon" /><van-icon v-else name="user-circle-o" class="accountId-icon" @click="toLogin()"/>
        <span v-if="isLogin()" class="accountId">{{account.accountName}}</span><span v-else class="accountId" @click="toLogin()">未登录</span>
      </template>
      <template #right>
        <!-- 登录后用户头像 -->
        <van-image v-if="isLogin()" round width="9vw" height="9vw" :src="account.accountImg"/>
      </template>
    </van-nav-bar>

    <!-- 这个div的作用，就是占住页面一定高度位置，把搜索栏的位置往下顶 -->
    <div style="padding-top:42px"></div>
    <van-sticky :offset-top="46">
    <!-- 搜索栏 -->
    <van-search v-model="searchTxt" shape="round" background="linear-gradient(to right,#fff1eb,#ace0f9)" placeholder="请输入搜索关键词"/>
    </van-sticky>


    <!-- 商家分类 -->
    <ul class="category-ul">
        <span><van-icon name="weapp-nav" /></span>
        <li>
            <img src="@/assets/category/cat01-meishi.svg" />
            <p>美食</p>
        </li>
    </ul>

    <!-- 轮播图 -->

    <van-swipe class="my-swipe" :autoplay="3000" :height="135"  indicator-color="#009966"  fit="contain">
        <van-swipe-item>
            <img  src="@/assets/index_banner_1.png" />
        </van-swipe-item>
        <van-swipe-item>
            <img  src="@/assets/index_banner_2.png" />
        </van-swipe-item>
        <van-swipe-item>
            <img  src="@/assets/index_banner_3.png" />
        </van-swipe-item>
    </van-swipe>

    <!-- 推荐商家 -->
    <van-sticky :offset-top="90">
    <div class="show-business">
        <div class="show-business-line"></div>
        <p>推荐商家</p>
        <div class="show-business-line"></div>
    </div>
    </van-sticky>

    <!-- 商家列表 -->
    <van-pull-refresh v-model="loading" @refresh="onLoad">
    <ul class="business">
      <li>
          <div class="img-wrapper">
            <div class="business-feature" >新店</div>
            <img src="@/assets/businessImg/sj01.png"/>
          </div>
          <!-- 角标 购物车在当前商家 添加的商品数量 -->
          <van-badge :content="10" max="99">
            <div class="child" />
          </van-badge>
          <div class="business-info">
              <div class="business-info-h">
                  <h3>商家名称</h3>
                  <!-- 收藏商家 图标 -->
                  <div class="business-info-like">
                      <van-icon name="like" style="font-size:5vw" />
                  </div>
              </div>
              <div class="business-info-star">
                  <div class="business-info-star-left ">
                      <!-- 商家评分 -->
                      <van-rate v-model="value" :size="14" color="#ff9933" void-icon="star" void-color="#eee"/>
                      <p>5.0 月售345单</p>
                  </div>
                  <div class="business-info-star-right">
                      商家专送
                  </div>
              </div>
              <div class="business-info-delivery">
                  <p>&#165; 20 起送 | &#165; 30  配送</p>
              </div>
              <div class="business-info-explain">
                  <div> 商家描述 </div>
              </div>
          </div>
      </li>
    </ul>
    </van-pull-refresh>
    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Footer from "@/components/Footer.vue";
import {getSessionStorage} from "@/common.js"
import {useRouter,useRoute} from "vue-router";
import { showToast } from 'vant';
import {get,post} from "@/api/index.js"

const value = ref(4);
const searchTxt = ref('');
const loading = ref(false);

const router = useRouter();

const toLogin = () => {
  router.push('/login');
};

const onLoad = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};


//取出登录用户数据
const account = getSessionStorage('account');
//判断用户是否登录过
const isLogin = ()=>{
  if(getSessionStorage('account')==null){
    return false;  //没登录
  }else{
    return true;  //登录过
  }
}


</script>

<style scoped >
.wrapper{ width:100%; height:100%; }
.accountId-icon{
  color:#009966;
  font-size:6vw;

}
.accountId{
  margin-left:1.2vw;
  font-size:4vw;
  font-weight: 600;
  color:#494949;
}

.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #fff;

  }

::v-deep(.van-tab__text){
  font-size: 18px !important;
}


/*商品分类*/
.wrapper .category-ul{
    width:100%; height: 44vw; display: flex; flex-wrap: wrap;
    justify-content: space-around;
    align-content:center; padding:4.4vw; box-sizing: border-box;
    position: relative;
}

.wrapper .category-ul span{
    position: absolute;
    right: 1.5vw;
    top:3vw;
    background-color: #ffde09;
    color:#fb8b06;
    border:0.3vw solid #444;
    border-radius: 1vw;
    padding: 0.5vw 2vw;
    font-weight: 800;

    box-shadow: 0.2vw 0.2vw 0.2vw rgba(0, 0, 0, 0.5);
    z-index: 9999;
    height:5vw;
}

.wrapper .category-ul li{
    width:18vw; height:16vw; display: flex; flex-direction: column; justify-content: center; align-items: center;
    user-select: none; cursor: pointer;
}
.wrapper .category-ul li img{
    width:13vw; height:11.3vw;
}
.wrapper .category-ul li p{
    font-size: 3.2vw; color:#79859E;
}

/*推荐商家*/
.wrapper .show-business{
    width:100%; background:linear-gradient(to right,#fff1eb,#ace0f9); height:10vw;display:flex;align-items:center; justify-content:center;
}


.wrapper .show-business .show-business-line{
    width:28vw; height:0.1vw; background-color: #cc9;
}
.wrapper .show-business p{
    font-size: 4vw; margin: 0 4vw; color:#cc9;
}

/* 商家列表样式 */
.wrapper .business{
    width:100%;
    margin-bottom:14vw;
    padding-bottom: 15vw;
    overflow: hidden;
}
.wrapper .business .img-wrapper{
    width: 24vw;
    position: relative;overflow: hidden;
}
.wrapper .business .business-feature{
    width: 18vw;
    height:4vw;
    background-color: #93C;

    font-weight: 600;
    font-size: 2.3vw;
    color: #fff;

    transform-origin: 50% 100%;
    transform: rotate(-45deg);

    position: absolute;
    left: -5vw;
    top: 0vw;

    display: flex;
    justify-content: center;
    align-items: flex-end;

    padding-bottom: 0.5vw;
    border-bottom: 0.1vw solid #f03;
    box-sizing: border-box;

    box-shadow: rgba(0, 0, 0, 0.3) 0.05vw 0.05vw 0.5vw;
}

.wrapper .business li .business-img-quantity {
  width: 5vw;
  height: 5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  border-radius: 2.5vw;

  display: flex;
  justify-content: center;
  align-items: center;

  /*设置成绝对定位，不占文档流空间*/
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}

.wrapper .business li{
    width:100%; box-sizing: border-box; padding:2.5vw; user-select: none;
    border-bottom:0.3vw solid #e2d1c3;  display: flex;
}

.wrapper .business li img{
    width:18vw; height:18vw; border-radius:2vw; z-index: 0;
}

.wrapper .business li .business-info{
    width:100%; box-sizing: border-box; padding:0 3vw;
}

.wrapper .business li .business-info .business-info-h{
    display: flex; justify-content: space-between; align-items: center;
}
.wrapper .business li .business-info .business-info-h h3{
    font-size: 4vw; color:#696969;
}
.wrapper .business li .business-info .business-info-h .business-info-like{
    width:4.6vw; height:3.4vw; color: #ff6666  ; font-size:4vw; margin-right: 4vw;
    display: flex; justify-content: center; align-items: center;
}

.wrapper .business li .business-info .business-info-h .business-info-like .heart_icon{
    background-image: url(../assets/heart.png);
    width:8vw;
    height:7vw;
    display: block;
    background-size: cover;
    background-position: center;
}

.wrapper .business li .business-info .business-info-star{
    display: flex; justify-content: space-between; align-items: center; font-size:3.1vw;
}
.wrapper .business li .business-info .business-info-star .business-info-star-left{
    display: flex; align-items: center;
}
.wrapper .business li .business-info .business-info-star .business-info-star-left .fa-star{
    color:#fcba26; margin-right:0.5vw;
}
.wrapper .business li .business-info .business-info-star .business-info-star-left p{
    color:#666; margin-left:1vw;
}
.wrapper .business li .business-info .business-info-star .business-info-star-right{
    background-color: #016cf4; color:#f9f9f9; font-size:2.8vw; border-radius:0.4vw; padding:0 0.8vw;
}
.wrapper .business li .business-info .business-info-delivery{
    display: flex; justify-content: space-between; align-items: center;
    color:#666; font-size: 3.1vw; margin-bottom: 2vw;
}
.wrapper .business li .business-info .business-info-explain{
    display: flex; justify-content:left; align-items: center;
}
.wrapper .business li .business-info .business-info-explain div{
    border:0.1vw solid #e2d1c3; font-size: 3vw; color:#666; border-radius:1vw; padding:0 2vw;
    background-color: #fdfcfb;
}
</style>
