<template>
  <el-form class="goodTop">
    <el-form-item label="选择店铺" style="margin: 0">
      <el-select
        v-model="shopId"
        @change="handleShop"
        filterable
        clearable
        placeholder="请选择或输入店铺名称">
        <el-option
          v-for="shop in shops"
          :key="shop._id"
          :label="shop.name"
          :value="shop._id">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      id: String,
      title: String
    },

    data () {
      return {
        titleName: '',
        shopId: '',
        shops: []
      }
    },

    async created () {
      // 编辑标题
      if (this.title) {
        this.titleName = this.title;
      } else {
        this.titleName = this.id? '编辑商品': '添加商品';
      }

      // 加载店铺列表
      this.fetchShops();

      // 选择该 id 的店铺
      if (this.id) {
        this.shopId = this.id
      }
    },

    methods: {
      // 加载店铺列表
      async fetchShops () {
        const res = await this.$http.get(`rest/shops`);
        this.shops = res.data;
      },

      // 选择店铺后触发事件
      handleShop () {
        this.$emit('getShop', this.shopId)
      }
    }
  }
</script>

<style lang='less'>
  .goodTop {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 1rem;

    .el-form-item__content {
      margin-right: 20px;
    }
    .el-form-item__label {
      width: 90px;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
