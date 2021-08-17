import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, PageHeader, List, Space, message} from 'antd'
import {useHistory, useParams} from 'react-router-dom';
import url from '../../api'
import './style.css'
import {LeftOutlined} from "@ant-design/icons";


function Payment() {

    let token = window.localStorage.getItem('token')

    let history = useHistory()

    let id = useParams()

    let [orderDetail, setOrderDetail] = useState({
        user: {},
        orderItemDtoList: [],
        shop: {}
    })
    let [hospital, setHospital] = useState({})
    let [location, setLocation] = useState({})


    useEffect(() => {
        axios({
            method: "get",
            url: url + '/api/order/detail',
            headers: {token},
            params: {
                orderId: Number(id.orderId)
            }
        }).then((res) => {
            console.log('订单详情:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                setOrderDetail(res.data.data[0])
                setHospital(res.data.data[0].hospital)
                setLocation(res.data.data[0].location)
            }
        }).catch((error) => {
            message.error(error.toString())
        })
    }, [id, token]);


    const handlePayment = () => {
        const urlCallBack = 'https://www.baidu.com/'
        const formData = new FormData();
        formData.append('url', urlCallBack)

        axios({
            method: "post",
            url: url + '/api/pay/url',
            headers: {token},
            params: {
                number: orderDetail.number
            },
            data: formData
        })
            .then((res) => {
                if (res.data.code !== 'SUCCESS') {
                    message.error(res.data.message)
                } else {
                    window.location.href = res.data.data.payUrl
                }
            })
            .catch((error) => {
                message.error(error.toString())
            })
    }

    const slot = () => {
        if (orderDetail.slot === 1) {
            return '早餐 6:40-7:00'
        } else if (orderDetail.slot === 2) {
            return '午餐 11:40-12:00'
        } else if (orderDetail.slot === 4) {
            return '晚餐 17:40-18:00'
        } else {
            return '不知道'
        }
    }


    return (
        <div className="Payment">
            <div className={'title3'}>
                <LeftOutlined style={{fontSize: 22}} onClick={() => window.history.back()}/>
                <div>订单确认</div>
                <span> </span>
            </div>

            <div className={'payment-message'}>
                <div className={'payment-message-item'}>
                    <span>姓名</span>
                    <span>{orderDetail.user.nickname}</span>
                </div>
                <div className={'payment-message-item'}>
                    <span>电话</span>
                    <span>{orderDetail.user.mobile}</span>
                </div>
                <div className={'payment-message-item'}>
                    <span>送达时间</span>
                    <span>{slot()}</span>
                </div>
                <div className={'payment-message-item'}>
                    <span>送达地址</span>
                    <span>
                        {hospital.name + "-" + location.department + '-' +
                        location.room + "房" + '-' + location.bunk + '床'}
                    </span>
                </div>
                <div className={'payment-message-item'}>
                    <span>订单编号</span>
                    <span>{orderDetail.number}</span>
                </div>
            </div>

            <div className={'payment-content'}>
                <div className={'payment-content-shop-name'}>{orderDetail.shop.name}</div>
                {
                    orderDetail.orderItemDtoList.map((item, index) => {
                        return (
                            <div className={'payment-content-product'} key={index}>
                                <div className={'payment-content-product-message'}>
                                    <div className={'payment-content-product-img'}>
                                        <img src={'http://' + item.cover} alt=""/>
                                    </div>
                                    <div className={'payment-content-product-qty'}>
                                        <span style={{fontSize: '16px', fontWeight: 700}}>{item.productName}</span>
                                        <span>* {item.qty}</span>
                                    </div>
                                </div>
                                <div>￥{item.qty * item.price}</div>
                            </div>
                        )
                    })

                }
                <div style={{display: 'flex', justifyContent: 'flex-end', padding: '8px 15px'}}>
                    <span>合计 ￥{orderDetail.total}</span>
                </div>
            </div>

            <div className='btn-wrap'>
                <button onClick={handlePayment} className={'btn-pay'}>支付</button>
            </div>
        </div>
    )
}

export default Payment