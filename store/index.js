import {
	createStore
} from 'vuex'
import $H from '/common/request.js'
const store = createStore({
	state: {
		username: 'zhangsan',
		user: null,
		token: null,
		uploadList: [],
		downloadList: []
	},
	actions: {
		// 初始化上传下载列表
		initList({
			state
		}) {
			if (state.user) {
				let d = uni.getStorageSync('download_' + state.user.id)
				let u = uni.getStorageSync('upload_' + state.user.id)
				state.downloadList = d ? JSON.parse(d) : []
				state.downloadList = u ? JSON.parse(u) : []
			}
		},
		// 创建上传任务
		createUploadJob({
			state
		}, obj) {
			// 添加上传队列最前
			state.uploadList.unshift(obj)
			// 异步设置本地存储，记录键值对，上传人和上传内容
			uni.setStorage({
				key: 'upload_' + state.user.id,
				data: JSON.stringify(state.uploadList)
			})
		},
		// 更新上传任务进度
		updateUploadJob({
			state
		}, obj) {
			// 在上传队列中查找用户的上传任务
			let i = state.uploadList.findIndex(item => item.key === obj.key)
			// 存在
			if (i !== -1) {
				// 更新progress进度条和上传状态
				state.uploadList[i].progress = obj.progress
				state.uploadList[i].status = obj.status
				// 异步更新本地存储
				uni.setStorage({
					key: 'upload_' + state.user.id,
					data: JSON.stringify(state.uploadList)
				})
			}
		},
		// 创建下载任务
		createDownloadJob({state}, obj) {
			state.downloadList.unshift(obj)
			uni.setStorage({
				key: 'download_' + state.user.id,
				data: JSON.stringify(state.downloadList)
			})
		},
		// 更新下载进度
		updateDownloadJob({state}, obj) {
			let i = state.downloadList.findIndex(item => item.key === obj.key)
			if (i !== -1) {
				// 更新progress值和下载状态
				state.downloadList[i].progress = obj.progress
				state.downloadList[i].status = obj.status
				uni.setStorage({
					key: 'download_' + state.user.id,
					data: JSON.stringify(state.downloadList)
				})
			}
		},
		login({
			state
		}, user) {
			state.user = user
			state.token = user.token
			uni.setStorageSync('user', JSON.stringify(user))
			uni.setStorageSync('token', user.token)
		},
		logout({
			state
		}) {
			$H.post('/logout', {}, {
				token: true
			})
			state.user = null
			state.token = null
			uni.removeStorageSync('user')
			uni.removeStorageSync('token')
			uni.removeStorageSync('dirs')
			uni.reLaunch({
				url: '/pages/login/login'
			})
		},
		unitUser({
			state
		}) {
			let user = uni.getStorageSync('user')
			if (user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		updateSize({
			state
		}, e) {
			state.user.total_size = e.total_size
			state.user.used_size = e.used_size
		}
	}
})

export default store