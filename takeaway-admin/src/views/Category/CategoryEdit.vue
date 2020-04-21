<template>
  <div>
    <h1 style="margin-bottom: 2rem">{{id? '编辑':'新建'}}分类</h1>
    <el-form label-width="120px" :model="model" ref="model" :rules="rules" @submit.native.prevent="save">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="model.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop="parent">
        <el-select v-model="model.parent" placeholder="请选择分类">
          <el-option
            v-for="item in parents"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
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
        parent: ''
      },
      rules: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: ['blur', 'change'] }
        ],
        parent: [
          { trigger: 'change' }
        ]
      },
      parents: []
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
    this.fetchParents();
    this.id && this.fetch();
    console.log(this.path)
  },

  methods: {
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 刷新编辑分类
    async fetch () {
      const res = await this.$http.get(`rest/categories/${this.id}`);
      this.model = res.data;
    },

    // 获取父级分类列表
    async fetchParents () {
      const res = await this.$http.get('rest/categories');
      this.parents = res.data;
    },

    // 提交新建的分类
    async save () {
      // 先判断是否填写完全
      let {name} = this.model;
      name = name.replace(/(^\s*)|(\s*$)/g, "");
      if (!name) {
        this.$message.error('分类名称未填写!');
        return
      }
      let res;
      if (this.id) {
        // 编辑分类
        res = await this.$http.put(`rest/categories/${this.id}`, this.model);
      } else {
        // 新建分类
        res = await this.$http.post('rest/categories', this.model);
      }
      if (res.status === 200) {
        this.$router.push('/shops/list');
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
