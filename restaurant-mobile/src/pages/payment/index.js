import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs'
import { Button, PageHeader, List, Space, message } from 'antd'
import { useHistory, useParams } from 'react-router-dom';
import url from '../../api'
import './style.css'


function Payment() {

    let token = window.localStorage.getItem('token')

    let history = useHistory()

    let id = useParams()

    let [orderDetail, setOrderDetail] = useState({})
    let [hospital, setHospital] = useState({})
    let [location, setLocation] = useState({})


    useEffect(() => {

        axios({
            method: "get",
            url: url + '/api/order/detail',
            headers: { token },
            params: {
                orderId: Number(id.orderId)
            }
        }).then((res) => {
            console.log('订单详情:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                console.log(res.data.code)
                setOrderDetail(res.data.data[0])
                setHospital(res.data.data[0].hospital)
                setLocation(res.data.data[0].location)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [id, token]);

    const handlePayment = () => {
        // const urlCallBack = url + '/postpay'
        const urlCallBack = 'http://47.118.78.54:8001/swagger-ui/'
        const formData = new FormData();
        formData.append('url', urlCallBack)
        console.log('formdata:', formData)

        axios({
            method: "post",
            url: url + '/api/pay/url',
            headers: { token },
            params: {
                number: orderDetail.number
            },
            data: formData
        }).then((res) => {
            console.log('payment:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                console.log(res.data.code)
                // history.push(res.data.data.payUrl)
                window.location.href = res.data.data.payUrl
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 取消订单
    const handleCancel = () => {
        let data = {
            orderId: orderDetail.id
        }
        console.log(data)
        axios({
            method: "post",
            url: url + '/api/order/cancel',
            headers: { token },
            data: qs.stringify(data)
        }).then((res) => {
            console.log('cancel:', res.data)
            if (res.data.code !== 'SUCCESS') {
                message.error(res.data.message)
            } else {
                message.success(res.data.message)
                history.push('/order')
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="Payment">

            <PageHeader
                className=""
                onBack={() => {
                    history.push('/product')
                }}
                title="订单支付"
            />

            <List>
                <List.Item className='content-row'>
                    <List.Item.Meta
                        title='配送地点'
                        description={hospital.name + ' ' + location.department + ' ' +
                            location.room + '-' + location.bunk}
                    />
                </List.Item>
                <List.Item className='content-row'>
                    <List.Item.Meta
                        title='配送时间'
                        description={orderDetail.day + ' ' + orderDetail.slot}
                    />
                </List.Item>
            </List>

            <List
                itemLayout="vertical"
                size="large"
                dataSource={orderDetail.orderItemDtoList}
                renderItem={item => (
                    <List.Item
                        className='list-row'
                        key={item.id}
                        extra={
                            <div>
                                <div>￥{item.price}</div>
                                <div>x {item.qty}</div>
                            </div>
                        }
                    >
                        <List.Item.Meta
                            title={<span>{item.productName}</span>}
                        />
                    </List.Item>
                )}
            >
                <List.Item className='content-row' extra={<div>合计 ￥{orderDetail.total}</div>}></List.Item>
            </List>

            <Space align='right' className='btn-wrap'>
                <Button size='middle' shape='round' onClick={handleCancel}>取消</Button>
                <Button type='primary' size='middle' shape='round' onClick={handlePayment}>支付</Button>
            </Space>
        </div>
    )
}

export default Payment