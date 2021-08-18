import React from 'react';
import {Form, Space} from 'antd';
import './style.css'

import {LeftOutlined} from "@ant-design/icons";


function Register(props) {

    const searchParams = new URLSearchParams(props.location.search.substring(1))
    let nickname = searchParams.get("nickname")
    let password = searchParams.get("password")


    const onFinish = (values) => {
        if (nickname === null && password === null) {
            props.history.push('/userinfo?mobile=' + values.mobile + '&code=' + values.code)
        } else {
            props.history.push('/userinfo?mobile=' + values.mobile + '&code=' + values.code + '&nickname=' + nickname + '&password=' + password)
        }
    };

    return (
        <div className="Register">

            <div className={'title6'}>
                <LeftOutlined style={{fontSize: 22}} onClick={() => window.history.back()}/>
                <div>用户注册</div>
                <span> </span>
            </div>

            <div className="card-container">
                <div className={'card-container-img'}>
                    <img
                        src="https://s.haohuoshi.net/uploads/images/20210304/9ced0fddd29bceb8201f08c97a1aebfb0c1a90cf.jpg"
                        alt=""/>
                </div>

                <Form
                    onFinish={onFinish}
                    name="phone">
                    <Form.Item
                        name="mobile"
                        rules={[{required: true, message: '请输入手机号'},
                            {
                                pattern: /^[1][0-9]{10}$/,
                                message: '请输入正确手机号!',
                            },]}>
                        <input type="text" style={{width: '100%'}} className={'input-phone'} placeholder={'请输入手机号码'}/>
                    </Form.Item>
                    <Form.Item>
                        <Space size={18}>
                            <Form.Item
                                name="code"
                                noStyle>
                                <input type="text" className={'input-phone'} placeholder={'请输入手机验证码'}/>
                            </Form.Item>
                            <button

                                onClick={() => {
                                    console.log(11111)
                                }}
                                className={'button-code'}>发送验证码
                            </button>
                        </Space>
                    </Form.Item>
                    <Form.Item>
                        <button className={'button-next'} type={'submit'}>下一步</button>
                    </Form.Item>
                </Form>


                {/*<Form*/}
                {/*    name="register"*/}
                {/*>*/}
                {/*    <Form.Item*/}
                {/*        label="用户名"*/}
                {/*        name="nickname"*/}
                {/*        // rules={[{required: true, message: '请输入用户名'}]}*/}
                {/*    >*/}
                {/*        <Input allowClear onChange={(e) => {*/}
                {/*            setNickname(e.target.value)*/}
                {/*        }}/>*/}
                {/*    </Form.Item>*/}

                {/*    <Form.Item*/}
                {/*        label="手机号"*/}
                {/*        name="mobile"*/}
                {/*        rules={[{required: true, message: '请输入手机号'},*/}
                {/*            {*/}
                {/*                pattern: /^[1][0-9]{10}$/,*/}
                {/*                message: '请输入正确手机号!',*/}
                {/*            },]}*/}
                {/*    >*/}
                {/*        <Input allowClear onChange={(e) => {*/}
                {/*            setMobile(e.target.value)*/}
                {/*        }}/>*/}
                {/*    </Form.Item>*/}

                {/*    <Form.Item*/}
                {/*        label="验证码"*/}
                {/*        name="smsCode"*/}
                {/*        // rules={[{required: true, message: '请输入验证码'}]}*/}
                {/*    >*/}
                {/*        <div>*/}
                {/*            <Input allowClear*/}
                {/*                   style={{width: 100}}*/}
                {/*                   onChange={(e) => {*/}
                {/*                       setSmsCode(e.target.value)*/}
                {/*                   }}/>*/}
                {/*            <Captcha value={mobile}></Captcha>*/}
                {/*        </div>*/}
                {/*    </Form.Item>*/}

                {/*    <Form.Item*/}
                {/*        label="密码"*/}
                {/*        name="password"*/}
                {/*        // rules={[*/}
                {/*        //     {required: true, message: '请输入密码'},*/}
                {/*        //     {*/}
                {/*        //         pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,*/}
                {/*        //         message: '请输入6-20位（包含字母数字）!',*/}
                {/*        //     },]}*/}
                {/*    >*/}
                {/*        <Input.Password allowClear/>*/}
                {/*    </Form.Item>*/}

                {/*    <Form.Item*/}
                {/*        label="密码确认"*/}
                {/*        name="confirm-password"*/}
                {/*        dependencies={['password']}*/}
                {/*        hasFeedback*/}
                {/*        // rules={[{required: true, message: '请再次输入密码'},*/}
                {/*        //     {*/}
                {/*        //         pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,*/}
                {/*        //         message: '请输入6-20位（包含字母数字）!',*/}
                {/*        //     },*/}
                {/*        //     ({getFieldValue}) => ({*/}
                {/*        //         validator(_, value) {*/}
                {/*        //             if (!value || getFieldValue('password') === value) {*/}
                {/*        //                 return Promise.resolve();*/}
                {/*        //             }*/}
                {/*        //             return Promise.reject(new Error('输入密码不一致'));*/}
                {/*        //         },*/}
                {/*        //     }),*/}
                {/*        // ]}*/}
                {/*    >*/}
                {/*        <Input.Password allowClear onChange={(e) => {*/}
                {/*            setPassword(e.target.value)*/}
                {/*        }}/>*/}
                {/*    </Form.Item>*/}

                {/*    <Form.Item>*/}
                {/*        <Button className="submit-btn" type="primary" htmlType="submit" onClick={handleSubmit}>*/}
                {/*            提交*/}
                {/*        </Button>*/}
                {/*    </Form.Item>*/}
                {/*</Form>*/}

            </div>
        </div>
    )
}

export default Register