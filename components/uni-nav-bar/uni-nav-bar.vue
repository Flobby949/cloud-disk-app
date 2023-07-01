<template>
	<view>
		<view class="fixed-top bg-main">
			<!-- 引入状态栏组件 -->
			<uni-status-bar></uni-status-bar>
			<!-- 自定义导航栏分三部分，flex布局，每个占一份 -->
			<view class="flex border-bottom align-center" style="height: 44px;">
				<view class="flex-1 flex">
					<!-- 具名插槽 -->
					<slot name="left"></slot>
				</view>
				<view class="flex flex-1 justify-center">
					<!-- 默认插槽 -->
					<slot />
				</view>
				<view class="flex-1 flex justify-end">
					<!-- 具名插槽 -->
					<slot name="right"></slot>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view>
			<uni-status-bar></uni-status-bar>
			<view style="height: 44px;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "uni-nav-bar",
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>