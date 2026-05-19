<template>
  <div class="order-detail-container">
    <div class="order-detail-wrapper">
      <div v-if="!order" class="not-found">
        <div class="not-found-icon">🔍</div>
        <p>订单不存在</p>
        <router-link to="/orders" class="btn btn-primary">返回订单列表</router-link>
      </div>

      <div v-else>
        <div class="detail-header">
          <h1>订单详情</h1>
          <div class="header-actions">
            <router-link to="/orders" class="back-link">← 返回订单列表</router-link>
          </div>
        </div>

        <div class="status-bar" :class="order.status">
          <div class="status-info">
            <span class="status-icon">{{ order.status === '已支付' ? '✅' : '⏳' }}</span>
            <span class="status-text">{{ getStatusText(order.status) }}</span>
          </div>
          <div class="status-hint">
            <span v-if="order.status === '待支付'">请尽快完成支付，订单将在30分钟后自动取消</span>
            <span v-else>感谢您的购买，期待下次光临</span>
          </div>
        </div>

        <div class="detail-content">
          <div class="info-section">
            <h2 class="section-title">
              <span class="icon">📋</span>
              订单信息
            </h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">订单编号</span>
                <span class="info-value order-id">{{ order.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">下单时间</span>
                <span class="info-value">{{ order.createTime }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">订单状态</span>
                <span :class="['info-value', 'status-tag', order.status]">{{ getStatusText(order.status) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">支付方式</span>
                <span class="info-value">GeekCoin 虚拟货币</span>
              </div>
            </div>
          </div>

          <div class="items-section">
            <h2 class="section-title">
              <span class="icon">📦</span>
              商品清单
              <span class="items-count">({{ totalQuantity }}件)</span>
            </h2>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="item-row">
                <div class="item-image">
                  <img :src="item.img" :alt="item.name" />
                </div>
                <div class="item-info">
                  <h3>{{ item.name }}</h3>
                  <p class="item-desc">{{ item.desc }}</p>
                </div>
                <div class="item-price">¥{{ item.price }}</div>
                <div class="item-quantity">×{{ item.quantity }}</div>
                <div class="item-subtotal">¥{{ item.price * item.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="payment-section">
            <h2 class="section-title">
              <span class="icon">💰</span>
              支付信息
            </h2>
            <div class="payment-summary">
              <div class="summary-row">
                <span>商品金额</span>
                <span>¥{{ order.totalPrice }}</span>
              </div>
              <div class="summary-row">
                <span>运费</span>
                <span>¥{{ shippingFee }}</span>
              </div>
              <div class="summary-row discount">
                <span>优惠</span>
                <span>-¥{{ discount }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row total">
                <span>应付金额</span>
                <span>¥{{ finalTotal }}</span>
              </div>
            </div>

            <div class="balance-info">
              <span class="balance-label">当前余额</span>
              <span :class="['balance-value', { warning: store.balance < finalTotal }]">
                {{ store.balance }} GeekCoin
              </span>
              <span v-if="store.balance < finalTotal" class="balance-hint">
                余额不足，请先充值
                <router-link to="/wallet" class="recharge-link">去充值</router-link>
              </span>
            </div>

            <button 
              v-if="order.status === '待支付'" 
              class="pay-button"
              :class="{ loading: store.loading, disabled: store.balance < finalTotal }"
              :disabled="store.loading || store.balance < finalTotal"
              @click="handlePay"
            >
              <span v-if="store.loading">支付中...</span>
              <span v-else>立即支付 ({{ finalTotal }} GeekCoin)</span>
            </button>

            <p v-if="store.error" class="error-message">{{ store.error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../store'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useStore()

const order = computed(() => store.getOrderById(route.params.id))

const totalQuantity = computed(() => {
  if (!order.value) return 0
  return order.value.items.reduce((sum, item) => sum + item.quantity, 0)
})

const shippingFee = computed(() => {
  if (!order.value) return 0
  return order.value.totalPrice >= 99 ? 0 : 10
})

const discount = computed(() => 0)

const finalTotal = computed(() => {
  if (!order.value) return 0
  return order.value.totalPrice + shippingFee.value - discount.value
})

const getStatusText = (status) => {
  return status === '待支付' ? '待支付' : '已支付'
}

const handlePay = async () => {
  console.log('支付按钮被点击')
  console.log('订单ID:', order.value.id)
  console.log('当前余额:', store.balance)
  console.log('订单金额:', order.value.totalPrice)
  
  try {
    await store.payOrder(order.value.id)
    alert('支付成功！')
  } catch (error) {
    alert(error.message)
    console.error('支付失败:', error)
  }
}
</script>

<style scoped>
.order-detail-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 80px 20px 40px;
}

.order-detail-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.not-found-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.not-found p {
  color: #666;
  margin: 0 0 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.back-link {
  font-size: 0.9rem;
  color: #1a73e8;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.status-bar.待支付 {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.status-bar.已支付 {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.status-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  font-size: 1.5rem;
}

.status-text {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
}

.status-hint {
  font-size: 0.85rem;
  color: #666;
}

.detail-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.info-section,
.items-section,
.payment-section {
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.info-section:last-child,
.items-section:last-child,
.payment-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 20px;
}

.section-title .icon {
  font-size: 1.1rem;
}

.items-count {
  font-size: 0.85rem;
  font-weight: 400;
  color: #666;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.85rem;
  color: #999;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #111;
}

.info-value.order-id {
  font-family: monospace;
}

.status-tag.待支付 {
  color: #e65100;
}

.status-tag.已支付 {
  color: #388e3c;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-row {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.item-image {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h3 {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 0.75rem;
  color: #999;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price,
.item-quantity,
.item-subtotal {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.item-price {
  color: #666;
  min-width: 60px;
}

.item-quantity {
  color: #999;
  min-width: 50px;
}

.item-subtotal {
  font-weight: 600;
  color: #111;
  min-width: 70px;
  text-align: right;
}

.payment-summary {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.9rem;
  color: #666;
}

.summary-row.discount {
  color: #388e3c;
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

.balance-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 0.9rem;
  color: #666;
}

.balance-value {
  font-size: 1rem;
  font-weight: 600;
  color: #388e3c;
}

.balance-value.warning {
  color: #e53935;
}

.balance-hint {
  font-size: 0.85rem;
  color: #e53935;
}

.recharge-link {
  color: #1a73e8;
  text-decoration: none;
}

.recharge-link:hover {
  text-decoration: underline;
}

.pay-button {
  width: 100%;
  padding: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.pay-button:hover:not(:disabled) {
  opacity: 0.9;
}

.pay-button:disabled,
.pay-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
