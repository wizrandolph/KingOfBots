import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '@/views/pk/PkIndexView.vue'
import RecordIndexView from '@/views/record/RecordIndexView.vue'
import RanklistIndexView from '@/views/ranklist/RanklistIndexView.vue'
import UserBotsIndexView from '@/views/user/bots/UserBotsIndexView.vue'
import NotFoundView from '@/views/error/NotFoundView.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'
import store from '@/store/index'

const routes = [
  {
    path: "/",
    name: "root",
    redirect: "/pk/",
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PkIndexView, 
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/record/",
    name: "record_index",
    component: RecordIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RanklistIndexView,
    meta: {
      requestAuth: true,
    }
    
  },
  {
    path: "/user/bot/",
    name: "user_bot_index",
    component: UserBotsIndexView,
    meta: {
      requestAuth: true,
    }
  },
  {
    path: "/user/account/login/",
    name: "user_account_login",
    component: UserAccountLoginView,
    meta: {
      requestAuth: false,
    }
  },
  {
    path: "/user/account/register/",
    name: "user_account_register",
    component: UserAccountRegisterView,
    meta: {
      requestAuth: false,
    }
  },
  {
    path: "/404/",
    name: "404",
    component: NotFoundView,
    meta: {
      requestAuth: false,
    }
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404/"
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const jwt_token = localStorage.getItem("jwt_token");
  if (to.meta.requestAuth && !store.state.user.is_login) {
    if (jwt_token) {
      store.commit("updatePullingInfo", true);
      store.commit("updateToken", jwt_token);
      store.dispatch("getinfo", {
        success() {
          next();
          store.commit("updatePullingInfo", false);
        },
        error() {
          alert("登录已过期，请重新登录");
          store.commit("updatePullingInfo", false);
          next({ name: "user_account_login" });
          localStorage.removeItem("jwt_token");
        }
      })
    } else {
      store.commit("updatePullingInfo", false);
      next({ name: "user_account_login" });
    }

  } else {
    next();
  }

})

export default router
