const host = 'http://www.sqhbb.com'              // 项目中接口地址host

export const WS_HOST = 'ws://47.105.125.106:8288'              // socket 地址

export const IS_DEV = 1                              // 是否是开发环境 1 是 0 否
export const PAGE_SIZE = 15                         // 分页配置 每页条数
export const VERSION_CODE = '1.0.0'                  // 版本号

export const API_BASE_URL = `${host}/api`            // 接口请求基础路径
export const UPLOAD_IMAGE_URL = `${host}/api/v1/5d5fa8984f0c2` // 图片上传接口路径 UploadImage方法依赖此配置
export const IMG_BASE_URL = `${host}/upload/`        // 图片基础路径 公共filters assembleImgSrc依赖此配置

export const LOGIN_PAGE_URL = '/pages/message/index'// 登录页面路由 request.js 依赖此配置 主要用于登录失效跳转

export const SYSTEM_CONFIG = {                                                            // 系统配置
  logo: '/static/logo.png',
  appName: 'Fast-UI',
  appNameUpper: '神奇黑板报',
  defaultAvatar:'/static/imgs/user.png'
}
