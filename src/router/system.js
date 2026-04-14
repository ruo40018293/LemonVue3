/*
  系统设置
*/
const system = [{
  path: '/sysMenu',
  name: 'sysMenu',
  component: () => import('@/views/system/Sys_Menu.vue'),
  meta: {
    keepAlive: true,
    title: '菜单配置'
  }
},
{
  path: '/SysLog',
  name: 'SysLog',
  component: () => import('@/views/system/Sys_Log.vue'),
  meta: {
    keepAlive: true, // 组件是否需要缓存
    title: '系统日志'
  }
},
{
  path: '/Sys_U9CLog',
  name: 'SysU9CLog',
  component: () => import('@/views/system/Sys_U9CLog.vue'),
  meta: {
    keepAlive: true, // 组件是否需要缓存
    title: 'U9C回写日志'
  }
},
{
  path: '/SysUser',
  name: 'SysUser',
  component: () => import('@/views/system/Sys_User.vue'),
  meta: {
    keepAlive: true,
    title: '用户管理'
  }
},
{
  path: '/SysUserAuth',
  name: 'SysUserAuth',
  component: () => import('@/views/system/Sys_UserAuth.vue'),
  meta: {
    keepAlive: false,
    title: '用户授权'
  }
},
{
  path: '/SysRole',
  name: 'SysRole',
  component: () => import('@/views/system/Sys_Role.vue'),
  meta: {
    keepAlive: true,
    title: '角色管理'
  }
},
{
  path: '/SysRoleAuth',
  name: 'SysRoleAuth',
  component: () => import('@/views/system/Sys_RoleAuth.vue'),
  meta: {
    keepAlive: false,
    title: '角色权限'
  }
},
{
  path: '/User_Switch',
  name: 'User_Switch',
  component: () => import('@/views/system/User_Switch.vue'),
  meta: {
    keepAlive: false,
    title: '变更信息'
  }
},
{
  path: '/JsonView',
  name: 'JsonView',
  component: () => import('@/views/system/Sys_JsonView.vue'),
  meta: {
    keepAlive: true,
    title: 'Json解析'
  }
}
]
export default system
