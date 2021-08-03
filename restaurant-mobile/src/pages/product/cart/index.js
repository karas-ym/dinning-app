import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import qs from 'qs'
import { useHistory } from 'react-router-dom'
import { List, InputNumber, Button, Drawer, Badge, Checkbox, Space, Divider } from 'antd'
import { ShoppingCartOutlined, MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import './style.css'

import { TimeContext } from '../../../App';
import { OrderContext } from '../../../App'

import url from '../../../api'

function Cart(props) {

    let token = window.localStorage.getItem('token')
    let userId = Number(window.localStorage.getItem('id'))

    let [render, setRender] = useState(true)

    let history = useHistory()

    // 获取订餐的日期和时段
    let value = useContext(TimeContext)
    let orderContext = useContext(OrderContext)


    const getSlot = (time) => {
        switch (time) {
            case '早餐':
                return 1
            case '午餐':
                return 2
            case '晚餐':
                return 4
            default:
        }
    }

    let slot = getSlot(value.time)

    // 购物车是否可见
    let [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    // 获取购物车
    let [listCart, setListCart] = useState([])

    useEffect(() => {
        axios({
            method: "get",
            url: url + '/api/cart/list',
            headers: { token },
            params: {
                userId: userId
            },
        }).then((res) => {
            console.log('cart:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                setListCart(res.data.data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [render, userId, token, props]);

    // 增减购物车商品
    const updateCart = (productId, cartId, qty, shopId) => {

        let data = {
            id: cartId,
            productId: productId,
            qty: qty,
            userId: userId,
            shopId: shopId
        }

        console.log('update:', data)

        axios({
            method: "post",
            url: url + '/api/cart/update',
            headers: { token },
            data: qs.stringify(data)
        }).then((res) => {
            console.log('addCart:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                setRender(!render)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 选中商品
    let [productList, setProductList] = useState([])
    const selectProduct = (id, checked) => {
        const idList = checked ? [...productList, id] : productList.filter(i => i !== id);
        console.log('pid: ', idList);
        setProductList(idList);
    }

    // 选中商品控制
    let [checkedList, setCheckedList] = useState([]);
    let [indeterminate, setIndeterminate] = useState(false);
    let [checkAll, setCheckAll] = useState(false);

    const onChange = (value, id) => {
        const list = value ? [...checkedList, id] : checkedList.filter(i => i !== id);
        console.log('list:', list)

        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < listCart.length);
        setCheckAll(list.length === listCart.length);
    };

    const onCheckAllChange = (e) => {
        let tempList = []
        for (let i = 0; i < listCart.length; i++) {
            tempList = [...tempList, listCart[i].cart.id]
        }
        setCheckedList(e.target.checked ? tempList : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);

        let total = 0
        for (let i = 0; i < listCart.length; i++) {
            total += (listCart[i].cart.qty * listCart[i].productDetail.product.price)
        }

        setPriceSum(e.target.checked ? total : 0)
    };

    // 计算总价
    let [priceSum, setPriceSum] = useState(0)
    const handleCheck = (price, qty, checked) => {
        price = Number(price)
        let sum = priceSum
        sum = checked ? sum = sum + (qty * price) : sum = sum - (qty * price);
        console.log('total: ', sum);
        setPriceSum(sum);
    }



    // 创建订单 跳转支付
    const checkout = () => {

        let data = {
            cartIdArr: productList.join(','),
            day: value.date,
            slot: slot,
            locationId: 1,
            userId: userId,
            shopId: 2
        }

        console.log('check-data:', data)

        axios({
            method: "post",
            url: url + '/api/order/create',
            headers: { token },
            data: qs.stringify(data)
        }).then((res) => {
            console.log('check:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                orderContext.setOrderDetail(res.data.data[0])
                history.push("/payment/" + res.data.data[0].id)
            }
        }).catch((error) => {
            console.log(error)
        })

    }



    return (
        <div className='Cart'>
            <Badge count={listCart.length} className="cart">
                <Button type="primary" shape="round" onClick={showDrawer} icon={<ShoppingCartOutlined />}>
                    购物车
                </Button>
            </Badge>
            <Drawer
                className='drawer'
                title="购物车"
                placement="right"
                onClose={onClose}
                visible={visible}
            >

                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                    全选
                </Checkbox>
                <Divider />

                <List size="small" dataSource={listCart}
                    renderItem={(item) => (
                        <List.Item  
                            key={item.cart.id}
                            actions={[
                                <Space>
                                    <MinusCircleTwoTone style={{ fontSize: '16px' }}
                                        onClick={() => {
                                            updateCart(item.cart.productId, item.cart.id, item.cart.qty - 1, item.cart.shopId)
                                            if (checkedList.indexOf(item.cart.id) > -1) {
                                                handleCheck(item.productDetail.product.price, 1, false)
                                            }
                                        }}
                                    />
                                    <InputNumber min={0} value={item.cart.qty} style={{ width: '25px' }} size='small' />
                                    <PlusCircleTwoTone style={{ fontSize: '16px' }}
                                        onClick={() => {
                                            updateCart(item.cart.productId, item.cart.id, item.cart.qty + 1, item.cart.shopId)
                                            if (checkedList.indexOf(item.cart.id) > -1) {
                                                handleCheck(item.productDetail.product.price, 1, true)
                                            }
                                        }}
                                    />
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Checkbox
                                        checked={checkedList.indexOf(item.cart.id) > -1 ? true : false}
                                        onChange={(e) => {
                                            selectProduct(item.cart.id, e.target.checked)
                                            handleCheck(item.productDetail.product.price, item.cart.qty, e.target.checked)
                                            onChange(e.target.checked, item.cart.id)
                                        }}></Checkbox>
                                }
                                title={<span>{item.productDetail.product.name}</span>}
                                description={<span> ￥{item.productDetail.product.price}</span>}
                            />
                        </List.Item>
                    )}
                >
                    <List.Item>合计: {priceSum}</List.Item>
                </List>

                <Button onClick={checkout}>去结算</Button>
            </Drawer>
        </div>
    )
}

export default Cart