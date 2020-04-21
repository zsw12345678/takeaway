<template>
  <div>
    <h1 style="margin-bottom: 2rem">{{id? '编辑':'添加'}}管理员</h1>
    <el-form label-width="120px" :model="model" ref="model" :rules="rules" @submit.native.prevent="save">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="model.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!id">
        <el-input v-model="model.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-else>
        <el-input v-model="model.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 2rem;">
        <el-button type="primary" native-type="submit">提交</el-button>
        <el-button @click="resetForm('model')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: String
  },

  data () {
    return {
      model: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          { required: true, message: '管理员账号不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  watch: {
    $route: {
      handler: function(){
        // DOM渲染完成才执行
        this.$nextTick(() => {
          // 重置表单
          this.id ? this.fetch(): this.$refs['model'].resetFields();
        });
      },
      deep: true // 深度观察监听
    }
  },

  created () {
    this.id && this.fetch();
  },

  methods: {
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 刷新编辑管理员
    async fetch () {
      const res = await this.$http.get(`rest/admin_users/${this.id}`);
      this.model = res.data;
    },

    // 提交新建的管理员
    async save () {
      // 先判断是否填写完全
      let {name, password} = this.model;
      name = name.replace(/(^\s*)|(\s*$)/g, "");
      password = name.replace(/(^\s*)|(\s*$)/g, "");
      if (!name) {
        this.$message.error('用户名未填写!');
        return
      } else if (!password){
        this.$message.error('密码未填写!');
        return
      }
      let res;
      if (this.id) {
        // 编辑管理员
        res = await this.$http.put(`rest/admin_users/${this.id}`, this.model);
      } else {
        // 新建管理员
        res = await this.$http.post('rest/admin_users', this.model);
      }
      if (res.status === 200) {
        this.$router.push('/admin_users/list');
        this.$message.success('保存成功!');
      } else {
        this.$message.success('保存失败!');
      }
    }
  }
}
</script>

<style>
</style>
