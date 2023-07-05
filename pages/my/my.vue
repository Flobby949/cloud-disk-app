<script setup>
	const logout = () => {
		uni.navigateTo({
			url: '../login/login'
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
					<text class="font-md text-dark mr-2">Flobby</text>
				</view>
				<text class="pr-2">软件工程师</text>
			</view>
		</view>
		<view class="p-3">
			<progress percent="80" class="mb-2" active stroke-width="5" />
			<view class="flex align-center justify-between font">
				<text class="text-light-muted">总量：100GB</text>
				<text class="text-warning">已用：80GB</text>
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