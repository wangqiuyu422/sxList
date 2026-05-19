<template>
  <div class="order-create-container">
    <div class="order-create-wrapper">
      <div class="order-header">
        <h1>确认订单</h1>
        <p class="subtitle">请确认您的订单信息</p>
      </div>

      <div v-if="store.cart.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <p>购物车为空，请先添加商品</p>
        <router-link to="/products" class="btn btn-primary">去购物</router-link>
      </div>

      <div v-else class="order-content">
        <div class="order-main">
          <div class="section">
            <h2 class="section-title">
              <span class="icon">📦</span>
              商品清单
            </h2>
            <div class="product-list">
              <div v-for="item in store.cart" :key="item.id" class="product-item">
                <div class="product-image">
                  <img :src="item.img" :alt="item.name" />
                </div>
                <div class="product-info">
                  <h3>{{ item.name }}</h3>
                  <p class="product-desc">{{ item.desc }}</p>
                  <div class="product-meta">
                    <span class="price">¥{{ item.price }}</span>
                    <span class="quantity">× {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="product-total">
                  ¥{{ item.price * item.quantity }}
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">
              <span class="icon">📝</span>
              收货信息
            </h2>
            <div class="form-group">
              <label>收货人姓名</label>
              <input 
                v-model="orderForm.name" 
                type="text" 
                class="form-input" 
                placeholder="请输入收货人姓名"
              />
            </div>
            <div class="form-group">
              <label>联系电话</label>
              <input 
                v-model="orderForm.phone" 
                type="tel" 
                class="form-input" 
                placeholder="请输入联系电话"
              />
            </div>
            <div class="form-group">
              <label>收货地址</label>
              <textarea 
                v-model="orderForm.address" 
                class="form-textarea" 
                rows="3"
                placeholder="请输入详细收货地址"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="order-sidebar">
          <div class="summary-card">
            <h3>订单摘要</h3>
            <div class="summary-row">
              <span>商品总数</span>
              <span>{{ totalQuantity }} 件</span>
            </div>
            <div class="summary-row">
              <span>商品金额</span>
              <span>¥{{ totalPrice }}</span>
            </div>
            <div class="summary-row">
              <span>运费</span>
              <span>¥{{ shippingFee }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>应付金额</span>
              <span>¥{{ finalTotal }}</span>
            </div>
            
            <button 
              class="submit-btn" 
              :class="{ loading: store.loading }"
              :disabled="store.loading || !isFormValid"
              @click="submitOrder"
            >
              <span v-if="store.loading">提交中...</span>
              <span v-else>确认下单</span>
            </button>

            <p v-if="store.error" class="error-message">{{ store.error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const orderForm = reactive({
  name: '',
  phone: '',
  address: ''
})

const totalPrice = computed(() => store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0))
const totalQuantity = computed(() => store.cart.reduce((sum, item) => sum + item.quantity, 0))
const shippingFee = computed(() => totalPrice.value >= 99 ? 0 : 10)
const finalTotal = computed(() => totalPrice.value + shippingFee.value)

const isFormValid = computed(() => {
  return orderForm.name.trim() && orderForm.phone.trim() && orderForm.address.trim()
})

const submitOrder = async () => {
  try {
    const order = await store.createOrder()
    router.push(`/orders/${order.id}`)
  } catch (error) {
    console.error('下单失败:', error)
  }
}
</script>

<style scoped>
.order-create-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 80px 20px 40px;
}

.order-create-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.order-header {
  text-align: center;
  margin-bottom: 32px;
}

.order-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px;
}

.order-header .subtitle {
  color: #666;
  margin: 0;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-cart p {
  color: #666;
  margin: 0 0 24px;
}

.order-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

@media (max-width: 900px) {
  .order-content {
    grid-template-columns: 1fr;
  }
}

.order-main {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 20px;
}

.section-title .icon {
  margin-right: 8px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h3 {
  font-size: 0.95rem;
  font-weight: 500;
  color: #111;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 0.8rem;
  color: #999;
  margin: 0 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-meta .price {
  font-weight: 600;
  color: #e53935;
}

.product-meta .quantity {
  font-size: 0.85rem;
  color: #666;
}

.product-total {
  font-weight: 600;
  color: #111;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1a73e8;
}

.form-textarea {
  resize: vertical;
}

.order-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.summary-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: #666;
  font-size: 0.9rem;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  padding-top: 12px;
}

.summary-divider {
  height: 1px;
  background: #eee;
  margin: 12px 0;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background: #1a73e8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 16px;
}

.submit-btn:hover:not(:disabled) {
  background: #1557b0;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn.loading {
  pointer-events: none;
}

.error-message {
  color: #e53935;
  font-size: 0.85rem;
  margin: 12px 0 0;
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background: #1a73e8;
}

.btn-primary:hover {
  background: #1557b0;
}
</style>
