import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";
import {notification} from "ant-design-vue";

const routes = [{
  path: '/',
  name: 'main',
  component: () => import('../views/HomeView.vue'),
  meta:{
    loginRequire: true
  },
  children:[{
    path: 'user-manager',
    component: () => import('../views/SecondaryRoutingViews/userManagement/AdminUserViews.vue'),
  },
    {
      path: 'batch-job-view',
      component: () => import('../views/SecondaryRoutingViews/scheduled/scheduled.vue'),
    },
    {
      path: 'timeline-view',
      component: () => import('../views/SecondaryRoutingViews/timeline/timeline.vue'),
    },
  ]
},
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginViews.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 路由登录拦截,验证用户是否登录
router.beforeEach((to, from, next) => {
  // 要不要对meta.loginRequire属性做监控拦截
  if (to.matched.some(function (item) {
    if(process.env.NODE_ENV !== 'production') {
      console.log(item, "是否需要登录校验：", item.meta.loginRequire || false);
    }
    return item.meta.loginRequire
  })) {
    const _userInfo = store.state.User;
    if(process.env.NODE_ENV !== 'production') {
      console.log("页面登录校验开始：", _userInfo);
    }
    if (!_userInfo.token) {
      if(process.env.NODE_ENV !== 'production') {
        console.log("用户未登录或登录超时！");
      }
      notification.error({ description: "未登录或登录超时" });
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router

