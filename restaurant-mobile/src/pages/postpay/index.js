import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom';

import url from '../../api'
import { OrderContext } from '../../App'

function Postpay() {

    let token = window.localStorage.getItem('token')
    let history = useHistory()
    let value = useContext(OrderContext)

    let [status, setStatus] = useState()
    let [time, setTime] = useState(5)

    const timer = () => {
        let timer = setInterval(() => {
            setTime(time--)
            if (time < 0) {
                clearInterval(timer)
                history.push('/')
            }
        }, 1000)
    }

    useEffect(() => {
        console.log(value.orderDetail.id)
        axios({
            method: "get",
            url: url + '/api/order/detail',
            headers: { token },
            params: {
                orderId: value.orderDetail.id
            }
        }).then((res) => {
            console.log('支付状态:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                console.log(res.data.code)
                setStatus(res.data.data[0].status)
                timer()
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [token, timer])

    return (
        <>
            {
                status === 2 ?
                    <Result
                        status="success"
                        title="支付成功"
                        subTitle={"等待" + time + "s回到首页"}
                        extra={[
                            <Button type="primary" key="console" onClick={() => {
                                history.push('/')
                            }}>
                                点击跳转
                            </Button>
                        ]}
                    /> : null
            }
        </>

    )
}

export default Postpay