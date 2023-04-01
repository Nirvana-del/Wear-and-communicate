import axios from 'axios';
//创建axios默认参数
const requests = axios.create ({
    // baseURL : '',
    timeout : 5000,
    baseURL: '/api',
    withCredentials :false,
    headers:{
        'Content-Type':'application/json'
    }
})
//请求拦截器
requests.interceptors.request.use(config=>{
    //存在token，请求会携带token
    if(window.sessionStorage.getItem('token')){
        config.headers.Authorization = window.sessionStorage.getItem('token');
    }
    return config;
},error=>{
    return Promise.reject(error)
})

//响应拦截器
requests.interceptors.response.use(response =>{
    return response.data
},error =>{
    const {response} = error
    if(response) {
    //服务器返回了结果
        switch (response.status) {
            case 401:
            console.log('权限不足')
                break;
            case 403:
            console.log('服务器拒绝请求，token过期')
                break;
            case 404:
            console.log('找不到地址')
                break;
        }
    } else {
        //服务器未返回结果
        if( !window.navigator.onLine) {
            return;
        }
    }
    return Promise.reject(error)
})
export default requests;

export const initMenu = (router,store) => {
    if(store.state.routes.length){
        return;
    }
}



