<script setup>
import { computed, ref } from "vue";
	const list = ref([
		{
			type: 'dir',
			name: '我的笔记',
			create_time: '2023-07-01 20:26',
			checked: true
		},
		{
			type: 'image',
			name: '风景.jpg',
			create_time: '2023-07-01 21:26',
			checked: true
		},
		{
			type: 'video',
			name: 'uniapp实战教程.mp4',
			create_time: '2023-07-01 19:26',
			checked: true
		},
		{
			type: 'text',
			name: '记事本.txt',
			create_time: '2023-07-02 20:26',
			checked: false
		},
		{
			type: 'none',
			name: '压缩包.rar',
			create_time: '2023-07-02 22:26',
			checked: false
		}
	])
	
	const handleSelect = (index) => {
		list.value[index].checked = !list.value[index].checked
	}
	
	const checkedList = computed(() => {
		return list.value.filter(item => item.checked)
	})
</script>
	
<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar v-if="checkedList.length === 0">
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
		
		<uni-nav-bar v-else>
			<template #left>
				<text class="font-md ml-3 text-light">取消</text>
			</template>
			<text class="font-md text-light font-weight-bold">已选中 {{ checkedList.length }} 个</text>
			<template #right>
				<text class="font-md mr-3 text-light">全选</text>
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
	
		<f-list v-for="(item, index) in list" :key="index" :item="item" :index="index" @my-select="handleSelect(index)">
			
		</f-list>
	</view>
</template>