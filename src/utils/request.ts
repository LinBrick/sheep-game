import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 50000
});

// 导出 axios 实例
export default service;