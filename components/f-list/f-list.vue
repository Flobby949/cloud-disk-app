<script setup>
	import {computed, reactive} from "vue"
	
	const props = defineProps({
		item: Object,
		index: [Number, String],
		checked: Boolean
	})
	
	const icons = reactive({
		dir: {
			icon: 'icon-file-b-2',
			color: 'text-warning'
		},
		image: {
			icon: 'icon-file-b-6',
			color: 'text-success'
		},
		video: {
			icon: 'icon-file-b-9',
			color: 'text-primary'
		},
		text: {
			icon: 'icon-file-s-7',
			color: 'text-info'
		},
		none: {
			icon: 'icon-file-b-8',
			color: 'text-muted'
		}
	})
	
	const iconClass = computed(() => {
		// 根据传入的item元素的type属性，获取对应的icon对象
		let item = icons[props.item.type]
		// 根据取得的item对象，拼接class名
		return `${item.icon} ${item.color}`
	})
	
	// 定义向父组件抛出的事件
	const emits = defineEmits(['my-select'])
	
	const onSelect = () => {
		emits('my-select')
	}
</script>	
	
<template>
	<view class="p-3 flex align-center border bottom-border" @click="emits('click')">
		
		<!-- 左侧：用计算属性得出动态样式，显示不同的文件图标 -->
		<text class="iconfont" :class="iconClass" style="font-size: 60rpx;"></text>
		
		<!-- 中间：渲染父组件传入的对象中的名称和事件 -->
		<view class="flex flex-column ml-3" style="line-height: 1.2;">
			<text class="font-md">{{ props.item.name }}</text>
			<text class="font-sm text-muted mt-2">{{ props.item.create_time }}</text>
		</view>
		
		<!-- 右侧：根据传入对象的checked属性进行渲染 -->
		<view class="ml-auto flex align-center justify-center" @click="onSelect">
			<!-- 未选择，灰色圈圈 -->
			<text v-if="!props.item.checked" style="width: 30rpx; height: 30rpx; border: 1px solid #999;" class="rounded-circle"></text>
			<!-- 选中，字体图标 -->
			<text v-else class="iconfont icon-xuanze-yixuan text-primary" style="font-size: 20px;"></text>
		</view>
	</view>
</template>

