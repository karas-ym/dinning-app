import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import qs from 'qs'
import {useHistory} from 'react-router-dom'
import {List, PageHeader, Image, Layout, Tabs, Tag, message, InputNumber, Space, Typography, Button, Badge} from 'antd'
import {MinusCircleTwoTone, PlusCircleTwoTone, ShoppingCartOutlined, PlusCircleFilled} from '@ant-design/icons'
import './style.css'
import {TimeContext} from '../../App';
import Cart from './cart'
import url from '../../api'

const {Header, Content} = Layout
const {TabPane} = Tabs
const {CheckableTag} = Tag

function Product(props) {
    const {Text} = Typography;
    let token = window.localStorage.getItem('token')
    let [render, setRender] = useState(false)
    let location = window.localStorage.getItem('location')

    console.log(location)

    // let history = useHistory()
    let value = useContext(TimeContext)

    let [listData, setListData] = useState([])
    let [cartqty, setCartqty] = useState([])
    let [categoryId, setCategoryId] = useState(0)
    let [categories, setCategories] = useState([])
    let [tags, setTags] = useState([])
    let [selectedTags, setSelectedTags] = useState([])
    let [num, setNum] = useState()


    const getSlot = (slot) => {
        switch (slot) {
            case '早餐':
                return 1
            case '午餐':
                return 2
            case '晚餐':
                return 4
            default:
        }
    }


    const searchParams = new URLSearchParams(props.location.search.substring(1))
    let id = searchParams.get("id")
    let slot = searchParams.get("slot")
    let date = searchParams.get("time")
    let weekday = new Date(searchParams.get("time")).getDay()


    // 商品列表
    const getProduct = (value) => {
        axios({
            method: "get",
            url: url + '/api/product/list',
            params: {
                weekday: weekday === 0 ? 7 : weekday,
                slot: getSlot(slot),
                categoryId: Number(categoryId),
                tagId: value,
                shopId: id
            }
        })
            .then((res) => {
                if (res.data.code === 'ERROR') {
                    message.error(res.data.data.message)
                } else {
                    setListData(res.data.data.productDtos)
                    if (window.localStorage.getItem('token') !== null) {
                        cartList(res.data.data.productDtos)
                    }
                }
            })
            .catch((error) => {
                message.error(error.toString())
            })
        getCategories()
        getTags()
    }

    // 加入购物车
    const addCart = (productId, shopId, num) => {

        let data = {
            productId: productId,
            qty: num,
            shopId: shopId
        }

        axios({
            method: "post",
            url: url + '/api/cart/update',
            headers: {token},
            data: qs.stringify(data)
        }).then((res) => {
            if (res.data.code === 'ERROR') {
                message.info(res.data.message)
            } else if (res.data.code === 'SUCCESS') {
                setRender(!render)
                // setCount(count + 1)
                cartList(listData)
            }
        }).catch((error) => {
            message.error(error.toString())
        })
    }

    // 获取分类
    const getCategories = () => {
        axios({
            method: "get",
            url: url + '/api/category/list',
            params: {
                shopId: id
            }
        })
            .then((res) => {
                if (res.data.code === 'ERROR') {
                    message.error(res.data.message)
                } else if (res.data.code === 'SUCCESS') {
                    setCategories(res.data.data)
                }
            })
            .catch((error) => {
                message.error(error.toString())
            })
    }

    // 获取标签
    const getTags = () => {
        axios({
            method: "get",
            url: url + '/api/tag/list',
        }).then((res) => {
            if (res.data.code === 'ERROR') {
                message.error(res.data.message);
            } else if (res.data.code === 'SUCCESS') {
                setTags(res.data.data)
            }
        }).catch((error) => {
            message.error(error.toString())
        })
    }

    //获取购物车列表
    function cartList(listData) {
        axios({
            method: "get",
            url: url + '/api/cart/list',
            headers: {token},
        })
            .then((res) => {
                cartqty = res.data.data
                setCartqty(cartqty)
                for (let i = 0; i < listData.length; i++) {
                    listData[i].count = 0
                    for (let j = 0; j < cartqty.length; j++) {
                        if (cartqty[j].cart.productId === listData[i].id) {
                            listData[i].count = cartqty[j].cart.qty
                        }
                    }
                }
                setListData([...listData])
            })
            .catch((error) => {
                message.error(error.toString())
            })
    }


    // 选择标签
    const handleTag = (tag, checked) => {
        console.log(tag, checked)
        // const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
        // console.log(nextSelectedTags)
        // setSelectedTags(nextSelectedTags);
        // checked ? setTagId(tag.id) : setTagId(0)
        // checked ? getProduct(tag.id) : getProduct()
        if (checked) {
            getProduct(tag.id)
        } else {
            getProduct()
        }
    }

    useEffect(() => {
        getProduct()
    }, [categoryId, num])

    const iii = (i) => {
        setNum(i)
    }


    // 商品列表
    const productList = () => {
        return (
            <List size="large"
                  style={{marginBottom:65}}
                  dataSource={listData}
                  itemLayout='horizontal'
                  renderItem={(item) => {
                      return (
                          <List.Item key={item.id}
                                     actions={[
                                         <div>
                                             {
                                                 token === null ?
                                                     <PlusCircleFilled
                                                         className={item.tags !== null ? 'add-icon' : 'add-icon-adjust'}
                                                         style={{color: '#1890ff', fontSize: '18px'}}
                                                         onClick={() => {
                                                             addCart(item.id, item.shopId)
                                                         }}/>
                                                     :
                                                     <Space
                                                         className={item.tags !== null ? 'add-icon update-qty' : 'add-icon-adjust update-qty'}>
                                                         <MinusCircleTwoTone style={{fontSize: '16px'}}
                                                                             onClick={() => {
                                                                                 for (let i = 0; i < listData.length; i++) {
                                                                                     if (item.id === listData[i].id) {
                                                                                         if (listData[i].count <= 0) {
                                                                                             return
                                                                                         }
                                                                                         listData[i].count = listData[i].count - 1
                                                                                         addCart(item.id, id, listData[i].count)
                                                                                         console.log(listData[i].count)
                                                                                         break
                                                                                     }
                                                                                 }
                                                                                 setListData([...listData])
                                                                             }}/>
                                                         <InputNumber value={item.count || 0}
                                                                      maxLength={2}
                                                                      style={{width: '30px'}}
                                                                      bordered={false}
                                                                      readOnly={true}
                                                                      size='small'
                                                         />
                                                         <PlusCircleTwoTone style={{fontSize: '16px'}}
                                                                            onClick={() => {
                                                                                for (let i = 0; i < listData.length; i++) {
                                                                                    if (item.id === listData[i].id) {
                                                                                        listData[i].count = (listData[i].count || 0) + 1
                                                                                        addCart(item.id, item.shopId, listData[i].count)
                                                                                    }
                                                                                }
                                                                                setListData([...listData])
                                                                            }}/>
                                                     </Space>
                                             }
                                         </div>
                                     ]}
                                     extra={<div className='tags' style={{height:21}}>{
                                         item.tags !== null ?
                                             item.tags.map((i) => {
                                                 return (
                                                     <Tag key={i}>{i}</Tag>
                                                 )
                                             }) : null
                                     }</div>}>
                              <List.Item.Meta
                                  onClick={() => {
                                      props.history.push("/product/" + item.id)
                                  }}
                                  avatar={<Image src={"http://" + item.cover} width={80}/>}
                                  title={<Text strong>{item.name}</Text>}
                                  description={<Text type="secondary">￥{item.price}</Text>}/>
                          </List.Item>
                      )
                  }}>
            </List>
        )
    }

    function cart() {
        axios({
            method: "get",
            url: url + '/api/cart/list',
            headers: {token}
        })
            .then(res => {
                console.log(res)
            })
    }


    return (
        <div className="Product">
            <PageHeader
                ghost={false}
                onBack={() => {
                    window.history.back()
                }}
                title="商品列表"
                subTitle={
                    <Space>
                        <div> 日期:{date}</div>
                        |
                        <div> 时段:{slot}</div>
                        |
                        <div>星期:{weekday}</div>
                    </Space>
                }
                className='header'
            />

            <Content className='main'>
                <Header className='tags-wrap'>
                    {
                        tags.map((tag) => {
                            return (
                                <CheckableTag
                                    className='tags-checkbox'
                                    key={tag.id}
                                    checked={selectedTags.indexOf(tag) > -1}
                                    onChange={checked => handleTag(tag, checked)}>
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
                          onChange={(activeKey) => {
                              console.log(activeKey)
                              setCategoryId(activeKey)
                          }}
                          tabBarStyle={{width: '90px'}}>

                        <TabPane tab='全部' key={0}>
                            {productList()}
                        </TabPane>

                        {
                            categories.map(item => {
                                return (
                                    <TabPane tab={item.name} key={item.id}>
                                        {productList()}
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                    {token !== null ?
                        <Cart value={value.shop} slot={slot} shopId={id} date={date} render={render}
                              setIII={iii}/>
                        :
                        <Badge className="cart">
                            <Button
                                type="primary"
                                shape="round"
                                onClick={cart}
                                icon={<ShoppingCartOutlined/>}>
                                购物车
                            </Button>
                        </Badge>
                    }
                </div>
            </Content>
        </div>
    )
}

export default Product