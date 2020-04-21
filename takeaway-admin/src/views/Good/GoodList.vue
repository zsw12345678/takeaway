<template>
  <div>
    <good-top :id="id" title="商品列表" @getShop="getShop" />
    <el-table :data="goods" border style="width: 100%; height: 100%">
      <el-table-column prop="_id" label="商品 ID" width="220" fixed="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="icon" label="商品图片" show-overflow-tooltip>
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="height: 3rem" />
        </template>
      </el-table-column>
      <el-table-column prop="menu_id.name" label="所属分类" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="price" label="现价" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.price}}元</span>
        </template>
      </el-table-column>
      <el-table-column prop="oldPrice" label="原价" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.oldPrice}}元</span>
        </template>
      </el-table-column>
      <el-table-column prop="info" label="商品介绍" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editGood(scope.row._id)">编辑</el-button>
          <el-button type="text" size="small" @click='removeGood(scope.row)'>删除</el-button>
        </template>
      </el-table-column>
      <!--<el-pagination background
                     layout="prev, pager, next, sizes, total, jumper"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="pagesize"
                     :total="goods.length"
                     @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
      >
      </el-pagination>-->
    </el-table>
  </div>
</template>

<script>
  import GoodTop from '../../components/GoodTop'

  export default {
    props: {
      id: String
    },

    components: {
      GoodTop
    },

    data () {
      return {
        shopId: '', // 当前店铺 ID
        goods: [] // 商品列表
      }
    },

    created() {
      if (this.id) {
        this.shopId = this.id;
        this.fetchGoods(this.id);
      }

    },

    methods: {
      // 编辑某一项商品
      editGood (goodId) {
        this.$router.push({
          path: '/goods/edit',
          query: {
            shopId: this.shopId,
            goodId: goodId
          }
        })
      },

      // 删除某一项商品
      async removeGood (row) {
        this.$confirm(`确定删除商品 ${row.name} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`rest/goods/${row._id}`);
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // 重新加载商品数据
            this.fetchGoods(this.shopId);
          } else {
            this.$message({
              type: 'success',
              message: '删除失败!'
            });
          }
        })
      },

      // 初始化商品列表
      async fetchGoods (id) {
        const res = await this.$http.get(`goods/${id}`);
        console.log(res);
        if (res.status === 200) {
          this.goods = res.data;
        }
      },

      // 获取当前店铺 ID
      getShop (id) {
        this.shopId = id;
        this.fetchGoods(id);
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>

</style>
