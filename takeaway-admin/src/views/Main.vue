<template>
  <el-container style="height: 100vh;">
    <el-row style="height: 100%; width: 100%">
      <el-col :span="4"  style="min-height: 100%; background-color: rgb(238, 241, 246)">
        <el-menu router :default-active="$route.path" unique-opened>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-s-shop"></i>店铺管理</template>
            <el-menu-item-group>
              <template slot="title">分类</template>
              <el-menu-item index="/categories/create">新建分类</el-menu-item>
              <el-menu-item index="/categories/list">分类列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">店铺</template>
              <el-menu-item index="/shops/create">添加店铺</el-menu-item>
              <el-menu-item index="/shops/list">店铺列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">商品</template>
              <el-menu-item index="/goods/create">添加商品</el-menu-item>
              <el-menu-item index="/goods/list">商品列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-cooperation"></i>权限管理</template>
            <el-menu-item-group>
              <template slot="title">管理员</template>
              <el-menu-item index="/admin_users/create">添加管理员</el-menu-item>
              <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-menu"></i>用户数据</template>
            <el-menu-item-group>
              <template slot="title">数据</template>
              <el-menu-item index="/user_list">用户列表</el-menu-item>
              <el-menu-item index="/order_list">订单列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
      </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <router-view></router-view>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  };
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 7rem;
    height: 7rem;
    line-height: 7rem;
    text-align: center;
  }
  .avatar {
    width: 7rem;
    height: 7rem;
    display: block;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .el-form-item__content {
    margin: 0 100px;
  }
</style>
