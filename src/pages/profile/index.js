import React, {useState, useEffect} from 'react';
import axios from 'axios'
import qs from 'qs'
import {useHistory} from 'react-router-dom'
import {Button, Avatar, PageHeader, Space, Input, Upload, Form, Drawer, Collapse, message} from 'antd'
import {CameraOutlined} from '@ant-design/icons';

import './style.css'
import url from '../../api'
import Captcha from '../../components/captcha';

const {Panel} = Collapse;

function Profile() {

    let token = window.localStorage.getItem('token')

    let history = useHistory()

    let [user, setUser] = useState({})

    let [nickname, setNickname] = useState(null)
    let [mobile, setMobile] = useState(null)
    let [password, setPassword] = useState(null)

    // 获取用户信息
    const getProfile = () => {
        axios({
            method: 'get',
            url: url + '/api/user/whoami',
            headers: {token}
        }).then((res) => {
            console.log('profile:', res.data) // 测试
            if (res.data.code !== 'SUCCESS') {
                message.info(res.data.message)
            } else if (res.data.code === 'SUCCESS') {
                message.success('登录成功')
                window.localStorage.setItem('id', res.data.data.id)
                setUser(res.data.data)
            }
        }).catch((error) => {
            message.error(String(error))
        })
    }

    useEffect(() => {
        if (token !== null) {
            getProfile()
        }
    }, [])

    //获取上传头像
    const updateAvatar = (info) => {
        const formData = new FormData();
        formData.append('file', info.file)
        console.log(info.file)
        axios({
            method: 'post',
            url: url + '/api/user/avatar',
            headers: {token},
            data: formData
        }).then((res) => {
            console.log(res.data)
            if (res.data.code === 'ERROR') {
                message.error(res.data.message)
            } else if (res.data.code === 'SUCCESS') {
                message.success('上传成功')
                getProfile()
            }
        }).catch((error) => {
            message.error(String(error))
        })
    }

    // 更新用户信息
    const handleUpdate = () => {
        let data = {
            nickname,
            password,
            mobile
        }

        axios({
            method: "post",
            url: url + '/api/user/update',
            headers: {token},
            data: qs.stringify(data),
        }).then((res) => {
            console.log(res.data)
            if (res.data.code === 'SUCCESS') {
                getProfile()
            } else if (res.data.code === 'ERROR') {
                message.error(res.data.message)
            }
        }).catch((error) => {
            message.error(String(error))
        })
    }

    // 退出确认弹框
    let [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleLogout = () => {
        window.localStorage.removeItem('token')
        history.push('/profile')
    }

    return (
        <div className="Profile">
            <PageHeader
                backIcon="false"
                title="个人中心"/>

            <div className="content">
                <Space direction='vertical' align='center'>
                    <Avatar
                        src={token !== null ? 'http://' + user.avatar : 'http://47.118.78.54:8001/image/9.jpeg'}
                        size={80}/>
                    <Upload
                        name='avatar'
                        customRequest={updateAvatar}
                        showUploadList={false}>
                        <Button size='small' icon={<CameraOutlined/>}>上传头像</Button>
                    </Upload>

                </Space>

                <Collapse bordered={false} expandIconPosition='right' className='list-row' ghost>
                    <Panel header={
                        <div>
                            昵称
                            <Space className="info-right">{user.nickname}</Space>
                        </div>
                    } key="1">
                        <Form>
                            <Form.Item
                                label="用户名"
                                name="nickname"
                                rules={[{required: true, message: '请输入用户名'}]}>
                                <div>
                                    <Input style={{width: 280}} onChange={(e) => {
                                        setNickname(e.target.value)
                                    }}/>
                                    <Button size='middle' onClick={handleUpdate}>提交</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Panel>

                    <Panel header={
                        <div>
                            手机号
                            <Space className="info-right">{user.mobile}</Space>
                        </div>
                    } key="2">
                        <Form>
                            <Form.Item
                                label="手机号"
                                name="mobile"
                                rules={[{required: true, message: '请输入手机号'}]}>
                                <div>
                                    <Input style={{width: 200}} onChange={(e) => {
                                        setMobile(e.target.value)
                                    }}/>
                                    <Captcha value={mobile}/>
                                </div>
                            </Form.Item>

                            <Form.Item
                                label="验证码"
                                name="smsCode"
                                rules={[{required: true, message: '请输入验证码'}]}>
                                <div>
                                    <Input style={{width: 100}}/>
                                    <Button size='middle' onClick={handleUpdate}>提交</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Panel>

                    <Panel header="更改密码" key="3">
                        <Form>
                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[{required: true, message: '请输入密码'}]}>
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
                                ]}>
                                <Input.Password onChange={(e) => {
                                    setPassword(e.target.value)
                                }}/>
                            </Form.Item>

                            <Form.Item>
                                <Button htmlType="submit" onClick={handleUpdate}>
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </Panel>
                </Collapse>

                {
                    token === null ?
                        <Button className="logout" size="large" type='primary' onClick={() => {
                            history.push('/login')
                        }}>登录</Button>
                        :
                        <Button className="logout" size="large" type='primary' onClick={showDrawer}>退出账号</Button>
                }

                <Drawer
                    placement="bottom"
                    onClose={onClose}
                    visible={visible}
                    closable={false}
                    height={150}
                    className='drawer'>

                    <Space direction='vertical' align='center' style={{width: '100%'}} size={20}>
                        <Button size="large" type='link' onClick={handleLogout}>退出登录</Button>
                        <Button size="large" type='link' onClick={onClose}>取消</Button>
                    </Space>

                </Drawer>
            </div>

        </div>
    )


}

export default Profile