<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import '@/assets/css/common.less'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'
import { onMounted } from 'vue'

onMounted(() => {
  const targetElement = document.getElementById('some-element')
  if (targetElement) {
    targetElement.style.display = 'block'
  }
})

Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

Date.prototype.toJSON = function() {
  return this.format('yyyy-MM-dd hh:mm:ss')
}
</script>

<style>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
}

.number_input .el-input__inner {
  line-height: 1 !important;
}

.number_input input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.number_input input[type="number"] {
  -moz-appearance: textfield;
}

.el-loading {
  z-index: 999999;
}

.el-loading-mask {
  z-index: 999999;
}

.el-table th.gutter {
  display: table-cell !important;
}

.el-table colgroup.gutter {
  display: table-cell !important;
}

.el-table--border:after,
.el-table--group:after,
.el-table:before {
  background-color: #E4E7ED;
}

.el-table--border,
.el-table--group {
  border-color: #E4E7ED;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #E4E7ED;
}

.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #E4E7ED;
}

.el-table--border td,
.el-table--border th {
  border-right: 1px solid #E4E7ED;
}

.el-table td {
  color: #222222;
  padding: 8px 0;
}

.el-table th {
  background: #f5f7fa;
  color: #666;
  padding: 8px 0;
  user-select: auto;
}

.el-tab-pane .el-table th {
  background: #fff;
  color: #666;
}

.el-table__fixed-right-patch {
  background-color: #f5f7fa;
}

.el-tab-pane .el-table__fixed-right-patch {
  background: #fff;
}

.el-loading .el-loading-spinner {
  padding: 7px;
  background: #ececec;
  width: 200px;
  color: red;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid #a0a0a0;
}

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

#nprogress .bar {
  background: #409eff;
  height: 2px;
}

.ivu-form .ivu-form-item-label {
  color: #939394;
}

.el-pagination {
  margin-top: 5px !important;
  display: flex;
  justify-content: flex-end;
}

.search_btn {
  margin-left: 10px;
}
</style>

<style lang="less">
html,
body,
#app {
  height: 100%;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  font-size: 14px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.searchForm {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
}

.searchFormJustify {
  justify-content: space-between;
}

.searchForm {
  .search_right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  }

  .search_item {
    margin-right: 10px;
  }

  .search_item>span {
    font-size: 12px;
  }
}

.tableTemplate {
  border-collapse: collapse;
  width: 100%;

  th {
    color: #666 !important;
    background-color: #f5f7fa;
  }

  td {
    color: #222222;
  }

  tr td,
  th {
    border: 1px solid #E4E7ED;
    padding: 10px 15px;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: center;
    font-size: 14px;
    word-break: break-all;
  }
}

.tableModel {
  border-collapse: collapse;
  width: 100%;

  th {
    color: #666 !important;
    background-color: #f5f7fa;
  }

  td {
    color: #222222;
  }

  >tr>td,
  >tr>th {
    border: 1px solid #E4E7ED;
    padding: 10px 15px;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: center;
    font-size: 14px;
    word-break: break-all;
  }
}

.tableTemplate .required-th:before,
.tableModel .required-th:before {
  content: '*';
  color: red;
  margin-right: 4px;
}

.tableTemplate .td-left,
.tableModel .td-left {
  text-align: left !important;
}

.tableTemplate .td-right,
.tableModel .td-right {
  text-align: right !important;
}

.tableTemplate .td-center,
.tableModel .td-center {
  text-align: center !important;
}

.tab_header_title {
  text-align: center;
  font-size: 18px;
  padding-bottom: 20px;
  color: #606266;
}

.el-table .table_action_btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.el-table .table_edit_icon {
  color: #409eff;
}

.el-table .table_del_icon {
  color: #f56c6c;
}

.column_td {
  text-decoration: underline;
  font-size: 14px;
  line-height: 23px;
  height: 23px;
  border: none;
  padding: 0;
  margin: 0;
}

.table-column-link {
  text-decoration: underline;
  cursor: pointer;
  color: #409eff;
}

.red_tips {
  color: #f56c6c;
}

.td_left {
  text-align: left !important;
}

.dialog-action-bd {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.el-date-editor .el-range-separator {
  width: 8%;
}

.tox-tinymce-aux {
  z-index: 5000 !important;
}

.rma-info-add-date {
  position: absolute;
  z-index: 99999 !important;
}

.popper-description {
  width: 1000px !important;
}

.popper-before-pn {
  width: auto !important;
  max-width: 1200px !important;
}

.search-form-collapse {
  border: 1px solid #ebeef5;
  padding: 8px 8px 3px 8px;
  margin-bottom: 10px;
  border-radius: 4px;

  .list-row {
    display: flex;
    align-items: center;
    padding-bottom: 7px;

    .search-item {
      display: flex;
      align-items: center;
      box-sizing: border-box;

      >div {
        flex-grow: 1;
      }
    }
  }

  .item-label {
    font-size: 13px;
    display: inline-block;
    min-width: 80px;
    margin-right: 7px;
    text-align: right;
    box-sizing: border-box;
    margin-bottom: 5px;
  }

  .item-block {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-bottom: 5px;
  }

  .tag-item {
    margin-right: 7px;
    cursor: pointer;
    margin-bottom: 6px;
  }

  .search-result-bd {
    position: relative;
    border-top: 1px dotted #ebeef5;

    .delete-icon {
      font-size: 16px;
      cursor: pointer;
      margin: 0 10px;
      color: #f56c6c;
    }
  }

  .collapse-icon {
    padding: 0 10px;
    cursor: pointer;
    font-size: 18px;
    color: #409eff;
    font-weight: 600;
    margin-left: 10px;
    display: inline-block;
    height: 28px;
    line-height: 28px;
  }

  .search-result-collapse {
    margin-top: 0px;
    border-top: none;
    padding-top: 0px;
  }
}

input,
textarea {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
