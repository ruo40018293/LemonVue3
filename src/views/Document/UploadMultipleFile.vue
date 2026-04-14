<!-- 多文件上传 -->
<template>
  <div>
    <div class="type-manage-bd upload-multiple-bd">
      <div>
        <document-type-tree
          ref="tree"
          :type-tree="typeTree"
          :init-menu-tree="initMenuTree"
          :active-class-id="initClassId"
          :class-id="classId"
          :doc-list-type-arr="activeTypeList"
          @getActiveTypeArr="getActiveTypeArr"
          @getCheckedNode="getCheckedNode"
          @initTypeStr="initTypeStr"
        />
        <!-- <check-type-tree ref="tree" :typeTree="typeTree" :initMenuTree="initMenuTree" :activeClassId="initClassId"
            :classId="classId" @getActiveTypeArr="getActiveTypeArr" :docListTypeArr="activeTypeList"
                @getCheckedNode="getCheckedNode" @initTypeStr="initTypeStr"></check-type-tree> -->
      </div>
      <div class="form-bd">
        <div style="padding-left:15px;font-size:14px;color:#F56C6C;margin:0px 0 20px 0;">
          上传须知：只能上传{{ limitFileType }}文件, 文件总大小不能超过256M</div>
        <div style="padding-left:15px;font-size:14px;color:#F56C6C;">请先选择菜单上传！</div>

        <div ref="uploadItem" class="upload-bd">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            multiple
            :action="uploadUrl"
            :accept="limitFileType"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-remove="handleRemove"
            :headers="importHeaders"
            :http-request="uploadFileRequest"
            :file-list="fileListArr"
            style="display:flex;"
          >
            <el-button size="small" type="success">点击上传</el-button>
          </el-upload>
        </div>

        <el-form ref="fileForm" :model="fileForm" :inline="true" class="demo-dynamic" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="选中类别" prop="Type">
                <div>{{ typeStr }}</div>
              </el-form-item></el-col>
            <el-col :span="8">
              <el-form-item label="文档编号" prop="MaxNo">
                <div>{{ MaxNo }}</div>
              </el-form-item></el-col>
            <el-col :span="8">
              <el-form-item label="文档版本" prop="MaxRev">
                <div style="width: 100px;"><el-input v-model="MaxRev" clearable size="small" /></div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="IsNeedCheck == 1">
            <el-col :span="12">
              <el-form-item label="审核人" prop="CheckUserName">
                <el-select
                  v-model="CheckUserName"
                  multiple
                  filterable
                  remote
                  placeholder="请输入搜索"
                  :remote-method="InterFilter"
                  :multiple-limit="5"
                  size="small"
                  style="width:250px;"
                >
                  <el-option
                    v-for="(item, index) in filterEmployee"
                    :key="index"
                    :label="item.UserName"
                    :value="item.UserName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准人" prop="ApproveUserName">
                <el-select
                  v-model="ApproveUserName"
                  multiple
                  filterable
                  remote
                  placeholder="请输入搜索"
                  :remote-method="InterFilter"
                  :multiple-limit="5"
                  size="small"
                  style="width:250px;"
                >
                  <el-option
                    v-for="(item, index) in filterEmployee"
                    :key="index"
                    :label="item.UserName"
                    :value="item.UserName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文档说明" prop="DocName">
                <div> <el-input
                  v-model="DocName"
                  type="textarea"
                  clearable
                  autocomplete="off"
                  size="small"
                  style="width:690px;"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                  placeholder="请输入"
                /></div>
              </el-form-item></el-col>
          </el-row>

          <div v-for="(listItem, index) in fileForm.uploadList" :key="index">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  ref="nameItem"
                  :prop="'uploadList.' + index + '.FileName'"
                  label="文件名称"
                  :rules="{
                    required: true, message: '请输入文件名称', trigger: 'blur'
                  }"
                >
                  <el-input v-model="listItem.FileName" clearable autocomplete="off" size="small" style="width:280px;" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item :prop="'uploadList.' + index + '.DocKeyWord'" label="关键字">
                  <el-input
                    v-model="listItem.DocKeyWord"
                    type="textarea"
                    clearable
                    autocomplete="off"
                    size="small"
                    style="width:690px;"
                    placeholder="关键字以逗号分隔"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider v-if="fileForm.uploadList.length > 1 && index != fileForm.uploadList.length - 1" />
          </div>
        </el-form>
        <div class="action_btn_bd">
          <!-- <el-button type="info" size="small" @click="addUploadItem">继续上传文件</el-button> -->
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button v-preventReClick type="primary" size="small" @click="submitForm('fileForm')">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/api/http.js'
import vPinyin from '@/utilities/vue-py.js'
import CheckTypeTree from '@/views/Document/CheckTypeTree.vue'
import DocumentTypeTree from '@/views/Document/DocumentTypeTree.vue'
import axios from 'axios'
export default {
  name: 'UploadDoc',

  components: {
    CheckTypeTree,
    DocumentTypeTree
  },
  props: ['typeTree', 'initMenuTree', 'classId', 'initClassId', 'activeTypeList'],
  data() {
    return {
      typeStr: '',
      MaxNo: '',
      MaxRev: 'A',
      DocName: '',
      CheckUserID: [],
      CheckUserName: [],
      ApproveUserID: [],
      ApproveUserName: [],
      employeeList: [],
      filterEmployee: [],
      IsNeedCheck: 0,
      fileListArr: [],
      activeTypeArr: [],
      activeClassId: null,
      CheckedNodes: [],
      activeTypeItem: null,
      ClassIdStr: '',
      fileForm: {
        uploadList: [{
          FileName: '',
          ClassIdStr: '',
          DocKeyWord: '',
          file: ''
        }]
      },
      uploadUrl: `${http.ipAddress}api/Document/FileUploadMulti`,
      importHeaders: {
        Authorization: this.$store.getters.getToken()
      },
      activeItemIndex: null,
      formData: '',
      limitFileType: '',
      fileCheckBool: true
    }
  },

  computed: {},

  watch: {},

  created() { },

  mounted() {
    this.getEmployeeList()
    this.getLimitFileType()
    this.GetCurrentTypeMaxNo()
  },

  methods: {
    // show(IsNeedCheck,activeTypeArr, activeClassId) {
    //         this.$nextTick(()=>{
    //         this.activeTypeArr = activeTypeArr;
    //         this.activeClassId = activeClassId;
    //         this.IsNeedCheck=IsNeedCheck;
    //       })
    //     },
    beforeUpload(file) {
      const MAX_SIZE = 1024 * 1024 * 256 // 5MB
      console.log(file.size)
      if (file.size > MAX_SIZE) {
        this.$message.error('文件大小不能超过 256MB!')
        return false
      }
      return true
    },
    // 获取所有员工列表
    async getEmployeeList() {
      const res = await http.get('/api/User/GetAllUserInfo')
      res.Data.map(elem => {
        elem.label = elem.UserName
        elem.value = elem.UserName
        elem.namePinYin = vPinyin.chineseToPinYin(elem.UserName)
        elem.nameSX = vPinyin.getInitials(elem.namePinYin)
      })
      this.employeeList = res.Data
    },
    InterFilter(queryString) {
      if (queryString) {
        this.selectLoading = true
        this.filterEmployee = this.base.keyWordSearchFilter(queryString, this.employeeList)
        setTimeout(() => {
          this.selectLoading = false
        }, 200)
      } else {
        this.filterEmployee = []
      }
    },
    // 控制树结构全部展开或关闭
    handleFoldAndExpand() {
      this.$refs.tree.defaultExpandAll = true
    },
    initTypeStr(str, activeItem) {
      this.typeStr = str
      this.CheckedNodes = [activeItem]
      this.activeTypeItem = activeItem
      this.fileForm.uploadList.map(elem => {
        elem.ClassIdStr = activeItem.Id
      })
    },
    getActiveTypeArr(typeArr, activeItem) {
      this.activeTypeArr = typeArr
      const list = []
      this.activeTypeArr.forEach(elem => {
        list.push(elem.label)
      })
      console.log(list)
      this.typeStr = list.join(' -> ')
      this.activeClassId = activeItem.Id
      this.IsNeedCheck = activeItem.IsNeedCheck
      this.ApproveUserID = activeItem.ApproveUserID ? activeItem.ApproveUserID.split(',') : []
      this.CheckUserID = activeItem.CheckUserID ? activeItem.CheckUserID.split(',') : []
      this.CheckUserName = activeItem.CheckUserName ? activeItem.CheckUserName.split(',') : []
      this.ApproveUserName = activeItem.ApproveUserName ? activeItem.ApproveUserName.split(',') : []
      this.GetCurrentTypeMaxNo()
    },
    /* 获取选中的节点 */
    getCheckedNode(nodeArr, item) {
      this.CheckedNodes = nodeArr
      this.activeTypeItem = item
      const ClassIdArr = []
      this.CheckedNodes.forEach(elem => {
        ClassIdArr.push(elem.Id)
      })
      this.ClassIdStr = ClassIdArr.join(',')
      this.fileForm.uploadList.map(elem => {
        elem.ClassIdStr = ClassIdArr.join(',')
      })
      let count = 0
      nodeArr.forEach(elem => {
        count += 1
      })
    },
    /* 获取可接受的文档类型 */
    async getLimitFileType() {
      const res = await this.http.get('/api/Document/GetLimitFileType')
      if (res.Data) {
        const typeArr = res.Data.split(',')
        const newArr = []
        typeArr.forEach(elem => {
          newArr.push('.' + elem)
        })
        this.limitFileType = newArr.join(',')
      }
    },
    /* 获取当前文件夹最新的文件编号 */
    async GetCurrentTypeMaxNo() {
      if (this.activeClassId > 0) {
        const res = await this.http.get('/api/Document/GetMaxNoByClass', { classId: this.activeClassId })
        if (res.Status) {
          this.MaxNo = res.Message
        }
      }
    },
    /* 关闭对话框 */
    closeDialog() {
      this.$emit('closeUploadMulDialog')
      this.$refs['fileForm'].resetFields()
    },

    handleChange(file, fileList) {
      // console.log(fileList);
      const fileName = file.name.substr(0, file.name.lastIndexOf('.'))
      if (fileList.length == 1) {
        this.fileForm.uploadList = [{
          FileName: fileName,
          ClassIdStr: this.ClassIdStr,
          DocKeyWord: '',
          file: file.raw
        }]
      }
      // console.log(this.ClassIdStr);
      if (fileList.length > 1) {
        this.fileForm.uploadList.push({
          FileName: fileName,
          ClassIdStr: this.ClassIdStr,
          DocKeyWord: '',
          file: file.raw
        })
      }
      this.fileListArr = fileList
      // console.log(this.fileForm.uploadList);
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传1个附件')
    },
    // 文件移除时钩子函数
    handleRemove(file, fileList) {
      // this.fileForm.uploadList[this.activeItemIndex].fileList = fileList;
      // this.fileForm.uploadList[this.activeItemIndex].FileName = '';

      const index = this.fileListArr.findIndex(elem => {
        return elem.name == file.name && elem.uid == file.uid
      })
      this.fileForm.uploadList.splice(index, 1)
      if (this.fileForm.uploadList.length == 0) {
        this.fileListArr = [{
          FileName: '',
          ClassIdStr: this.ClassIdStr,
          DocKeyWord: '',
          file: file.raw
        }]
      }
      this.fileListArr = fileList
    },
    // 文件成功上传后
    uploadSuccess(response, file, fileList) {
      this.$message({
        type: response.Status ? 'success' : 'error',
        message: response.Message
      })
      for (let i = 0; i < this.$refs.uploadFile.length; i++) {
        this.fileForm.uploadList[i].FileName = ''
        this.fileForm.uploadList[i].fileList = []
        this.$refs.uploadFile[i].clearFiles()
      }
      if (response.Status) {
        this.closeDialog()
        this.$emit('getList')
      }
    },
    fileTypeCheck(file) {
      // 截取上传文件的后缀名
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      // console.log(fileType);
      // 判断多个
      if (!this.limitFileType.includes(fileType)) {
        this.$message({
          type: 'error',
          message: fileType + '不是能上传的格式类型！'
        })
        this.fileCheckBool = false
        return false
      }
    },
    uploadError(error, file, fileList) {
      console.log(error)
      this.$message({
        type: 'error',
        message: '上传文档失败'
      })
    },

    submitForm() {
      this.$refs['fileForm'].validate(valid => {
        if (!valid) return false
        this.fileCheckBool = true
        if (this.IsNeedCheck == 1) {
          var tempCheckId = []
          this.CheckUserName.map(elem => {
            const employeeitem = this.employeeList.find(item => {
              return item.UserName.toLowerCase() == elem.toLowerCase()
            })
            tempCheckId.push(employeeitem.UserId)
          })
          this.CheckUserID = tempCheckId

          var tempApproveId = []
          this.ApproveUserName.map(elem => {
            const employeeitem = this.employeeList.find(item => {
              return item.UserName.toLowerCase() == elem.toLowerCase()
            })
            tempApproveId.push(employeeitem.UserId)
          })
          this.ApproveUserID = tempApproveId

          const ApproveUserArr = this.ApproveUserID
          const CheckUserArr = this.CheckUserID
          if (ApproveUserArr.length == 0) {
            this.$message.error('批准人不能为空')
            return
          }
          if (CheckUserArr.length > 0 && ApproveUserArr.length > 0) {
            let state = false
            CheckUserArr.forEach(elem => {
              if (ApproveUserArr.includes(elem)) {
                state = true
                return
              }
            })
            if (state) {
              this.$message.error('审核人和批准人不能为同一个人')
              return
            }
          }
          this.ApproveUserID = this.ApproveUserID.join(',')
          this.CheckUserID = this.CheckUserID.join(',')
        } else {
          this.ApproveUserID = null
          this.CheckUserID = null
        }
        this.$refs.uploadFile.submit()
        const formData = new FormData()
        const list = []
        let listObj = null
        if (this.fileForm.uploadList.length == 0 || this.fileForm.uploadList[0].file.size == undefined || this.fileForm.uploadList[0].file.size == 0) {
          this.$message({
            type: 'error',
            message: '请先上传文件！'
          })
          return
        }
        this.fileForm.uploadList.forEach(item => {
          this.fileTypeCheck(item.file)
        })
        if (!this.fileCheckBool) { return }

        if (this.MaxNo == '') {
          this.$message({
            type: 'error',
            message: '获取文档编号异常！请重新进入重试！'
          })
          return
        }
        this.fileForm.uploadList.forEach((elem, i) => {
          formData.append('file', elem.file)
          listObj = {
            'FileName': elem.FileName,
            'DocKeyWord': elem.DocKeyWord
          }
          list.push(listObj)
        })

        const Param = {
          'TypeId': this.activeClassId == null ? '-1' : this.activeClassId,
          'DocNo': this.MaxNo,
          'DocName': this.DocName,
          'Rev': this.MaxRev,
          'IsNeedCheck': this.IsNeedCheck,
          'ApproveUserID': this.ApproveUserID,
          'CheckUserID': this.CheckUserID,
          'FileList': list
        }
        formData.append('infoJsonStr', JSON.stringify(Param))
        this.formData = formData
        this.http.uploadFilePost(this.uploadUrl, this.formData, '上传中...').then(res => {
          this.$message({
            type: res.Status ? 'success' : 'error',
            message: res.Message
          })
          if (res.Status) {
            this.closeDialog()
            this.$emit('getList')
          }
        })
      })
    },
    uploadFileRequest(param) {

    }
  }

}

</script>
<style lang='less' scoped>
.type-manage-bd {
  display: flex;
  justify-content: space-between;
}

.form-bd {
  flex: 1;
  padding: 0 10px;
  border-left: 1px solid #EBEEF5;

  .upload-bd {
    margin: 0 0 10px 15px;
    min-height: 50px;
  }

  /deep/ .el-divider {
    border-top: 1px dashed #DCDFE6;
    background-color: #fff;
    margin-top: 4px !important;
  }

}

.action_btn_bd {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}

// /deep/ .el-list-enter-active,
// /deep/ .el-list-leave-active {
//   transition: none;
// }

// /deep/ .el-list-enter,
// /deep/ .el-list-leave-active {
//   opacity: 0;
// }

/deep/ .el-upload-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 10px;
  width: 100%;

  .el-upload-list__item:first-child {
    margin-top: 0;
  }

  .el-upload-list__item {
    margin-top: 0;
    // width: auto;
    width: 33%;
  }
}

.upload-multiple-bd .form-bd {
  height: calc(100vh - 220px);
  overflow-y: scroll;
}
</style>
