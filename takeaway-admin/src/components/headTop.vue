<template>
    <div class="header_container">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/1' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
			</el-breadcrumb>
			<el-dropdown menu-align='start'>
				<i class="el-icon-setting" style="margin-right: 4rem; font-size: 1.3rem"></i>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="toHome">首页</el-dropdown-item>
					<el-dropdown-item @click.native="signout">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
    </div>
</template>

<script>
	export default {
		methods: {
			toHome () {
				this.$router.push('/1');
			},

			signout () {
				this.$confirm(`确定退出吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					window.localStorage.clear()
					this.$message({
						type: 'success',
						message: '退出成功!'
					})
					this.$router.push('/login')
				})
			}
		}
	}
</script>

<style>
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		width: 36px;
		height: 36px ;
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
		text-align: center;
	}
</style>
