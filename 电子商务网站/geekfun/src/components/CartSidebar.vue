<template>
  <div v-show="store.cartSidebarOpen" class="cart-sidebar">
    <div class="cart-backdrop" @click="closeCart"></div>
    <div class="cart-panel">
      <div class="cart-header">
        <h2>购物车</h2>
        <button class="cart-close" @click="closeCart">×</button>
      </div>
      <div class="cart-content">
        <div v-if="store.cart.length === 0" class="cart-empty">
          <p>购物车中暂无商品</p>
        </div>
        <div v-else>
          <div v-for="item in store.cart" :key="item.id" class="cart-item">
            <div class="cart-item-info">
              <h4>{{ item.name }}</h4>
              <p>¥{{ item.price }} × {{ item.quantity }}</p>
            </div>
            <button class="cart-remove" @click="store.removeFromCart(item.id)">×</button>
          </div>
          <div class="cart-footer">
            <div class="cart-total">
              <span>总价</span>
              <span class="cart-total-price">¥{{ totalPrice }}</span>
            </div>
            <router-link to="/orders/create" class="btn btn-primary" @click="closeCart">
              确认下单
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store'
import { computed } from 'vue'

const store = useStore()

const totalPrice = computed(() => store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0))

const closeCart = () => {
  store.cartSidebarOpen = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
}

.cart-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #eeeeee;
}

.cart-header h2 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.cart-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.cart-close:hover {
  background: #f5f5f5;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.cart-empty {
  text-align: center;
  padding: 48px 16px;
}

.cart-empty p {
  color: #999999;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.cart-item-info h4 {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 4px;
}

.cart-item-info p {
  font-size: 0.85rem;
  color: #666666;
  margin: 0;
}

.cart-remove {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999999;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.cart-remove:hover {
  color: #e53935;
  background: rgba(229, 57, 53, 0.1);
}

.cart-footer {
  padding: 20px 16px;
  border-top: 1px solid #eeeeee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cart-total span:first-child {
  font-size: 0.9rem;
  color: #666666;
}

.cart-total-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;
}

.cart-footer .btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  background: #1a73e8;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-footer .btn:hover {
  background: #1557b0;
}
</style>
