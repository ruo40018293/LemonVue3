const redirect = [{
  path: '/404',
  name: '404',
  component: () => import('@/views/redirect/404.vue'),
  meta: {
    anonymous: true,
    keepAlive: false,
    title: '404'
  }
},
{
  path: '/401',
  name: '401',
  component: () => import('@/views/redirect/401.vue'),
  meta: {
    keepAlive: false,
    title: '401'
  }
},
{
  path: '/iframe',
  name: 'iframe',
  component: () => import('@/views/system/IFrame.vue'),
  meta: {
    keepAlive: false,
    title: 'tab'
  }
}
]
export default redirect
