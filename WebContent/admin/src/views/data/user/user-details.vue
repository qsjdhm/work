<template>
    <div class="data-user-details-page">
        <div class="header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home/data-dashboard' }">功能地图</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/home/data-user-edit' }">用户列表</el-breadcrumb-item>
                <el-breadcrumb-item>ID : {{id}} - 名称 :  {{name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名称" prop="name">
                    <el-input :disabled="isSubmit" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" >
					<el-input :disabled="isSubmit" v-model="ruleForm.password"></el-input>
                </el-form-item>
				<el-form-item label="用户邮箱" prop="email">
					<el-input :disabled="isSubmit" v-model="ruleForm.email"></el-input>
				</el-form-item>
                <el-form-item>
                    <el-button
                        v-if="!isSubmit"
                        @click="submitForm('ruleForm')"
                        type="primary">
                        <i class="fa fa-cloud-upload"></i>
                        修改用户
                    </el-button>
                    <el-button v-if="isSubmit" type="primary" :loading="true">修改用户中
                    </el-button>
                    <el-button :disabled="isSubmit" @click="resetForm('ruleForm')">重置数据</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import '../../../css/data/user/user-details.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_ID,
        SET_NAME,
        SET_PASSWORD,
		SET_EMAIL,
        SET_ISSUBMIT,

        GET_USER,
        SUBMIT_DATA
    } from '../../../vuex/modules/data/user/user-details';


    export default {
        data: function () {
            return {
                ruleForm: {
                    name: '',
					password: '',
                    email: '',
                },
                rules: {
                    name: [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                id: state => state.dataUserDetails.id,
                name: state => state.dataUserDetails.name,
				password: state => state.dataUserDetails.password,
                email: state => state.dataUserDetails.email,
                isSubmit: state => state.dataUserDetails.isSubmit,
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
						self.$store.commit(SET_PASSWORD, self.ruleForm.password);
                        self.$store.commit(SET_EMAIL, self.ruleForm.email);

                        // 触发action提交用户内容
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
                                self.$message.error('修改用户出错');
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
				this.$store.commit(SET_PASSWORD, '');
				this.ruleForm.password = '';
                this.$store.commit(SET_EMAIL, '');
                this.ruleForm.email = '';
            },
        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let params = this.$route.params;
            let path = this.$route.path;
            // 如果是详情页
            if (params.detailsId) {
                path = path.split('/'+params.detailsId)[0];
            }
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
            let self = this;
            // 获取外链信息
			self.$store.commit(SET_ID, self.$route.params.detailsId);
			self.$store.dispatch(GET_USER).then(function () {
				self.ruleForm.name = self.name;
				self.ruleForm.email = self.email;
            });
        }
    }
</script>

<style scoped>

</style>
