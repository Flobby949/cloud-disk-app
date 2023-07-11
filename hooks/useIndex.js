import $H from '/common/request.js'
import {
	computed,
	ref
} from "vue";
import store from '/store'

export function useIndex() {
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
			case '下载':
				download()
				break
			default:
				break
		}
	}

	const download = () => {
		checkedList.value.forEach(item => {
			if (item.isdir === 0) {
				const key = genId(8)
				// 下载对象
				let obj = {
					name: item.name,
					type: item.type,
					size: item.size,
					key,
					progress: 0,
					status: true,
					created_time: new Date().getTime()
				}
				// 创建下载任务
				store.dispatch('createDownloadJob', obj)
				let url = item.url
				// 调用uniapp下载api
				let d = uni.downloadFile({
					url,
					success: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							uni.saveFile({
								tempFilePath: item.tempFilePath
							})

						}
					}
				})
				d.onProgressUpdate(res => {
					store.dispatch('updateDownloadJob', {
						progress: res.progress,
						status: true,
						key
					})
				})
			}
		})
		uni.showToast({
			title: '加入下载队列',
			icon: 'none'
		})
	}

	const handleDeleteConfirm = () => {
		// loading过渡
		uni.showLoading({
			title: '删除中...',
			mask: false
		})
		// 删除接口需要 “1,,2,3”格式参数，map遍历用 , 连接
		let ids = checkedList.value.map(item => item.id).join(',')
		$H.post('/file/delete', {
				ids
			}, {
				token: true
			}).then(res => {
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
		}, {
			token: true
		}).then(res => {
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
				break
			case '上传图片':
				// 选择图片，限制9张
				uni.chooseImage({
					count: 9,
					success: (res) => {
						// 选择图片成功，循环异步调用上传接口
						res.tempFiles.forEach(item => {
							upload(item, 'image')
						})
					}
				})
				break
			case '上传视频':
				uni.chooseVideo({
					count: 1,
					success: (res) => {
						let name = ''
						let size = 0
						// 取文件名
						name = res.tempFilePath.substring(res.tempFilePath.lastIndexOf('/') + 1)
						size = res.size
						// 上传
						upload({
							path: res.tempFilePath,
							name,
							type: 'video',
							size
						})
					}
				})
				break
			default:
				break
		}
	}

	// 生成唯一 id
	const genId = (len) => {
		return Number(Math.random().toString().substr(3, len) + Date.now()).toString(36)
	}

	// 上传文件
	const upload = (file, type) => {
		// 上传文件类型
		let t = type
		// 上传key，区分文件
		const key = genId(8)
		// 构造上传文件对象，文件名，类型，大小，key，进度，状态，创建时间
		let obj = {
			name: file.name,
			type: t,
			key,
			progress: 0,
			status: true,
			created_time: new Date().getTime()
		}
		// 创建上传任务，通过 dispatch 分发给 vuex，异步上传调度
		store.dispatch('createUploadJob', obj)
		// 上传，参数为当前位置的目录id
		console.log(file_id.value);
		$H.upload('/upload?file_id=' + file_id.value, {
			filePath: file.path
		}, p => {
			// 更新上传进度
			store.dispatch('updateUploadJob', {
				status: true,
				process: p,
				key
			}).then(res => {
				// 上传成功
				getList()
			})
		})
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
		}, {
			token: true
		}).then(res => {
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

	// 搜索功能，关键词为空就请求全部数据
	const handleSearch = (e) => {
		if (e.detail.value === '') {
			return getList()
		}
		$H.get('/file/search?keyword=' + e.detail.value, {
			token: true
		}).then(res => {
			list.value = formatList(res.rows)
		})
	}
	
	return {
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
	}
}