<template>
	<div class="data-book-add-page">
		<div class="header">
			当您填写图书信息的时候请尽量填写完整, 以保证封面、下载链接的正常使用.
		</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="所属分类">
                <el-select class="filter-sort" :disabled="isSubmit" v-model="ruleForm.sort" placeholder="请选择">
                    <el-option
                        v-for="(item, key) in ruleForm.list"
                        :label="item.label"
                        :value="item.value"
                        :key="key">
                    </el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="图书封面" prop="coverList">
				<el-upload
						class="upload-demo"
						:action="uploadUrl"
						:multiple="false"
						:on-success="uploadHandle"
						:file-list="ruleForm.coverList"
						list-type="picture">
					<el-button :disabled="isSubmit" size="small" type="primary">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form-item>
            <el-form-item label="图书名称" prop="name">
                <el-input :disabled="isSubmit" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="图书高度" prop="height">
                <el-input :disabled="isSubmit" v-model="ruleForm.height" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="下载链接" prop="link">
                <el-input :disabled="isSubmit" type="textarea" v-model="ruleForm.link"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    v-if="!isSubmit"
                    @click="submitForm('ruleForm')"
                    type="primary">
                    <i class="fa fa-cloud-upload"></i>
                    新增图书
                </el-button>
                <el-button v-if="isSubmit" type="primary" :loading="true">提交图书中
                </el-button>
                <el-button :disabled="isSubmit" @click="resetForm('ruleForm')">重置数据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../../css/data/book/book-add.less';

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
        SET_HEIGHT,
        SET_COVER,
        SET_LINK,
        SET_ISSUBMIT,

        GET_SORTLIST,
        SUBMIT_DATA
    } from '../../../vuex/modules/data/book/book-add';

    export default {
        data: function () {
            return {
                ruleForm: {
                    list: [],
                    sort: '',
                    name: '',
                    height: '',
                    link: '',
                    coverList: [],
                },
                rules: {
                    name: [
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                    ],
                    height: [
                        { required: true, message: '高度不能为空', trigger: 'blur' },
                    ],
                    link: [
                        { required: true, message: '下载链接不能为空', trigger: 'blur' },
                    ],
                    coverList: [
                        { type: 'array', required: true, message: '图书封面不能为空', trigger: 'blur' },
                    ],
                }
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                uploadUrl: state => state.BASE_URL+'/UniversalUploadAction',
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataBookAdd.sortList,
                classify: state => state.dataBookAdd.classify,
                name: state => state.dataBookAdd.name,
                height: state => state.dataBookAdd.height,
                cover: state => state.dataBookAdd.cover,
                link: state => state.dataBookAdd.link,
                isSubmit: state => state.dataBookAdd.isSubmit,
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
                this.ruleForm.coverList = [];
                this.ruleForm.coverList.push(file);
                this.$store.commit(SET_COVER, file.response);
            },
            // 提交数据
            submitForm(formName) {
                let self = this;
                this.$refs[formName].validate(function (valid) {
                    if (valid) {
                        self.$store.commit(SET_CLASSIFY, self.ruleForm.sort);
                        self.$store.commit(SET_NAME, self.ruleForm.name);
                        self.$store.commit(SET_HEIGHT, self.ruleForm.height);
                        self.$store.commit(SET_LINK, self.ruleForm.link);

                        // 触发action提交图书内容
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
                                self.$message.error('添加图书出错');
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
                this.$store.commit(SET_CLASSIFY, this.sortList[0].value);
                this.ruleForm.sort = this.sortList[0].value;
                this.$store.commit(SET_NAME, '');
                this.ruleForm.name = '';
                this.$store.commit(SET_HEIGHT, '');
                this.ruleForm.height = '';
                this.$store.commit(SET_COVER, '');
                this.ruleForm.coverList = [];
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
            let self = this;
            // 获取分类列表
            this.$store.dispatch(GET_SORTLIST).then(function () {
                self.ruleForm.list = self.sortList;
                self.ruleForm.sort = self.classify;
            });
        }
    }
</script>

<style scoped>

</style>
