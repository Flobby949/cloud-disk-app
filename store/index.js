import {
	createStore
} from 'vuex'
import $H from '/common/request.js'
const store = createStore({
	state: {
		username: 'zhangsan',
		user: null,
		token: null
	},
	actions: {
		login({state}, user) {
			state.user = user
			state.token = user.token
			uni.setStorageSync('user', JSON.stringify(user))
			uni.setStorageSync('token', user.token)
		},
		logout({state}) {
			$H.post('/logout', {}, {
				token: true
			})
			state.user = null
			state.token = null
			uni.removeStorageSync('user')
			uni.removeStorageSync('token')
			
			uni.reLaunch({
				url: '/pages/login/login'
			})
		},
		unitUser({state}) {
			let user = uni.getStorageSync('user')
			if (user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		updateSize({state}, e) {
			state.user.total_size = e.total_size
			state.user.used_size = e.used_size
		}
	}
})

export default store