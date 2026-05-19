<template>
  <div class="card h-100">
    <img :src="product.img" class="card-img-top p-3" :alt="product.name">
    <div class="card-body text-center">
      <h5 class="card-title">{{ product.name }}</h5>
      <p class="card-text text-muted">¥{{ product.price }}</p>
      <div class="d-flex gap-2 justify-content-center">
        <router-link :to="`/products/${product.id}`" class="btn btn-outline-primary btn-sm">查看详情</router-link>
        <button class="btn btn-primary btn-sm" @click="handleAddToCart" :disabled="store.loading">
          {{ store.loading ? '添加中...' : '加入购物车' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store'
import { ref } from 'vue'

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