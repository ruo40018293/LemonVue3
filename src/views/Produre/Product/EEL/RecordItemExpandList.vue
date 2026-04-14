<template>
  <div class="container_bd">
    <div class="search-form-collapse">
      <div class="search-bd">
        <div class="list-row" style="flex-flow: row wrap;">
          <div class="search-item">
            <span class="item-label">参数</span>
            <div class="item-block">
              <el-input v-model="search.Keyword" placeholder="请输入关键字" size="mini" style="width: 215px;" clearable
                @keyup.enter.native="SearchClick" />
            </div>
          </div>
          <el-button class="search_item" style="margin-left:10px;" type="primary" icon="el-icon-search" size="small"
            @click="SearchClick">搜索
          </el-button>
        </div>
      </div>
    </div>
    <el-table :key="TableKey" ref="TableDataRef" :data="TableData" style="width: 100%" border
      :height="base.getTableHeight() - 40" :default-sort="{
        prop: search.Orderby,
        order: search.Sort == 'asc' ? 'ascending' : 'descending'
      }" :row-class-name="getRowClass" @sort-change="sortChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :key="TableKey" :data="props.row.DetailList">
            <el-table-column prop="ParamName" label="参数名称" align="center" header-align="center" sortable="custom" />
            <el-table-column prop="ParamValue" label="参数值" align="center" header-align="center" sortable="custom" />
            <el-table-column prop="Remark" label="备注" align="center" header-align="center" sortable="custom" />
            <el-table-column prop="AddUser" label="更新人" width="80" align="center" header-align="center"
              sortable="custom" />
            <el-table-column prop="AddTime" label="更新时间" :formatter="base.formatterTime" width="150" align="center"
              header-align="center" sortable="custom" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center" header-align="center" />
      <el-table-column prop="SN" label="条码" align="center" header-align="center" sortable="custom" />
      <el-table-column prop="ParamName" label="参数名称" align="center" header-align="center" sortable="custom" />
      <el-table-column prop="ParamValue" label="参数值" align="center" header-align="center" sortable="custom" />
      <el-table-column prop="Remark" label="备注" align="center" header-align="center" sortable="custom" />
      <el-table-column prop="AddUser" label="新增人" width="80" align="center" header-align="center" sortable="custom" />
      <el-table-column prop="AddTime" label="新增时间" :formatter="base.formatterTime" width="150" align="center"
        header-align="center" sortable="custom" />
      <el-table-column label="操作" width="150" align="center" header-align="center">
        <template slot-scope="scope">
          <i v-if="(scope.row.Status != -1 && base.isHasPermisByTN('RecordItemExpandList', '编辑'))"
            style="color: #409EFF;cursor: pointer;" title="设置AB盒号" @click="SetABBox(scope.row)"> AB </i>
          <i v-if="(scope.row.Status != -1 && base.isHasPermisByTN('RecordItemExpandList', '编辑'))"
            class="el-icon-edit-outline" style="color: #409EFF;cursor: pointer;" title="编辑" @click="OpenEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="search.Page" :page-sizes="base.pageSizes" :page-size="search.PageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <el-dialog title="编辑信息" :visible.sync="EditRecordItemExpandVisible" width="800px" top="5vh" :append-to-body="true"
      @close="EditClose">
      <table class="tableModel">
        <tr>
          <th>条码</th>
          <td>
            {{ EditModel.SN }}
          </td>
          <th>参数名称</th>
          <td> {{ EditModel.ParamName }}</td>
          <th>参数值</th>
          <td>{{ EditModel.ParamValue }}</td>
        </tr>
        <tr>
          <th>拓展参数清单</th>
          <td colspan="5">
            <el-table :data="EditModel.DetailList" style="width: 100%" border>
              <el-table-column prop="ParamID" label="参数" min-width="120" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.ParamID" style="width:150" size="small" filterable>
                    <el-option v-for="item in ParamList" :key="item.Id" :label="item.ParamName" :value="item.Id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="ParamValue" label="参数值" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ParamValue" size="small" clearable />
                </template>
              </el-table-column>
              <el-table-column prop="Remark" label="备注" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Remark" size="small" clearable />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center" header-align="center">
                <template slot="header" slot-scope="scope">
                  <i style="color: #409EFF;margin-right: 10px;cursor: pointer;" title="添加盒号"
                    @click="AddBoxNoItem(EditModel.DetailList)">盒号</i>
                  <i class="el-icon-plus table-icon" style="color: #409EFF;cursor: pointer;" title="添加"
                    @click="AddItem(EditModel.DetailList)" />
                </template>
                <template slot-scope="scope">
                  <i class="el-icon-delete table-icon" style="color: #F56C6C;cursor: pointer;" title="删除"
                    @click="DelItem(EditModel.DetailList, scope.row, scope.$index)" />
                </template>
              </el-table-column>
            </el-table>
          </td>
        </tr>
        <tr>
          <th>操作</th>
          <td colspan="5">
            <el-button class="search_item" type="primary" icon="el-icon-edit-outline" size="mini"
              @click="SaveEdit">保存</el-button>
          </td>
        </tr>
      </table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'RecordItemExpandList',
  components: {
  },
  data() {
    return {
      search: {
        Keyword: '',
        ProcessId: '',
        Status: 0,
        Page: 1,
        PageSize: 20,
        Orderby: 'AddTime',
        Sort: 'Desc'
      },
      TableData: [],
      pageTotal: null,
      TableKey: 0,
      EditRecordItemExpandVisible: false,
      EditModel: {}
    }
  },
  mounted() {
    this.GetParameterList()
    this.GetList()
  },
  methods: {
    SetABBox(row) {
      this.$confirm('确定设置本行为AB盒吗？该SN另一行会自动设置为CD封测盒！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = { Id: row.Id }
          this.http
            .post('/api/Prod_Record/SetABBox', params, '加载中...')
            .then(res => {
              if (res.Status) {
                this.$message.success({
                  message: res.Message
                })
                this.GetList()
              } else {
                this.$message.error({
                  message: res.Message
                })
              }
            })
        })
        .catch(() => { })
    },
    OpenEdit(row) {
      this.EditModel = row
      this.EditRecordItemExpandVisible = true
    },
    EditClose() {
      this.EditRecordItemExpandVisible = false
      this.EditModel = {}
    },
    AddBoxNoItem(list) {
      const rowObj = {
        Id: 0,
        ParamID: 106,
        ParamValue: '',
        Remark: ''
      }
      list.push(rowObj)
    },
    AddItem(list) {
      const rowObj = {
        Id: 0,
        ParamID: '',
        ParamValue: '',
        Remark: ''
      }
      list.push(rowObj)
    },
    // 删除
    DelItem(list, row, index) {
      list.splice(index, 1)
    },
    // 搜索
    SearchClick() {
      this.GetList()
    },
    GetList() {
      this.TableData = []
      this.http
        .get(
          '/api/Prod_Record/GetRecordItemExpandPageList',
          {
            Keyword: this.search.Keyword ? this.search.Keyword : null,
            Page: this.search.Page,
            PageSize: this.search.PageSize,
            Orderby: this.search.Orderby,
            Sort: this.search.Sort
          },
          '加载中...'
        )
        .then(res => {
          if (res.Status) {
            this.TableData = res.Data.Rows
            this.pageTotal = res.Data.Total
            this.TableKey += 1
          } else {
            this.TableData = []
            this.pageTotal = 0
            this.TableKey = 0
          }
        })
    },
    // 隐藏无子项的展开按钮
    getRowClass({ row }) {
      if (row.DetailList.length == 0) {
        return 'row-expand-cover'
      } else {
        return ''
      }
    },
    // 排序
    sortChange(column) {
      console.log(column)
      if (column.order == 'descending') {
        this.search.Orderby = column.prop
        this.search.Sort = 'desc'
      } else if (column.order == 'ascending') {
        this.search.Orderby = column.prop
        this.search.Sort = 'asc'
      } else if (column.order == null) {
        this.search.Orderby = null
        this.search.Sort = null
      }
      this.GetList()
    },
    // 分页
    handleSizeChange(val) {
      this.search.PageSize = val
      this.search.Page = 1
      this.GetList()
    },
    handleCurrentChange(val) {
      this.search.Page = val
      this.GetList()
    },
    ShowRecordItemExpandList(row) {
      console.log(row)
      this.ReturnModel = row
      this.ReturnlVisible = true
    },
    GetParameterList() {
      this.http.get('/api/Base_Parameter/GetDistinctParam').then(res => {
        if (res.Status) {
          if (res.Data) {
            this.ParamList = res.Data
          } else {
            this.$message.error({
              message: '请先配置参数'
            })
          }
        } else {
          this.$message.error({
            message: res.Message
          })
        }
      })
    },
    SaveEdit() {
      this.http
        .post(
          '/api/Prod_Record/EditRecordItemExpand',
          this.EditModel,
          '加载中...'
        )
        .then(res => {
          if (res.Status) {
            this.$message.success(res.Message)
            this.EditRecordItemExpandVisible = false
            this.GetList()
          } else {
            this.$message.error(res.Message)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
/* 隐藏无子项的展开按钮 */
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}

.table-icon {
  font-size: 18px;
  cursor: pointer;
}

.table-icon+.table-icon {
  margin-left: 5px;
}

/deep/.el-table th,
/deep/.el-table td {
  padding: 5px 0 !important;
}

/deep/.el-table .cell,
/deep/.el-table th .cell {
  padding: 0 5px !important;
}

/deep/.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  //改变了cell的padding后要改变表格第一列样式
  padding-left: 5px !important;
}

/deep/.el-select-dropdown__wrap.el-scrollbar__wrap {
  //解决下拉框最后一条数据显示不完整
  margin-bottom: 0px !important;
}

/deep/.el-dialog .el-dialog__body {
  padding: 0 20px 10px;
}

.btn-item {
  //操作列的表头
  // margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.btn-item+.btn-item {
  margin-top: 15px;
}

//排序按钮的样式
/deep/.el-table .caret-wrapper {
  margin-left: 5px;
  width: 10px;

  .sort-caret {
    left: 0;
  }
}

.tableModel {

  //表单样式
  tr th {
    width: 150px;
    padding: 10px 5px;
  }

  tr td {
    text-align: left;
    padding: 10px 5px;
  }
}
</style>
