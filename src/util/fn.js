// 公用函数方法

import http from "./request";
import { Loading } from "element-ui";
// 限制输入框只能输入数字和小数点,不能以小数点开头,小数点只出现一次,最多两位小数
export const filterNum = params => {
  params = params.replace(/[^\d\.]/g, ""); // 数字和.
  params = params.replace(/^\./g, ""); // 不以小数点开头
  params = params.replace(/\.{2,}/g, "."); // 小数点出现一次
  params = params
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", "."); // 小数点出现一次
  params = params.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 两位小数
  return params;
};

// 日期时间转换
export const $dateFormat = (date, type) => {
  if (!date) {
    return "";
  }
  let time = new Date(date);
  let year = time.getFullYear();
  let month =
    time.getMonth() < 9 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
  let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  let hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  let minutes =
    time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  let seconds =
    time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  if (type == 1) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
};

// 日期转换
export const $dayFormat = (date, type) => {
  if (!date) {
    return "";
  }
  let time = new Date(date);
  let year = time.getFullYear();
  let month =
    time.getMonth() < 9 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
  let day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  if (type == 1) {
    return `${year}-${month}-${day}`;
  } else if (type == 2) {
    return `${year}${month}${day}`;
  } else if (type == 3) {
    return `${year}-${month}`;
  }
};

// 数字转换为大写
export const convertCurrency = money => {
  var cnNums = new Array(
    "零",
    "壹",
    "贰",
    "叁",
    "肆",
    "伍",
    "陆",
    "柒",
    "捌",
    "玖"
  ); // 汉字的数字
  var cnIntRadice = new Array("", "拾", "佰", "仟"); // 基本单位
  var cnIntUnits = new Array("", "万", "亿", "兆"); // 对应整数部分扩展单位
  var cnDecUnits = new Array("角", "分", "毫", "厘"); // 对应小数部分单位
  var cnInteger = "整"; // 整数金额时后面跟的字符
  var cnIntLast = "元"; // 整型完以后的单位
  var maxNum = 999999999999999.9999; // 最大处理的数字
  var integerNum; // 金额整数部分
  var decimalNum; // 金额小数部分
  var chineseStr = ""; // 输出的中文金额字符串
  var parts; // 分离金额后用的数组,预定义
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    return money;
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  money = money.toString();
  if (money.indexOf(".") == -1) {
    integerNum = money;
    decimalNum = "";
  } else {
    parts = money.split(".");
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        zeroCount = 0; // 归零
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  // 小数部分
  if (decimalNum != "") {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != "0") {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == "") {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == "") {
    chineseStr += cnInteger;
  }
  return chineseStr;
};

// 日期时间插件参数
export const pickOption = (params = 1) => {
  if (params == 1) {
    // 当前以后的日期不能选
    return {
      disabledDate: time => {
        return time.getTime() > Date.now();
      }
    };
  } else {
    // 当前以前的日期不能选
    return {
      disabledDate: time => {
        return time.getTime() < Date.now();
      }
    };
  }
};

//导出
export async function exportData(url, data, filename) {
  const loading = Loading.service({
    lock: true,
    text: "正在导出，请稍等。。。",
    spinner: "el-icon-loading"
  });
  const res = await http.get(url, data, null, {
    responseType: "blob"
  });
  if (res) {
    const url = window.URL.createObjectURL(new Blob([res]), {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    });
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xls`; //下载后文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
    loading.close();
  }
}
