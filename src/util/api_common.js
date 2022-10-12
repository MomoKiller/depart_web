import http from "@/util/request";

// 公用接口

// 获取公司列表
export const queryCompany = params => {
  return http.get("/admincommon/company_list", params).then(res => res);
};

// 获取部门列表
export const queryDepart = params => {
  return http.get("/admincommon/depart_list", params).then(res => res);
};

// 获取部门人员列表
export const queryUser = params => {
  return http.get("/select_user", params).then(res => res);
};

// 获取员工列表
export const queryStaff = params => {
  return http.get("/adminapi/user/userList", params).then(res => res);
};

// 获取管理员列表
export const queryAdmin = params => {
  return http.get("/adminapi/role/admin_list", params).then(res => res);
};

// 获取非管理员列表
export const queryPreAdmin = params => {
  return http.get("/adminapi/role/get_pre_admin", params).then(res => res);
};

// 获取所有权限菜单列表
export const queryNode = params => {
  return http.get("/adminapi/role/node_list", params).then(res => res);
};

// 上传接口
export const uploadFile = params => {
  let data = new FormData();
  data.append("file", params);
  return http.post("/api/uploadFile", data).then(res => res);
};

// 获取团建类型列表
export const typeList = params => {
  return http
    .post(params == 1 ? "/adminapi/set/type_list" : "/type_list")
    .then(res => res);
};
// 获取团建类型列表
export const directTypeList = params => {
  return http.post("/type_list", { type: 2 }).then(res => res);
};
// 获取我的团建列表
export const myActivity = params => {
  return http.post("/my_activity_list", params).then(res => res);
};

// 团建管理-团建列表
export const activityList = params => {
  return http.post("/activity_list", params).then(res => res);
};

// 团建管理-团建详情
export const activityDetail = params => {
  return http.post("/activity_detail", { id: params }).then(res => res);
};
// 日常团建-团建撤销
export const approveRevoke = params => {
  return http.post("/approve_revoke", params).then(res => res);
};

// 定向团建-列表
export const directList = params => {
  return http.get("/direction/my_direction_list", params).then(res => res);
};

// 定向团建-人员列表
export const directUserList = params => {
  return http.post("/new_select_user", params).then(res => res);
};
// 定向团建-团建详情
export const directDetail = params => {
  return http
    .post("/direction/activity_detail", { id: params })
    .then(res => res);
};
