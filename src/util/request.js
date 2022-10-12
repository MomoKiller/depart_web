import axios from "axios";
import { Message, Loading } from "element-ui";
import { BASE_URL } from "./index";
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 20000;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";

const http = axios.create();

const get = http.get;
http.get = (url, params, options = {}, config) => {
  return get(url, { ...config, params }).then((data = {}) => {
    if (config && config.responseType == "blob") {
      // 导出接口,返回blob对象
      return Promise.resolve(data.data ? data.data : false);
    } else {
      return Promise.resolve(data.data ? data.data.data : false);
    }
  });
};

const post = http.post;
http.post = (url, params, options = {}, config) => {
  return post(url, params, config).then((data = {}) => {
    return Promise.resolve(data.data ? data.data.data : false);
  });
};

let loading;
// 请求拦截器
http.interceptors.request.use(
  config => {
    let info = window.localStorage.getItem("info");
    if (info) {
      config.headers.token = `${JSON.parse(info).token}`;
    } else {
    }
    // 加载提示
    loading = Loading.service({
      lock: true,
      text: "数据加载中",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.2)"
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    if (response.data.code == 0) {
      // 成功
      loading.close();
      return response;
    } else if (response.data.code == 1004) {
      // token
      loading.close();
      window.localStorage.clear();
      Message.error("登录过期,请重新登录");
      location.href = "/";
    } else {
      if (response.config.responseType == "blob") {
        loading.close();
        return response;
      } else {
        loading.close();
        Message.error(
          response.data.msg ||
            response.data.message ||
            "数据加载失败，请刷新页面重试！"
        );
      }
    }
  },
  error => {
    console.log(error);
    loading.close();
    Message.error("网络异常，请刷新页面重试！");
    return Promise.reject(error);
  }
);

export default http;
