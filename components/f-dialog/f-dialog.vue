<script setup>
import { ref } from "vue";
	const props = defineProps({
		title: {
			type: String,
			default: "提示"
		},
		cancelText: {
			type: String,
			default: "取消"
		},
		confirmText: {
			type: String,
			default: "确定"
		},
		onCancel: {
			type: Function,
			default: null
		},
		onConfirm: {
			type: Function,
			default: null
		}
	})
	
	const popRef = ref(null)
	
	const showPopup = () => {
		popRef.value.open()
	}
	
	const hidePopup = () => {
		popRef.value.close()
	}
	
	const confirm = () => {
		// 如果onConfirm不是函数，不执行
		if (typeof props.onConfirm === 'function') {
			// 执行父组件定义操作函数
			props.onConfirm()
		}
		hidePopup()
	}
	
	const cancel = () => {
		if (typeof props.onCancel === 'function') {
			// 执行父组件定义操作函数
			props.onCancel()
		}
		hidePopup()
	}
	
	// 向父组件暴露打开关闭方法
	defineExpose({
		showPopup,
		hidePopup
	})
</script>


<template>
	<uni-popup ref="popRef">
		<!-- 最外层容器样式 -->
		<view class="bg-white rounded" style="width: 600rpx;">
			<!-- 标题样式 -->
			<view class="flex align-center justify-center font-weight-bold border-bottom border-light-secondary"
				style="height: 100rpx;">
				{{ props.title }}
			</view>
			<!-- 内容 -->
			<view class="flex align-center justify-center p-3">
				<slot />
			</view>
			<!-- 确定取消，@tap更适合手机操作 -->
			<view class="flex border-top border-light-secondary" style="height: 100rpx;">
				<view class="flex-1 text-muted flex align-center justify-center" @tap="cancel">
					{{ props.cancelText }}
				</view>
				<view class="flex-1 text-main flex align-center justify-center" @tap="confirm">
					{{ props.confirmText }}
				</view>
			</view>
		</view>
	</uni-popup>
</template>