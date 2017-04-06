<template>
	<div class="data-article-add-page">
        <el-select class="classify" v-model="classifyValue" placeholder="请选择">
            <el-option
                v-for="(item, key) in sortList"
                :label="item.label"
                :value="item.value"
                :key="key">
            </el-option>
        </el-select>
        <el-input class="name" v-model="name" placeholder="请输入文章标题"></el-input>
        <script id="content" name="content" type="text/plain"></script>
        <el-select
            v-model="selectedTag"
            multiple
            placeholder="请选择文章标签">
            <el-option
                v-for="(item, key) in tagList"
                :label="item.label"
                :value="item.value"
                :key="key">
            </el-option>
        </el-select>
        <el-button @click="submitData" type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
</template>

<script type="text/ecmascript-6">
    // 富文本
    import '../../../assets/ueditor1.6.1/ueditor.config';
    import '../../../assets/ueditor1.6.1/ueditor.all.min';
    import '../../../assets/ueditor1.6.1/ueditor.parse';
    import '../../../assets/ueditor1.6.1/lang/zh-cn/zh-cn';
    import '../../../assets/ueditor1.6.1/themes/default/css/ueditor.css';

    import '../../../css/data/article/article-add.less';

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
        SET_TAGLIST,
        SET_TAG,

        GET_SORTLIST,
        GET_TAGLIST,

        SUBMIT_DATA
    } from '../../../vuex/modules/data/article/article-add';

    export default {
        data: function () {
            return {
                editor : null,
                selectedTag : []
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataArticleAdd.sortList,
                classify: state => state.dataArticleAdd.classify,
                name: state => state.dataArticleAdd.name,
                tagList: state => state.dataArticleAdd.tagList,
                tag: state => state.dataArticleAdd.tag
            }),
            // 分类切换
            classifyValue: {
                get: function () { return this.classify; },
                set: function (newClassify) {
                    this.$store.commit(SET_CLASSIFY, newClassify);
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
            // 添加文章
            submitData: function (event) {
                this.$store.commit(SET_TAG, this.selectedTag);
                this.$store.dispatch(SUBMIT_DATA);

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
            // 初始化富文本组件
            this.editor = new UE.ui.Editor({
                initialContent: "",  // 初始化时显示的内容
                focus: false,  // 是否聚焦
                initialFrameWidth: 820,  // 设置宽度
                initialFrameHeight: 400,  // 设置宽度
                autoClearinitialContent: true,  // focus时自动清空初始化时的内容
                autoHeightEnabled: false
            });
            this.editor.render("content");


            // 获取分类列表
            let self = this;
            self.$store.dispatch(GET_SORTLIST).then(function(response){
                self.$store.dispatch(GET_TAGLIST);
            });
        }
    }
</script>

<style scoped>

</style>
