<template>
  <div>
    <headTop></headTop>
    <div class="table_container">
      <el-table :data="items" border style="width: 100%; height: 100%">
        <el-table-column prop="_id" label="店铺 ID" width="220" fixed="left"  show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" label="店铺名称" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="avatar" label="店铺头像" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <img :src="scope.row.avatar" style="height: 3rem" />
          </template>
        </el-table-column>
        <el-table-column prop="categories" label="所属分类" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="category in scope.row.categories" :key="category._id">{{category.name}}<br /></span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryMode" label="配送方式" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryTime" label="配送时长" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.deliveryTime}}分钟</span>
          </template>
        </el-table-column>
        <el-table-column prop="minPrice" label="起送价" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.minPrice}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryPrice" label="配送价" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.deliveryPrice}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="bulletin" label="店铺公告" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.bulletin? scope.row.bulletin: '/'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系号码" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="店铺地址" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="openTime" label="营业时间" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.openTime[0]}} - {{scope.row.openTime[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push(`/shops/edit/${scope.row._id}`)">编辑</el-button>
            <el-button type="text" size="small" @click='remove(scope.row)'>删除</el-button>
            <el-button type="text" size="small" @click="$router.push(`/goods/list/${scope.row._id}`)">查看商品</el-button>
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
        const res = await this.$http.get('rest/shops');
        this.items = res.data;
      },

      remove(row) {
        this.$confirm(`确定删除店铺 ${row.name} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`rest/shops/${row._id}`);
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

<style lang="less">
  .table_container {
    padding: 20px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-table-column {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .cell {
    text-align: center;
  }
  .el-tooltip__popper {
    max-width: 40vw;
  }
  .el-form-item__content {
    margin: 0 100px;
  }
</style>
