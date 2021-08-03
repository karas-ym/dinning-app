import React, { useState } from 'react';
import axios from 'axios'
import { Form, Input, Button, PageHeader, Tabs } from 'antd';
import './style.css'
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs


function Login() {

    let [nickname, setNickname] = useState('')
    let [password, setPassword] = useState('')
    let [mobile, setMobile] = useState('')

    let history = useHistory()

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleLogin = () => {

        axios({
            method: "get",
            url: 'http://47.118.78.54:8001/api/token/create',
            params: {
                mobile: mobile,
                password: password,
                nickname:nickname
            }
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
        <div className="Login">
            <PageHeader
                className="header"
                onBack={() => {
                    history.push('/profile')
                }}
                title="用户登录"
            />

            <div className="main">
                <div className="card-container">

                    <Tabs type="card">

                        <TabPane tab="手机号登录" key="1">
                            <Form
                                name="login-mobile"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    label="手机号"
                                    name="mobile"
                                    rules={[{ required: true, message: '请输入手机号' }]}
                                >
                                    <Input onChange={(e) => { setMobile(e.target.value) }} />
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password onChange={(e) => { setPassword(e.target.value) }} />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit" onClick={handleLogin}>
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        <TabPane tab="用户名登录" key="2">
                            <Form
                                name="login-username"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    label="用户名"
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input onChange={(e) => { setNickname(e.target.value) }} />
                                </Form.Item>

                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password onChange={(e) => { setPassword(e.target.value) }} />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit" onClick={handleLogin}>
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                    </Tabs>

                </div>

            </div>
        </div>

    )
}

export default Login