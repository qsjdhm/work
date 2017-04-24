<template>
	<div class="picture-dashboard-page">
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
					</div>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-row class="container-data" :gutter="20">
                <el-col class="container-list" :span="24">
                    <div class="list-data">
                        <el-upload
                            :action="uploadUrl"
                            :on-success="uploadHandle"
                            :show-file-list="false"
                            list-type="picture-card">
                            <i class="el-icon-plus"></i>
                        </el-upload>

                        <el-card
                            v-for="(item, key) in listData"
                            :body-style="{ padding: '0px' }">
                            <img :src="'http://localhost:8080/work/admin/src/assets/ueditor1.6.1/jsp/upload/'+item.Picture_Name" class="image">
                            <div style="padding: 14px;">
                                <span>{{item.Picture_Name}}</span>
                                <div class="bottom clearfix">
                                    <time class="time">{{ item.Picture_Time }}</time>
                                </div>
                            </div>
                        </el-card>

                    </div>
                    <div class="list-page">
                        <el-pagination
                            @current-change="listPageChange"
                            :current-page="listPage"
                            :page-size="20"
                            layout="total, prev, pager, next"
                            :total="listCount">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../css/picture/dashboard.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_SORTLIST,
        SET_CLASSIFY,
        SET_STARTTIME,
        SET_ENDTIME,
        SET_LISTPAGE,

        GET_SORTLIST,
        GET_LISTDATACOUNT,
        GET_LISTDATA
    } from '../../vuex/modules/picture/dashboard';

    export default {
        data: function () {
            return {
                listHeight : 0, // list的高度
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                uploadUrl: state => state.BASE_URL+'/UniversalUploadAction',
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.pictureDashboard.sortList,
                classify: state => state.pictureDashboard.classify,
                startTime: state => state.pictureDashboard.startTime,
                endTime: state => state.pictureDashboard.endTime,
                listCount: state => state.pictureDashboard.listCount,
                listPage: state => state.pictureDashboard.listPage,
                listData: state => state.pictureDashboard.listData,
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
            // 图片上传切换
            uploadHandle(response, file, fileList) {
                console.info(1111111111111111);
                console.info(response);
                console.info(file);
                console.info(file);
//                this.ruleForm.coverList = [];
//                this.ruleForm.coverList.push(file);
//                this.$store.commit(SET_COVER, file.response);
            },
            // 根据条件查询数据
            searchData(event) {
                let self = this;
                self.$store.dispatch(GET_LISTDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_LISTDATA);
                });
            },
            // 重置条件
            resetFilter(event) {
                this.$store.commit(SET_CLASSIFY, '1');
                this.$store.commit(SET_STARTTIME, '');
                this.$store.commit(SET_ENDTIME, '');
                let self = this;
                self.$store.dispatch(GET_LISTDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_LISTDATA);
                });
            },
            // 翻页事件
            listPageChange(val) {
                this.$store.commit(SET_LISTPAGE, val);
                // 重新获取当前页的list表数据
                this.$store.dispatch(GET_LISTDATA);
            },
            // 格式化处理表格的时间数据格式
            formatterListTime(row, column) {
                return row.Article_Date.split(' ')[0];
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
            // 设置list高度
            this.listHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
            this.$store.dispatch(GET_LISTDATA);
        }
    }
</script>

<style scoped>

</style>
