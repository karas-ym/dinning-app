import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useHistory} from 'react-router-dom';
import {Result, message} from 'antd'
import './style.css'

import url from '../../api'


function Order(props) {
    let token = window.localStorage.getItem('token')

    const [listData, setListData] = useState([])

    useEffect(() => {
        if (token !== null) {
            getOrderList()
        } else {
            props.history.push('/login')
        }
    }, [])

    const getOrderList = () => {
        axios({
            method: "get",
            url: url + '/api/order/userOrderList',
            headers: {token},
        }).then((res) => {
            console.log('order:', res.data)
            if (res.data.code !== 'SUCCESS') {
                message.error(res.data.message)
            } else {
                setListData(res.data.data.orderDetailDto)
            }
        })
            .catch((error) => {
                message.error(error.toString())
            })
    }

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


    return (
        <>
            <div className={'title4'}>
                <div>订单</div>
            </div>

            <div className="Order">
                {
                    listData.map((item, index) => {
                        return (
                            <div className={'order-item'} key={index}>
                                <div className={'order-item-message'}>
                                    <div className={'order-item-message-name'}>
                                        <div className={'order-item-message-img'}>
                                            <img
                                                src="https://cdn.pixabay.com/photo/2021/06/27/14/32/raspberry-6368999_960_720.png"
                                                alt=""/>
                                        </div>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold'
                                        }}>{item.shop.name}</span>
                                    </div>
                                    <div className={'order-item-message-status'}>
                                                <span style={{
                                                    color: '#a1a1a1',
                                                    fontSize: '15px'
                                                }}>{orderStatus(item)}</span>
                                    </div>
                                </div>

                                <div className={'order-item-product'}>
                                    <div style={{display: 'flex',}}>
                                        {
                                            item.orderItemDtoList.map((item, index) => {
                                                return (
                                                    <div className={'order-item-product-img'} key={index}>
                                                        <img src={'http://' + item.cover} alt=""/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={'total'}>
                                        <span>￥{item.total}</span>
                                        <span style={{
                                            color: '#a1a1a1',
                                            fontSize: '13px'
                                        }}>共{item.orderItemDtoList.length}件</span>
                                    </div>
                                </div>

                                <div className={'order-item-btn'}>
                                    <button onClick={() => props.history.push("/order/" + item.id)}>查看订单
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>

    )
}

export default Order