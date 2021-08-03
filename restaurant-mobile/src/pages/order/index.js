import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom';
import { PageHeader, Tabs, List, Space, Button, Result } from 'antd'
import './style.css'

import url from '../../api'
import { OrderContext } from '../../App'

const { TabPane } = Tabs

function Order() {

    let history = useHistory()
    let value = useContext(OrderContext)
    let token = window.localStorage.getItem('token')

    const [listData, setListData] = useState([])

    useEffect(() => {

        axios({
            method: "get",
            url: url + '/api/order/userOrderList',
            headers: { token },
        }).then((res) => {
            console.log('order:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                setListData(res.data.data.orderDetailDto)
            }
        }).catch((error) => {
            console.log(error)
        })

    }, [token])

    const orderStatus = (item) => {
        switch (item.status) {
            case 1:
                if (item.paymentStatus === 2) {
                    if (item.sendStatus === 1) {
                        return <div>待配送</div>
                    }
                    else if (item.sendStatus === 2) {
                        return <div>已打包</div>
                    }
                    else {
                        return <div>已配送</div>
                    }
                } else if (item.paymentStatus === 3) {
                    return <div>退款中</div>
                } else {
                    return <div>未支付</div>
                }
                break
            case 2:
                return '已取消'
            case 3:
                return '已完成'
            default:
        }
    }


    if (token === null) {
        return (
            <>
                <PageHeader
                    className="header"
                    backIcon="false"
                    title="订单信息"
                />

                <Result
                    title="您还未登录"
                    key={token}
                    extra={[
                        <Button type='primary' size='large' onClick={() => {
                            history.push('/login')
                        }}>登录</Button>,
                        <Button type='default' size='large' onClick={() => {
                            history.push('/register')
                        }}>注册</Button>
                    ]}
                />
            </>
        )
    } else {
        return (
            <div className="Order">
                <PageHeader
                    className="header"
                    backIcon="false"
                    title="订单信息"
                />

                <div className="card-container">
                    <Tabs type="card">
                        <TabPane tab="全部订单" key="1">
                            <List itemLayout="vertical" size="large" dataSource={listData}
                                renderItem={item => (
                                    <List.Item
                                        key={item.id}
                                        onClick={() => {
                                            value.setOrderDetail(item)
                                            history.push("/order/" + item.id)
                                        }}
                                        extra={
                                            <Space direction='vertical' size={10}>
                                                {orderStatus(item)}
                                                <div>￥{item.total}</div>
                                            </Space>
                                        }
                                    >
                                        <List.Item.Meta
                                            title={<span>{item.shop.name}</span>}
                                            description={
                                                item.orderItemDtoList.map((product) => {
                                                    return (
                                                        <div key={product.id}>{product.productName} x {product.qty}</div>
                                                    )
                                                })
                                            }
                                        />
                                    </List.Item>
                                )}
                            >
                            </List>
                        </TabPane>

                        <TabPane tab="退款" key="2">

                        </TabPane>
                    </Tabs>
                </div>

            </div>
        )
    }
}

export default Order