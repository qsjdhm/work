<template>
	<div class="data-link-add-page">
		<div class="header">
			当您填写外链信息的时候请尽量填写完整, 以保证访问链接的正常使用.
		</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="外链名称" prop="name">
                <el-input :disabled="isSubmit" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="访问链接" prop="link">
                <el-input :disabled="isSubmit" type="textarea" v-model="ruleForm.link"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    v-if="!isSubmit"
                    @click="submitForm('ruleForm')"
                    type="primary">
                    <i class="fa fa-cloud-upload"></i>
                    新增外链
                </el-button>
                <el-button v-if="isSubmit" type="primary" :loading="true">提交外链中
                </el-button>
                <el-button :disabled="isSubmit" @click="resetForm('ruleForm')">重置数据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../../css/data/link/link-add.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_NAME,
        SET_LINK,
        SET_ISSUBMIT,

        SUBMIT_DATA
    } from '../../../vuex/modules/data/link/link-add';

    export default {
        data: function () {
            return {
                ruleForm: {
                    name: '',
                    link: '',
                },
                rules: {
                    name: [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                    ],
                    link: [
                        { required: true, message: '访问链接不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                name: state => state.dataLinkAdd.name,
                link: state => state.dataLinkAdd.link,
                isSubmit: state => state.dataLinkAdd.isSubmit,
            }),
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
            // 提交数据
            submitForm(formName) {
                let self = this;
                this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        self.$store.commit(SET_NAME, self.ruleForm.name);
                        self.$store.commit(SET_LINK, self.ruleForm.link);

                        // 触发action提交外链内容
                        self.$store.commit(SET_ISSUBMIT, true);
                        self.$store.dispatch(SUBMIT_DATA).then(function(response){
                            // 设置当前from可编辑
                            self.$store.commit(SET_ISSUBMIT, false);
                            if (response.data.success === '1') {
                                self.$message({
                                    message: response.data.msg,
                                    type: 'success'
                                });
                            } else {
                                self.$message.error('添加外链出错');
                            }
                        });
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            // 重置当前数据
            resetForm(formName) {
                this.$store.commit(SET_NAME, '');
                this.ruleForm.name = '';
                this.$store.commit(SET_LINK, '');
                this.ruleForm.link = '';
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

        }
    }
</script>

<style scoped>

</style>
