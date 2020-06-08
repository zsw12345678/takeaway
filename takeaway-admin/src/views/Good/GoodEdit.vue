<template>
  <div>
    <headTop></headTop>
    <good-top :id="$route.query.shopId" @getShop="getShop" />
    <div class="table_container">
      <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="商品分类" name="menu">
        <p style="margin: 0 0 20px 5px; font-size: 18px" v-if="menus.length">该店铺共有 {{menus.length}} 个商品分类</p>
        <p v-else-if="this.shopId">该店铺暂无商品分类.....</p>
        <p v-else>选择店铺后显示商品分类</p>
        <el-tag
          v-for="menu in menus"
          :key="menu._id"
          closable
          @close="removeMenu(menu)">
          {{menu.name}}
        </el-tag>
        <br />
        <el-button class="button-new-tag" @click="inputShow=true"><i class="el-icon-plus"></i> 添加商品分类</el-button>
        <el-form :model="newMenu" ref="newMenu" v-show="inputShow" @submit.native.prevent="saveMenu">
          <el-form-item
            label="分类"
            label-width="100px"
            prop="name"
            :rules="[
            { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: ['blur', 'change'] }
            ]">
            <el-input v-model="newMenu.name" style="width: 50%; margin-right: 10px" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 2rem">
            <el-button type="primary" native-type="submit">保存</el-button>
            <el-button @click="resetForm('newMenu')">重置</el-button>
            <el-button @click.prevent="hideInput">删除</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$route.query.goodId? '编辑商品': '添加商品'" name="good">
        <el-row style="margin-top: 15px;">
          <el-col :span="15" :offset="4">
            <el-form :model="good"
                 ref="good"
                 :rules="rules"
                 label-width="120px"
                 :validate-on-rule-change="false"
                 @submit.native.prevent="saveGood">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="good.name" placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <el-form-item label="所属分类" prop="menu">
                <el-select v-model="good.menu_id" multiple placeholder="请选择分类">
                  <el-option
                    v-for="menu in menus"
                    :key="menu._id"
                    :label="menu.name"
                    :value="menu._id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品图片" prop="icon">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="afterUpload">
                  <img v-if="good.icon" :src="good.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="现价" prop="price">
                <el-input v-model.number="good.price" placeholder="请输入商品价格（单位为元）"></el-input>
              </el-form-item>
              <el-form-item label="原价" prop="oldPrice">
                <el-input v-model.number="good.oldPrice" placeholder="请输入商品原价（单位为元）"></el-input>
              </el-form-item>
              <el-form-item label="商品介绍" prop="info">
                <el-input v-model="good.info" type="textarea" placeholder="请输入商品介绍"></el-input>
              </el-form-item>
              <el-form-item style="margin-top: 2rem">
                <el-button type="primary" native-type="submit">保存到店铺商品列表中</el-button>
                <el-button @click="resetForm('good')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    </div>
    </div>
</template>

<script>
  import GoodTop from '../../components/GoodTop'
  import headTop from '../../components/headTop'

  export default {
    components: {
      GoodTop,
      headTop
    },

    data () {
      return {
        activeName: 'menu',
        menus: [  // 分类数组
        ],
        newMenu: {  // 新添分类
          name: '',
          shop_id: ''
        },
        inputShow: false, // 分类输入框显示
        good: {  // 商品信息
          name: '',
          menu_id: [],
          icon: '',
          price: '',
          oldPrice: '',
          info: '',
          shop_id: ''
        },
        shopId: '', // 当前店铺id
        goodId: '', // 当前商品id
        rules: {  // 商品信息检验
          name: [
            { required: true, message: '商品名称不能为空', trigger: ['blur', 'change'] }
          ],
          menu_id: [
            { required: true, message: '商品分类不能为空', trigger: ['blur', 'change'] }
          ],
          icon: [
            { required: true, message: '商品图片不能为空', trigger: ['blur', 'change'] }
          ],
          price: [
            { required: true, message: '商品价格不能为空', trigger: ['blur', 'change'] },
            { type: 'number', message: '商品价格必须为数字值', trigger: ['blur', 'change'] }
          ],
          oldPrice: [
            { type: 'number', message: '商品原价必须为数字值', trigger: ['blur', 'change'] }
          ]
        },
      }
    },

    created () {
      if (this.$route.query.shopId) {
        const {shopId, goodId} = this.$route.query;
        this.shopId = shopId;
        this.goodId = goodId;
        // 显示商品分类数组
        this.showMenus(shopId);
        // 显示商品输入框及值
        this.activeName = 'good';
        this.showGood(goodId);
      }
    },

    methods: {
      // 保存商品
      async saveGood () {
        let res;
        this.good.shop_id = this.shopId;
        if (this.goodId) {
          // 修改商品
          res = await this.$http.put(`rest/goods/${this.goodId}`, this.good);
        } else {
          // 新增商品
          res = await this.$http.post('rest/goods', this.good);
        }
        if (res.status === 200) {
          this.$message.success('保存成功');
          this.$router.push(`/goods/list/${this.shopId}`);
        }
      },

      // 移除分类
      removeMenu (menu) {
        this.$confirm(`确定删除商品分类${menu.name}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            const res = await this.$http.delete(`rest/menus/${menu._id}`);
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.showMenus(this.shopId);
            }
        })
      },

      // 保存分类
      async saveMenu () {
        if (!this.shopId) {
          this.$message.warning('请选择店铺');
          return;
        }
        this.newMenu.shop_id = this.shopId;
        const res = await this.$http.post(`rest/menus`, this.newMenu);
        if (res.status === 200) {
          this.$message.success('保存成功');
          this.showMenus(this.shopId);
        }
      },

      // 加载商品分类列表
      async showMenus (shopId) {
        const res = await this.$http.get(`menus/${shopId}`);
        this.menus = res.data;
        this.hideInput();
      },

      // 加载商品详情
      async showGood (goodId) {
        const res = await this.$http.get(`rest/goods/${goodId}`);
        this.good = res.data;
      },

      // 获取店铺 ID
      getShop (id) {
        this.shopId = id;
        this.showMenus(id);
        if (this.$route.query.shopId !== id) {
          this.resetForm('good');
        }
      },

      // 隐藏商品分类输入框
      hideInput () {
        this.resetForm('newMenu');
        this.inputShow = false;
      },

      // 重置表单
      resetForm (formName) {
        this.$refs[formName].resetFields();
        this.good.menu_id = '';
      },

      // 上传图片成功后执行的方法
      afterUpload (data) {
        if (data) {
          this.good.icon = data.url;
          this.$message.success('上传成功!');
        } else {
          this.$message.error('上传失败，请重新上传!');
        }
      },
    }
  }
</script>

<style lang='less'>
  .table_container {
    padding: 20px;

    .el-tag, .button-new-tag {
      margin-right: 15px;
      margin-bottom: 15px;
      height: 38px;
      line-height: 38px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 15px;
    }

    .button-new-tag {
      margin-top: 5px;
      margin-bottom: 25px;
    }
  }
</style>
