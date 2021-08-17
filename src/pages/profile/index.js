import React, {useState, useEffect} from 'react';
import axios from 'axios'
import qs from 'qs'
import {useHistory} from 'react-router-dom'
import {Button, Avatar, PageHeader, Space, Input, Upload, Form, Drawer, Collapse, message} from 'antd'
import {CameraOutlined, EditOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined} from '@ant-design/icons';

import './style.css'
import url from '../../api'
import Captcha from '../../components/captcha';

const {Panel} = Collapse;

function Profile(props) {

    let token = window.localStorage.getItem('token')


    let history = useHistory()

    let [user, setUser] = useState({})


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
        props.history.push('/profile')
        setVisible(false);
    }

    return (
        <div>

            <aside className="profile-card">
                <header>
                    <a target="_blank">
                        <img src={"http://47.118.78.54:8001/image/9.jpeg"} className="hoverZoomLink" alt={'头像'}/>
                    </a>

                    <h1>
                        {token !== null ? user.nickname : '用户名'}
                    </h1>

                    <h2>
                        {token !== null ? user.mobile : '手机号'}
                    </h2>

                </header>

                <div className="profile-bio">
                    <p>
                        It takes monumental improvement for us to change how we live our lives. Design is the way we
                        access that
                        improvement.
                    </p>
                </div>

                {
                    token === null
                        ?
                        <ul className="profile-social-links">
                            <li>
                                <span onClick={() => {
                                    props.history.push('/register')
                                }}>
                                    <UserAddOutlined/>
                                </span>
                            </li>
                            <li>
                                <span onClick={() => {
                                    props.history.push('/login')
                                }}>
                                    <LoginOutlined/>
                                </span>
                            </li>
                        </ul>
                        :
                        <ul className="profile-social-links">
                            <li>
                                <span>
                                    <EditOutlined/>
                                </span>
                            </li>
                            <li>
                                <span onClick={showDrawer}>
                                    <LogoutOutlined/>
                                </span>
                            </li>
                        </ul>
                }
            </aside>


            <Drawer placement="bottom" onClose={onClose} visible={visible} closable={false} height={150}
                    className='drawer'>
                <Space direction='vertical' align='center' style={{width: '100%'}} size={20}>
                    <Button size="large" type='link' onClick={handleLogout}>退出登录</Button>
                    <Button size="large" type='link' onClick={onClose}>取消</Button>
                </Space>
            </Drawer>

        </div>
    )


}

export default Profile