import React, {useState} from 'react';
import axios from 'axios'
import qs from 'qs'
import {Form, Input, Button, PageHeader, message} from 'antd';
import './style.css'
import {useHistory} from 'react-router-dom';
import url from '../../api'
import Captcha from '../../components/captcha';


function Register() {

    let [nickname, setNickname] = useState('')
    let [mobile, setMobile] = useState('')
    let [password, setPassword] = useState('')
    let [smsCode, setSmsCode] = useState()

    let history = useHistory()

    const onFinish = (values) => {
        message.success('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Failed:', errorInfo);
    };

    // 提交注册
    const handleSubmit = () => {

        let data = {
            nickname: nickname,
            password: password,
            mobile: mobile,
            code: smsCode
        }

        axios({
            method: "post",
            url: url + '/api/user/create',
            data: qs.stringify(data)
        }).then((res) => {
            console.log(res.data)
            if (res.data.code !== 'SUCCESS') {
                onFinishFailed(res.data.message)
            } else {
                window.localStorage.setItem('token', res.data.data.token)
                onFinish(res.data.message)
                history.push('/profile')
            }
        }).catch((error) => {
            console.log(error)
        })

    }

    return (
        <div className="Register">
            <PageHeader
                onBack={() => {
                    history.push('/profile')
                }}
                title="用户注册"
            />

            <div className="card-container">
                <Form
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >

                    <Form.Item
                        label="用户名"
                        name="nickname"
                        rules={[{required: true, message: '请输入用户名'}]}
                    >
                        <Input onChange={(e) => {
                            setNickname(e.target.value)
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="手机号"
                        name="mobile"
                        rules={[{required: true, message: '请输入手机号'}]}
                    >
                        <Input onChange={(e) => {
                            setMobile(e.target.value)
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="验证码"
                        name="smsCode"
                        rules={[{required: true, message: '请输入验证码'}]}
                    >
                        <div>
                            <Input style={{width: 100}} onChange={(e) => {
                                setSmsCode(e.target.value)
                            }}/>
                            <Captcha value={mobile}></Captcha>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true, message: '请输入密码'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="密码确认"
                        name="confirm-password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[{required: true, message: '请再次输入密码'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('输入密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password onChange={(e) => {
                            setPassword(e.target.value)
                        }}/>
                    </Form.Item>

                    <Form.Item>
                        <Button className="submit-btn" type="primary" htmlType="submit" onClick={handleSubmit}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    )
}

export default Register