import React, {useState, useEffect} from 'react';
import axios from 'axios'
import qs from 'qs'
import {useHistory} from 'react-router-dom'
import {Button, Space, Drawer, message} from 'antd'
import {
    LineChartOutlined, MessageOutlined, PropertySafetyOutlined,
    RightOutlined, SettingOutlined, SoundOutlined,

} from '@ant-design/icons';

import './style.css'
import url from '../../api'


function Profile(props) {

    let token = window.localStorage.getItem('token')


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
        if (token !== null) {
            setVisible(true);
        } else {
            message.info('请先登录')
        }
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleLogout = () => {
        window.localStorage.removeItem('token')
        props.history.push('/profile')
        setVisible(false);
    }

    const login = () => {
        if (token === null) {
            props.history.push('/login')
        }
    }

    return (
        <div className={'profile'}>
            <div className={'profile-card'} onClick={login}>
                <div className={'profile-card-title'}>
                    <Space size={20}>
                        <div className={'profile-card-title-img'}>
                            <img src="http://47.118.78.54:8001/image/9.jpeg" alt=""/>
                        </div>
                        <div className={'profile-card-title-name'}>
                            <span style={{fontSize: '16px', fontWeight: 700}}>
                                 {token !== null ? user.nickname : '用户名'}
                            </span>
                            <span style={{fontSize: '16px', color: 'grey', marginTop: 4}}>
                                 {token !== null ? user.mobile : '手机号'}
                            </span>
                        </div>
                    </Space>
                </div>
                <RightOutlined style={{fontSize: '14px', paddingRight: '12px'}}/>
            </div>

            <div className={'profile-card-one'}>
                <div className={'profile-card-one-item'}>
                    <Space>
                        <span><PropertySafetyOutlined/></span>
                        <span>会员余额</span>
                    </Space>
                    <RightOutlined style={{fontSize: '14px'}}/>
                </div>
                <div className={'profile-card-one-item'}>
                    <Space>
                        <span><LineChartOutlined/></span>
                        <span>消费数据</span>
                    </Space>
                    <RightOutlined style={{fontSize: '14px'}}/>
                </div>
            </div>

            <div className={'profile-card-two'}>
                <div className={'profile-card-one-item'}>
                    <Space>
                        <span><SoundOutlined/></span>
                        <span>公告通知</span>
                    </Space>
                    <RightOutlined style={{fontSize: '14px'}}/>
                </div>
                <div className={'profile-card-one-item'}>
                    <Space>
                        <span><MessageOutlined/></span>
                        <span>意见反馈</span>
                    </Space>
                    <RightOutlined style={{fontSize: '14px'}}/>
                </div>
                <div className={'profile-card-one-item'} onClick={showDrawer}>
                    <Space>
                        <span><SettingOutlined/></span>
                        <span>退出登录</span>
                    </Space>
                    <RightOutlined style={{fontSize: '14px'}}/>
                </div>
            </div>


            <div style={{textAlign: 'center', color: '#999', marginTop: 80}}>
                @学坝教育（测试）
                <br/>
                提供运营服务
            </div>

            <Drawer placement="bottom" onClose={onClose} visible={visible} closable={false} height={150}
                    className='drawer'>
                <Space direction='vertical' align='center' style={{width: '100%'}} size={20}>
                    <Button size="large" type='link' danger onClick={handleLogout}>退出登录</Button>
                    <Button size="large" type='link' danger onClick={onClose}>取消</Button>
                </Space>
            </Drawer>

        </div>
    )


}

export default Profile