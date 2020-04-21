import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import CategoryEdit from "../views/Category/CategoryEdit";
import CategoryList from "../views/Category/CategoryList";
import ShopEdit from "../views/Shop/ShopEdit";
import ShopList from "../views/Shop/ShopList";
import GoodEdit from "../views/Good/GoodEdit";
import GoodList from "../views/Good/GoodList";
import AdminUserEdit from "../views/AdminUser/AdminUserEdit";
import AdminUserList from "../views/AdminUser/AdminUserList";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      {path: '/categories/create', component: CategoryEdit},
      {path: '/categories/edit/:id', component: CategoryEdit, props: true},
      {path: '/categories/list', component: CategoryList},

      {path: '/shops/create', component: ShopEdit},
      {path: '/shops/edit/:id', component: ShopEdit, props: true},
      {path: '/shops/list', component: ShopList},

      {path: '/goods/create', component: GoodEdit},
      {path: '/goods/edit', component: GoodEdit},
      {path: '/goods/list', component: GoodList},
      {path: '/goods/list/:id', component: GoodList, props: true},

      {path: '/admin_users/create', component: AdminUserEdit},
      {path: '/admin_users/edit/:id', component: AdminUserEdit, props: true},
      {path: '/admin_users/list', component: AdminUserList},
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
