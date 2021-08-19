import React, {useState} from 'react';
import './App.css';
import {HashRouter, Switch, Route, Link} from "react-router-dom"
import Home from './pages/home'
import Product from './pages/product'
import Order from './pages/order'
import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import OrderItem from './pages/order/order_item'
import Payment from './pages/payment'
import Postpay from './pages/postpay'
import ShopList from './temp'
import Shop from "./pages/shop";
import Userinfo from "./pages/register/userinfo";
import {ContainerOutlined, HomeOutlined, UserOutlined} from "@ant-design/icons";

export const TimeContext = React.createContext()

export const OrderContext = React.createContext()

function App() {

    let [date, setDate] = useState(null)
    let [time, setTime] = useState(null)
    let [weekday, setWeekday] = useState(null)
    let [orderDetail, setOrderDetail] = useState({})
    let [shop, setShop] = useState(null)
    const [number, setNumber] = useState(1)

    return (
        <OrderContext.Provider value={{orderDetail, setOrderDetail}}>
            <TimeContext.Provider value={{date, setDate, time, setTime, weekday, setWeekday, shop, setShop}}>
                <HashRouter>
                    <div className="App">
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/shop" component={Shop}/>

                            <Route path="/product" component={Product}/>

                            <Route exact path="/payment/:orderId" component={Payment}/>
                            <Route path="/postpay" component={Postpay}/>

                            <Route exact path="/order" component={Order}/>
                            <Route path="/order/:id" component={OrderItem}/>

                            <Route path="/login" component={Login}/>

                            <Route path="/register" component={Register}/>
                            <Route path="/userinfo" component={Userinfo}/>

                            <Route path="/profile" component={Profile}/>

                            <Route path="/shops" component={ShopList}/>

                        </Switch>

                        <div className="footer">
                            <Link to={'/'} onClick={() => {
                                setNumber(1)
                            }}>
                                <div key={1} className={number === 1 ? 'footer-block footer-one' : 'footer-block'}>
                                    <HomeOutlined className={'footer-icon'}/>
                                    <span className={number === 1 ? 'footer-name footer-one' : 'footer-name'}>首页</span>
                                </div>
                            </Link>
                            <Link to={'/order'} onClick={() => {
                                setNumber(2)
                            }}>
                                <div className={number === 2 ? 'footer-block footer-one' : 'footer-block'}>
                                    <ContainerOutlined className={'footer-icon'}/>
                                    <span className={number === 2 ? 'footer-name footer-one' : 'footer-name'}>订单</span>
                                </div>
                            </Link>
                            <Link to={'/profile'} onClick={() => {
                                setNumber(3)
                            }}>
                                <div className={number === 3 ? 'footer-block footer-one' : 'footer-block'}>
                                    <UserOutlined className={'footer-icon'}/>
                                    <span className={number === 3 ? 'footer-name footer-one' : 'footer-name'}>我的</span>
                                </div>
                            </Link>
                        </div>

                    </div>
                </HashRouter>
            </TimeContext.Provider>
        </OrderContext.Provider>
    )
}

export default App
