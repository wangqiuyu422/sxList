import { defineStore } from 'pinia'

// 模拟商品数据
const mockProducts = [
  { id: 1, name: '柯西不等式马克杯', price: 25, desc: '柯西不等式是由大数学家柯西(Cauchy)在研究数学分析中的"流数"问题时得到的。', img: 'https://via.placeholder.com/200x200?text=柯西不等式' },
  { id: 2, name: '泊松分布马克杯', price: 19, desc: '泊松分布是一种统计与概率学里常见到的离散概率分布，由法国数学家西莫恩·德尼·泊松在1838年时发表。', img: 'https://via.placeholder.com/200x200?text=泊松分布' },
  { id: 3, name: '余弦定理马克杯', price: 28, desc: '余弦定理是描述三角形中三边长度与一个角的余弦值关系的数学定理，是勾股定理在一般三角形情形下的推广。', img: 'https://via.placeholder.com/200x200?text=余弦定理' },
  { id: 4, name: '正弦定理马克杯', price: 24, desc: '正弦定理是三角学中的一个基本定理，它指出"在任意一个平面三角形中，各边和它所对角的正弦值的比相等"。', img: 'https://via.placeholder.com/200x200?text=正弦定理' },
  { id: 5, name: '拉普拉斯定理马克杯', price: 30, desc: '拉普拉斯定理是计算行列式的一种方法，它是将行列式按某k个行或列展开的定理。', img: 'https://via.placeholder.com/200x200?text=拉普拉斯' },
  { id: 6, name: '拉格朗日换马克杯', price: 27, desc: '拉格朗日中值定理是微分学中的基本定理之一，它反映了可导函数在闭区间上的整体的平均变化率与区间内某点的局部变化率的关系。', img: 'https://via.placeholder.com/200x200?text=拉格朗日' },
]

export const useStore = defineStore('main', {
  state: () => ({
    products: mockProducts,
    // 购物车：从localStorage读取，默认空数组
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    // 订单：从localStorage读取，默认空数组
    orders: JSON.parse(localStorage.getItem('orders')) || [],
    // 模拟API加载状态
    loading: false,
    // 模拟API错误状态
    error: null
  }),
  actions: {
    // 同步购物车到localStorage
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    // 同步订单到localStorage
    saveOrders() {
      localStorage.setItem('orders', JSON.stringify(this.orders))
    },

    // 模拟API：添加商品到购物车（含失败模拟）
    async addToCart(productId) {
      this.loading = true
      this.error = null

      // 模拟API网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      // 模拟30%概率API调用失败
      if (Math.random() < 0.3) {
        this.loading = false
        this.error = '网络请求失败，请稍后重试'
        throw new Error(this.error)
      }

      const product = this.products.find(p => p.id === productId)
      if (!product) return

      // 检查商品是否已在购物车
      const existItem = this.cart.find(item => item.id === productId)
      if (existItem) {
        existItem.quantity += 1
      } else {
        this.cart.push({ ...product, quantity: 1 })
      }

      this.saveCart()
      this.loading = false
    },

    // 从购物车移除商品
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId)
      this.saveCart()
    },

    // 更新购物车商品数量
    updateCartQuantity(productId, quantity) {
      const item = this.cart.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
        this.saveCart()
      }
    },

    // 模拟API：创建订单（下单）
    async createOrder() {
      this.loading = true
      this.error = null

      // 模拟API网络延迟
      await new Promise(resolve => setTimeout(resolve, 800))

      // 模拟20%概率下单失败
      if (Math.random() < 0.2) {
        this.loading = false
        this.error = '下单失败，请稍后重试'
        throw new Error(this.error)
      }

      // 生成订单
      const order = {
        id: '#' + Date.now().toString().slice(-8),
        items: [...this.cart],
        totalPrice: this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        createTime: new Date().toLocaleString(),
        status: '待支付'
      }

      this.orders.unshift(order)
      this.saveOrders()

      // 清空购物车
      this.cart = []
      this.saveCart()

      this.loading = false
      return order
    },

    // 模拟API：支付订单
    async payOrder(orderId) {
      this.loading = true
      this.error = null

      // 模拟支付接口延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟15%概率支付失败
      if (Math.random() < 0.15) {
        this.loading = false
        this.error = '支付失败，请检查余额后重试'
        throw new Error(this.error)
      }

      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = '已支付'
        this.saveOrders()
      }

      this.loading = false
    },

    // 根据ID获取订单
    getOrderById(orderId) {
      return this.orders.find(o => o.id === orderId)
    },

    // 根据ID获取商品
    getProductById(productId) {
      return this.products.find(p => p.id === productId)
    }
  }
})