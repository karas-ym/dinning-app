import React from 'react';
import axios from 'axios';
import {render} from "react-dom";
import {message} from 'antd'
import './index.css';
import App from './App';


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    //对响应数据做点什么
    if (response.data.code === "INVALID_TOKEN") {
        message.error(response.data.message);
        window.location.href = '/#/login'
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

render(<App/>, document.getElementById("root"))
