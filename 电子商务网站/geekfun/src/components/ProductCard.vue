<template>
  <article class="product-card">
    <div class="product-image">
      <img :src="product.img" :alt="product.name">
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">¥{{ product.price }}</p>
      <div class="product-actions">
        <router-link :to="`/products/${product.id}`" class="btn btn-outline-primary btn-sm">查看详情</router-link>
        <button class="btn btn-primary btn-sm" @click="handleAddToCart" :disabled="store.loading">
          {{ store.loading ? '添加中...' : '加入购物车' }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useStore } from '../store'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const store = useStore()
const handleAddToCart = async () => {
  try {
    await store.addToCart(props.product.id)
    alert('已加入购物车')
  } catch (err) {
    alert(err.message)
  }
}
</script>

<style scoped>
.product-card {
  background: var(--bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-h);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-h);
  margin-bottom: 16px;
}

.product-actions {
  display: flex;
  gap: 12px;
}

.product-actions .btn {
  flex: 1;
  padding: 10px;
  font-size: 0.875rem;
}
</style>
