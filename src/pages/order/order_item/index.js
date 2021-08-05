import React, { useState, useEffect } from 'react';
import axios from 'axios'
import qs from 'qs'
import './style.css'
import { PageHeader, List, Button, Layout, Input, Form, Rate, message, Space } from 'antd'
import { useHistory, useParams } from 'react-router-dom';

import url from '../../../api'

const { Content } = Layout
const { TextArea } = Input;

function OrderItem() {

    let token = window.localStorage.getItem('token')

    let history = useHistory()

    let orderId = useParams() //地址栏获取订单id

    let [render, setRender] = useState(false)

    let [orderDetail, setOrderDetail] = useState({})

    let [cmt, setCmt] = useState('')
    let [point, setPoint] = useState()
    let [shop, setShop] = useState({})

    useEffect(() => {
        console.log(orderId)

        axios({
            method: "get",
            url: url + '/api/order/detail',
            headers: { token },
            params: {
                orderId: Number(orderId.id)
            }
        }).then((res) => {
            console.log('订单详情:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                console.log(res.data.code)
                setOrderDetail(res.data.data[0])
                setCmt(res.data.data[0].evaluation)
                setShop(res.data.data[0].shop)
            }
        }).catch((error) => {
            console.log(error)
        })

    }, [orderId, render, token])

    console.log('detail', orderDetail)

    // 订单庄状态
    const orderStatus = (item) => {
        switch (item.status) {
            case 1:
                if (item.paymentStatus === 2) {
                    if (item.sendStatus === 1) {
                        return <div>待配送</div>
                    }
                    else if (item.sendStatus === 2) {
                        return <div>配送中</div>
                    }
                    else {
                        return <div>已配送</div>
                    }
                } else if (item.paymentStatus === 3) {
                    return <div>退款中</div>
                } else {
                    return <div>未支付</div>
                }
            case 2:
                return '已取消'
            case 3:
                return '已完成'
            default:
        }
    }

    // 评论栏
    // let [visible, setVisible] = useState(false);
    // const showDrawer = () => {
    //     setVisible(true);
    // };
    // const onClose = () => {
    //     setVisible(false);
    // };

    // 评价
    const handleCmt = () => {

        let data = {
            evaluation: cmt,
            evaluationPoint: point,
            id: orderId.id
        }
        console.log('comment:', data)
        axios({
            method: "post",
            url: url + '/api/order/evaluate',
            headers: { token },
            data: qs.stringify(data)
        }).then((res) => {
            console.log('订单详情:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                console.log(res.data.code)
                setRender(!render)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

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
        <div className="OrderItem">
            <PageHeader
                className="header"
                onBack={() => {
                    history.push('/order')
                }}
                title={
                    <div>{orderStatus(orderDetail)}</div>
                }
            />

            <Content>

                <List
                    header={shop.name}
                    itemLayout="vertical"
                    size="large"
                    dataSource={orderDetail.orderItemDtoList}
                    renderItem={item => (
                        <List.Item
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
                    <List.Item extra={<div>合计 ￥{orderDetail.total}</div>}></List.Item>

                    {
                        orderDetail.paymentStatus === 1 && orderDetail.status === 1 ?
                            <Space size={0} className='btn-wrap'>
                                <Button size='middle' shape='round' onClick={handleCancel}>取消订单</Button>
                                <Button type='primary' shape='round'
                                    className="check-btn"
                                    onClick={() => {
                                        history.push('/payment/' + orderId.id)
                                    }}>继续支付</Button>
                            </Space> : null
                    }

                    {
                        orderDetail.paymentStatus !== 1 && orderDetail.status === 1 ?
                            <Space size={0} className='btn-wrap'>
                                <Button size='middle' shape='round' onClick={handleCancel}>取消订单</Button>
                            </Space> : null
                    }

                    {
                        orderDetail.status === 3 && orderDetail.evaluation === '' && orderDetail.evaluationPoint === '0' ?
                            <List.Item>
                                {/* <Button size='small' onClick={showDrawer}>去评价</Button> */}
                                {/* <Drawer
                                title="评价"
                                placement="bottom"
                                closable={false}
                                onClose={onClose}
                                visible={visible}
                            > */}
                                <Form.Item>
                                    整体评分
                                    <Rate defaultValue={orderDetail.evaluationPoint} onChange={(value) => { setPoint(value) }} />
                                </Form.Item>
                                <Form.Item>
                                    评价内容
                                    <TextArea
                                        value={cmt}
                                        rows={4}
                                        onChange={(e) => { setCmt(e.target.value) }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" onClick={handleCmt}>
                                        提交
                                    </Button>
                                </Form.Item>
                                {/* </Drawer> */}
                            </List.Item> : null
                    }

                </List>

            </Content>

        </div >
    )
}

export default OrderItem