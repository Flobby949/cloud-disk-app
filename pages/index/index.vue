<script setup>
	import {
		computed,
		ref
	} from "vue";
	
	import {
		onLoad, onShow
	} from "@dcloudio/uni-app"
	
	import $H from "/common/request.js"
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
	// 获取文件列表
	const getList = () => {
		let orderby = sortOptions.value[sortIndex.value].key
		// 获取文件列表，file_id为0表示根目录全部数据
		$H.get(`/file?file_id=${file_id.value}&orderby=${orderby}`, {
			token: true
		}).then(res => {
			list.value = formatList(res.rows)
		})
	}
	
	const list = ref([])
	let dirs = ref([])
	
	// 向后端请求文件数组时的fileId
	const file_id = computed(() => {
		const len = dirs.value.length
		if (len === 0) {
			return 0
		}
		return dirs.value[len - 1].id
	})
	
	const current = computed(() => {
		const len = dirs.value.length
		if (len === 0) {
			return false
		}
		return dirs.value[len - 1]
	})
	
	const changeDir = () => {
		// 不知道为什么doEvent点击一下触发两次，所以要弹栈两次
		dirs.value.pop()
		dirs.value.pop()
		getList()
		uni.setStorage({
			key: 'dirs',
			data: JSON.stringify(dirs.value)
		})
	}
	
	const formatList = (fileList) => {
		return fileList.map(item => {
			let type = 'none'
			// isdir属性为1，为文件夹
			if (item.isdir === 1) {
				type = 'dir'
			} else {
				// ext 属性值是mime类型，例如“image/png”，获取 / 前面一段，得到文件类型
				type = item.ext.split('/')[0] || 'none'
			}
			return {
				type, 
				checked: false,
				...item
			}
		})
	}

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
			return [{
					icon: "icon-xiazai",
					name: "下载"
				},
				{
					icon: "icon-shanchu",
					name: "删除"
				}
			]
		} else {
			return [{
					icon: "icon-xiazai",
					name: "下载"
				},
				{
					icon: "icon-fenxiang-1",
					name: "分享"
				},
				{
					icon: "icon-shanchu",
					name: "删除"
				},
				{
					icon: "icon-chongmingming",
					name: "重命名"
				}
			]
		}
	})

	// 删除对话框ref
	const deleteDialogRef = ref(null)
	// 重命名对话框ref
	const renameDialogRef = ref(null)
	// 底部操作条处理
	const handleBottomEvent = (item) => {
		switch (item.name) {
			case '删除':
				uni.showModal({
					title: '提示',
					content: '确定删除吗?',
					success: (res) => {
						if (res.confirm) {
							handleDeleteConfirm()
						}
					}
				})
				break
			case '重命名':
				// 重命名只对单个文件进行，checkList数组中只有一个
				renameValue.value = checkedList.value[0].name
				renameDialogRef.value.showPopup()
				break
			default:
				break
		}
	}
	const handleDeleteConfirm = () => {
		// loading过渡
		uni.showLoading({
			title: '删除中...',
			mask: false
		})
		// 删除接口需要 “1,,2,3”格式参数，map遍历用 , 连接
		let ids = checkedList.value.map(item => item.id).join(',')
		$H.post('/file/delete', {ids}, {token:true}).then(res => {
			// 重新请求数据
			getList()
			uni.showToast({
				title: '删除成功',
				icon: 'success'
			})
		})
		.finally(() => {
			uni.hideLoading()
		})
	}

	const handleCancel = () => {
		console.log('取消');
		// 执行取消后的逻辑
	}

	// 重命名相关
	const renameValue = ref('')

	const handleRenameConfirm = () => {
		if (renameValue === '') {
			return uni.showToast({
				title: '文件名不能为空',
				icon: 'none'
			})
		}
		$H.post('/file/rename', {
			id: checkedList.value[0].id,
			file_id: file_id.value,
			name: renameValue.value
		}, {token:true}).then(res => {
			// 更新元素名称
			checkedList.value[0].name = renameValue.value
			uni.showToast({
				title: '重命名成功',
				icon: 'none'
			})
		})
		renameDialogRef.value.hidePopup()
	}

	// 新增
	const addList = ref([{
			icon: 'icon-file-b-6',
			color: 'text-success',
			name: '上传图片'
		},
		{
			icon: 'icon-file-b-9',
			color: 'text-primary',
			name: '上传视频'
		},
		{
			icon: 'icon-file-b-8',
			color: 'text-muted',
			name: '上传文件'
		},
		{
			icon: 'icon-file-b-2',
			color: 'text-warning',
			name: '新建文件夹'
		}
	])

	const addPopup = ref(null)
	// 打开操作条
	const openAddPopup = () => {
		addPopup.value.open()
	}

	// 新建文件相关
	const newDirDialogRef = ref(null)
	const newDirName = ref('')

	// 处理添加操作条的各种事件
	const handleAddEvent = (item) => {
		addPopup.value.close()
		switch (item.name) {
			case '新建文件夹':
				newDirDialogRef.value.showPopup()
		}
	}

	const handleNewDirConfirm = () => {
		if (newDirName.value === '') {
			return uni.showToast({
				title: '文件夹名不能为空',
				icon: 'none'
			})
		}
		// 请求新增文件夹接口
		$H.post('/file/createdir', {
			file_id: file_id.value,
			name: newDirName.value
		}, { token: true }).then(res => {
			getList()
			uni.showToast({
				title: '新建文件夹成功',
				icon: 'none'
			})
		})
		newDirDialogRef.value.hidePopup()
		newDirName.value = ''
	}

	// 预览
	const doEvent = (item) => {
		switch (item.type) {
			case 'image':
				// 从list中过滤得到全部image文件
				let images = list.value.filter(i => {
					return i.type === 'image'
				})
				// 预览图片
				uni.previewImage({
					current: item.url,
					urls: images.map(i => i.url)
				})
				break
			case 'video':
				uni.navigateTo({
					url: `../video/video?url=${item.url}&title=${item.name}`
				})
				break
			case 'dir': 
				dirs.value.push({
					id: item.id,
					name: item.name
				})
				getList()
				uni.setStorage({
					key: 'dirs',
					data: JSON.stringify(dirs.value)
				})
				break
			default:
				break
		}
	}

	// 排序相关
	const sortIndex = ref(0)
	const sortOptions = ref([{
			name: '按名称排序',
			key: 'name'
		},
		{
			name: '按时间排序',
			key: 'created_time'
		}
	])

	const sortPopup = ref(null)
	const openSortPopup = () => {
		sortPopup.value.open()
	}
	const changeSort = (index) => {
		sortIndex.value = index
		getList()
		sortPopup.value.close()
	}
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
					placeholder="搜索文件">
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