const ResearchManage = [{
  path: '/ResearchManage/ResearchRecords',
  name: 'ResearchRecords',
  component: () => import('@/views/ResearchManage/ResearchRecords.vue'),
  meta: {
    keepAlive: true,
    title: '研发记录'
  }
}
]
export default ResearchManage
