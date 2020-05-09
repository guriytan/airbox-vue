import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* Layout */
const Layout = () => import('@/layout')

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/Login'),
    hidden: true
  },
  {
    path: '/forget',
    component: () => import('@/views/login/Forget'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/Register'),
    hidden: true,
  },
  {
    path: '/reset/:id',
    component: () => import('@/views/login/Reset'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/files',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard'),
      meta: {title: 'Dashboard'}
    }, {
      path: 'files',
      name: 'Files',
      component: () => import('@/views/Files'),
      meta: {title: 'Files'}
    }, {
      path: 'preview',
      name: 'Preview',
      component: () => import('@/views/Preview'),
      meta: {title: 'Preview'}
    }, {
      path: 'type/:id',
      name: 'Type',
      component: () => import('@/views/Type'),
      meta: {title: 'Type'}
    }, {
      path: 'help',
      name: 'Help',
      component: () => import('@/views/Help'),
      meta: {title: 'Help'}
    }]
  },

  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
});

const router = createRouter();

export default router
