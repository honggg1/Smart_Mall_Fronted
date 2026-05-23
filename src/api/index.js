import axios from "axios"  //导入异步请求插件axios
import qs from "qs"        //导入qs


//创建axios对象，做一些基础设置
// http://localhost:10001    /account/login
const axiosInstance =  axios.create({
    baseURL:'http://localhost:10001',
    timeout:50000
});


/*
    url: /account/login   
    get请求参数是通过URL传递。

    传统参数传递：/account/login?name=steve

    RESTFul风格参数传递：
        参数值是地址的一部分：
        /account/login/steve
        id=101 value=200
        /account/info/101/200
*/
export function get(url){
   return axiosInstance.get(url);
}

// HTTP协议 Get和 Post区别
//常用post方式请求，封装成一个post().  post传递参数是在请求体； 请求报文(行、头、体)
/*
    url:/account/login
    params: account对象
    isJSON: true直接传递json对象给Java，false转化为参数形式 给Java
*/
export function post(url,params,isJSON){
    let headers = {
        'Content-Type': 'application/json'
    }

    //isJSON true表示传递参数是json格式,false表示传递参数是 参数形式(qs)
    if(!isJSON){
        //参数形式传递
        params = qs.stringify(params);  //将json转化为 参数形式
        headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    return  axiosInstance.post(url,params,headers);
}