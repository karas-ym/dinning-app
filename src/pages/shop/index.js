import React, {useEffect, useState} from 'react';
import axios from "axios";
import url from "../../api"
import {message} from "antd"
import {LeftOutlined, StarFilled} from "@ant-design/icons";
import './index.css'


function Shop(props) {

    const searchParams = new URLSearchParams(props.location.search.substring(1))
    let slot = searchParams.get("slot")
    let date = searchParams.get("time")
    let weekday = searchParams.get("weekday")

    console.log(slot)
    console.log(date)
    console.log(weekday)

    // 获取商店列表
    let [shopList, setShopList] = useState([])
    const getShop = () => {
        axios({
            method: "get",
            url: url + '/api/shop/list',
            params: {
                hospitalId: window.sessionStorage.getItem('hospital')
            }
        })
            .then((res) => {

                if (res.data.code === "SUCCESS") {
                    console.log(res.data.data)
                    setShopList(res.data.data)
                }
            })
            .catch((error) => {
                message.error(error.toString())
            })
    }

    useEffect(() => {
        getShop()
    }, [])


    return (
        <div>
            <div className={'title1'}>
                <LeftOutlined style={{fontSize: 22}} onClick={() => window.history.back()}/>
                <div>店铺列表</div>
                <span></span>
            </div>

            <div className={'shop-content'}>
                {
                    shopList.map((item, index) => {
                        return (
                            <div className={'shop-table'} key={index}>
                                <div className={'shop-table-content'}>
                                    <img style={{width: 80, height: 80}}
                                         src="https://cdn.pixabay.com/photo/2021/06/27/14/32/raspberry-6368999_960_720.png"
                                         alt=""/>
                                    <div className={'content-describe'}>
                                        <span className={'content-describe-title'}>{item.name}</span>
                                        <span style={{color: '#CCCCCCFF'}}>40人吃过</span>
                                        <span><StarFilled style={{color:' #ffc300'}}/> 5.0</span>
                                    </div>
                                </div>
                                <button
                                    className={'order-dishes'}
                                    onClick={() => {
                                        props.history.push('/product?id=' + item.id + '&slot=' + slot + '&time=' + date + '&weekday=' + weekday + '&name=' + item.name)
                                        console.log();
                                    }}>
                                    点单
                                </button>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    );
}

export default Shop;