import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  base: '/abstract-umi/',
  publicPath: '/abstract-umi/',
  outputPath: 'abstract-umi',
  hash: true,
  proxy: {
    '/api': {
      'target': 'http://127.0.0.1:7001/', 
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '/api' },
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '种类',
      path: '/category',
      component: './Category',
    },
    {
      name: '数据实体',
      path: '/dataModeManager',
      component: './DataModeManager/DataModel',
    },
    {
      name: '标签',
      path: '/tagManager',
      component: './TagManager/TagManager',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login/Login',
    },
    {
      name: '注册',
      path: '/register',
      component: './Register/Register',
    },
  ],
  npmClient: 'pnpm',
});

