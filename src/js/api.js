import user from "./module/user";
import product from "./module/product"
import order from './module/order'
import shopcart from './module/shopcart'
import collection from './module/collection'
import categoryBrand from "./module/category-brand";
import _axios from "@/plugins/axios";
import address from "./module/address";
import comment from "./module/comment";


function conver(s) {
  return s < 10 ? '0' + s : s;
}

export default {
  getLocalDateTime(options={}) {
    var myDate = new Date();
    if(options.week) {
      myDate.setDate(myDate.getDate() + options.week*7);
    }
    if(options.month) {
      myDate.setMonth(myDate.getMonth() + options.month)
    }
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();
    //获取当前时间
    var now = year + '-' + conver(month) + "-" + conver(date) + " " + conver(h) + ':' + conver(m) + ":" + conver(s);
    return now;
  },
  getIRI(iri) {
    return _axios.get(iri);
  },
  ...user,...product,...order,...shopcart,...collection,...categoryBrand,...address,...comment
}

