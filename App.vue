<script>
	import SH from './common/request.js'
	import store from './store'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			console.log(store.state.username);
			SH.get('/list').then(res => {
				console.log('请求后端');
				console.log(res);
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/common/uni.css");
	@import url("/common/common.css");
	@import url("/common/free.css");
	@import url("/common/icon.css");
</style>
