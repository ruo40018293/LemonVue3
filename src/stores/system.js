import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const userMes = ref(JSON.parse(localStorage.getItem('userMes') || '{}'))
  const sidebarCollapse = ref(false)
  const appsettings = ref({})
  const permission = ref([])

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function setUserMes(mes) {
    userMes.value = mes
    localStorage.setItem('userMes', JSON.stringify(mes))
  }

  function toggleSidebar() {
    sidebarCollapse.value = !sidebarCollapse.value
  }

  function logout() {
    token.value = ''
    userInfo.value = {}
    userMes.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userMes')
  }

  function setAppsettings(settings) {
    appsettings.value = settings
  }

  function setPermission() {
    const userMesData = localStorage.getItem('userMes')
    if (userMesData) {
      try {
        const parsed = JSON.parse(userMesData)
        userMes.value = parsed
        permission.value = parsed.permission || []
      } catch (e) {
        console.error('解析 userMes 失败', e)
      }
    }
  }

  return {
    token,
    userInfo,
    userMes,
    sidebarCollapse,
    appsettings,
    permission,
    isAuthenticated,
    setToken,
    setUserInfo,
    setUserMes,
    toggleSidebar,
    logout,
    setAppsettings,
    setPermission
  }
})
