import {
	createStore
} from 'vuex'

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
		}
	}
})

export default store