<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="老化计划查询" name="first">
      <div>
        <div class="search-form-collapse">
          <div class="search-bd">
            <div class="list-row" style="flex-flow: row wrap;">
              <div class="search-item">
                <span class="item-label">机器层</span>
                <div class="item-block">
                  <el-input v-model="search.Layer" placeholder="机器层" size="mini" style="width: 160px;" clearable
                    @keyup.enter.native="SearchClick" />
                </div>
              </div>
              <div class="search-item">
                <span class="item-label">老化条件</span>
                <div class="item-block">
                  <el-input v-model="search.Grade" placeholder="老化条件" size="mini" style="width: 160px;" clearable
                    @keyup.enter.native="SearchClick" />
                </div>
              </div>
              <div class="search-item">
                <span class="item-label">SN</span>
                <div class="item-block">
                  <el-input v-model="search.SN" placeholder="SN" size="mini" style="width: 160px;" clearable
                    @keyup.enter.native="SearchClick" />
                </div>
              </div>
              <div class="search-item" style="margin-left: 10px;">
                <span class="item-label">QCW/TJ/备注</span>
                <div class="item-block">
                  <el-input v-model="search.Remark" placeholder="QCW/TJ/备注" size="mini" style="width: 160px;" clearable
                    @keyup.enter.native="SearchClick" />
                </div>
              </div>

              <div class="search-item">
                <span class="item-label">开始时间</span>
                <div class="item-block">
                  <el-date-picker v-model="search.TimeQuan" size="small" type="daterange" align="right" unlink-panels
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
                    :default-time="['00:00:00', '23:59:59']" format="yyyy 年 MM 月 dd 日" @change="validateDateRange" />
                </div>
              </div>
              <div class="search-item" style="margin-left: 10px;">
                <div class="item-block">
                  <el-checkbox v-model="search.HasFailTime" style="margin-left:10px">失效时长不为空</el-checkbox>
                </div>
              </div>
              <el-button v-preventReClick class="search_item" style="margin-left:10px;" type="primary"
                icon="el-icon-search" size="mini" @click="SearchClick">搜索
              </el-button>
              <div style="margin: 0 10px;display: flex;align-items: center;" @click.stop="ExportClick">
                <svg class="svg-icon" style="width: 26px;height: 26px;cursor: pointer;" aria-hidden="true">
                  <title>导出</title>
                  <use xlink:href="#icon-excel2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <el-table ref="TableDataRef" :data="TableData" style="width: 100%" border :height="base.getTableHeight() - 60">
          <el-table-column type="index" label="序号" width="80" align="center" header-align="center" />
          <el-table-column prop="Layer" label="机器层" width="150" align="center" header-align="center"
            show-overflow-tooltip />
          <el-table-column prop="PlanName" label="计划名称" width="120" header-align="center" />
          <el-table-column prop="AgingType" label="老化类型" align="center" header-align="center" show-overflow-tooltip />
          <el-table-column prop="Grade" label="老化条件" width="150" header-align="center" show-overflow-tooltip />
          <el-table-column prop="StrPower" label="功率" width="80" align="center" header-align="center" />
          <el-table-column prop="wavelength" label="波长" width="80" header-align="center" align="center" />
          <el-table-column prop="No" label="No" width="80" header-align="center" align="center" />
          <el-table-column prop="Channel" label="Channel" width="80" header-align="center" align="center" />
          <el-table-column prop="SN" label="SN" width="220" header-align="center" align="center"
            show-overflow-tooltip />
          <el-table-column prop="FailTime" label="失效时长" width="80" header-align="center" align="center" />
          <el-table-column prop="QCW" label="QCW" width="80" header-align="center" align="center" />
          <el-table-column prop="GradeCW" label="老化条件CW" width="110" header-align="center" align="center" />
          <el-table-column prop="Tj" label="Tj" width="80" header-align="center" align="center" />
          <el-table-column prop="InspectionFA" label="目检FA" width="80" header-align="center" align="center"
            show-overflow-tooltip />
          <el-table-column prop="Remark" label="备注" header-align="center" align="center" show-overflow-tooltip />
          <el-table-column prop="StartTime" label="开始时间" width="160" header-align="center" align="center"
            :formatter="base.formatterTime" />
          <el-table-column prop="EndTime" label="结束时间" width="160" header-align="center" align="center"
            :formatter="base.formatterTime" />
          <el-table-column prop="EndTime" label="老化时长" width="160" header-align="center" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.EndTime">
                {{ calculateDuration(scope.row.StartTime, scope.row.EndTime) }}
              </span>
              <span v-else>未结束</span>
            </template>
          </el-table-column>
          <el-table-column prop="ModifyTime" label="修改时间" width="160" header-align="center" align="center"
            :formatter="base.formatterTime" />
        </el-table>
        <el-pagination background :current-page="search.Page" :page-sizes="base.pageSizes" :page-size="search.PageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="Total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="老化结果汇总" name="second">
      <div class="search-form-collapse">
        <div class="search-bd">
          <div class="list-row" style="flex-flow: row wrap;">
            <div class="search-item">
              <span class="item-label">机器层</span>
              <div class="item-block">
                <el-input v-model="search.Layer" placeholder="机器层" size="mini" style="width: 160px;" clearable
                  @keyup.enter.native="SearchClick" />
              </div>
            </div>
            <div class="search-item">
              <span class="item-label">老化条件</span>
              <div class="item-block">
                <el-input v-model="search.Grade" placeholder="老化条件" size="mini" style="width: 160px;" clearable
                  @keyup.enter.native="SearchClick" />
              </div>
            </div>
            <div class="search-item" style="margin-left: 10px;">
              <span class="item-label">QCW/TJ/备注</span>
              <div class="item-block">
                <el-input v-model="search.Remark" placeholder="QCW/TJ/备注" size="mini" style="width: 160px;" clearable
                  @keyup.enter.native="SearchClick" />
              </div>
            </div>

            <div class="search-item">
              <span class="item-label">开始时间</span>
              <div class="item-block">
                <el-date-picker v-model="search.TimeQuan" size="small" type="daterange" align="right" unlink-panels
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
                  :default-time="['00:00:00', '23:59:59']" format="yyyy 年 MM 月 dd 日" @change="GetSumList" />
              </div>
            </div>
            <div class="search-item" style="margin-left: 10px;">
              <div class="item-block">
                <el-checkbox v-model="search.HasFailTime" style="margin-left:10px">失效时长不为空</el-checkbox>
              </div>
            </div>
            <el-button v-preventReClick class="search_item" style="margin-left:10px;" type="primary"
              icon="el-icon-search" size="mini" @click="GetSumList">搜索
            </el-button>
            <div style="margin: 0 10px;display: flex;align-items: center;" @click.stop="ExportSumClick">
              <svg class="svg-icon" style="width: 26px;height: 26px;cursor: pointer;" aria-hidden="true">
                <title>导出</title>
                <use xlink:href="#icon-excel2" />
              </svg>
            </div>
          </div>
        </div>
        <el-table id="SumTableData" ref="SumTableDataRef" :data="SumTableData" style="width: 100%" border
          :height="base.getTableHeight() - 60">
          <el-table-column type="index" label="序号" width="80" align="center" header-align="center" />
          <el-table-column prop="PlanName" label="计划名称" width="120" header-align="center" />
          <el-table-column prop="Layer" label="机器层" width="180" header-align="center" />
          <el-table-column prop="StartTime" label="开始时间" width="160" header-align="center" align="center"
            :formatter="base.formatterTime" />
          <el-table-column prop="EndTime" label="结束时间" width="160" header-align="center" align="center"
            :formatter="base.formatterTime" />
          <el-table-column prop="EndTime" label="老化时长" width="160" header-align="center" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.EndTime">
                {{ calculateDuration(scope.row.StartTime, scope.row.EndTime) }}
              </span>
              <span v-else>未结束</span>
            </template>
          </el-table-column>
          <el-table-column prop="Wafer" label="Wafer" width="150" header-align="center" align="center"
            show-overflow-tooltip />
          <el-table-column prop="BatchNo" label="BatchNo" width="150" header-align="center" align="center"
            show-overflow-tooltip />
          <el-table-column prop="NGQty" label="不良数" width="80" header-align="center" align="center" />
          <el-table-column prop="OKQty" label="良品数" width="80" header-align="center" align="center" />
          <el-table-column prop="SumQty" label="老化数" width="80" header-align="center" align="center" />
          <el-table-column prop="NGRate" label="失效率" width="80" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.NGRate ? scope.row.NGRate + '%' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="OneDayNGQty" label="24h内失效" width="100" header-align="center" align="center" />
          <el-table-column prop="OneDayOutNGQty" label="24h后失效" width="100" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.NGQty - scope.row.OneDayNGQty ? scope.row.NGQty - scope.row.OneDayNGQty : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="Grade" label="老化条件" width="150" header-align="center" show-overflow-tooltip />
          <el-table-column prop="StrPower" label="功率" width="80" align="center" header-align="center" />
          <el-table-column prop="WaveLength" label="波长" width="80" header-align="center" align="center" />
          <el-table-column prop="IsAging" label="是否老化运行" width="120" header-align="center" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.IsAging == 1">
                Yes </span>
              <span v-else>No</span>
            </template>
          </el-table-column>
          <el-table-column prop="Tj" label="Tj" width="80" header-align="center" align="center" />
          <el-table-column prop="FailTimeList" label="不良信息" width="200" header-align="center" align="center"
            show-overflow-tooltip />
          <el-table-column prop="InspectionFAList" label="目检FA" width="80" header-align="center" align="center"
            show-overflow-tooltip />
          <el-table-column prop="RemarkList" label="备注" header-align="center" align="center" show-overflow-tooltip />

        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { entries } from 'xe-utils'

