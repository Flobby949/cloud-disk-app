<script setup>
	import {
		computed,
		ref
	} from "vue";

	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app"

	import {
		useIndex
	} from '/hooks/useIndex.js'
	const {
		getList,
		changeDir,
		handleSelect,
		handleCheckAll,
		handleBottomEvent,
		handleDeleteConfirm,
		handleCancel,
		handleRenameConfirm,
		openAddPopup,
		handleAddEvent,
		handleNewDirConfirm,
		doEvent,
		openSortPopup,
		changeSort,
		handleSearch,
		list,
		dirs,
		file_id,
		current,
		checkedList,
		actions,
		deleteDialogRef,
		renameDialogRef,
		renameValue,
		addList,
		addPopup,
		newDirDialogRef,
		newDirName,
		sortPopup,
		sortOptions,
		sortIndex
	} = useIndex()

	onLoad(() => {
		getList()
	})
	onShow(() => {
		// 本地存储读取路由数组
		let dirsLocal = uni.getStorageSync('dirs')
		if (dirsLocal) {
			dirs.value = JSON.parse(dirsLocal)
		}
		getList()
	})
</script>

<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar v-if="checkedList.length === 0">
			<template v-slot:left>
				<view class="flex align-center justify-center bg-light rounded-circle ml-3"
					style="width: 60rpx; height: 60rpx;" @tap="changeDir" v-if="current">
					<text class="iconfont icon-fanhui"></text>
				</view>
				<text class="font-md ml-3 text-right text-white">{{ current ? current.name : '首页'}}</text>
			</template>
			<template v-slot:right>
				<view class="flex flex-row">
					<view style="width: 60rpx; height: 60rpx;"
						class="flex align-center justify-center bg-light rounded-circle mr-3" @tap="openAddPopup">
						<text class="iconfont icon-zengjia"></text>
					</view>
					<view style="width: 60rpx; height: 60rpx;"
						class="flex align-center justify-center bg-light rounded-circle mr-3" @tap="openSortPopup">
						<text class="iconfont icon-gengduo"></text>
					</view>
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
				<input type="text" style="height: 70rpx; padding-left: 70rpx;" class="bg-light font-md rounded-circle"
					placeholder="搜索文件" @input="handleSearch">
			</view>
		</view>

		<f-list v-for="(item, index) in list" :key="index" :item="item" :index="index" @click="doEvent(item)"
			@my-select="handleSelect(index)" />

		<!-- 底部操作条 -->
		<!-- 选中元素才显示操作条 -->
		<view v-if="checkedList.length > 0">
			<!-- 设置操作条容器样式，固定顶部，flex布局，垂直拉升 -->
			<view class="flex align-stretch bg-main text-white fixed-bottom" style="height: 115rpx;">
				<!-- 根据操作菜单个数等分容器，:hover-class实现点击变色 -->
				<view class="flex-1 flex flex-column align-center justify-center" style="line-height: 1.5;"
					v-for="(item, index) in actions" :key="index" hover-class="bg-hover-primary"
					@click="handleBottomEvent(item)">
					<text class="iconfont" :class="item.icon"></text>
					{{ item.name }}
				</view>
			</view>
		</view>

		<!-- 删除对话框 -->
		<f-dialog ref="deleteDialogRef" :onConfirm="handleDeleteConfirm" :onCancel="handleCancel">是否删除选中文件</f-dialog>

		<!-- 重命名对话框 -->
		<f-dialog ref="renameDialogRef" :onConfirm="handleRenameConfirm" :onCancel="handleCancel">
			<input type="text" v-model="renameValue" class="flex-1 bg-light rounded px-2" style="height: 95rpx;"
				placeholder="重命名" />
		</f-dialog>

		<!-- 添加操作条 -->
		<uni-popup ref="addPopup" type="bottom" safe-area>
			<view class="bg-white flex" style="height: 200rpx;">
				<!-- 遍历 addList 数组，均分纵向布局 -->
				<view class="flex flex-1 align-center justify-center flex-column" hover-class="bg-light"
					v-for="(item, index) in addList" :key="index" @tap="handleAddEvent(item)">
					<!-- 每个操作的图标，可以传入图标的名称和颜色 -->
					<text style="width: 110rpx;height: 110rpx;"
						class="flex align-center justify-center rounded-circle bg-light iconfont"
						:class="item.icon + ' ' + item.color">
					</text>
					<text class="font text-muted">{{ item.name }}</text>
				</view>
			</view>
		</uni-popup>

		<!-- 新建文件夹对话框 -->
		<f-dialog ref="newDirDialogRef" :onConfirm="handleNewDirConfirm" :onCancel="handleCancel">
			<input type="text" v-model="newDirName" class="flex-1 bg-light rounded px-2" style="height: 95rpx;"
				placeholder="新建文件夹名称" />
		</f-dialog>
	</view>

	<!-- 文件排序对话框 -->
	<uni-popup ref="sortPopup" type="bottom">
		<view class="bg-white">
			<view v-for="(item,index) in sortOptions" :key="index"
				class="flex align-center justify-center py-3 border-bottom border-light-secondary"
				:class="index === sortIndex ? 'text-main' : 'text-dark'" hover-class="bg-light"
				@click="changeSort(index)">
				{{ item.name }}
			</view>
		</view>
	</uni-popup>
</template>