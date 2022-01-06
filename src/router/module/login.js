export default [
  {
    path: 'login',
    name: 'login',
    component: ()=> import('@/views/login/pages/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: 'register',
    name: 'register',
    component: ()=> import('@/views/login/pages/Register.vue'),
    meta: {
      title: '注册'
    }
  },
]