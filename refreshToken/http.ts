const service = axios.create({
    // withCredentials: true, // send cookies when cross-domain requests
    baseURL, // .env中配置的api前缀
    timeout: 10000, // request timeout
});

/**
 * 请求失败后的错误统一处理
 * @param {HttpResultJson} res 响应json
 */
const handleError = (res: HttpResultJson, response: AxiosResponse) => {
    const { code, msg } = res;
    switch (code) {
        // token过期
        case 33333:
            // 延续Promise链
            return new Promise((reslove, reject) => {
                // 添加请求到队列
                addRequest(() => reslove(service(response.config)));
                // 刷新token
                refreshToken()
            })
        default:
            break;
    }
    return Promise.reject(new Error(res.msg));
};

/**
 * 响应拦截器
 */
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data;

        if (res.code !== ResponseCode.success) {
            // 处理错误
            return handleError(res, response);
        } else {
            // 响应成功
            return Promise.resolve(res);
        }
    },
    (error: AxiosError) => {
        console.error("response error:" + error); // for debug
        Toast.fail({
            message: error.message,
            duration: 1.5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default service;
