import { useSystemStore } from '@/stores'
import router from '@/router'

let $vue = null
const buttons = []

const permission = {
  init(vueInstance) {
    $vue = vueInstance
  },
  getButtons(path, extra, table) {
    if (table) {
      table = '/' + table
    }
    const systemStore = useSystemStore()
    let permissionItem = systemStore.permission.find(p => p.path === (table || path))
    
    if (!permissionItem) {
      permissionItem = systemStore.permission.find(p => p.path === path.substring(1))
      console.log('框架自带：这里判断权限是不准确的，因为数据还没加载下来就判断了，判断有没有此页面的权限：' + permissionItem)
      if (!permissionItem) {
        console.log('框架自带：没有页面权限，跳转到401页面')
        permission.to401()
        return
      }
    }

    const permissions = permissionItem.permission
    const gridButtons = buttons.filter(item => {
      return !item.value || permissions.indexOf(item.value) !== -1
    })
    if (extra && extra instanceof Array) {
      gridButtons.push(...extra)
    }
    return gridButtons
  },
  to401() {
    router.push({
      path: '/401'
    })
  }
}

export default permission
