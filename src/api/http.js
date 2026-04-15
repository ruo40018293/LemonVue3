import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import router from '@/router'
import { useSystemStore } from '@/stores'

axios.defaults.timeout = 1000000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

let $httpVue = null
let currentToken = ''
const _Authorization = 'Authorization'
const _Bearer = 'Bearer '
let loading = null
let ipAddress = ''
let needLoadingRequestCount = 0

function init(vueInstance) {
  $httpVue = vueInstance
  const systemStore = useSystemStore()
  const baseUrl = systemStore.appsettings.apiUrl
  axios.defaults.baseURL = baseUrl
  ipAddress = baseUrl
}

function getToken() {
  if (currentToken) {
    return _Bearer + currentToken
  }
  const systemStore = useSystemStore()
  return systemStore.token ? _Bearer + systemStore.token : ''
}

function startLoading(str) {
  const text = str || 'Loading...'
  if (needLoadingRequestCount === 0 && !loading) {
    loading = ElLoading.service({
      lock: true,
      text: text,
      background: 'rgba(58, 61, 63, 0.32)'
    })
  }
  needLoadingRequestCount++
}

function hideLoading() {
  needLoadingRequestCount--
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0)
  if (needLoadingRequestCount === 0) {
    if (loading) {
      loading.close()
      loading = null
    }
  }
}

axios.interceptors.request.use((config) => {
  if (config.headers.showLoading) {
    startLoading(decodeURIComponent(config.headers.showLoading))
  }
  return config
}, (error) => {
  if (error.config && error.config.headers.showLoading) {
    hideLoading()
  }
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  if (res.config.headers.showLoading) {
    hideLoading()
  }
  if (res.data.success) {
    return res
  }
  return Promise.resolve(res)
}, (error) => {
  if (error.config && error.config.headers.showLoading) {
    hideLoading()
  }
  let httpMessage = ''
  if (error.response) {
    if (error.response.data && error.response.data.Message) {
      httpMessage = error.response.data.Message
    } else if (error.response.status === 404) {
      httpMessage = '没有找到请求的地址'
    }
  } else {
    if (JSON.stringify(error).includes('timeout')) {
      httpMessage = '服务器响应超时，请刷新当前页！'
    } else {
      httpMessage = '网络好像出了点问题~'
    }
  }
  redirect(error.response || {}, httpMessage)
  return Promise.reject(error.response)
})

function post(url, params, showLoading) {
  axios.defaults.headers[_Authorization] = getToken()
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: {
        'showLoading': showLoading ? encodeURIComponent(showLoading) : false
      }
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err.data && err.data.Message ? err.data.Message : '网络好像出了点问题~~')
    }).catch((error) => {
      reject(error)
    })
  })
}

function get(url, param, showLoading) {
  axios.defaults.headers[_Authorization] = getToken()
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        'showLoading': showLoading ? encodeURIComponent(showLoading) : false
      },
      params: param
    }).then(response => {
      resolve(response.data)
    }, err => {
      redirect(err.data)
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

function exportFile(api, params, fileName, showLoading) {
  axios.defaults.headers[_Authorization] = getToken()
  axios.get(api, {
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'showLoading': showLoading ? encodeURIComponent(showLoading) : false
    },
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response.data])
    const linkNode = document.createElement('a')
    linkNode.download = fileName
    linkNode.style.display = 'none'
    linkNode.href = URL.createObjectURL(blob)
    document.body.appendChild(linkNode)
    linkNode.click()
    URL.revokeObjectURL(linkNode.href)
    document.body.removeChild(linkNode)
  }).catch(error => {
    console.log(error)
  })
}

function downloadFile(url, param, showLoading) {
  axios.defaults.headers[_Authorization] = getToken()
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'get',
      params: param,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'showLoading': showLoading ? encodeURIComponent(showLoading) : false
      },
      responseType: 'blob'
    }).then(response => {
      if (response.status === 200) {
        resolve(response)
      } else {
        reject(response)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

function uploadFilePost(api, params, showLoading) {
  axios.defaults.headers[_Authorization] = getToken()
  return new Promise((resolve, reject) => {
    axios.post(api, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'showLoading': showLoading ? encodeURIComponent(showLoading) : false
      }
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err.data && err.data.Message ? err.data.Message : '网络好像出了点问题~~')
    }).catch((error) => {
      reject(error)
    })
  })
}

