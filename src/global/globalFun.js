import http from '@/api/http.js'
import store from '@/store'
import base from '@/utilities/common'
import axios from 'axios'
import vPinyin from '@/utilities/vue-py.js'
import router from '@/router'
// /*
//    保持在线/获取当前在线人数 处于成功登录的状态下 前端轮询 每5秒访问一次
//   */
// function keepOnline() {
//   http.get("api/Home/KeepOnline").then((res) => {
//     if (res.Status) {
//       store.commit('setOnlineNum', res.Data);
//       setTimeout(() => {
//         if (store.getters.getUserInfo()) {
//           keepOnline();
//         }
//       }, 300000); //5秒一次
//     }
//   })
// }
// 跳转老系统链接时确保在线
// function onlineToPath() {
//   return new Promise((resolve, reject) => {
//     http.get("api/Home/KeepOnline").then((res) => {
//       store.commit('setOnlineNum', res.Data);
//       resolve(res);
//     }).catch(error => {
//       console.log(error);
//     })
//   })
// }

// 打开老系统的链接前需要调用keepOnline接口
// function openOldSystemLink(url) {
//   if (base.IsPC()) {
//     onlineToPath().then(res => {
//       if (res.Status) {
//         window.open(url, '_blank');
//       }
//     })
//   } else {
//     var newPage = window.open('about:blank');
//     onlineToPath().then(res => {
//       if (res.Status) {
//         newPage.location.href = url;
//       }
//     })
//   }
// }

function showTime() {
  var week = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日'
  ]
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minutes = date.getMinutes()
  var second = date.getSeconds()
  const dateStr =
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (day < 10 ? '0' + day : day) +
    '' +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ':' +
    (second < 10 ? '0' + second : second) +
    ' ' +
    (week[date.getDay() - 1] || '')

  return dateStr
}

/**
 * 表格列表数据删除操作
 *
 * @param {*} that  当前组件(相当于this)
 * @param {*} getList 获取列表
 * @param {*} api 接口地址
 * @param {*} postData  需要传递的参数
 */
function deleteDataItem(that, getList, api, postData) {
  that.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false
  })
    .then(() => {
      http.post(api, postData).then((res) => {
        that.$message({
          type: res.Status ? 'success' : 'error',
          message: res.Message
        })
        if (res.Status == true) {
          getList()
        }
      })
    })
}

/* 下载文件 */
function downloadFile(api, params, fileName) {
  axios.get(api, {
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' // 请求的数据类型为form data格式
    },
    'responseType': 'blob' // 设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
  }).then(response => {
    const blob = new Blob([response.data])
    const linkNode = document.createElement('a')
    linkNode.download = fileName // a标签的download属性规定下载文件的名称
    linkNode.style.display = 'none'
    linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
    document.body.appendChild(linkNode)
    linkNode.click() // 模拟在按钮上的一次鼠标单击
    URL.revokeObjectURL(linkNode.href) // 释放URL 对象
    document.body.removeChild(linkNode)
  }).catch(error => {
    console.log(error)
  })
}

/* 打开新的浏览器tab查看文件 */
function viewFileOpenNewTab(url) {
  const {
    href
  } = router.resolve({
    path: url
  })
  window.open(href, '_blank')
}

/* 任务转移功能获取相关人员 */
async function taskTransferGetEmployee() {
  const res = await http.get('/api/Hr_Employee/GetAllEmployee')
  // let excludeList = ['PKS', '柯洱斯', '仓库配置外员工', '随行付', '亮亮'];
  // let employeeList = res.Data.filter(elem => !excludeList.includes(elem.Company));
  const employeeList = res.Data
  employeeList.map(elem => {
    elem.value = elem.Name
    elem.namePinYin = vPinyin.chineseToPinYin(elem.Name)
    elem.nameSX = vPinyin.getInitials(elem.namePinYin)
  })
  return employeeList
}

/* 从HTML字符串中提取Img、video的标签和地址 */
function getImageAndVideoURL(con) {
  let obj = {}
  const imgReg = /<img.*?(?:>|\/>)/gi // 匹配图片中的img标签
  const videoReg = /<video(([\s\S])*?)<\/video>/gi // 匹配图片中的img标签
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
  const ImageArr = con.match(imgReg) || [] // 筛选出所有的img
  const VideoArr = con.match(videoReg) || [] // 筛选出所有的video

  const indexImg = con.search(imgReg)
  const indexVideo = con.search(videoReg)
  // 去除所有图片和视频后的帖子内容
  const narrowHandle = con.replace(/&nbsp;/gi, '').replace(/<img.*?(?:>|\/>)/gi, '').replace(
    /<video(([\s\S])*?)<\/video>/gi, '').replace(/<p(.*)><\/p>/gi, '').replace(/<[^<>]+>/g, '')
  const ImageSrcArr = [] // 图片地址数组
  const VideoSrcArr = [] // 视频地址数组

  for (let i = 0; i < ImageArr.length; i++) {
    const imgSrc = ImageArr[i].match(srcReg)
    // 获取图片地址
    ImageSrcArr.push(imgSrc[1])
  }
  for (let i = 0; i < VideoArr.length; i++) {
    const videoSrc = VideoArr[i].match(srcReg)
    // 获取图片地址
    VideoSrcArr.push(videoSrc[1])
  }

  let haveImageOrVideo = false
  let showImageOrVideo = ''
  if (indexImg === -1 && indexVideo === -1) {
    haveImageOrVideo = false
  } else if (indexImg > 0 && indexImg < indexVideo) {
    haveImageOrVideo = true
    showImageOrVideo = 'IMG'
  } else if (indexImg > 0 && indexVideo < 0) {
    haveImageOrVideo = true
    showImageOrVideo = 'IMG'
  } else if (indexVideo > 0 && indexVideo < indexImg) {
    haveImageOrVideo = true
    showImageOrVideo = 'VIDEO'
  } else if (indexVideo > 0 && indexImg < 0) {
    haveImageOrVideo = true
    showImageOrVideo = 'VIDEO'
  }
  obj = {
    ImageSrcArr,
    VideoSrcArr,
    haveImageOrVideo,
    showImageOrVideo,
    narrowHandle,
    showLeft: true
  }
  return obj
}

export default {
  // keepOnline,
  // onlineToPath,
  showTime,
  // openOldSystemLink,
  deleteDataItem,
  downloadFile,
  viewFileOpenNewTab,
  taskTransferGetEmployee,
  getImageAndVideoURL
}
