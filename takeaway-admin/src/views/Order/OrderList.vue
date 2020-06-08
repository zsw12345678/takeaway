<template>
  <div>
    <headTop></headTop>
    <div class="table_container">
      <el-table :data="items">
        <el-table-column prop="_id" label="订单ID" width="220">
        </el-table-column>
        <el-table-column prop="user_id" label="用户ID" width="220">
        </el-table-column>
        <el-table-column prop="shop_name" label="店铺名称">
        </el-table-column>
        <el-table-column prop="goodStr" label="商品">
        </el-table-column>
        <el-table-column prop="total_price" label="价格">
          <template slot-scope="scope">
            <span>{{scope.row.total_price}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="支付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">已支付</span>
            <span v-else>未支付</span>
          </template>
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
        const res = await this.$http.get('rest/orders');
        this.items = res.data
      },

      remove(row) {
        this.$confirm(`确定删除订单 ${row._id} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`rest/orders/${row._id}`);
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
