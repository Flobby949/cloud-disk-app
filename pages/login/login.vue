<script setup>
	import {
		ref
	} from "vue";
	import $H from '/common/request.js'
	import store from '/store'
	
	// 登录或注册
	const type = ref("login")

	// 表单
	const form = ref({
		username: 'Flobby',
		password: '123456',
		repassword: ''
	})

	// 切换登录注册
	const changeType = () => {
		type.value = type.value === 'login' ? 'reg' : 'login'
	}

	// 按钮点击事件
	const handleClick = () => {
		let msg = type.value === 'login' ? '登录' : '注册'
		$H.post('/'+type.value, form.value).then(res => {
			uni.showToast({
				title: msg + "成功",
				icon: 'success',
				duration: 1000
			})
			
			if (type.value === 'login') {
				store.dispatch('login', res).then(res => {
					uni.switchTab({
						url: '../index/index'
					})
				})
			} else {
				form.value = {
					username: '',
					password: '',
					repassword: ''
				}
				changeType()
			}
		})
	}
</script>

<template>
	<view class="bg-light" style="height: 100vh;">
		<view style="height: 44px;">

		</view>
		<view class="flex align-center justify-center font-lg text-muted"
			style="motion-path: 100rpx; margin-bottom: 100rpx;">
			网盘
		</view>

		<view class="px-4">
			<input type="text" v-model="form.username" class="uni-input bg-white rounded mb-4 text-muted"
				placeholder="手机号/用户名">
			<input type="password" v-model="form.password" class="uni-input bg-white rounded mb-4 text-muted"
				placeholder="请输入密码">

			<!-- 注册显示确认密码 -->
			<input type="password" v-model="form.repassword" v-if="type === 'reg'"
				class="uni-input bg-white rounded mb-4 text-muted" placeholder="请确认密码">
			<view class="bg-main text-white flex align-center justify-center font-md py-2 rounded-circle"
				hover-class="bg-main-hover" @click="handleClick">
				{{ type === 'login' ? '登 录' : '注 册' }}
			</view>
		</view>
		<view class="flex align-center justify-center pt-5">
			<view class="text-main mx-2 font-sm" @click="changeType">
				{{ type === 'login' ? '去注册' : '去登陆' }}
			</view>
		</view>
	</view>

</template>