<template>
	<div class="data-cog-admin-page">
		<div class="header">
			当您填写管理员信息的时候请尽量填写完整, 以保证管理员的正常使用.
		</div>
        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                <el-form-item label="头像">
                    <img
                        class="admin-avatar image"
                        :src="'http://localhost:8080'+avatar"
                        @click="showAmpCover(scope.row)">
                    <el-upload
                        class="upload-demo"
                        :action="uploadUrl"
                        :multiple="false"
                        :on-success="uploadHandle"
                        :file-list="ruleForm.avatarList"
                        list-type="picture">
                        <el-button :disabled="isSubmit" size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input :disabled="isSubmit" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input :disabled="isSubmit" type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input :disabled="isSubmit" v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        v-if="!isSubmit"
                        @click="submitForm('ruleForm')"
                        type="primary">
                        <i class="fa fa-cloud-upload"></i>
                        修改信息
                    </el-button>
                    <el-button v-if="isSubmit" type="primary" :loading="true">修改信息中
                    </el-button>
                    <el-button :disabled="isSubmit" @click="resetForm('ruleForm')">重置数据</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../css/cog/cog-admin.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_ID,
        SET_AVATAR,
        SET_NAME,
        SET_PASSWORD,
        SET_EMAIL,
        SET_ISSUBMIT,

        GET_USER,
        SUBMIT_DATA
    } from '../../vuex/modules/cog/cog-admin';

    export default {
        data: function () {
            return {
                ruleForm: {
                    name: '',
                    password: '',
                    email: '',
                    avatarList: [],
                },
                rules: {
                    name: [
                        { required: true, message: '昵称不能为空', trigger: 'blur' },
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
                uploadUrl: state => state.BASE_URL+'/UniversalUploadAction',
                topActiveMenu: state => state.fremework.topActiveMenu,

                id: state => state.cogAdmin.id,
                avatar: state => state.cogAdmin.avatar,
                password: state => state.cogAdmin.password,
                name: state => state.cogAdmin.name,
                email: state => state.cogAdmin.email,
                isSubmit: state => state.cogAdmin.isSubmit,
            }),
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
            // 图片上传切换
            uploadHandle(res, file) {
                this.ruleForm.avatarList = [];
                this.ruleForm.avatarList.push(file);
                this.$store.commit(SET_AVATAR, file.response);
            },
            // 提交数据
            submitForm(formName) {
                let self = this;
                this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        self.$store.commit(SET_NAME, self.ruleForm.name);
                        self.$store.commit(SET_PASSWORD, self.ruleForm.password);
                        self.$store.commit(SET_EMAIL, self.ruleForm.email);

                        // 触发action提交管理员内容
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
                                self.$message.error('修改管理员信息出错');
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
            // 从缓存中取出用户信息
            let self = this;
            let id = JSON.parse(localStorage["workUser"]).id;
            this.$store.commit(SET_ID, id);

            // 获取管理员信息
            this.$store.dispatch(GET_USER).then(function () {
                self.ruleForm.name = self.name;
                self.ruleForm.email = self.email;
            });

        }
    }
</script>

<style scoped>

</style>
