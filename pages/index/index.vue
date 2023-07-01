<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar>
			<template v-slot:left>
				<text class="font-md ml-3 text-right text-white">首页</text>
			</template>
			<template v-slot:right>
				<view style="width: 60rpx; height: 60rpx;" class="flex align-center justify-center bg-light rounded-circle mr-3">
					<text class="iconfont icon-zengjia"></text>
				</view>
				<view style="width: 60rpx; height: 60rpx;" class="flex align-center justify-center bg-light rounded-circle mr-3">
					<text class="iconfont icon-gengduo"></text>
				</view>
			</template>
		</uni-nav-bar>
		
		<!-- 搜索框 -->
		<view class="px-3 py-2">
			<!-- 父相子绝 -->
			<view class="position-relative">
				<!-- 搜索图标绝对定位到父容器左侧 -->
				<view class="flex align-center justify-center text-light-muted"
					style="height: 70rpx; width: 70rpx; position: absolute; top: 0; left: 0;">
					<text class="iconfont icon-sousuo"></text>
				</view>
				<!-- 输入框左侧留空，放置搜索图标 -->
				<input type="text" style="height: 70rpx; padding-left: 70rpx;"
					class="bg-light font-md rounded-circle" placeholder="搜索文件">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
