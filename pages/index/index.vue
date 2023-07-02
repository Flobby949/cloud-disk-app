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
	
	const handleCheckAll = (checked) => {
		list.value.forEach(item => {
			item.checked = checked
		})
	}
	
	// 操作菜单
	const actions = computed(() => {
		// 超过一个，批量删除和下载
		if (checkedList.value.length > 1) {
			return [
				{
					icon: "icon-xiazai",
					name: "下载"
				},
				{
					icon: "icon-shanchu",
					name: "删除"
				}
			]
		} else {
			return [
				{
					icon: "icon-xiazai",
					name: "下载"
				},
				{
					icon: "icon-fenxiang-1",
					name: "分享"
				},
				{
					icon: "icon-xiazai",
					name: "下载"
				},
				{
					icon: "icon-chongmingming",
					name: "重命名"
				}
			]
		}
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
				<text class="font-md ml-3 text-light" @click="handleCheckAll(false)">取消</text>
			</template>
			<text class="font-md text-light font-weight-bold">已选中 {{ checkedList.length }} 个</text>
			<template #right>
				<text class="font-md mr-3 text-light" @click="handleCheckAll(true)">全选</text>
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
	
		<f-list v-for="(item, index) in list" :key="index" :item="item" :index="index" @my-select="handleSelect(index)" />
		
		<!-- 底部操作条 -->
		<!-- 选中元素才显示操作条 -->
		<view v-if="checkedList.length > 0">
			<!-- 设置操作条容器样式，固定顶部，flex布局，垂直拉升 -->
			<view class="flex align-stretch bg-main text-white fixed-bottom" style="height: 115rpx;">
				<!-- 根据操作菜单个数等分容器，:hover-class实现点击变色 -->
				<view class="flex-1 flex flex-column align-center justify-center"
					style="line-height: 1.5;"
					v-for="(item, index) in actions"
					:key="index"
					hover-class="bg-hover-primary"
					>
					<text class="iconfont" :class="item.icon"></text>
					{{ item.name }}
				</view>
			</view>
		</view>
	</view>
</template>