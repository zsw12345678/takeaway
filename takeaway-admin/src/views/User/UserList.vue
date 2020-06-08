<template>
  <div>
    <headTop></headTop>
    <div class="table_container">
      <el-table :data="items">
        <el-table-column prop="_id" label="用户ID" width="220">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="phone" label="电话号码">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='remove(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import headTop from '../../components/headTop'

  export default {
    components: {
      headTop
    },

    data () {
      return {
        items: []
      }
    },

    created() {
      this.fetch()
    },

    methods: {
      async fetch () {
        const res = await this.$http.get('rest/web_users');
        this.items = res.data
      },

      remove(row) {
        this.$confirm(`确定删除用户 ${row.username} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`rest/web_user/${row._id}`);
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetch();
          } else {
            this.$message({
              type: 'success',
              message: '删除失败!'
            });
          }
        })


      }
    }
  }
</script>

<style lang='less'>
  .table_container {
    padding: 20px;
  }
</style>
