<template>
  <div class="wrapper">
    <!-- 标题 -->
    <NavBar :title="title"></NavBar>

    <!-- 搜索栏 -->
    <van-search v-model="searchTxt" shape="round" 
    background="linear-gradient(to right,#fff1eb,#ace0f9)" placeholder="搜索商家分类"/>
      
    <ul class="category-ul">
        <!-- 循环显示全部分类信息 -->
        <li v-for="(item, index) in category_list" :key="index" @click="toBusinessList(item.categoryId, item.categoryName)">
            <img :src="item.categoryCover" />
            <p>{{ item.categoryName }}</p>
        </li>
    </ul>

    <Footer></Footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import {useRouter,useRoute} from "vue-router";
import Footer from "@/components/Footer.vue";
import NavBar from "@/components/NavBar.vue";
import {get,post} from "@/api/index.js"

const router = useRouter();

const title = ref("全部分类");
const searchTxt = ref('');

//响应式数组：商家分类数组
const category_list = ref([]);
//加载商家分类数据
const loadCategory=()=>{
    let url = "/category/list";
    get(url).then(res=>{
        if(res.data.code == 20000){
            category_list.value = res.data.resultData;
        }
    }).catch(e=>{ console.log(e);});
}
loadCategory();

//跳转至 分类下的商家列表页面
const toBusinessList=(id,name)=>{
    //跳转至 分类-下商家列表页面。在BusinessList.vue界面显示该分类下的商家列表。
    router.push({
        path:"/businessList",
        query:{categoryId:id,categoryName:name}
    });
}
</script>

<style scoped >
.wrapper{ width:100%; height:100%; background-color: #f1f5f8;}
/*商品分类*/
.wrapper .category-ul{
    margin:3vw;
    
    display: flex; 
    flex-wrap: wrap; 
    padding:3vw 1.5vw;
    align-items: center;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 3vw;
    border:0.2vw solid #efefef;
}

.wrapper .category-ul span{
    position: absolute;
    right: 1.5vw;
    top:-2vw;
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
    width:18vw; height:18vw; display: flex; 
    flex-direction: column; 
    justify-content:center; 
    align-items:center;
    user-select: none; cursor: pointer;
}
.wrapper .category-ul li img{
    width:13vw; height:11.3vw;
}
.wrapper .category-ul li p{
    font-size: 3.2vw; color:#79859E;
}
</style>
