import React from 'react';
import {LeftOutlined} from "@ant-design/icons";
import './userinfo.css'
import {Form, message} from "antd";
import axios from "axios";
import url from "../../api";
import qs from 'qs'


function Userinfo(props) {


    const searchParams = new URLSearchParams(props.location.search.substring(1))
    let mobile = searchParams.get("mobile")
    let code = searchParams.get("code")
    let nickname = searchParams.get("nickname")
    let password = searchParams.get("password")


    const onfinish = (val) => {

        if (val.password === val.again) {
            let data = {
                nickname: val.nickname,
                password: val.password,
                mobile: mobile,
                code: code,
            }

            axios({
                method: "post",
                url: url + '/api/user/create',
                data: qs.stringify(data)
            })
                .then((res) => {
                    if (res.data.code === 'ERROR') {
                        message.error(res.data.message)
                    } else if (res.data.code === 'SUCCESS') {
                        window.localStorage.setItem('token', res.data.data.token)
                        props.history.push('/profile')
                    } else if (res.data.code === 'CODE_ERROR') {
                        message.error(res.data.message)
                        props.history.push('/register?nickname=' + val.nickname + '&password=' + val.password)
                    }
                })
                .catch((error) => {
                    message.error(error.toString())
                })
        } else {
            message.error('两次输入密码不一致')
        }
    }


    return (
        <div>
            <div className={'title7'}>
                <LeftOutlined style={{fontSize: 22}} onClick={() => window.history.back()}/>
                <div>用户注册</div>
                <span> </span>
            </div>

            <div className={'userinfo'}>

                <div className={'card-container-img'}>
                    <img
                        src="https://s.haohuoshi.net/uploads/images/20210304/9ced0fddd29bceb8201f08c97a1aebfb0c1a90cf.jpg"
                        alt=""/>
                </div>

                <Form
                    initialValues={{
                        'nickname': nickname === null ? '' : nickname,
                        'password': password === null ? '' : password,
                        'again': password === null ? '' : password,
                    }}
                    onFinish={onfinish}
                    name={'userinfo'}>
                    <Form.Item
                        label={'用户名'}
                        rules={[
                            {required: true, message: '请输入用户姓名'},
                        ]}
                        name={'nickname'}>
                        <input type="text" className={'userinfo-input'} placeholder={'请输入用户姓名'}/>
                    </Form.Item>
                    <Form.Item
                        label={'密码'}
                        rules={[
                            {required: true, message: '请输入密码'},
                        ]}
                        name={'password'}>
                        <input type="password" className={'userinfo-input'} placeholder={'请输入密码'}/>
                    </Form.Item>
                    <Form.Item
                        label={'再次输入密码'}
                        name={'again'}
                        rules={[
                            {required: true, message: '请输入密码'},
                        ]}>
                        <input type="password" className={'userinfo-input'} placeholder={'请输入再次输入密码'}/>
                    </Form.Item>
                    <Form.Item>
                        <button type={'submit'} className={'userinfo-button'}>提交</button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Userinfo;