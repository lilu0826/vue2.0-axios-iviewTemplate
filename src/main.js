// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from "axios"

Vue.use(iView);

Vue.config.productionTip = false

//路由拦截
// router.beforeEach((to, from, next) => {
//   let token = sessionStorage.token;
//   if (token && to.name != 'login') {
//     next()
//   } else if (token && to.name == 'login') {
//     next('/');
//   } else if (!token && to.name != 'login') {
//     next('/login')
//   } else {
//     next()
//   }
// })


axios.defaults.baseURL = 'http://smartforestry.polesapp.com/';//接口地址

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  iView.LoadingBar.start()
  // 读取 token
  if (sessionStorage.token) {
    config.headers.Authorization = 'Bearer ' + sessionStorage.token
  }
  return config
}, error => {
  alert("错误的传参", 'fail')
  return Promise.reject(error)
});
// 添加一个响应拦截器
axios.interceptors.response.use(function (res) {
  //对响应数据做些事
  iView.LoadingBar.finish()
  return res
},
  error => {
    iView.LoadingBar.error()
    if (error.response.status === 401) {
      // 401 说明 token 验证失败
      // 可以直接跳转到登录页面，重新登录获取 token
      // location.href = '/login'
      iView.Message.error('您的登录信息已失效请重新登录')
      sessionStorage.token = ''
      router.replace({ path: '/login' })
    } else if (error.response.status === 500) {
      // 服务器错误
      // do something
      iView.Message.error('系统错误！')
      return Promise.resolve(error.response)
    }
    // 返回 response 里的错误信息
    return Promise.resolve(error.response)
  });

Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
