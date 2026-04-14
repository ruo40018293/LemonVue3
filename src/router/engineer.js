/**
 * 工艺管理
 */

const engineer = [
  {
    path: '/Engineer/Route',
    name: 'RouteList',
    component: () => import('@/views/Engineer/Route/RouteList.vue'),
    meta: {
      keepAlive: true,
      title: '工艺路线'
    }
  }, {
    path: '/Engineer/AuditRoute',
    name: 'AuditRoute',
    component: () => import('@/views/Engineer/Route/AuditRoute.vue'),
    meta: {
      keepAlive: true,
      title: '工艺审批'
    }
  },
  {
    path: '/Engineer/LabelAddItem',
    name: 'LabelAddItem',
    component: () => import('@/views/Engineer/Label/LabelAddItem.vue'),
    meta: {
      keepAlive: true,
      title: '标签明细设置'
    }
  },
  {
    path: '/Engineer/Barcode',
    name: 'BarcodeList',
    component: () => import('@/views/Engineer/Barcode/BarcodeList.vue'),
    meta: {
      keepAlive: true,
      title: '条码规则'
    }
  },
  {
    path: '/Engineer/Label',
    name: 'LabelList',
    component: () => import('@/views/Engineer/Label/LabelList.vue'),
    meta: {
      keepAlive: true,
      title: '标签模板'
    }
  },
  {
    path: '/Engineer/GuideList',
    name: 'Engineer_GuideInstructionList',
    component: () => import('@/views/Engineer/Guide/GuideList.vue'),
    meta: {
      keepAlive: true,
      title: '维护指导书'
    }
  },
  {
    path: '/Engineer/GuideSelection',
    name: 'Engineer_GuideSelection',
    component: () => import('@/views/Engineer/Guide/GuideSelection.vue'),
    meta: {
      keepAlive: true,
      title: '查看指导书'
    }
  },
  {
    path: '/Engineer/GuideEdit',
    name: 'Engineer_GuideEdit',
    component: () => import('@/views/Engineer/Guide/GuideEdit.vue'),
    meta: {
      keepAlive: true,
      title: '编辑作业指导书'
    }
  },
  {
    path: '/Document/DocumentList',
    name: 'DocumentList',
    component: () => import('@/views/Document/DocumentList.vue'),
    meta: {
      keepAlive: true,
      title: '文档管理'
    }
  },

  {
    path: '/Document/DocumentView',
    name: 'DocumentView',
    component: () => import('@/views/Document/DocumentView.vue'),
    meta: {
      keepAlive: false,
      isCanOpenTabSame: true, // 是否可以打开相同的新的tab(后端返回的菜单列表中没有)
      title: '文档预览'
    }
  },
  // {
  //   path: '/Document/DocumentBusinessView',
  //   name: 'DocumentBusinessView',
  //   component: () => import('@/views/Document/DocumentBusinessView.vue'),
  //   meta: {
  //     keepAlive: false,
  //     isCanOpenTabSame: true,
  //     title: "文档预览",
  //   }
  // },
  {
    path: '/Document/CheckDoc',
    name: 'CheckDoc',
    component: () => import('@/views/Document/CheckDoc.vue'),
    meta: {
      keepAlive: false,
      title: '审核文档'
    }
  }
]
export default engineer
