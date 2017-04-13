<template>
	<div class="data-book-edit-page">
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
                                prop="Book_ID"
                                label="ID"
								sortable="custom"
                                width="80">
                            </el-table-column>
                            <el-table-column
                                prop="Book_Name"
                                label="名称">
								<template scope="scope">
									<a :href="'#/home/data-book-edit/' + scope.row.Book_ID" >{{scope.row.Book_Name}}</a>
								</template>
                            </el-table-column>
                            <el-table-column
                                prop="Sort_Name"
                                label="分类"
								sortable="custom"
								width="160">
                            </el-table-column>
							<el-table-column
								prop="Book_Link"
								label="下载链接"
								width="200">
							</el-table-column>
                            <el-table-column
                                prop="Book_Cover"
                                label="封面"
								align="center"
								width="100">
								<template scope="scope">
									<el-tooltip class="item" effect="dark" content="点击查看封面原图" placement="top">
										<img
											class="book-cover image"
											:src="'http://localhost:8080/work'+scope.row.Book_Cover"
											@click="showAmpCover(scope.row)">
									</el-tooltip>
								</template>
                            </el-table-column>
							<el-table-column
								prop="Download_Num"
								label="下载数"
								sortable="custom"
								class-name="uncomment"
								align="right"
								width="120">
							</el-table-column>
							<el-table-column
								prop="Recommend_Num"
								label="推荐数"
								sortable="custom"
								align="right"
								width="120">
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

		<!-- 显示封面弹框 -->
		<el-dialog :title="'查看《'+selectedBook.Book_Name+'》封面原图'" :close-on-click-modal="false" :close-on-press-escape="false" v-model="coverModel">
			<img
				class="image"
				:style="{width:'180px',height:selectedBook.Book_Height+'px'}"
				:src="'http://localhost:8080/work'+selectedBook.Book_Cover">
		</el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../../css/data/book/book-edit.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_SORTLIST,
        SET_CLASSIFY,
        SET_NAME,
		SET_SEQ,
		SET_DESC,
        SET_TABLEPAGE,

        GET_SORTLIST,
        GET_TABLEDATACOUNT,
        GET_TABLEDATA
    } from '../../../vuex/modules/data/book/book-edit';

    export default {
        data: function () {
            return {
            	coverModel : false,  // 封面弹框
				selectedBook : {},  // 当前图书
                tableHeight : 0, // table的高度
				sortRequest : false  // 是否允许排序字段远程请求数据
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataBookEdit.sortList,
                classify: state => state.dataBookEdit.classify,
                name: state => state.dataBookEdit.name,
				seq: state => state.dataBookEdit.seq,
				desc: state => state.dataBookEdit.desc,
                tableCount: state => state.dataBookEdit.tableCount,
                tablePage: state => state.dataBookEdit.tablePage,
                tableData: state => state.dataBookEdit.tableData,
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
			// 点击图片放大事件
			showAmpCover(row) {
            	console.info(row);
				this.selectedBook = row;
				this.coverModel = true;
			}
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
            // 获取分类列表
            self.$store.dispatch(GET_SORTLIST).then(function (response) {
                // 获取数据总个数
                return self.$store.dispatch(GET_TABLEDATACOUNT);
            }).then(function (response) {
                // 获取数据区间个数
                self.$store.dispatch(GET_TABLEDATA);
                self.sortRequest = true;
            });
        }
    }
</script>

<style scoped>

</style>
