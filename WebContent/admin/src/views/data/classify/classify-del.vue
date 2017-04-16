<template>
    <div class="data-classify-del-page">
        <div class="header">
            <el-row :gutter="20">
                <el-col class="header-title" :span="24">
                    <div class="filter-package">
                        <el-select class="filter-sort" v-model="classifyValue" placeholder="请选择">
                            <el-option
                                v-for="(item, key) in sortList"
                                :label="item.label"
                                :value="item.value"
                                :key="key">
                            </el-option>
                        </el-select>
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
                            {{ item.Sort_ID }}
                        </el-tag>
                        <el-button
                            class="del-all"
                            v-if="multipleSelection.length!=0"
                            type="text"
                            @click.native.prevent="deleteSelectionRow"
                            size="small">
                            清除所选分类
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
                            row-key="Sort_ID"
                            @sort-change="sortChangeHandle"
                            @selection-change="selectionChangeHandle">
                            <el-table-column
                                type="selection"
                                :reserve-selection="true"
                                width="50">
                            </el-table-column>
							<el-table-column
									prop="Sort_ID"
									label="ID"
									sortable="custom"
									width="80">
							</el-table-column>
							<el-table-column
									prop="Sort_Name"
									label="名称">
							</el-table-column>
							<el-table-column
									prop="F_Sort"
									label="分类"
									sortable="custom"
									width="160">
							</el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="120">
                                <template scope="scope">
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click.native.prevent="deleteRow(scope.$index, scope.row.Sort_ID)">
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

    import '../../../css/data/classify/classify-del.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_CLASSIFY,
        SET_NAME,
        SET_SEQ,
        SET_DESC,
        SET_TABLEPAGE,

        GET_TABLEDATACOUNT,
        GET_TABLEDATA,
        DEL_CLASSIFY
    } from '../../../vuex/modules/data/classify/classify-del';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
                multipleSelection: [],  // 选中分类
                sortRequest : false  // 是否允许排序字段远程请求数据
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataClassifyDel.sortList,
                classify: state => state.dataClassifyDel.classify,
                name: state => state.dataClassifyDel.name,
                seq: state => state.dataClassifyDel.seq,
                desc: state => state.dataClassifyDel.desc,
                tableCount: state => state.dataClassifyDel.tableCount,
                tablePage: state => state.dataClassifyDel.tablePage,
                tableData: state => state.dataClassifyDel.tableData,
            }),
            // 分类切换事件
            classifyValue: {
                get: function () { return this.classify; },
                set: function (newClassify) {
                    this.$store.commit(SET_CLASSIFY, newClassify);
                }
            },
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
                this.$store.commit(SET_CLASSIFY, '0');
                this.$store.commit(SET_NAME, '');
                let self = this;
                self.$refs.table.clearSelection();
                self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 选中标签删除事件
            tagCloseHandle(tag) {
                // 删除当前选中的分类
                this.$refs.table.toggleRowSelection(tag, false);
            },
            // 删除选中的行事件
            deleteSelectionRow() {
                // 先向后台发请求
                let self = this;
                let selectionArray = [];
                self.multipleSelection.forEach(function(item){
                    selectionArray.push(item.Sort_ID);
                });

                self.$store.dispatch(DEL_CLASSIFY, selectionArray.join(';')).then(function(response) {
                    if (response.data.success === '1') {
                        self.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    } else {
                        self.$message.error('删除分类出错');
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
                self.$store.dispatch(DEL_CLASSIFY, id).then(function(response) {
                    if (response.data.success === '1') {
                        self.$message({
                            message: response.data.msg,
                            type: 'success'
                        });
                    } else {
                        self.$message.error('删除分类出错');
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
            this.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
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
