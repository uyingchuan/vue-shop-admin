import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login'
// import Home from '../views/home'
// import Welcome from '../views/welcome'
// import Users from '../components/users/users'
// import Roles from '../components/power/roles'
// import Rights from '../components/power/rights'
// import Reports from '../components/report/reports'
// import Orders from '../components/order/orders'
// import GoodsAdd from '../components/goods/goodsAdd'
// import Goods from '../components/goods/goods'
// import Params from '../components/goods/params'
// import Categories from '../components/goods/categories'

// 路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/users/users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/roles.vue')

const Categories = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/categories.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/params.vue')

const Goods = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/goodsAdd.vue')

const Orders = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/orders.vue')
const Reports = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/reports.vue')

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
