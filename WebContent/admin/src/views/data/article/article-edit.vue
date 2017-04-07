<template>
	<div class="data-article-edit-page">
        <div class="header">
            <el-row :gutter="20">
                <el-col class="header-title" :span="24">
                    <el-select class="filter-sort" v-model="classifyValue" placeholder="请选择">
                        <el-option
                            v-for="(item, key) in sortList"
                            :label="item.label"
                            :value="item.value"
                            :key="key">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        class="filter-time"
                        v-model="startTimeValue"
                        type="month"
                        placeholder="起始日期">
                    </el-date-picker>
                    <span> - </span>
                    <el-date-picker
                        class="filter-time"
                        v-model="endTimeValue"
                        type="month"
                        placeholder="至今">
                    </el-date-picker>
                    <el-button type="primary" @click="searchData">
                        <i class="fa fa-search"></i>
                        查询
                    </el-button>
                    <el-button @click="resetFilter">重置条件</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-row class="container-data" :gutter="20">
                <el-col class="container-table" :span="24">
                    <div class="table-data">
                        <el-table
                            :data="tableData"
                            :height="tableHeight+145"
                            style="width: 100%">
                            <el-table-column
                                prop="Article_ID"
                                label="ID"
                                width="65">
                            </el-table-column>
                            <el-table-column
                                prop="Article_Title"
                                label="名称">
                            </el-table-column>
                            <el-table-column
                                prop="Sort_Name"
                                label="分类">
                            </el-table-column>
                            <el-table-column
                                prop="Article_Tag"
                                label="标签">
                                <template scope="scope">
                                    <el-tag
                                        v-if="scope.row.Article_Tag!=''"
                                        v-for="(item, key) in scope.row.Article_Tag.split(',')"
                                        :key="key"
                                        type="primary">
                                        {{ item }}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="Read_Num"
                                label="点击"
                                width="90">
                            </el-table-column>
                            <el-table-column
                                prop="Recommend_Num"
                                label="推荐"
                                width="90">
                            </el-table-column>
                            <el-table-column
                                prop="Article_Date"
                                label="时间">
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

    import '../../../css/data/article/article-edit.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_SORTLIST,
        SET_CLASSIFY,
        SET_STARTTIME,
        SET_ENDTIME,
        SET_TABLEPAGE,

        GET_SORTLIST,
        GET_TABLEDATACOUNT,
        GET_TABLEDATA
    } from '../../../vuex/modules/data/article/article-edit';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataArticleEdit.sortList,
                classify: state => state.dataArticleEdit.classify,
                startTime: state => state.dataArticleEdit.startTime,
                endTime: state => state.dataArticleEdit.endTime,
                tableCount: state => state.dataArticleEdit.tableCount,
                tablePage: state => state.dataArticleEdit.tablePage,
                tableData: state => state.dataArticleEdit.tableData,
            }),
            // 分类切换事件
            classifyValue: {
                get: function () { return this.classify; },
                set: function (newClassify) {
                    this.$store.commit(SET_CLASSIFY, newClassify);
                }
            },
            // 时间区间切换事件
            startTimeValue: {
                get: function () { return this.startTime; },
                set: function (newTime) {
                    const self = this;
                    if (newTime === '') {
                        self.$store.commit(SET_STARTTIME, '');
                    } else {
                        let year = newTime.getFullYear();
                        let month = newTime.getMonth()+1;
                        if (month < 10) {
                            month = '0'+month;
                        }
                        self.$store.commit(SET_STARTTIME, year+'-'+month);
                    }
                }
            },
            endTimeValue: {
                get: function () { return this.endTime; },
                set: function (newTime) {
                    const self = this;
                    if (newTime === '') {
                        self.$store.commit(SET_ENDTIME, '');
                    } else {
                        let year = newTime.getFullYear();
                        let month = newTime.getMonth() + 1;
                        if (month < 10) {
                            month = '0' + month;
                        }
                        self.$store.commit(SET_ENDTIME, year + '-' + month);
                    }
                }
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
                this.$store.commit(SET_STARTTIME, '');
                this.$store.commit(SET_ENDTIME, '');
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
            });
        }
    }
</script>

<style scoped>

</style>
