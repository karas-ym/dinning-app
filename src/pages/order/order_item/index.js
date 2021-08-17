import React, {useState, useEffect} from 'react';
import axios from 'axios'
import qs from 'qs'
import './style.css'
import {PageHeader, List, Button, Layout, Input, Form, Rate, message, Space, Divider, Avatar, Typography} from 'antd'
import {useHistory, useParams} from 'react-router-dom';

import url from '../../../api'

const {Content} = Layout
const {TextArea} = Input;

function OrderItem() {
    const {Text} = Typography;

    let token = window.localStorage.getItem('token')

    let history = useHistory()

    let orderId = useParams() //地址栏获取订单id

    let [render, setRender] = useState(false)

    let [orderDetail, setOrderDetail] = useState({
        hospital: {},
        location: {},
    })

    let [cmt, setCmt] = useState('')
    let [point, setPoint] = useState()
    let [shop, setShop] = useState({})

    useEffect(() => {
        console.log(orderId)

        axios({
            method: "get",
            url: url + '/api/order/detail',
            headers: {token},
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
                    } else if (item.sendStatus === 2) {
                        return <div>配送中</div>
                    } else {
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
            headers: {token},
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
            headers: {token},
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
                onBack={() => {
                    window.history.back()
                }}
                title={
                    <div>{orderStatus(orderDetail)}</div>
                }/>

            <Content style={{backgroundColor: "#f8f8f8"}}>
                <Divider orientation="left" style={{
                    backgroundColor: "#fff",
                    padding: '10px 0',
                    fontSize: 18,
                    fontWeight: 700
                }}>{shop.name}</Divider>
                <List
                    itemLayout="vertical"
                    size="large"
                    header={<Text strong style={{fontSize: 18}}>餐品</Text>}
                    style={{backgroundColor: "#fff", marginTop: 10}}
                    dataSource={orderDetail.orderItemDtoList}
                    renderItem={item => (
                        <div className={'item'}>
                            <List.Item
                                style={{borderBottom: '2px solid #f8f8f8'}}
                                key={item.id}
                                extra={
                                    <div style={{display: 'flex', alignItems: 'center',flexDirection: 'column'}}>
                                        <div>￥{item.price}</div>
                                        <div>* {item.qty}</div>
                                    </div>
                                }>
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size={64} src={'http://' + item.cover}/>}
                                    title={<span>{item.productName}</span>}/>
                            </List.Item>
                        </div>
                    )}>

                    <List.Item extra={<div>合计 ￥{orderDetail.total}</div>}></List.Item>

                    {
                        orderDetail.paymentStatus === 1 && orderDetail.status === 1 ?
                            <Space size={10} className='btn-wrap'>
                                <Button size='middle' shape='round' onClick={handleCancel}
                                >取消订单</Button>
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
                                <Button size='middle' shape='round' onClick={handleCancel}
                                        type={'primary'}>取消订单</Button>
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
                                    <Rate defaultValue={orderDetail.evaluationPoint} onChange={(value) => {
                                        setPoint(value)
                                    }}/>
                                </Form.Item>
                                <Form.Item>
                                    评价内容
                                    <TextArea
                                        value={cmt}
                                        rows={4}
                                        onChange={(e) => {
                                            setCmt(e.target.value)
                                        }}
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

                <div className={'orderD'}>
                    <Text strong style={{fontSize: 18}}>配送信息</Text>
                    <Divider/>
                    <div className={'row'}>
                        <Text type="secondary">配送时间</Text>
                        <Text>立即配送</Text>
                    </div>
                    <div className={'row'}>
                        <Text type="secondary">配送地址</Text>
                        <Text>{orderDetail.hospital.name +
                        orderDetail.location.department +
                        orderDetail.location.bunk + "房" +
                        orderDetail.location.room + "床"}</Text>
                    </div>
                    <div className={'row'}>
                        <Text type="secondary">配送服务</Text>
                        <Text>商家配送</Text>
                    </div>
                </div>

                <div className={'orderD'}>
                    <Text strong style={{fontSize: 18}}>订单详情</Text>
                    <Divider/>
                    <div className={'row'}>
                        <Text type="secondary">订单号码</Text>
                        <Text>{orderDetail.number}</Text>
                    </div>
                    <div className={'row'}>
                        <Text type="secondary">下单时间</Text>
                        <Text>{orderDetail.createAt}</Text>
                    </div>
                    <div className={'row'}>
                        <Text type="secondary">餐具数量</Text>
                        <Text>依据用餐量提供</Text>
                    </div>
                </div>

            </Content>

        </div>
    )
}

export default OrderItem