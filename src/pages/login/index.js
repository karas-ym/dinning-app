import React, { useState } from 'react';
import axios from 'axios'
import { Form, Input, Button, PageHeader, message, Divider } from 'antd';
import './style.css'
import { useHistory } from 'react-router-dom';
import url from '../../api'

function Login() {

    let [password, setPassword] = useState('')
    let [mobile, setMobile] = useState('')

    let history = useHistory()

    const handleLogin = () => {

        axios({
            method: "get",
            url: url + '/api/token/create',
            params: {
                mobile: mobile,
                password: password,
            }
        }).then((res) => {
            console.log(res.data)
            if (res.data.code !== 'SUCCESS') {
                message.info(res.data.message)
            } else {
                window.localStorage.setItem('token', res.data.data.token)
                message.success(res.data.message)
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

                    <Form
                        size='large'
                        name="login-mobile"
                        onFinish={handleLogin}
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

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="link" size='middle' className='option' onClick={() => {
                                history.push('/register')
                            }}>
                                去注册
                            </Button>
                            <Divider type="vertical" style={{ fontSize: '18px', borderLeft: '2px solid #888' }} />
                            <Button type="link" size='middle' className='option' onClick={() => {
                                history.push()
                            }}>
                                找回密码
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='submit'>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>

                </div>

            </div>
        </div>

    )
}

export default Login