<template>
	<div class="data-classify-edit-page">
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
                    <div class="table-data">
                        <el-table
                            :data="tableData"
                            :height="tableHeight+148"
							:default-sort = "{prop: seq, order: descValue}"
							@sort-change="sortChangeHandle"
                            style="width: 100%">
                            <el-table-column
                                prop="Sort_ID"
                                label="ID"
								sortable="custom"
                                width="80">
                            </el-table-column>
                            <el-table-column
                                prop="Sort_Name"
                                label="所属名称">
								<template scope="scope">
									<a :href="'#/home/data-classify-edit/' + scope.row.Sort_ID" >{{scope.row.Sort_Name}}</a>
								</template>
                            </el-table-column>
                            <el-table-column
                                prop="F_Sort"
                                label="分类"
								sortable="custom"
								width="160">
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

    import '../../../css/data/classify/classify-edit.less';

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
        GET_TABLEDATA
    } from '../../../vuex/modules/data/classify/classify-edit';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
				sortRequest : false  // 是否允许排序字段远程请求数据
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataClassifyEdit.sortList,
                classify: state => state.dataClassifyEdit.classify,
                name: state => state.dataClassifyEdit.name,
				seq: state => state.dataClassifyEdit.seq,
				desc: state => state.dataClassifyEdit.desc,
                tableCount: state => state.dataClassifyEdit.tableCount,
                tablePage: state => state.dataClassifyEdit.tablePage,
                tableData: state => state.dataClassifyEdit.tableData,
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
                self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
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
				self.$store.dispatch(GET_TABLEDATA);
				self.sortRequest = true;
            });
        }
    }
</script>

<style scoped>

</style>