export default {
  name: 'AgingPlanScan',
  components: {},
  data() {
    return {
      search: {
        Layer: '',
        Grade: '',
        SN: '',
        HasFailTime: false,
        Remark: '',
        TimeQuan: '',
        Page: 1,
        PageSize: 20
      },
      activeName: 'first',
      ProcessList: [],
      TableData: [],
      SumTableData: [],
      Total: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
      }
    }
  },
  mounted() {
  },
  methods: {
    // 计算两个时间之间的小时差
    calculateDuration(startTime, endTime) {
      if (!startTime || !endTime) {
        return '' // 如果任何一个时间为空，返回空
      }

      // 转换为时间戳（毫秒）
      const start = new Date(startTime).getTime()
      const end = new Date(endTime).getTime()

      // 计算小时差（毫秒 -> 小时）
      const hours = Math.round((end - start) / (1000 * 60 * 60))

      return `${hours} 小时`
    },

    validateDateRange() {
      this.GetList()
    },
    // 导出
    ExportSumClick() {
      const excelName = '老化计划汇总明细.xlsx'
      var xlsxParam = { raw: true }// 转换成excel时，使用原始的格式
      var ExeclID = 'SumTableData'
      const tables = document.getElementById(ExeclID).cloneNode(true)
      // 判断是否为固定列，解决（为固定列时，会重复生成表格）
      if (tables.querySelector('.el-table__fixed') !== null) {
        tables.removeChild(tables.querySelector('.el-table__fixed'))
      }
      const table_book = this.$XLSX.utils.table_to_book(tables, xlsxParam)
      var table_write = this.$XLSX.write(table_book, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        this.$FileSaver.saveAs(
          new Blob([table_write], { type: 'application/octet-stream' }),
          excelName
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, table_write)
      }
      return table_write
    },
    // 导出
    ExportClick() {
      this.http.get('/api/Prod_EEL/ExportAllAgingPlanList', {
        Layer: this.search.Layer ? this.search.Layer : null,
        Grade: this.search.Grade ? this.search.Grade : null,
        SN: this.search.SN ? this.search.SN : null,
        HasFailTime: this.search.HasFailTime ? 1 : 0,
        Remark: this.search.Remark ? this.search.Remark : null,
        BenginDate: this.search.TimeQuan[0],
        EndDate: this.search.TimeQuan[1]
      }, '下载中...').then((res) => {
        if (res.Status) {
          if (res.Data) {
            const apiUrl = this.$store.state.system.appsettings.apiUrl
            window.open(`${apiUrl}${res.Data}`)
          }
        } else {
          this.$message.error(res.Message)
        }
      })
    },
    // 搜索
    SearchClick() {
      this.search.Page = 1
      this.GetList()
    },
    GetList() {
      this.http.get('/api/Prod_EEL/GetAllAgingPlanList', {
        Layer: this.search.Layer ? this.search.Layer : null,
        Grade: this.search.Grade ? this.search.Grade : null,
        SN: this.search.SN ? this.search.SN : null,
        HasFailTime: this.search.HasFailTime ? 1 : 0,
        Remark: this.search.Remark ? this.search.Remark : null,
        BenginDate: this.search.TimeQuan[0],
        EndDate: this.search.TimeQuan[1],
        Page: this.search.Page,
        PageSize: this.search.PageSize
      }, '加载中...').then(res => {
        if (res.Status) {
          this.TableData = res.Data.Rows
          this.Total = res.Data.Total
        } else {
          this.TableData = []
          this.Total = 0
        }
      })
    },
    GetSumList() {
      if (!this.search.TimeQuan) {
        this.$message.error({
          message: '请选择时间！'
        })
        return
      }
      this.http.get('/api/Prod_EEL/GetSumAgingPlanList', {
        Layer: this.search.Layer ? this.search.Layer : null,
        Grade: this.search.Grade ? this.search.Grade : null,
        HasFailTime: this.search.HasFailTime ? 1 : 0,
        Remark: this.search.Remark ? this.search.Remark : null,
        BenginDate: this.search.TimeQuan[0],
        EndDate: this.search.TimeQuan[1]
      }, '加载中...').then(res => {
        if (res.Status) {
          this.SumTableData = res.Data
        } else {
          this.SumTableData = []
        }
      })
    },
    // 分页
    handleSizeChange(val) {
      this.search.PageSize = val
      this.SearchClick()
    },
    handleCurrentChange(val) {
      this.search.Page = val
      this.GetList()
    }
  }
}
</script>
