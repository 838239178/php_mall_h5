export default [
  {
    path: 'index',
    name: 'index',
    component: () => import('@/views/main/pages/Index.vue')
  },
  {
    path: 'search',
    name: 'search',
    component: () => import('@/views/main/pages/Search.vue')
  },
  {
    path: 'userinfo',
    name: 'userinfo',
    component: () => import('@/views/main/pages/UserInfo.vue')   
  },
  {
    path: 'shopcar',
    name: 'shopcar',
    component: () => import('@/views/main/pages/ShopCar.vue')   
  },
  {
    path: 'ordersettle',
    name: 'ordersettle',
    component: ()=> import('@/views/main/pages/OrderSettle.vue')
  },
  {
    path: 'orderlist',
    name: 'orderlist',
    component: ()=> import('@/views/main/pages/OrderList.vue')
  },
  {
    path: 'collection',
    name: 'collection',
    component: ()=> import('@/views/main/pages/Collection.vue')
  },
  {
    path: 'address',
    name: 'address',
    component: ()=> import('@/views/main/pages/Address.vue')
  },
  {
    path: 'product',
    name: 'product',
    component: ()=>import('@/views/main/pages/ProductDetail.vue')
  }
]