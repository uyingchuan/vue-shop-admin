import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login'
// import Home from '../views/home'
// import Welcome from '../views/welcome'
// import Users from '../views/users/users'
// import Roles from '../views/power/roles'
// import Rights from '../views/power/rights'
// import Reports from '../views/report/reports'
// import Orders from '../views/order/orders'
// import GoodsAdd from '../views/goods/goodsAdd'
// import Goods from '../views/goods/goods'
// import Params from '../views/goods/params'
// import Categories from '../views/goods/categories'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/users/users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/power/rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/power/roles.vue')

const Categories = () => import(/* webpackChunkName: "Cate_Params" */ '../views/goods/categories.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../views/goods/params.vue')

const Goods = () => import(/* webpackChunkName: "GoodsList_Add" */ '../views/goods/goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_Add" */ '../views/goods/goodsAdd.vue')

const Orders = () => import(/* webpackChunkName: "Order_Report" */ '../views/order/orders.vue')
const Reports = () => import(/* webpackChunkName: "Order_Report" */ '../views/report/reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/reports', component: Reports },
      { path: '/orders', component: Orders },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: GoodsAdd }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
