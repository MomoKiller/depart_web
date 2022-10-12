import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import App from "./App";
import router from "./router";
import http from "@/util/request";
import { $dateFormat, $dayFormat, pickOption } from "@/util/fn";
import filters from "@/util/filter";

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: "medium" }); // 统一默认medium-size

Vue.prototype.ExportUrl = `http://7cec.com:8098`; // 导出基路径
Vue.prototype.pagesizes = [10, 20, 30, 40, 50]; // 分页页码选择
Vue.prototype.$http = http; // axios请求
Vue.prototype.$dateFormat = $dateFormat; // 日期时间转化
Vue.prototype.$dayFormat = $dayFormat; // 日期转化
Vue.prototype.$pickOption = pickOption; // 日期时间插件参数

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// 全局禁止MessageBox & Dialog点击蒙层或者ESC键关闭弹层
ElementUI.MessageBox.setDefaults({
  closeOnClickModal: false,
  closeOnPressEscape: false
});
ElementUI.Dialog.props.closeOnClickModal.default = false;
ElementUI.Dialog.props.closeOnPressEscape.default = false;

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
