<template>
    <div class="backup-del-page">
        <div class="header">
            <el-row :gutter="20">
                <el-col class="header-title" :span="24">
                    <div class="filter-package">
						<el-input v-model="nameValue" placeholder="名称模糊查询"></el-input>
                        <el-button type="primary" @click="searchData">
                            <i class="fa fa-search"></i>
                            查询
                        </el-button>
                        <el-button @click="resetFilter">重置条件</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-row class="container-data" :gutter="20">
                <el-col class="container-table" :span="24">
                    <div class="container-selection">
                        当前已选中备份 :
                        <span v-if="multipleSelection.length==0">无</span>
                        <el-tag
                            v-for="(item, key) in multipleSelection"
                            :key="key"
                            :closable="true"
                            :close-transition="false"
                            @close="tagCloseHandle(item)"
                            type="primary">
                            {{ item.Backup_Name }}
                        </el-tag>
						<el-button
								class="del-all"
								v-if="multipleSelection.length!=0"
								type="text"
								@click.native.prevent="downloadSelectionRow"
								size="small">
							下载所选备份
						</el-button>
                        <el-button
                            class="del-all"
                            v-if="multipleSelection.length!=0"
                            type="text"
                            @click.native.prevent="deleteSelectionRow"
                            size="small">
                            清除所选备份
                        </el-button>
                    </div>
                </el-col>

                <el-col class="container-table" :span="24">
                    <div class="table-data">
                        <el-table
                            :data="tableData"
                            :height="tableHeight+108"
                            style="width: 100%"
                            :default-sort = "{prop: 'Backup_Name', order: 'desc'}"
                            ref="table"
                            row-key="Backup_Name"
                            @selection-change="selectionChangeHandle">
                            <el-table-column
                                type="selection"
                                :reserve-selection="true"
                                width="50">
                            </el-table-column>
							<el-table-column
									prop="Backup_Name"
									label="名称"
									sortable>
							</el-table-column>
							<el-table-column
									prop="Backup_Size"
									label="大小"
									sortable>
								<template scope="scope">
									{{scope.row.Backup_Size}} byte
								</template>
							</el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="160">
                                <template scope="scope">
									<el-button
											type="text"
											size="small"
											@click.native.prevent="downloadRow(scope.$index, scope.row.Backup_Name)">
										下载
									</el-button>
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click.native.prevent="deleteRow(scope.$index, scope.row.Backup_Name)">
                                        移除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="table-page">
                        <el-pagination
                            @current-change="tablePageChange"
                            :current-page="tablePage"
                            :page-size="20"
                            layout="total, prev, pager, next"
                            :total="tableCount">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../css/cog/cog-backup.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_NAME,
        SET_TABLEPAGE,

        GET_TABLEDATACOUNT,
        GET_TABLEDATA,
        DEL_BACKUP
    } from '../../vuex/modules/cog/cog-backup';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
                multipleSelection: [],  // 选中用户
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                name: state => state.cogBackup.name,
                tableCount: state => state.cogBackup.tableCount,
                tablePage: state => state.cogBackup.tablePage,
                tableData: state => state.cogBackup.tableData,
            }),
			// 名称切换事件
			nameValue: {
				get: function () { return this.name; },
				set: function (newName) {
					this.$store.commit(SET_NAME, newName);
				}
			},
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
            // 根据条件查询数据
            searchData(event) {
				this.$store.dispatch(GET_TABLEDATA);
            },
            // 重置条件
            resetFilter(event) {
                this.$store.commit(SET_NAME, '');
				this.$refs.table.clearSelection();
				this.$store.dispatch(GET_TABLEDATA);
            },
            // 选中标签删除事件
            tagCloseHandle(tag) {
                // 删除当前选中的用户
                this.$refs.table.toggleRowSelection(tag, false);
            },
            // 删除选中的行事件
            deleteSelectionRow() {
                // 先向后台发请求
                let self = this;
                let selectionArray = [];
                self.multipleSelection.forEach(function(item){
                    selectionArray.push(item.Backup_Name);
                });

                self.$store.dispatch(DEL_BACKUP, selectionArray.join(';')).then(function(response) {
                    if (response.data.success === '1') {
                        self.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    } else {
                        self.$message.error('删除备份出错');
                    }
                    // 然后清空当前选中的数据
                    self.$refs.table.clearSelection();
					self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 删除单行选中数据事件
            deleteRow(index, id) {
                let self = this;
                self.$store.dispatch(DEL_BACKUP, id).then(function(response) {
                    if (response.data.success === '1') {
                        self.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    } else {
                        self.$message.error('删除备份出错');
                    }
					self.$store.dispatch(GET_TABLEDATA);
                });
            },
			// 下载事件
			downloadSelectionRow() {

			},
			downloadRow(index, id) {

			},
            // 翻页事件
            tablePageChange(val) {
                this.$store.commit(SET_TABLEPAGE, val);
                // 重新获取当前页的table表数据
                this.$store.dispatch(GET_TABLEDATA);
            },
            // 行选中事件
            selectionChangeHandle(val) {
                this.multipleSelection = val;
            },
        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let path = this.$route.path;
            const self = this;
            if (this.topActiveMenu !== pId) {
                this.setChildMenuShow(false).then(function () {
                    return self.setActiveTopMenu(pId);
                }).then(function () {
                    // 通过v-if，使每次切换顶级菜单时，让浏览器重新渲染子菜单组件，达到切换顶级菜单后默认选中第一个子菜单
                    return self.setChildMenuShow(true);
                }).then(function () {
                    self.setActiveChildMenu(path);
                });
            } else {
                this.setActiveChildMenu(path);
            }
        },
        mounted: function () {
            const self = this;
            // 设置table高度
			this.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
			this.$store.dispatch(GET_TABLEDATA);
        }
    }
</script>

<style scoped>

</style>
