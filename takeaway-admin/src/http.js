import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
  baseURL: "http://localhost:4000/admin/api"
});

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求前在请求头中添加授权信息
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 给 response 加拦截器
http.interceptors.response.use(res => {
  return res;
}, err => {
  if (err.response.data.message) {
    Vue.prototype.$message({
      type: 'error',
      message: err.response.data.message
    });
    if (err.response.status === 401) {
      setTimeout(() => {
        router.push('/login');
      },1000)
    }
  }
  return Promise.reject(err);
});

export default http;

