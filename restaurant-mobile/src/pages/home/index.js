import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader, Button, DatePicker, Radio, Space, message, Select } from 'antd'
import moment from 'moment';
import './style.css'
import { TimeContext } from '../../App';
import url from '../../api'

const { Header, Content } = Layout
const { Option } = Select;

function Home() {

    let history = useHistory()

    let [date, setDate] = useState(null)    // 
    let [time, setTime] = useState(null)    // 时段 1 2 4, 

    let value = useContext(TimeContext)

    const getDay = (day) => {
        switch (day) {
            case 'Monday':
                return '1'
            case 'Tuesday':
                return '2'
            case 'Wednesday':
                return '3'
            case 'Thursday':
                return '4'
            case 'Friday':
                return '5'
            case 'Saturday':
                return '6'
            case 'Sunday':
                return '7'
            default:
        }
    }

    // 获取日期
    function onChangeDate(date, dateString) {
        // 获取星期几
        let weekday
        if (date != null) {
            weekday = date.format('dddd')
            weekday = getDay(weekday)
        }
        setDate(dateString)
        value.setDate(dateString)
        value.setWeekday(weekday)
    }

    // 可选日期范围
    function disabledDate(current) {
        // Can not select days before today and today
        // return current || current < moment().endOf('day');
        return current > moment().add(2, "day") || current < moment().startOf('day');
    }

    // 当前日期和时间 是否可以订餐
    let day = new Date()
    let h = day.getHours()
    let d = day.getDate()
    let dateNow
    if (date != null) {
        dateNow = Number(date.slice(8))
    }

    const orderBr = () => {
        if (dateNow === d) {
            return h < 6 ? false : true
        } else {
            return false
        }
    }

    const orderLu = () => {
        if (dateNow === d) {
            return h < 10 ? false : true
        } else {
            return false
        }
    }

    const orderDi = () => {
        if (dateNow === d) {
            return h < 20 ? false : true
        } else {
            return false
        }
    }

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

    const handleShop = (e) => {
        value.setShop(e)
    }

    useEffect(() => {
        getShop()
    }, [])

    return (
        <Layout className="Home">

            <Header className="header">
                <PageHeader
                    className=""
                    title="订餐首页"
                />
            </Header>

            <Content>
                <Space direction="vertical" align="center" size={30}>

                    <Select placeholder="选择店铺" style={{ width: 120 }} onChange={handleShop}>
                        {
                            shopList.map((item) => {
                                return (
                                    item.status === 1 ?
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                        : null
                                )
                            })
                        }
                    </Select>

                    <DatePicker
                        placeholder='选择订餐日期'
                        disabledDate={disabledDate}
                        locale='ch'
                        onChange={onChangeDate}
                        allowClear="true"
                    />

                    <Radio.Group buttonStyle="solid"
                        onChange={(e) => {
                            setTime(e.target.value)
                            value.setTime(e.target.value)
                        }}
                    >
                        <Radio.Button value="早餐" disabled={orderBr()}>早餐</Radio.Button>
                        <Radio.Button value="午餐" disabled={orderLu()}>午餐</Radio.Button>
                        <Radio.Button value="晚餐" disabled={orderDi()}>晚餐</Radio.Button>
                    </Radio.Group>

                    <div>预定日期: {date}</div>
                    <div>预定时段: {time}</div>

                    <Button type="primary" onClick={() => {
                        if (date !== null && time !== null && value.shop !== null) {
                            history.push('/product')
                        } else if (value.shop === null) {
                            message.info('请选择店铺')
                        } else {
                            message.info('请选择订餐时间')
                        }
                    }}>去订餐</Button>
                </Space>
            </Content>

        </Layout >
    )
}

export default Home