function redirect(responseText, message) {
  const responseData = typeof responseText === 'string' ? JSON.parse(responseText) : responseText
  const systemStore = useSystemStore()
  
  if ((responseData.hasOwnProperty('Code') && responseData.Code === 401) || 
      (responseData.Data && responseData.Data.Code === 401)) {
    systemStore.logout()
    toLogin()
  } else if ((responseData.hasOwnProperty('Code') && responseData.Code === 405) || 
             (responseData.Data && responseData.Data.Code === 405) || 
             (responseData.data && responseData.data.Code === 405)) {
    router.push({
      path: '/401',
      query: {
        redirect: Math.random(),
        fromPath: router.currentRoute.value.fullPath
      }
    })
  } else {
    throttle((msg) => {
      if (msg !== '没有找到请求的地址') {
        ElMessage.error(msg)
      }
    })(message)
  }
}

let _lastTime = null
function throttle(fn, gapTime = 1500) {
  return function(i) {
    const _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(i)
      _lastTime = _nowTime
    }
  }
}

function debounce(fn, delay) {
  var timer = null
  var delay = delay || 200
  return function() {
    var args = arguments
    var that = this
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(that, args)
    }, delay)
  }
}

function toLogin() {
  currentToken = ''
  router.push({
    path: '/login',
    query: {
      redirect: Math.random(),
      fromPath: router.currentRoute.value.fullPath
    }
  })
}

function createXHR() {
  if (XMLHttpRequest) {
    return new XMLHttpRequest()
  }
  if (ActiveXObject) {
    if (typeof arguments.callee.activeXString !== 'string') {
      var versions = [
        'MSXML2.XMLHttp.6.0',
        'MSXML2.XMLHttp',
        'MSXML2.XMLHttp.3.0'
      ]
      for (var i = 0; i < versions.length; i++) {
        try {
          new ActiveXObject(versions[i])
          arguments.callee.activeXString = versions[i]
          break
        } catch (e) { }
      }
    }
    return new ActiveXObject(arguments.callee.activeXString)
  }
}

function ajax(param) {
  const httpParam =
    Object.assign({
      url: '',
      headers: {},
      param: {},
      json: true,
      success: function() { },
      errror: function() { },
      type: 'post',
      async: true
    }, param)

  httpParam.url = axios.defaults.baseURL + httpParam.url.replace(/\/?/, '')
  httpParam.headers[_Authorization] = getToken()
  var xhr = createXHR()
  xhr.onreadystatechange = function() {
    if (xhr.status === 403 || xhr.status === 401) {
      redirect(xhr.responseText)
      return
    }
    if (xhr.status === 202) {
      return
    }
    if (xhr.readyState === 4 && xhr.status === 200) {
      httpParam.success(httpParam.json ? JSON.parse(xhr.responseText) : xhr.responseText)
      return
    }
    if (xhr.status !== 0 && xhr.readyState !== 1) {
      httpParam.errror(xhr)
    }
  }
  xhr.open(
    httpParam.type,
    httpParam.url,
    httpParam.async
  )
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  for (const key in httpParam.headers) {
    xhr.setRequestHeader(key, httpParam.headers[key])
  }
  let dataStr = ''
  for (const key in httpParam.param) {
    dataStr += key + '=' + httpParam.param[key]
  }
  try {
    xhr.send(dataStr)
  } catch (error) {
    toLogin()
  }
}

ajax.post = function(url, param, success, errror) {
  ajax({
    url: url,
    param: param,
    success: success,
    error: errror,
    type: 'post'
  })
}
ajax.get = function(url, param, success, errror) {
  ajax({
    url: url,
    param: param,
    success: success,
    error: errror,
    type: 'post'
  })
}

export default {
  post,
  get,
  ajax,
  init,
  ipAddress,
  exportFile,
  downloadFile,
  uploadFilePost
}
