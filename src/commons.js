//获得当前的日期，格式 yyyy年MM月dd日 2026年05月10日
export const getDate=()=>{
    var d = new Date();
    var year = d.getFullYear();  
    var month =d.getMonth()+1;  //枚举
    var day = d.getDate();
    month = month < 10 ? '0'+month : month;   
    //表达式1?值1:值2
    day = day<10 ? '0'+day : day;
    return `${year}年${month}月${day}日`;
}
export const getInfo=()=>"上海海洋大学项目实训";