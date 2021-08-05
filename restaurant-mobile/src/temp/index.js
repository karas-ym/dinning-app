import React, { useState, useEffect } from 'react';
import axios from 'axios'
// import './style.css'
import url from '../api'
import cover from '../cover/food.png'

import { Card, Col, Row, Input } from 'antd';

const { Meta } = Card;


function Add_comments() {

    // 获取商店列表
    let [shopList, setShopList] = useState([])

    const getShop = () => {
        axios({
            method: "get",
            url: url + '/api/shop/list',
            params: {
                hospitalId: 1
            }
        }).then((res) => {
            console.log('shop:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                console.log(res.data.code)
                setShopList(res.data.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getShop()
    }, [])

    return (
        <div>

            <Row gutter={16}>
                <Col span={12}>
                    <Card
                        // style={{ width: 200 }}
                        size='large'
                        cover={<img alt="example" src={cover} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        // style={{ width: 200 }}
                        size='large'
                        cover={<img alt="example" src={cover} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                </Col>
            </Row>

        </div >
    )
}

export default Add_comments