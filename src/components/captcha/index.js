import React, {useState} from 'react';
import axios from 'axios'
import qs from 'qs'
import {Input, Button, message, Modal, Image, Space} from 'antd';
import url from '../../api'
import {useHistory} from 'react-router-dom';

function Captcha(props) {

    let history = useHistory()

    let [captchaUrl, setCaptchaUrl] = useState()
    let [captchaKey, setCaptchaKey] = useState()
    let [code, setCode] = useState(null)

    // 图片验证
    let [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const handleCaptcha = () => {
        console.log(props.value)

        axios({
            method: "get",
            url: url + '/api/captcha/create',
        }).then((res) => {
            console.log(res.data)
            setCaptchaUrl(res.data.url)
            setCaptchaKey(res.data.key)
        }).catch((error) => {
            console.log(error)
        })
    }

    // 发送手机验证码

    let [cd, setCd] = useState(10)
    let [smsStatus, setSmsStaus] = useState(true)//短信发送状态 true 已发送 false 未发送

    const sendSms = () => {

        axios({
            method: "post",
            url: url + '/api/sms',
            data: qs.stringify({mobile: props.value})
        }).then((res) => {
            console.log(res.data)
            if (res.data.code === 'ERROR') {
                message.error(res.data.message)
            } else if (res.data.code === 'SMS_EXCEPTION') {
                showModal()
                handleCaptcha()
            } else {
                console.log(res.data.message)
                setSmsStaus(false)
                countdown()
            }
        }).catch((error) => {
            console.log(error)
        })

    }

    // 验证短信重发间隔
    const countdown = () => {
        setCd(cd--)
        var timer = setInterval(() => {
            setCd(cd--)
            if (cd < 0) {
                setCd(10)
                setSmsStaus(true)
                clearInterval(timer)
            }
        }, 1000)
    }

    const submit = () => {
        axios({
            method: "get",
            url: url + '/api/captcha/verify',
            params: {
                code: code,
                key: captchaKey
            }
        }).then((res) => {
            console.log(res.data)
            if (res.data.code !== 'SUCCESS') {
                history.push('/register')
            } else {
                console.log(res.data.mesasge)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <span>
            <Button size='middle' disabled={!smsStatus} onClick={sendSms}>
                {!smsStatus ? cd + "s 后重新发送" : '发送验证码'}
            </Button>
            <Modal title="图片验证" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                   closable={false}
                   footer={null}
                   centered
                   width={300}
            >
                <Space direction='vertical' size={20}>
                    <Space>
                        <Image width={150} src={captchaUrl}/>
                        <Button type='link' onClick={handleCaptcha}>换一张</Button>
                    </Space>
                    <Space size={20}>
                        <Input style={{width: '80px'}} size='large' onChange={(e) => {
                            setCode(e.target.value)
                        }}></Input>
                        <Button type='primary' onClick={submit}>验证</Button>
                    </Space>
                </Space>
            </Modal>
        </span>
    )
}

export default Captcha