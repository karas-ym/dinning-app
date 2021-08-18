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

export const TimeContext = React.createContext()

export const OrderContext = React.createContext()

function App() {

    let [date, setDate] = useState(null)
    let [time, setTime] = useState(null)
    let [weekday, setWeekday] = useState(null)
    let [orderDetail, setOrderDetail] = useState({})
    let [shop, setShop] = useState(null)

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
                            <Link to={'/'}>首页</Link>
                            <Link to={'/order'}>订单</Link>
                            <Link to={'/profile'}>我的</Link>
                        </div>

                    </div>
                </HashRouter>
            </TimeContext.Provider>
        </OrderContext.Provider>
    )
}

export default App
