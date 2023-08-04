## 无缝刷新token

核心使用
```js
// 创建axios实例 
const service = axios.create();

/**
 * 响应拦截器
 */
service.interceptors.response.use(
    (response: AxiosResponse) => {
    const res = response.data;
    // token过期，需要刷新token
    if(res.code == 33333){
        // 中断Promise链
        return new Promise((reslove, reject) => {
         // 添加请求到队列
        addRequest(() => reslove(service(response.config)));
         // 刷新token
        refreshToken()
     })
    }
    // 响应成功
    return Promise.resolve(res);
})
```