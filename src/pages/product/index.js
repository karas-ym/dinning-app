import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import qs from 'qs'
import { Link, useHistory } from 'react-router-dom'
import { List, PageHeader, Image, Layout, Tabs, Tag, message, InputNumber, Space } from 'antd'
import { PlusCircleFilled, MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons'
import './style.css'
import { TimeContext } from '../../App';
import Cart from './cart'
import TagBar from './components/tag-bar.js'
import url from '../../api'

const { Header, Content } = Layout
const { TabPane } = Tabs
const { CheckableTag } = Tag

function Product() {

    let token = window.localStorage.getItem('token')
    let userId = Number(window.localStorage.getItem('id'))
    let [render, setRender] = useState(false)

    let history = useHistory()
    let value = useContext(TimeContext)

    let [shopId, setShopId] = useState(value.shop)

    let [listData, setListData] = useState([])
    let [categoryId, setCategoryId] = useState(0)
    let [categories, setCategories] = useState([])
    let [tags, setTags] = useState([])
    let [selectedTags, setSelectedTags] = useState([])

    let [count, setCount] = useState(1)

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

    // 商品列表
    const getProduct = (tagId) => {
        let data = {
            weekday: Number(value.weekday),
            slot: slot,
            categoryId: Number(categoryId),
            tagId: tagId,
            shopId: shopId
        }
        console.log('data', data)
        axios({
            method: "get",
            url: url + '/api/product/list',
            params: {
                weekday: value.weekday,
                slot: slot,
                categoryId: Number(categoryId),
                tagId: tagId,
                shopId: value.shop
            }
        }).then((res) => {
            console.log('product:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                setListData(res.data.data.productDtos)
                console.log(res.data.code)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 加入购物车
    const addCart = (productId, shopId) => {

        let data = {
            productId: productId,
            qty: 1,
            userId: userId,
            shopId: shopId
        }

        console.log(data)

        axios({
            method: "post",
            url: url + '/api/cart/create',
            headers: { token },
            data: qs.stringify(data)
        }).then((res) => {
            console.log('addCart:', res.data)
            if (res.data.code !== 'SUCCESS') {
                message.info(res.data.message)
            } else {
                setRender(!render)
                // setCount(count + 1)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 获取分类
    const getCategories = () => {
        axios({
            method: "get",
            url: url + '/api/category/list',
            params: {
                shopId: value.shop
            }
        }).then((res) => {
            console.log('categoryList:', res.data)
            if (res.data.code !== 'SUCCESS') {
                console.log(res.data.message)
            } else {
                setCategories(res.data.data)
                console.log(res.data.code)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 获取标签
    const getTags = () => {
        axios({
            method: "get",
            url: url + '/api/tag/list',
        }).then((res) => {
            console.log('tags:', res.data)
            if (res.data.code !== 'SUCCESS') {

            } else {
                setTags(res.data.data)
                console.log(res.data.code)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 选择标签
    const handleTag = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        // console.log('已选标签: ', tag.id);
        setSelectedTags(nextSelectedTags);
        // checked ? setTagId(tag.id) : setTagId(0)
        checked ? getProduct(tag.id) : getProduct(0)
    }

    useEffect(() => {
        getProduct()
        getCategories()
        getTags()
    }, [categoryId])

    // 商品列表
    const productList = () => {
        return (
            <List size="large" dataSource={listData} itemLayout='horizontal'
                renderItem={(item) => (
                    <List.Item key={item.id}
                        actions={[
                            <div>
                                {
                                    count === 0 ?
                                        <PlusCircleFilled
                                            className={item.tags !== null ? 'add-icon' : 'add-icon-adjust'}
                                            style={{ color: '#1890ff', fontSize: '18px' }}
                                            onClick={() => {
                                                addCart(item.id, item.shopId)
                                            }} />
                                        :
                                        <Space className={item.tags !== null ? 'add-icon update-qty' : 'add-icon-adjust update-qty'}>
                                            <MinusCircleTwoTone style={{ fontSize: '16px' }}

                                            />
                                            <InputNumber min={0} value={count} style={{ width: '25px' }} size='small' />
                                            <PlusCircleTwoTone style={{ fontSize: '16px' }}

                                            />
                                        </Space>
                                }
                            </div>
                        ]}
                        extra={<div className='tags'>{
                            item.tags !== null ?
                                item.tags.map((i) => {
                                    return (
                                        <Tag key={i}>{i}</Tag>
                                    )
                                }) : null
                        }</div>}
                    >
                        <List.Item.Meta
                            avatar={<Image src={"http://" + item.cover} width={80} />}
                            title={<Link to={"/order/" + item.id}>{item.name}</Link>}
                            description={<div>￥{item.price}</div>}
                        />
                    </List.Item>
                )}
            >
            </List>
        )
    }


    return (
        <div className="Product">
            <PageHeader
                ghost={false}
                onBack={() => {
                    history.push('/')
                }}
                title="商品列表"
                subTitle={<div>  日期 {value.date} 时段 {value.time} 星期 {value.weekday}</div>}
                className='header'
            />

            <Content className='main'>
                {/* <TagBar value={setSelectedTags}></TagBar> */}
                <Header className='tags-wrap' >
                    {
                        tags.map((tag) => {
                            return (
                                <CheckableTag
                                    className='tags-checkbox'
                                    key={tag.id}
                                    checked={selectedTags.indexOf(tag) > -1}
                                    onChange={checked => handleTag(tag, checked)}
                                >
                                    {tag.name}
                                </CheckableTag>
                            )
                        })
                    }
                </Header>

                <div className='card-container'>
                    <Tabs type='card'
                        tabPosition='left'
                        defaultActiveKey={0}
                        onChange={(activeKey) => { setCategoryId(activeKey) }}
                        tabBarStyle={{ width: '90px' }}
                    >
                        <TabPane tab='全部' key={0}>
                            {productList()}
                        </TabPane>
                        {
                            categories.map(item => {
                                return (
                                    <TabPane tab={item.name} key={item.id} >
                                        {productList()}
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>

                    <Cart value={value.shop} render={render}></Cart>

                </div>
            </Content>
        </div >
    )
}

export default Product