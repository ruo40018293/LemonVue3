<template>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="机台老化信息查询" name="first">
            <div>
                <div class="search-form-collapse">
                    <div class="search-bd">
                        <div class="list-row" style="flex-flow: row wrap;">
                            <!-- <div class="search-item">
                                <span class="item-label">工单号</span>
                                <div class="item-block">
                                    <el-input v-model="search.Order_No" placeholder="工单号" size="small"
                                        style="width: 150px;" clearable @keyup.enter.native="SearchClick" />
                                </div>
                            </div> -->
                            <div class="search-item">
                                <span class="item-label">芯片SN号</span>
                                <div class="item-block">
                                    <el-input v-model="search.ChipID" placeholder="芯片SN号" size="small"
                                        style="width: 150px;" clearable @keyup.enter.native="SearchClick" />
                                </div>
                            </div>
                            <div class="search-item">
                                <span class="item-label">机台号</span>
                                <div class="item-block">
                                    <el-input v-model="search.OVEN" placeholder="机台号" size="small" style="width: 150px;"
                                        clearable @keyup.enter.native="SearchClick" />
                                </div>
                            </div>
                            <div class="search-item">
                                <span class="item-label">老化单元号</span>
                                <div class="item-block">
                                    <el-input v-model="search.Layer" placeholder="老化单元号" size="small"
                                        style="width: 150px;" clearable @keyup.enter.native="SearchClick" />
                                </div>
                            </div>
                            <div class="search-item">
                                <span class="item-label">备注</span>
                                <div class="item-block">
                                    <el-input v-model="search.Remark" placeholder="备注" size="small"
                                        style="width: 150px;" clearable @keyup.enter.native="SearchClick" />
                                </div>
                            </div>
                            <!-- <div class="search-item">
                                <span class="item-label">芯片类型</span>
                                <div class="item-block">
                                    <el-input v-model="search.ChipType" placeholder="芯片类型" size="small"
                                        style="width: 160px;" clearable @keyup.enter.native="SearchClick" />
                                </div>
                            </div> -->
                            <div class="search-item">
                                <span class="item-label">老化结果</span>
                                <div class="item-block">
                                    <el-select v-model="search.Result" placeholder="老化结果" size="small"
                                        style="width: 100px;" clearable @change="SearchClick">
                                        <el-option label="Pass" value="Pass" />
                                        <el-option label="Fail" value="Fail" />
                                    </el-select>
                                </div>
                            </div>
                            <div class="search-item">
                                <span class="item-label">时间</span>
                                <div class="item-block">
                                    <el-date-picker v-model="search.TimeQuan" size="small" type="daterange"
                                        align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" :picker-options="pickerOptions"
                                        :default-time="['00:00:00', '23:59:59']" format="yyyy 年 MM 月 dd 日"
                                        @change="validateDateRange" />
                                </div>
                            </div>
                            <el-button v-preventReClick class="search_item" style="margin-left:10px;" type="primary"
                                icon="el-icon-search" size="small" @click="SearchClick">搜索
                            </el-button>
                            <div style="margin: 0 10px;display: flex;align-items: center;" @click.stop="ExportClick">
                                <svg class="svg-icon" style="width: 26px;height: 26px;cursor: pointer;"
                                    aria-hidden="true">
                                    <title>导出</title>
                                    <use xlink:href="#icon-excel2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <el-table ref="TableDataRef" :data="TableData" style="width: 100%" border
                    :height="base.getTableHeight() - 60">
                    <el-table-column type="index" label="序号" width="80" align="center" header-align="center" />
                    <!-- <el-table-column prop="PCB_No" label="PCB号" width="120" header-align="center"
                        show-overflow-tooltip /> -->
                    <el-table-column prop="ChipID" label="芯片SN号" align="center" width="220" header-align="center"
                        show-overflow-tooltip />
                    <!-- <el-table-column prop="ChipType" label="芯片类型" width="100" header-align="center"
                        show-overflow-tooltip /> -->
                    <el-table-column prop="OVEN" label="机台号" width="100" header-align="center" align="center" />
                    <el-table-column prop="Layer" label="老化单元号" width="120" header-align="center" align="center" />
                    <!-- <el-table-column prop="PCBPosition" label="PCB位置" width="100" header-align="center"
                        align="center" /> -->
                    <el-table-column prop="ChipPosition" label="芯片位置" width="100" header-align="center"
                        align="center" />
                    <el-table-column prop="StartTime" label="开始时间" width="160" header-align="center" align="center"
                        :formatter="base.formatterTime" />
                    <el-table-column prop="EndTime" label="结束时间" width="160" header-align="center" align="center"
                        :formatter="base.formatterTime" />
                    <el-table-column prop="BurnTimeMins" label="老化时长(分钟)" width="120" header-align="center"
                        align="center" />
                    <el-table-column prop="Temp_C" label="温度(℃)" width="100" header-align="center" align="center"
                        show-overflow-tooltip />
                    <el-table-column prop="I_mA" label="电流(mA)" width="100" header-align="center" align="center"
                        show-overflow-tooltip />
                    <el-table-column prop="V_LD" label="电压(V)" width="100" header-align="center" align="center"
                        show-overflow-tooltip />
                    <el-table-column prop="Result" label="老化结果" width="100" header-align="center" align="center" />
                    <el-table-column prop="ResultLog" label="备注" header-align="center" align="center"
                        show-overflow-tooltip />
                    <el-table-column prop="SampleTime" label="计划时间(分钟)" width="120" header-align="center"
                        align="center" />
                    <el-table-column prop="AddTime" label="添加时间" width="160" header-align="center" align="center"
                        :formatter="base.formatterTime" />
                    <el-table-column prop="ActualEndTime" label="实际结果时间" width="160" header-align="center" align="center"
                        :formatter="base.formatterTime" />
                </el-table>
                <el-pagination background :current-page="search.Page" :page-sizes="base.pageSizes"
                    :page-size="search.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="老化wafer汇总信息" name="second">
            <div class="search-form-collapse">
                <div class="search-bd">
                    <div class="list-row" style="flex-flow: row wrap;">
                        <div class="search-item">
                            <span class="item-label">更新时间</span>
                            <el-date-picker v-model="search.TimeQuan" size="small" type="daterange" align="right"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']"
                                format="yyyy 年 MM 月 dd 日" />
                        </div>
                        <div class="search-item">
                            <span class="item-label">晶圆号</span>
                            <div class="item-block">
                                <el-input v-model="search.Wafer" placeholder="晶圆号" size="small" style="width: 160px;"
                                    clearable @keyup.enter.native="GetSumList" />
                            </div>
                        </div>
                        <el-button v-preventReClick class="search_item" style="margin-left:10px;" type="primary"
                            icon="el-icon-search" size="small" @click="GetSumList">搜索
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
                    <el-table-column prop="Wafer" label="晶圆号" width="220" header-align="center" align="center"
                        show-overflow-tooltip />
                    <el-table-column prop="AgingInProgressCount" label="老化中数量" width="120" header-align="center"
                        align="center" />
                    <el-table-column prop="TotalBurnCount" label="当月总老化数" width="120" header-align="center"
                        align="center" />
                    <el-table-column prop="PassCount" label="Pass数" width="120" header-align="center" align="center" />
                    <el-table-column prop="AgingWaferChipSumCount" label="老化总数量" width="120" header-align="center"
                        align="center" />
                    <el-table-column prop="YieldRate" label="良率" width="100" header-align="center" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.YieldRate ? scope.row.YieldRate + '%' : '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="FailWithin24h" label="24h内失效" width="100" header-align="center"
                        align="center" />
                    <el-table-column prop="FailWithin48h" label="48h内失效" width="100" header-align="center"
                        align="center" />
                    <el-table-column prop="FailOver48h" label="48h后失效" width="100" header-align="center"
                        align="center" />
                    <el-table-column prop="LastUpdateTime" label="最近更新时间" width="160" header-align="center"
                        align="center" :formatter="base.formatterTime" />
                </el-table>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    name: 'AgingCOCList',
    components: {},
    data() {
        return {
            search: {
                Order_No: '',
                ChipID: '',
                OVEN: '',
                Layer: '',
                Remark: '',
                Result: '',
                TimeQuan: '',
                SummaryDate: new Date(),
                Wafer: '',
                Page: 1,
                PageSize: 20
            },
            activeName: 'first',
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
        validateDateRange() {
            this.GetList()
        },
        // 导出
        ExportClick() {
            const excelName = '老化机台日志明细.xlsx'
            var xlsxParam = { raw: true }// 转换成excel时，使用原始的格式
            var ExeclID = 'TableData' // 注意：需要在el-table上添加id="TableData"
            const tables = document.getElementById(ExeclID) ? document.getElementById(ExeclID).cloneNode(true) : this.$refs.TableDataRef.$el.querySelector('.el-table__body-wrapper table').cloneNode(true)
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

        // 导出汇总
        ExportSumClick() {
            const excelName = 'Wafer每月汇总.xlsx'
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
        // 搜索
        SearchClick() {
            this.search.Page = 1
            this.GetList()
        },
        GetList() {
            this.http.get('/api/Prod_EEL/GetCOCBILogList', {
                ChipID: this.search.ChipID ? this.search.ChipID : null,
                OVEN: this.search.OVEN ? this.search.OVEN : null,
                Layer: this.search.Layer ? this.search.Layer : null,
                Result: this.search.Result ? this.search.Result : null,
                Remark: this.search.Remark ? this.search.Remark : null,
                StartTime: this.search.TimeQuan ? this.search.TimeQuan[0] : null,
                EndTime: this.search.TimeQuan ? this.search.TimeQuan[1] : null,
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
            if (!this.search.SummaryDate && !this.search.Wafer) {
                this.$message.error('请选择月份或晶圆号')
                return
            }
            this.http.get('/api/Prod_EEL/GetCOCBiWaferMonthlySummaryList', {
                StartTime: this.search.TimeQuan ? this.search.TimeQuan[0] : null,
                EndTime: this.search.TimeQuan ? this.search.TimeQuan[1] : null,
                Wafer: this.search.Wafer ? this.search.Wafer : null
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