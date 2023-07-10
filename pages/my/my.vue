<script setup>
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		computed,
		ref
	} from "vue";
	import {
		useStore
	} from 'vuex'
	import $H from '/common/request.js'
	const store = useStore()
	const user = ref(store.state.user)

	onShow(() => {
		// 进入页面获取空间大小
		getSize()
	})

	// 计算用户使用百分比
	const percent = computed(() => {
		if (user.value.total_size === 0) {
			return 0
		}
		return (user.value.used_size / user.value.total_size) / 100
	})

	// 获取最新空间大小，dispatch提交给vuex更新数据
	const getSize = () => {
		$H.get('/getSize', {
			token: true
		}).then(res => {
			store.dispatch('updateSize', res)
		})
	}

	// 单位转换
	const byteToSize = (bytes) => {
		if (bytes === 0) return '0 KB'
		let k = 1024,
			size = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k))
		return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + size[i]
	}

	const logout = () => {
		store.dispatch('logout').then(res => {
			uni.showToast({
				title: '退出成功',
				icon: 'none'
			})
		})
	}
</script>

<template>
	<view>
		<view class="p-3 flex align-center">
			<image src="../../static/avatar.jpg" class="rounded-circle shadow-lg mr-3"
				style="width: 120rpx;height: 120rpx;"></image>
			<view class="flex flex-1 flex-column text-muted font">
				<view class="flex align-end">
					<text class="font-md text-dark mr-2">{{ user.nickname || user.username}}</text>
				</view>
				<text class="pr-2">{{ user.desc || '暂无描述...'}}</text>
			</view>
		</view>
		<view class="p-3">
			<progress percent="80" class="mb-2" active stroke-width="5" />
			<view class="flex align-center justify-between font">
				<text class="text-light-muted">总量：{{ byteToSize(user.total_size) }}</text>
				<text class="text-warning">已用：{{ byteToSize(user.used_size) }}</text>
			</view>
		</view>
		<view class="bg-light" style="height: 20rpx;"></view>
		<view class="flex justify-between p-3">
			<text class="text-muted font">设置</text>
			<image src="../../static/arrow-right.png" style="width: 40rpx; height: 40rpx;" mode=""></image>
		</view>
		<view class="bg-main text-white flex align-center justify-center font-md py-1 mx-2 rounded-circle"
			hover-class="bg-main-hover" @click="logout">
			退出登录
		</view>
	</view>
</template>