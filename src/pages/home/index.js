import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {Space, message, Carousel} from 'antd'
import moment from 'moment';
import './style.css'
import {TimeContext} from '../../App';
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import 'moment/locale/zh-cn'


function Home(props) {

    //获取送餐地址
    if (window.sessionStorage.getItem('location') === null) {
        const searchParams = new URLSearchParams(props.location.search.substring(1))
        window.sessionStorage.setItem('location', searchParams.get("location"))
        window.sessionStorage.setItem('hospital', searchParams.get("hospital"))
    }


    let [date, setDate] = useState(null)    //日期变量
    const [weekday, setWeekday] = useState()        //周末变量

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
            return h < 11 ? false : true
        } else {
            return false
        }
    }

    const orderDi = () => {
        if (dateNow === d) {
            return h < 17 ? false : true
        } else {
            return false
        }
    }


    const dateFormat = 'YYYY-MM-DD';


    useEffect(() => {
        setDate(moment(new Date().toLocaleDateString()).format('YYYY-MM-DD'))
        setWeekday(moment(new Date().toLocaleDateString()).format('dddd'))
    }, [])

    const breakfast = () => {
        if (orderBr()) {
            message.warn('今日不可预定')
        } else {
            props.history.push('/shop?slot=' + 1 + '&time=' + date + '&weekday=' + weekday)
        }
    }

    const lunch = () => {
        if (orderLu()) {
            message.warn('今日不可预定')
        } else {
            props.history.push('/shop?slot=' + 2 + '&time=' + date + '&weekday=' + weekday)
        }
    }

    const dinner = () => {
        if (orderDi()) {
            message.warn('今日不可预定')
        } else {
            props.history.push('/shop?slot=' + 4 + '&time=' + date + '&weekday=' + weekday)
        }
    }


    return (
        <div className="Home">
            <div style={{width: '100vw'}}>
                <Carousel autoplay>
                    <div className={'picture-home'}>
                        <img className={'picture-home-img'}
                             src="https://cdn.pixabay.com/photo/2020/10/27/03/48/gioc-village-waterfall-5689446_960_720.jpg"
                             alt=""/>
                    </div>
                    <div className={'picture-home'}>
                        <img className={'picture-home-img'}
                             src="https://cdn.pixabay.com/photo/2021/08/12/10/38/mountains-6540497_960_720.jpg"
                             alt=""/>
                    </div>
                </Carousel>
            </div>

            <div className={'content-home'}>
                <Space direction="vertical" align="center" size={30}>
                    <div style={{fontSize: '18px', fontWeight: 700}}>食堂订餐</div>
                    <div className={'date'}>
                        <>
                            <button className={'date-btn'} onClick={() => {
                                if (new Date().getTime() >= (new Date(date).getTime() - 12 * 60 * 60 * 1000)) {
                                    message.warn('昨天不可预定')
                                } else {
                                    setDate(moment(new Date(date).getTime() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'))
                                    setWeekday(moment(new Date(date).getTime() - 24 * 60 * 60 * 1000).format('dddd'))
                                }
                            }}>
                                <LeftOutlined style={{color: '#fff'}}/>
                            </button>
                        </>

                        <span style={{color: 'red'}}>
                                预定日期：
                            <Space>
                                <>{date}</>
                                <>{weekday}</>
                            </Space>
                        </span>

                        <>
                            <button className={'date-btn'} onClick={() => {
                                if ((new Date(date).getTime() + 24 * 60 * 60 * 1000) - new Date().getTime() > 24 * 60 * 60 * 1000 * 2.5) {
                                    message.warn('预定不可超过两天')
                                } else {
                                    setDate(moment(new Date(date).getTime() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD'))
                                    setWeekday(moment(new Date(date).getTime() + 24 * 60 * 60 * 1000).format('dddd'))
                                }
                            }}>
                                <RightOutlined style={{color: '#fff'}}/>
                            </button>
                        </>
                    </div>


                    <div className={'period'}>
                        <div className={'time-one'} onClick={breakfast}>
                            <div className={'time-two-first'}>
                                <img className={'picture-home-img'}
                                     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                     alt=""/>
                            </div>
                            <div className={'time-two'}>
                                <div className={'time-bulletin'}>
                                    <Space>
                                        <span className={'title'}>早餐</span>
                                        {
                                            orderBr() ? <span className={'Display'}>今日不可预定</span> : null
                                        }
                                    </Space>
                                    <span>预定时间：当日6:00前</span>
                                    <span>统一配送：当日6:40-7:00</span>
                                </div>
                                <RightOutlined style={{fontSize: '15px', color: '#8c8080'}}/>
                            </div>
                        </div>

                        <div className={'time-one'} onClick={lunch}>
                            <div className={'time-two-first'}>
                                <img className={'picture-home-img'}
                                     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                     alt=""/>
                            </div>
                            <div className={'time-two'}>
                                <div className={'time-bulletin'}>
                                    <Space>
                                        <span className={'title'}>午餐</span>
                                        {
                                            orderLu() ? <span className={'Display'}>今日不可预定</span> : null
                                        }
                                    </Space>
                                    <span>预定时间：当日11:00前</span>
                                    <span>统一配送：当日11:40-12:00</span>
                                </div>
                                <RightOutlined style={{fontSize: '15px', color: '#8c8080'}}/>
                            </div>
                        </div>
                        <div className={'time-one'}>
                            <div className={'time-two-first'}>
                                <img className={'picture-home-img'}
                                     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                     alt=""/>
                            </div>
                            <div className={'time-two'} onClick={dinner}>
                                <div className={'time-bulletin'}>
                                    <Space>
                                        <span className={'title'}>晚餐</span>
                                        {
                                            orderDi() ? <span className={'Display'}>今日不可预定</span> : null
                                        }
                                    </Space>
                                    <span>预定时间：当日17:00前</span>
                                    <span>统一配送：当日17:40-18:00</span>
                                </div>
                                <RightOutlined style={{fontSize: '15px', color: '#8c8080'}}/>
                            </div>
                        </div>
                    </div>
                </Space>
            </div>
        </div>
    )
}

export default Home