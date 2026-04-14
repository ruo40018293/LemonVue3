<template>
    <div>
        <el-divider content-position="left">热沉关系查询</el-divider>
        <el-form :model="searchForm" :inline="true" size="small" style="margin-bottom: 15px;">
            <el-form-item label="Wafer">
                <el-input v-model="searchForm.wafer" placeholder="请输入Wafer" clearable style="width: 150px;" />
            </el-form-item>
            <el-form-item label="芯片编号">
                <el-input v-model="searchForm.chipID" placeholder="请输入ChipID" clearable style="width: 150px;" />
            </el-form-item>
            <el-form-item label="热沉编号">
                <el-input v-model="searchForm.heatSink" placeholder="请输入HeatSink" clearable style="width: 150px;" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="searchForm.remark" placeholder="请输入Remark" clearable style="width: 200px;" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                <el-button @click="handleReset" icon="el-icon-refresh-right">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table id="EelScanTable" :data="tableData" style="width: 100%" border stripe height="650">
            <el-table-column type="index" label="序号" width="60" align="center" header-align="center" />
            <el-table-column prop="WaferID" label="Wafer" width="120" align="center" header-align="center" />
            <el-table-column prop="ChipID" label="芯片编号" width="150" align="center" header-align="center">
                <template slot="header">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <span>芯片编号</span>
                        <i class="el-icon-document-copy table-icon"
                            style="color: #409EFF; margin-left: 5px; cursor: pointer;" title="复制整列芯片编号"
                            @click="copyAllChipIDs" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="HeatSink" label="热沉编号" width="150" align="center" header-align="center">
                <template slot="header">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <span>热沉编号</span>
                        <i class="el-icon-document-copy table-icon"
                            style="color: #409EFF; margin-left: 5px; cursor: pointer;" title="复制整列热沉编号"
                            @click="copyAllHeatSinks" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="Remark" label="备注" min-width="200" align="left" header-align="center" />
            <!-- <el-table-column prop="Rid" label="记录ID" width="100" align="center" header-align="center" /> -->
            <!-- <el-table-column prop="AddTime" label="添加时间" width="180" align="center" header-align="center"
                :formatter="formatDate" /> -->
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'LatterPartParamScan',
    data() {
        return {
            searchForm: {
                wafer: '',
                chipID: '',
                heatSink: '',
                remark: ''
            },
            tableData: [],
            total: 0,
            loading: false,
            pagination: {
                page: 1,
                pageSize: 20
            }
        }
    },
    methods: {
        handleSearch() {
            this.loadData();
        },
        handleReset() {
            this.searchForm = {
                wafer: '',
                chipID: '',
                heatSink: '',
                remark: ''
            };
            this.tableData = [];
            this.total = 0;
        },
        // 加载数据
        loadData() {
            // 构建查询参数
            if (!this.searchForm.wafer && !this.searchForm.chipID && !this.searchForm.heatSink && !this.searchForm.remark) {
                this.$message.warning('请输入查询条件');
                return;
            }
            const params = {
                WaferID: this.searchForm.wafer,
                ChipID: this.searchForm.chipID,
                HeatSink: this.searchForm.heatSink,
                Remark: this.searchForm.remark,
            };
            // 调用API获取数据（根据实际情况调整API地址）
            this.http.get('/api/Prod_Record/GetLatterPartRecordBySearch', params, '查询中...')
                .then(res => {
                    this.loading = false;
                    if (res.Status) {
                        this.tableData = res.Data;
                    } else {
                        this.tableData = [];
                        this.total = 0;
                        this.$message.warning(res.Message || '查询失败');
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.error('查询数据失败');
                    console.error('查询失败:', err);
                });
        },

        // 复制所有芯片编号
        copyAllChipIDs() {
            if (this.tableData.length === 0) {
                this.$message.warning('没有数据可以复制');
                return;
            }

            const chipIDs = this.tableData.map(item => item.ChipID).join('\n');
            this.copyToClipboard(chipIDs, '已复制所有芯片编号到剪贴板');
        },

        // 复制所有热沉编号
        copyAllHeatSinks() {
            if (this.tableData.length === 0) {
                this.$message.warning('没有数据可以复制');
                return;
            }

            const heatSinks = this.tableData.map(item => item.HeatSink).join('\n');
            this.copyToClipboard(heatSinks, '已复制所有热沉编号到剪贴板');
        },

        // 复制到剪贴板
        copyToClipboard(text, successMsg) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        this.$message.success(successMsg);
                    })
                    .catch(err => {
                        console.error('复制失败:', err);
                        this.fallbackCopyTextToClipboard(text, successMsg);
                    });
            } else {
                this.fallbackCopyTextToClipboard(text, successMsg);
            }
        },

        // 兼容性复制方法
        fallbackCopyTextToClipboard(text, successMsg) {
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // 使textarea不可见但可选中
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);

            // 选中并复制
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                this.$message.success(successMsg);
            } catch (err) {
                console.error('复制失败:', err);
                this.$message.error('复制失败，请手动复制');
            }

            // 清理
            document.body.removeChild(textArea);
        },

        // 格式化日期
        formatDate(row, column, cellValue) {
            if (!cellValue) return '';
            return this.$utils.formatterDate(cellValue);
        },

        // 分页大小变化
        handleSizeChange(val) {
            this.pagination.pageSize = val;
            this.pagination.page = 1;
            this.loadData();
        },

        // 当前页变化
        handleCurrentChange(val) {
            this.pagination.page = val;
            this.loadData();
        }
    }
}
</script>

<style scoped>
.table-icon {
    font-size: 18px;
    cursor: pointer;
}
</style>