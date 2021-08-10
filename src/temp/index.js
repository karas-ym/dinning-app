import React, {useState, useEffect} from 'react';
import axios from 'axios'
import './style.css'
import url from '../api'
import cover from '../cover/food.png'

import {PageHeader, List, Image} from 'antd';
import {useHistory} from 'react-router-dom';


function Add_comments() {

    let history = useHistory()


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
        <div className='Shop-list'>

            <PageHeader
                onBack={() => {
                    history.push('/')
                }}
                title="商家列表"
                className='header'
            />


            <List size="large" dataSource={shopList} itemLayout='horizontal' split
                // style={{ backgroundColor: '#fcfcfc' }}
                  renderItem={(item) => (
                      <List.Item key={item.id}
                                 style={{backgroundColor: '#fcfcfc'}}
                                 className='list-row'
                      >
                          <List.Item.Meta
                              avatar={<Image src={cover} width={80} className='shop-cover'/>}
                              title={<div className='shop-name'>{item.name}</div>}
                          />
                      </List.Item>
                  )}
            >
            </List>


        </div>
    )
}

export default Add_comments