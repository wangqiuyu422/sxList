<template>
  <nav class="geek-navbar">
    <div class="geek-nav-wrapper">
      <a href="/" class="geek-nav-logo">GeekFun</a>
      <div class="geek-nav-links">
        <a href="/" class="geek-nav-link">首页</a>
        <a href="/products" class="geek-nav-link">产品</a>
        <a href="/orders" class="geek-nav-link">订单</a>
        <a href="/wallet" class="geek-nav-link">钱包</a>
        <div class="geek-balance">
          <span class="balance-icon">💰</span>
          <span class="balance-amount">{{ store.balance }} GeekCoin</span>
        </div>
        <button class="geek-cart-button" @click="openCart">
          购物车
          <span v-if="cartCount > 0" class="geek-cart-badge">{{ cartCount }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useStore } from '../store'
import { computed } from 'vue'

const store = useStore()
const cartCount = computed(() => store.cart.reduce((sum, item) => sum + item.quantity, 0))

const openCart = () => {
  store.cartSidebarOpen = true
  document.body.style.overflow = 'hidden'
}
</script>

<style scoped>
.geek-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  height: 60px;
  display: flex;
  align-items: center;
}

.geek-nav-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.geek-nav-logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;
  text-decoration: none;
}

.geek-nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.geek-nav-link {
  font-size: 0.9rem;
  color: #666666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.geek-nav-link:hover {
  color: #111111;
}

.geek-balance {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #8b4513;
}

.balance-icon {
  font-size: 1rem;
}

.geek-cart-button {
  position: relative;
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #333333;
  background: #fafafa;
  border: 1px solid #eeeeee;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.geek-cart-button:hover {
  background: #f0f0f0;
  border-color: #dddddd;
}

.geek-cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: #e53935;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .geek-nav-links {
    gap: 16px;
  }
  
  .geek-nav-link {
    font-size: 0.85rem;
  }
  
  .geek-cart-button {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>
