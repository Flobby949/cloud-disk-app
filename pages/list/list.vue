<script setup>
	import {
		computed,
		ref
	} from "vue";
	const tabIndex = ref(0)
	const tabBars = ref([{
			name: '下载列表'
		},
		{
			name: '上传列表'
		}
	])
	const changeTab = (index) => {
		tabIndex.value = index
	}
	
	const list = ref([
		{
			type: 'image',
			name: '风景.jpg',
			create_time: '2023-07-01 21:26',
			url: "https://i2.100024.xyz/2023/07/03/12zwnum.webp",
			checked: false,
			download: 100
		},
		{
			type: 'video',
			name: 'uniapp实战教程.mp4',
			data: "https://flobby.oss-cn-shenzhen.aliyuncs.com/post/865691909-1-208.mp4",
			create_time: '2023-07-01 19:26',
			checked: false,
			download: 66
		},
		{
			type: 'image',
			name: '风景.jpg',
			create_time: '2023-07-01 21:26',
			url: "https://i2.100024.xyz/2023/07/03/12zw8jj.webp",
			checked: false,
			download: 88
		},
		{
			type: 'text',
			name: '记事本.txt',
			create_time: '2023-07-02 20:26',
			checked: false,
			download: 33
		},
		{
			type: 'image',
			name: '风景.jpg',
			create_time: '2023-07-01 21:26',
			url: "https://i2.100024.xyz/2023/07/03/12zwf5j.webp",
			checked: false,
			download: 50
		},
		{
			type: 'none',
			name: '压缩包.rar',
			create_time: '2023-07-02 22:26',
			checked: false,
			download: 7
		}
	])
	
	// 下载状态属性
	// 下载中
	const downloading = computed(() => {
		return list.value.filter(item => {
			return item.download < 100;
		})
	})
	// 下载完成
	const downloaded = computed(() => {
		return list.value.filter(item => {
			return item.download === 100;
		})
	})
	const swiperChange = (e) => {
		tabIndex.value = e.detail.current
	}
</script>

<template>
	<view style="height: 100vh;" class="flex flex-column">
		<!-- tab栏 -->
		<view class="flex border-bottom border-light-secondary" style="height: 100rpx;">
			<view class="flex-1 flex flex-column align-center justify-center" v-for="(item, index) in tabBars"
				:key="index" :class="index === tabIndex ? 'text-main' : ''" @click="changeTab(index)">
				<text> {{ item.name }} </text>
				<text style="height: 8rpx;width: 140rpx;" class="rounded" :class="tabIndex === index ? 'bg-main' : 'bg-white'"></text>
			</view>
		</view>
		
		<!-- 列表内容 -->
		<swiper :duration="250" class="flex flex-1" :current="tabIndex" @change="swiperChange">
			<!-- 下载列表 -->
			<swiper-item class="flex flex-1">
				<scroll-view scroll-y="true" class="flex-1">
					<view class="bg-light flex align-center font-sm px-2 text-muted">
						文件下载至：storage/xxx/xxx
					</view>
					<view class="p-2 border-bottom border-light-secondary font text-muted">
						下载中({{ downloading.length }})
					</view>
					<f-list v-for="(item, index) in downloading" :key="'i' + index" :item="item" :index="index">
						<view class="flex align-center text-main" style="height: 70rpx;">
							<text class="iconfont icon-zanting"></text>
							<text class="ml-1">{{ item.download }}</text>
						</view>
						<progress slot="bottom" :percent="item.download" active-color="#009cff" :stroke-width="4" />
					</f-list>
					
					<view class="p-2 border-bottom border-light-secondary font text-muted">
						下载完成({{ downloaded.length }})
					</view>
					<f-list v-for="(item, index) in downloaded" :key="'d' + index" :item="item" :index="index" />
				</scroll-view>
			</swiper-item>
			<!-- 上传列表 -->
			<swiper-item class="flex flex-1">
				<scroll-view scroll-y="true" class="flex-1">
					<view class="font-md">
						上传列表
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>