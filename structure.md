### 用户端

首页	/		选择订餐日期时间

产品列表	/product	 购物车 组件

产品详情	/product:id



订单页	/order	



个人中心页	/profile

登录	/login

注册	/register



### 商家端

登录	/login

注册	/register

#### 商家

​	首页	/		-- 添加商品

​	产品列表	/product

​	产品详情	/product:id

​	订单列表	/order

​	订单详情	/orderDetail

#### 配送

​	首页	/deliver			-- 订单列表，接单

​	订单详情	/orderDetail	



```
const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            initialValues={{ remember: true }}
            size="large"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
```

