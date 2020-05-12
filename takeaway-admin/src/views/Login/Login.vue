<template>
  <div class="logon-container">
    <h1 class="title">迅捷外卖后台管理系统</h1>
    <el-card header="请先登录" class="logon-card">
      <el-form :model="user" ref="user" :rules="rules" @submit.native.prevent="login">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 2rem;">
          <el-button type="primary" native-type="submit">登录</el-button>
          <el-button @click="$refs.user.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        user: {
          username: '',
          password: ''
        },

        rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: ['blur', 'change'] }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: ['blur', 'change'] }
          ]
        }
      }
    },

    methods: {
      async login () {
        const res = await this.$http.post('/login', this.user);
        if (res.status === 200) {
          localStorage.token = res.data.token;
          this.$router.push('/');
          this.$message({
            type: 'success',
            message: '登录成功!'
          });
        }
      }
    }
  }
</script>

<style lang='less'>
  .logon-container {
    width: 100vw;
    height: 100vh;
    background-image: url('./image/bg.jpg');
    background-size: 100vw 100vh;

    .title {
      position: absolute;
      left: 1.5rem;
      top: 1.5rem;
      color: #fff;
    }

    .logon-card {
      width: 25rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .el-form-item__content {
        margin: 0;
      }
    }
  }
</style>
