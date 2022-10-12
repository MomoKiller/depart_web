// export const BASE_URL = "http://7cec.com:8098"; //测试地址
// export const BASE_URL = "http://leagueapi.tt.cn"; //正式地址


/**
 * 测试|生产环境URL 依据域名判断
 */

 export const BASE_URL = (location.hostname === "league.tt.cn") ? "http://leagueapi.tt.cn" : "http://7cec.com:8098";