import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "hash", // history
  base: "", // 基路径
  routes: [
    {
      // 默认登录页
      path: "/",
      redirect: "/login"
    },
    {
      // 登录页
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue")
    },
    {
      // 错误页
      path: "/err",
      name: "err",
      component: () => import("@/views/err/index.vue")
    },
    {
      // 团建
      path: "/building",
      component: () => import("@/layout/default_layout.vue"),
      children: [
        {
          // 日常团建
          path: "/daily",
          name: "Daily",
          meta: { active: "/daily" },
          component: () => import("@/views/daily/index.vue")
        },
        {
          // 日常团建-发起团建
          path: "/league_create",
          name: "league_create",
          meta: { active: "/daily" },
          component: () => import("@/views/daily/create.vue")
        },
        {
          // 团建审批
          path: "/approval",
          name: "Approval",
          meta: { active: "/approval" },
          component: () => import("@/views/approval")
        },
        {
          // 定向审批
          path: "/direct",
          name: "Direct",
          meta: { active: "/direct" },
          component: () => import("@/views/direct")
        },
        {
          // 定向团建-发起团建
          path: "/direct_create",
          name: "direct_create",
          meta: { active: "/direct" },
          component: () => import("@/views/direct/create.vue")
        },

        {
          // 首页
          path: "/index",
          name: "index",
          meta: { active: "/index" },
          component: () => import("@/views/index/index.vue")
        },

        /*{// 我的投票
      path: '/myvote',
      name: 'myvote',
      meta: {active: '/myvote'},
      component: () => import('@/views/my/vote/list.vue')
    },{// 我的投票-发起投票
      path: '/create_vote',
      name: 'create_vote',
      meta: {active: '/myvote'},
      component: () => import('@/views/my/vote/create.vue')
    },{// 我的投票-投票详情
      path: '/vote_detail',
      name: 'vote_detail',
      meta: {active: '/myvote'},
      component: () => import('@/views/my/vote/detail.vue')
    },*/ {
          // 团建管理
          path: "/leaguemanage",
          name: "leaguemanage",
          meta: { active: "/leaguemanage" },
          component: () => import("@/views/league/manage/list.vue")
        },
        {
          // 团建管理-团建详情
          path: "/league_detail",
          name: "league_detail",
          meta: { active: "" },
          component: () => import("@/views/league/manage/detail.vue")
        },
        {
          // 团建管理-团建报销
          path: "/league_reimburse",
          name: "league_reimburse",
          meta: { active: "/leaguemanage" },
          component: () => import("@/views/league/manage/reimburse.vue")
        },
        {
          // 团建管理-查看报销进度呀
          path: "/reimbursementDetails",
          name: "reimbursementDetails",
          meta: { active: "/leaguemanage" },
          component: () =>
            import("@/views/league/manage/reimbursementDetails.vue")
        },
        {
          // 报销管理-查看报销情况
          path: "/reimbursementSituation",
          name: "reimbursementSituation",
          meta: { active: "/reimburse" },
          component: () =>
            import("@/views/league/manage/reimbursementSituation.vue")
        },
        {
          // 团建管理-团建制度
          path: "/system",
          name: "system",
          meta: { active: "/leaguemanage" },
          component: () => import("@/views/league/manage/system.vue")
        },
        {
          // 系统管理-费用管理
          path: "/cost",
          name: "cost",
          meta: { active: "/cost", isAdmin: 1, id: 1 },
          component: () => import("@/views/system/cost.vue")
        },
        {
          // 系统管理-团建管理
          path: "/league",
          name: "league",
          meta: { active: "/league", isAdmin: 1, id: 2, keepAlive: true,  },
          component: () => import("@/views/system/league.vue")
        },
        {
          // 系统管理-报销管理
          path: "/reimburse",
          name: "reimburse",
          meta: { active: "/reimburse", isAdmin: 1, id: 3, keepAlive: true, },
          component: () => import("@/views/system/reimburse.vue")
        },
        {
          // 系统管理-人员管理
          path: "/staff",
          name: "staff",
          meta: { active: "/staff", isAdmin: 1, id: 4 },
          component: () => import("@/views/system/staff.vue")
        },
        {
          // 系统管理-权限管理
          path: "/power",
          name: "power",
          meta: { active: "/power", isAdmin: 1, id: 5 },
          component: () => import("@/views/system/power.vue")
        },
        {
          // 系统管理-配置管理
          path: "/config",
          name: "config",
          meta: { active: "/config", isAdmin: 1, id: 6 },
          component: () => import("@/views/system/config.vue")
        },
        {
          // 系统管理-定向管理
          path: "/directManage/list",
          name: "DirectList",
          meta: { active: "/directManage/list", isAdmin: 0, id: 7 },
          component: () => import("@/views/system/directManage")
        },
        {
          // 系统管理-额度查询
          path: "/directManage/limitQuery",
          name: "limitQuery",
          meta: { active: "/directManage/list", isAdmin: 1, id: 7 },
          component: () => import("@/views/system/directManage/limitQuery")
        },
        {
          // 默认首页
          path: "/",
          redirect: "/index"
        }
      ]
    }
  ]
});

// 路由守卫验证登录态 & 权限
router.beforeEach((to, from, next) => {
  let info = window.localStorage.getItem("info"); // 登录信息
  if (info) {
    // 已经登录
    let data = JSON.parse(info);
    if (to.path == "/login") {
      next();
    } else {
      if (to.path == "/leagueapproval" && !data.is_show_approve) {
        next(from.path);
      } else if (to.path == "/leagueapproval" && data.is_show_approve) {
        next();
      } else {
        if (
          to.meta &&
          to.meta.isAdmin &&
          !data.admin_info.node.find(d => d.id == to.meta.id)
        ) {
          next(from.path);
        } else {
          next();
        }
      }
    }
  } else {
    // 未登录
    if (to.path === "/login") {
      next();
    } else {
      next("/err");
    }
  }
});

// 避免跳转重复路由导致的报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
