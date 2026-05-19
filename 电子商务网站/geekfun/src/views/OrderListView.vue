<template>
  <div class="orders-container">
    <div class="orders-wrapper">
      <div class="orders-header">
        <h1>我的订单</h1>
        <p class="subtitle">管理您的所有订单</p>
      </div>

      <div class="filter-bar">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          class="filter-btn"
          :class="{ active: currentFilter === filter.value }"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
          <span v-if="getFilterCount(filter.value) > 0" class="filter-count">{{ getFilterCount(filter.value) }}</span>
        </button>
      </div>

      <div v-if="filteredOrders.length === 0" class="empty-orders">
        <div class="empty-icon">📦</div>
        <p>暂无{{ currentFilter === 'all' ? '' : filters.find(f => f.value === currentFilter)?.label }}订单</p>
      </div>

      <div v-else class="orders-grid">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-id">
              <span class="id-label">订单编号</span>
              <span class="id-value">{{ order.id }}</span>
            </div>
            <span :class="['status-badge', order.status]">
              {{ getStatusText(order.status) }}
            </span>
          </div>
          
          <div class="order-items">
            <div class="items-preview">
              <div 
                v-for="(item, index) in order.items.slice(0, 3)" 
                :key="item.id" 
                class="item-thumb"
                :style="{ zIndex: 3 - index }"
              >
                <img :src="item.img" :alt="item.name" />
              </div>
              <span v-if="order.items.length > 3" class="more-items">+{{ order.items.length - 3 }}</span>
            </div>
            <div class="items-info">
              <span class="items-count">共 {{ getTotalQuantity(order) }} 件商品</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span class="total-label">订单金额</span>
              <span class="total-value">¥{{ order.totalPrice }}</span>
            </div>
            <div class="order-actions">
              <span class="order-time">{{ order.createTime }}</span>
              <div class="action-buttons">
                <button class="btn btn-secondary" @click="goToDetail(order.id)">查看详情</button>
                <button 
                  v-if="order.status === '待支付'" 
                  class="btn btn-primary"
                  @click="goToDetail(order.id)"
                >
                  去支付
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const currentFilter = ref('all')

const filters = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' }
]

const filteredOrders = computed(() => {
  if (currentFilter.value === 'all') {
    return store.orders
  } else if (currentFilter.value === 'pending') {
    return store.orders.filter(o => o.status === '待支付')
  } else if (currentFilter.value === 'paid') {
    return store.orders.filter(o => o.status === '已支付')
  }
  return store.orders
})

const getFilterCount = (filter) => {
  if (filter === 'all') return store.orders.length
  if (filter === 'pending') return store.orders.filter(o => o.status === '待支付').length
  if (filter === 'paid') return store.orders.filter(o => o.status === '已支付').length
  return 0
}

const getTotalQuantity = (order) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const getStatusText = (status) => {
  return status === '待支付' ? '待支付' : '已支付'
}

const goToDetail = (orderId) => {
  console.log('跳转到订单详情:', orderId)
  const cleanId = String(orderId).replace(/^#/, '')
  router.push(`/orders/${cleanId}`)
}
</script>

<style scoped>
.orders-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 80px 20px 40px;
}

.orders-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.orders-header {
  margin-bottom: 24px;
}

.orders-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px;
}

.orders-header .subtitle {
  color: #666;
  margin: 0;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 0.9rem;
  color: #666;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #1a73e8;
  color: #1a73e8;
}

.filter-btn.active {
  background: #1a73e8;
  border-color: #1a73e8;
  color: #fff;
}

.filter-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-btn:not(.active) .filter-count {
  background: #f0f0f0;
  color: #666;
}

.empty-orders {
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

.empty-orders p {
  color: #666;
  margin: 0;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.order-id {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.id-label {
  font-size: 0.8rem;
  color: #999;
}

.id-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111;
}

.status-badge {
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 12px;
}

.status-badge.待支付 {
  background: #fff3e0;
  color: #e65100;
}

.status-badge.已支付 {
  background: #e8f5e9;
  color: #388e3c;
}

.order-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.items-preview {
  display: flex;
  align-items: center;
}

.item-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #fff;
  margin-left: -12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-thumb:first-child {
  margin-left: 0;
}

.item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-items {
  margin-left: 8px;
  font-size: 0.85rem;
  color: #999;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.items-count {
  font-size: 0.85rem;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.order-total {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-label {
  font-size: 0.85rem;
  color: #666;
}

.total-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e53935;
}

.order-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.order-time {
  font-size: 0.8rem;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-secondary {
  color: #666;
  background: #f5f5f5;
  border-color: #ddd;
}

.btn-secondary:hover {
  background: #f0f0f0;
}

.btn-primary {
  color: #fff;
  background: #1a73e8;
  border-color: #1a73e8;
}

.btn-primary:hover {
  background: #1557b0;
}
</style>
