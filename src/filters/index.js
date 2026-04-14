const sexFilter = (val) => {
  return val == 'M' ? '男' : '女'
}

const knowledgeFilter = (val) => {
  switch (val) {
    case 1:
      return '大专'
      break
    case 2:
      return '本科'
      break
    case 3:
      return '硕士'
      break
    case 4:
      return '博士'
      break
    default:
      return '无'
      break
  }
}

const stateFilter = (val) => {
  const stateArr = [{
    id: -1,
    value: '全部状态'
  },
  {
    id: 0,
    value: '已入职'
  },
  {
    id: 1,
    value: '录用'
  },
  {
    id: 2,
    value: '可以面试'
  },
  {
    id: 3,
    value: '不予考虑'
  },
  {
    id: 4,
    value: '同意面试'
  },
  {
    id: 5,
    value: '不同意面试'
  },
  {
    id: 6,
    value: '面试通过'
  },
  {
    id: 7,
    value: '面试不通过'
  },
  {
    id: 8,
    value: '同意入职'
  },
  {
    id: 9,
    value: '不同意入职'
  },
  {
    id: 11,
    value: '待定面试'
  },
  {
    id: 12,
    value: '待定入职'
  },
  {
    id: 13,
    value: '列入考虑'
  },
  {
    id: null,
    value: ''
  }
  ]
  const item = stateArr.find(elem => {
    return val == elem.id
  })
  return item.value
}

const degreeFilter = (val) => {
  if (val == 1) {
    return '学士'
  } else if (val == 2) {
    return '硕士'
  } else if (val == 3) {
    return '博士'
  } else {
    return '无'
  }
}

const dateFilter = (val) => {
  if (!val) return ''
  return val.substr(0, 10)
}
const recruitReasonFilter = (val) => {
  if (val == 1) {
    return '流失替换'
  } else if (val == 2) {
    return '新增需求'
  } else {
    return ''
  }
}

export default {
  sexFilter,
  knowledgeFilter,
  stateFilter,
  degreeFilter,
  dateFilter,
  recruitReasonFilter
}
