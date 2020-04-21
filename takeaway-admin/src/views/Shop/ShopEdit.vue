<template>
  <div>
    <h1 >{{id? '编辑':'添加'}}店铺</h1>
    <br>
    <el-tabs type="border-card">
      <el-tab-pane label="店铺信息">
        <el-form label-width="120px"
                 :validate-on-rule-change="false"
                 :model="shop"
                 ref="shop"
                 :rules="rules"
                 @submit.native.prevent="saveShop">
          <el-form-item label="名称" prop="name">
            <el-input v-model="shop.name" placeholder="请输入店铺名称"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :on-success="afterUpload">
              <img v-if="shop.avatar" :src="shop.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="分类" prop="categories">
            <el-select v-model="shop.categories" multiple placeholder="请选择店铺分类">
              <el-option
                v-for="item in allCategories"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系号码" prop="phone">
            <el-input v-model="shop.phone" maxLength="11" placeholder="请输入联系号码"></el-input>
          </el-form-item>
          <el-form-item label="店铺地址" prop="address">
            <el-input v-model="shop.address" placeholder="请输入店铺地址"></el-input>
          </el-form-item>
          <el-form-item label="营业时间" prop="openTime">
            <el-time-picker
              is-range
              v-model="shop.openTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="HH:mm"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="配送方式" prop="deliveryMode">
            <el-input v-model="shop.deliveryMode" placeholder="请输入配送方式"></el-input>
          </el-form-item>
          <el-form-item label="配送时长" prop="deliveryTime">
            <el-input v-model.number="shop.deliveryTime" placeholder="请输入配送时长（单位为分钟）"></el-input>
          </el-form-item>
          <el-form-item label="起送价" prop="minPrice">
            <el-input v-model.number="shop.minPrice" placeholder="请输入起送价（单位为元）"></el-input>
          </el-form-item>
          <el-form-item label="配送价" prop="deliveryPrice">
            <el-input v-model.number="shop.deliveryPrice" placeholder="请输入配送价 （单位为元）"></el-input>
          </el-form-item>
          <el-form-item label="公告" prop="bulletin">
            <el-input v-model="shop.bulletin" type="textarea" placeholder="请店铺公告"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 2rem">
            <el-button type="primary" native-type="submit">保存</el-button>
            <el-button @click="resetForm('shop')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    id: String
  },

  data () {
    return {
      shop: {
        name: '',
        avatar: '',
        categories: [],
        deliveryMode: '迅捷专送',
        minPrice: 0,
        deliveryPrice: 0,
        deliveryTime: '',
        bulletin: '',
        phone: '',
        address: '',
        openTime: ''
      },
      rules: {
        name: [
          { required: true, message: '店铺名称不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        avatar: [
          { required: true, message: '店铺头像不能为空', trigger: ['blur', 'change'] }
        ],
        categories: [
          { required: true, message: '店铺分类不能为空', trigger: ['blur', 'change'] }
        ],
        phone: [
          {required: true, message: '联系号码不能为空', trigger: ['blur', 'change'] },
          {pattern: /^1[3456789]\d{9}$/, message: '联系号码格式不正确', trigger: ['blur', 'change'] }
        ],
        address: [
          {required: true, message: '店铺地址不能为空', trigger: ['blur', 'change'] }
        ],
        openTime: [
          {required: true, message: '营业时间不能为空', trigger: ['blur', 'change'] }
        ],
        deliveryMode: [
          { required: true, message: '配送方式不能为空', trigger: ['blur', 'change'] }
        ],
        deliveryTime: [
          { required: true, message: '配送时长不能为空', trigger: ['blur', 'change'] },
          { type: 'number', message: '配送时长必须为数字值', trigger: ['blur', 'change']}
        ],
        minPrice: [
          { type: 'number', message: '起送价必须为数字值', trigger: ['blur', 'change'] }
        ],
        deliveryPrice: [
          { type: 'number', message: '配送价必须为数字值', trigger: ['blur', 'change'] }
        ],
        bulletin: [
          { trigger: ['blur'] }
        ]
      },
      allCategories: []
    }
  },

  watch: {
    $route: {
      handler: function(){
        // DOM渲染完成才执行
        this.$nextTick(() => {
          // 重置表单
          this.id ? this.fetch(): this.$refs['shop'].resetFields();
        });
      },
      deep: true // 深度观察监听
    }
  },

  created () {
    this.id && this.fetchShop();
    this.fetchCategories();
  },

  methods: {
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },

    // 上传图片成功后执行的方法
    afterUpload (data) {
      if (data) {
        this.shop.avatar = data.url;
        this.$message.success('上传成功!');
      } else {
        this.$message.error('上传失败，请重新上传!');
      }
    },

    // 刷新编辑店铺分类数据
    async fetchCategories () {
      const res = await this.$http.get(`rest/categories`);
      this.allCategories = res.data;
    },

    // 刷新编辑店铺
    async fetchShop () {
      const res = await this.$http.get(`rest/shops/${this.id}`);
      // 合并原有的值和请求到的值，防止报错
      this.shop = Object.assign({}, this.shop, res.data)
    },

    // 提交店铺信息
    async saveShop () {
      // 先判断是否填写完全
      let {name, avatar} = this.shop;
      name = name.replace(/(^\s*)|(\s*$)/g, "");
      if (!name) {
        this.$message.error('店铺名称未填写!');
        return
      } else if (!avatar) {
        this.$message.error('店铺头像未上传!');
        return
      }
      let res;
      if (this.id) {
        // 编辑店铺
        res = await this.$http.put(`rest/shops/${this.id}`, this.shop);
      } else {
        // 新建店铺
        res = await this.$http.post('rest/shops', this.shop);
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
