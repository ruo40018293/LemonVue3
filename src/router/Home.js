/**
 * 首页
 */

const Home = [
  {
    path: '/TaskList',
    name: 'TaskList',
    component: () => import('@/views/home/components/TaskList.vue'),
    meta: {
      keepAlive: true,
      title: '待办事务'
    }
  },
  {
    path: '/FileList',
    name: 'FileList',
    component: () => import('@/views/home/components/FileList.vue'),
    meta: {
      keepAlive: true,
      title: '公司文件'
    }
  }
]
export default Home
