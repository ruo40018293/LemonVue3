# LemonVue3 迁移指南

## 项目概述

本项目是从 LemonVue (Vue2) 升级到 Vue3 的完整迁移版本。

## 已完成工作 ✅

### 1. 项目基础架构
- [x] 使用 Vite 替代 Webpack 作为构建工具
- [x] 配置 Vue 3.4+ 项目
- [x] 设置项目别名和开发服务器

### 2. 依赖升级
- [x] Vue 3.4+
- [x] Vue Router 4.2+
- [x] Pinia 2.1+ (替代 Vuex)
- [x] Element Plus 2.5+ (替代 Element UI)
- [x] Axios 1.6+
- [x] Less 4.2+

### 3. 状态管理
- [x] 从 Vuex 迁移到 Pinia
- [x] 创建 system store (用户信息、token、侧边栏状态)
- [x] 使用 Composition API 语法

### 4. 路由系统
- [x] 升级到 Vue Router 4
- [x] 配置路由守卫
- [x] 实现权限控制
- [x] 懒加载路由组件

### 5. UI 框架
- [x] 从 Element UI 升级到 Element Plus
- [x] 集成 Element Plus 图标库
- [x] 更新组件语法 (slot 语法变化等)

### 6. 核心组件
- [x] 登录页面 (Login.vue)
- [x] 主布局 (Home.vue) - 侧边栏、顶部导航
- [x] 首页仪表盘 (index.vue)
- [x] 401/404 错误页面

### 7. API 层
- [x] 重构 HTTP 请求拦截器
- [x] 重构 HTTP 响应拦截器
- [x] 集成 Element Plus 消息提示

## 项目结构

```
/workspace
├── src/
│   ├── api/
│   │   └── http.js              # Axios 配置和拦截器
│   ├── assets/                   # 静态资源
│   ├── stores/
│   │   ├── index.js
│   │   └── system.js            # 系统状态管理
│   ├── router/
│   │   └── index.js             # 路由配置
│   ├── views/
│   │   ├── Login.vue            # 登录页
│   │   ├── Home.vue             # 主布局
│   │   ├── index.vue            # 首页
│   │   └── redirect/            # 错误页面
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── LEMONVUE3_MIGRATION_GUIDE.md
```

## Vue2 → Vue3 主要变化

### 1. 组件语法变化

**Vue2 (Options API):**
```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

**Vue3 (Composition API - `<script setup>`):**
```javascript
<script setup>
import { ref } from 'vue'
const count = ref(0)
const increment = () => count.value++
</script>
```

### 2. Element UI → Element Plus 变化

| Element UI | Element Plus | 说明 |
|-----------|--------------|------|
| `el-submenu` | `el-sub-menu` | 子菜单组件更名 |
| slot="title" | `#title` | 插槽语法变化 |
| `size="medium"` | `size="default"` | 尺寸属性变化 |
| `this.$message` | `ElMessage` | 消息提示函数式调用 |

### 3. Vuex → Pinia 变化

**Vuex:**
```javascript
// store/index.js
export default new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) { state.count++ }
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => commit('increment'), 1000)
    }
  }
})

// 组件中使用
this.$store.state.count
this.$store.commit('increment')
this.$store.dispatch('asyncIncrement')
```

**Pinia:**
```javascript
// stores/counter.js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++
  const asyncIncrement = () => {
    setTimeout(() => increment(), 1000)
  }
  return { count, increment, asyncIncrement }
})

// 组件中使用
<script setup>
const store = useCounterStore()
store.count
store.increment()
store.asyncIncrement()
</script>
```

## 后续迁移计划 📋

### 高优先级
- [ ] 迁移系统管理模块 (用户、角色、菜单管理)
- [ ] 迁移基础数据模块
- [ ] 迁移工具函数和过滤器
- [ ] 完善 API 接口层

### 中优先级
- [ ] 迁移物料管理模块
- [ ] 迁移工程管理模块
- [ ] 迁移文档管理模块
- [ ] 迁移生产管理模块

### 低优先级
- [ ] 样式优化和调整
- [ ] 性能优化
- [ ] 单元测试
- [ ] E2E 测试

## 启动项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建
npm run preview
```

## 注意事项

1. **所有文件使用 `<script setup>` 语法** - 这是 Vue3 推荐的语法
2. **使用 Pinia 替代 Vuex** - 更简洁、类型安全
3. **Element Plus 组件使用** - 注意组件名和属性的变化
4. **响应式数据** - 使用 `ref` 和 `reactive`
5. **生命周期钩子** - 导入使用 `onMounted`, `onUnmounted` 等

## 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **构建工具**: Vite 5.0+
- **路由**: Vue Router 4.2+
- **状态管理**: Pinia 2.1+
- **UI 组件**: Element Plus 2.5+
- **HTTP 客户端**: Axios 1.6+
- **样式**: Less 4.2+

## 联系方式

如有问题，请参考：
- Vue3 文档: https://cn.vuejs.org/
- Element Plus 文档: https://element-plus.org/
- Pinia 文档: https://pinia.vuejs.org/zh/
