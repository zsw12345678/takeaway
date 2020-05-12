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
import Login from "../views/Login/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'logon',
    component: Login,
    meta: {
      isPublic: true
    }
  },
  {
    path: '/',
    name: 'main',
    component: Main,
    meta: [],
    children: [
      {path: '/categories/create', component: CategoryEdit, meta: ['店铺管理', '新建分类']},
      {path: '/categories/edit/:id', component: CategoryEdit, meta: ['店铺管理', '编辑分类'], props: true},
      {path: '/categories/list', component: CategoryList, meta: ['店铺管理', '分类列表']},

      {path: '/shops/create', component: ShopEdit, meta: ['店铺管理', '添加店铺']},
      {path: '/shops/edit/:id', component: ShopEdit, meta: ['店铺管理', '编辑店铺'], props: true},
      {path: '/shops/list', component: ShopList, meta: ['店铺管理', '店铺列表']},

      {path: '/goods/create', component: GoodEdit, meta: ['店铺管理', '添加商品']},
      {path: '/goods/edit', component: GoodEdit, meta: ['店铺管理', '编辑商品']},
      {path: '/goods/list', component: GoodList, meta: ['店铺管理', '商品列表']},
      {path: '/goods/list/:id', component: GoodList, meta: ['店铺管理', '商品详情'], props: true},

      {path: '/admin_users/create', component: AdminUserEdit, meta: ['权限管理', '添加管理员']},
      {path: '/admin_users/edit/:id', component: AdminUserEdit, meta: ['权限管理', '管理员编辑'], props: true},
      {path: '/admin_users/list', component: AdminUserList, meta: ['权限管理', '管理员列表']},
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !localStorage.token) {
    return next('/login')
  }
  next()
});

export default router
