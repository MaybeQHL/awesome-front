/**
 * 无缝刷新token
 * @author maybe
 */
import { refreshToken as apiRefreshToken } from '@/api/user'
import { removeToken, setToken } from './auth';
import { useRouter } from 'vue-router'

let requests: any[] = [];
let pending = false; //同时请求多个过期链接，保证只请求一次

export const addRequest = (request: any) => {
    requests.push(request);
};

export const retryRequest = () => {
    requests.forEach((request) => request())
    requests = [];
};

export const clearAuthAndRedirect = () => {
    removeToken();
    const router = useRouter();
    router.replace('/login')
}

export const refreshToken = async () => {
    if (!pending) {
        try {
            pending = true;
            // 重新获取token
            const { data } = await apiRefreshToken();
            // 更新缓存token
            setToken(data.token)
            // 重发请求池
            retryRequest();
        } catch (error) {
            console.error(error);
            clearAuthAndRedirect();
        } finally {
            pending = false;
        }
    }
}