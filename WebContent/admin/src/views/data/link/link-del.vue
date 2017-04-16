<template>
    <div class="data-link-del-page">
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
                        当前已选中ID :
                        <span v-if="multipleSelection.length==0">无</span>
                        <el-tag
                            v-for="(item, key) in multipleSelection"
                            :key="key"
                            :closable="true"
                            :close-transition="false"
                            @close="tagCloseHandle(item)"
                            type="primary">
                            {{ item.Link_ID }}
                        </el-tag>
                        <el-button
                            class="del-all"
                            v-if="multipleSelection.length!=0"
                            type="text"
                            @click.native.prevent="deleteSelectionRow"
                            size="small">
                            清除所选外链
                        </el-button>
                    </div>
                </el-col>

                <el-col class="container-table" :span="24">
                    <div class="table-data">
                        <el-table
                            :data="tableData"
                            :height="tableHeight+108"
                            style="width: 100%"
                            :default-sort = "{prop: seq, order: descValue}"
                            ref="table"
                            row-key="Link_ID"
                            @sort-change="sortChangeHandle"
                            @selection-change="selectionChangeHandle">
                            <el-table-column
                                type="selection"
                                :reserve-selection="true"
                                width="50">
                            </el-table-column>
							<el-table-column
									prop="Link_ID"
									label="ID"
									sortable="custom"
									width="80">
							</el-table-column>
							<el-table-column
									prop="Link_Name"
									label="名称"
									sortable="custom">
								<template scope="scope">
									<a :href="'#/home/data-link-edit/' + scope.row.Link_ID" >{{scope.row.Link_Name}}</a>
								</template>
							</el-table-column>
							<el-table-column
									prop="Link_Url"
									label="访问链接"
									sortable="custom">
							</el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="120">
                                <template scope="scope">
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click.native.prevent="deleteRow(scope.$index, scope.row.Link_ID)">
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

    import '../../../css/data/link/link-del.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_NAME,
        SET_SEQ,
        SET_DESC,
        SET_TABLEPAGE,

        GET_TABLEDATACOUNT,
        GET_TABLEDATA,
        DEL_LINK
    } from '../../../vuex/modules/data/link/link-del';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
                multipleSelection: [],  // 选中外链
                sortRequest : false  // 是否允许排序字段远程请求数据
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                name: state => state.dataLinkDel.name,
                seq: state => state.dataLinkDel.seq,
                desc: state => state.dataLinkDel.desc,
                tableCount: state => state.dataLinkDel.tableCount,
                tablePage: state => state.dataLinkDel.tablePage,
                tableData: state => state.dataLinkDel.tableData,
            }),
			// 名称切换事件
			nameValue: {
				get: function () { return this.name; },
				set: function (newName) {
					this.$store.commit(SET_NAME, newName);
				}
			},
            // 排序顺序
            descValue: function () {
                return this.desc + 'ending';
            }
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
                let self = this;
                self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 重置条件
            resetFilter(event) {
                this.$store.commit(SET_NAME, '');
                let self = this;
                self.$refs.table.clearSelection();
                self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 选中标签删除事件
            tagCloseHandle(tag) {
                // 删除当前选中的外链
                this.$refs.table.toggleRowSelection(tag, false);
            },
            // 删除选中的行事件
            deleteSelectionRow() {
                // 先向后台发请求
                let self = this;
                let selectionArray = [];
                self.multipleSelection.forEach(function(item){
                    selectionArray.push(item.Link_ID);
                });

                self.$store.dispatch(DEL_LINK, selectionArray.join(';')).then(function(response) {
                    if (response.data.success === '1') {
                        self.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    } else {
                        self.$message.error('删除外链出错');
                    }
                    // 然后清空当前选中的数据
                    self.$refs.table.clearSelection();
                    return self.$store.dispatch(GET_TABLEDATACOUNT);
                }).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 删除单行选中数据事件
            deleteRow(index, id) {
                let self = this;
                self.$store.dispatch(DEL_LINK, id).then(function(response) {
                    if (response.data.success === '1') {
                        self.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    } else {
                        self.$message.error('删除外链出错');
                    }
                    return self.$store.dispatch(GET_TABLEDATACOUNT);
                }).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 翻页事件
            tablePageChange(val) {
                this.$store.commit(SET_TABLEPAGE, val);
                // 重新获取当前页的table表数据
                this.$store.dispatch(GET_TABLEDATA);
            },
            // 列排序事件
            sortChangeHandle(prop) {
                // 排序事件会在vue的生命周期mounted之前，所以添加一个sortRequest限制排序远程请求数据什么时候可以开始请求
                if (prop.order && prop.prop && this.sortRequest) {
                    let desc = '';
                    if (prop.order === 'ascending') {
                        desc = 'asc';
                    } else {
                        desc = 'desc';
                    }
                    let self = this;
                    self.$store.commit(SET_DESC, desc);
                    self.$store.commit(SET_SEQ, prop.prop);
                    self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        self.$store.dispatch(GET_TABLEDATA);
                    });
                }
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
			self.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
			// 获取数据总个数
            self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
				// 获取数据区间个数
				self.sortRequest = true;
				return self.$store.dispatch(GET_TABLEDATA);
            });
        }
    }
</script>

<style scoped>

</style>
