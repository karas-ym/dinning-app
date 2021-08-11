import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import {Layout, PageHeader, Button, DatePicker, Radio, Space, message, Select} from 'antd'
import moment from 'moment';
import './style.css'
import {TimeContext} from '../../App';
import url from '../../api'

const {Header, Content} = Layout
const {Option} = Select;

function Home(props) {

    //获取送餐地址
    const searchParams = new URLSearchParams(props.location.search.substring(1))
    window.localStorage.setItem('location', searchParams.get("location"))

    let history = useHistory()

    let [date, setDate] = useState(null)    // 
    let [time, setTime] = useState(null)    // 时段 1 2 4,
    let [selectShop, setSelectShop] = useState() //

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
        })
            .then((res) => {
                if (res.data.code === 'ERROR') {
                    message.error(res.data.message)
                } else if (res.data.code === 'SUCCESS') {
                    setShopList(res.data.data)
                    setSelectShop(res.data.data[0].name);
                    setShopId(res.data.data[0].id)
                }
            })
            .catch((error) => {
                message.error(error.toString())
            })
    }


    const [shopId, setShopId] = useState()
    const handleShop = (e) => {
        setShopId(e)
    }

    const dateFormat = 'YYYY-MM-DD';

    useEffect(() => {
        getShop()
        setDate(moment(new Date().toLocaleDateString()).format('YYYY-MM-DD'))
    }, [])

    return (
        <Layout className="Home">

            <Header className="header">
                <PageHeader
                    className=""
                    title="订餐首页"/>
            </Header>

            <Content>
                <Space direction="vertical" align="center" size={30}>

                    <Select placeholder="选择店铺" defaultValue={selectShop} key={selectShop} style={{width: 120}}
                            onChange={handleShop}>
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
                        defaultValue={moment(new Date().toLocaleDateString(), dateFormat)} format={dateFormat}
                        allowClear/>

                    <Radio.Group buttonStyle="solid"
                                 onChange={(e) => {
                                     setTime(e.target.value)
                                     value.setTime(e.target.value)
                                 }}>
                        <Radio.Button value="早餐" disabled={orderBr()}>早餐</Radio.Button>
                        <Radio.Button value="午餐" disabled={orderLu()}>午餐</Radio.Button>
                        <Radio.Button value="晚餐" disabled={orderDi()}>晚餐</Radio.Button>
                    </Radio.Group>

                    <div>预定日期: {date}</div>
                    <div>预定时段: {time}</div>

                    <Button type="primary" onClick={() => {
                        if (date !== null && time !== null && shopId !== null && date !== '') {
                            history.push('/product?id=' + shopId + '&slot=' + time + '&time=' + date)
                        } else if (shopId === null) {
                            message.info('请选择店铺')
                        } else {
                            message.info('请选择订餐时间')
                        }
                    }}>去订餐</Button>
                </Space>
            </Content>

        </Layout>
    )
}

export default Home