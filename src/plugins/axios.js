import axios from "axios";
import store from '@/store'
import router from '@/router/index'
import qs from "qs";


const _axios = axios.create({
  timeout: 3 * 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
  paramsSerializer: (param) => qs.stringify(param)
});

_axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    for (var k in config.params) {
      if (config.params[k] == null || config.params[k] == undefined || config.params[k] == "") {
        delete config.params[k];
      }
    }
    if (store.state.token) {
      config.headers['Authorization'] = `Bearer ${store.state.token}`;
    }
    if (config.method == "patch") {
      config.headers['Content-Type'] = 'application/merge-patch+json';
    }
    return config;
  },
  function (error) {
    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    var data = response.data;
    var after = {};
    if (data['@type'] == 'hydra:Collection') {
      after = {
        list: data["hydra:member"],
        total: data["hydra:totalItems"]
      }
    } else {
      after = data;
    }
    return after;
  },
  function (error) {
    // Do something with response error
    var guessMsg = "请求失败";
    if (error.response) {
      let code = error.response.status;
      error.code = code;
      if (code == 401) {
        store.commit("clear");
        router.push("/login");
        guessMsg = "请先登录";
      } else if (code == 404) {
        guessMsg = "找不到资源"
      } else if (code == 403) {
        guessMsg = "权限不足"
      } else if (/^4[0-9][0-9]$/.test(code)) {
        guessMsg = error.response.data.message || error.response.data["hydra:description"];
      } else if (/^5[0-9][0-9]$/.test(code)) {
        guessMsg = "服务器异常"
        console.error(error.response.data["hydra:description"])
      }
    } 
    error.msg = guessMsg;
    return Promise.reject(error);
  }
);

export default _axios;
