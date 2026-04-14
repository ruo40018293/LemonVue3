
import http from '@/api/http.js'
import buttons from '@/../config/buttons.js'

let $vue = null
const permission = {
  init(vue) {
    $vue = vue
  },
  getButtons(path, extra, table) { // extra自定额外按钮
    // table获取指定表的权限
    if (table) {
      table = '/' + table
    }
    let permission = $vue.$store.getters.getPermission(table || path)
    if (!permission) {
      permission = $vue.$store.getters.getPermission(path.substring(1))
      console.log('框架自带：这里判断权限是不准确的，因为数据还没加载下来就判断了，判断有没有此页面的权限：' + permission)
      if (!permission) {
        console.log('框架自带：没有页面权限，跳转到401页面')
        $vue.permission.to401()
        return
      }
    }

    const permissions = permission.permission// .split(',');
    const gridButtons = buttons.filter(item => {
      return !item.value || permissions.indexOf(item.value) != -1
    })
    if (extra && extra instanceof Array) {
      gridButtons.push(...extra)
    }
    return gridButtons
  },
  to401() {
    $vue.$router.push({
      path: '/401'
    })
  }
}

export default permission
