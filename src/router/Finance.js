const Finance = [
  {
    path: '/Finance/BudgetList',
    name: 'BudgetList',
    component: () => import('@/views/Finance/BudgetList.vue'),
    meta: {
      keepAlive: true,
      title: '预算查询'
    }
  }
]
export default Finance
