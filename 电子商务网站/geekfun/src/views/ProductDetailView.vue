<template>
  <div class="container py-5" v-if="product">
    <div class="row">
      <div class="col-md-6">
        <img :src="product.img" class="img-fluid" :alt="product.name">
      </div>
      <div class="col-md-6">
        <h2>{{ product.name }}</h2>
        <h3 class="text-primary my-3">¥{{ product.price }}</h3>
        <p class="text-muted">{{ product.desc }}</p>
        <button class="btn btn-primary btn-lg" @click="handleAddToCart" :disabled="store.loading">
          {{ store.loading ? '添加中...' : '加入购物车' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const store = useStore()

const product = computed(() => store.getProductById(Number(route.params.id)))

const handleAddToCart = async () => {
  try {
    await store.addToCart(product.value.id)
    alert('已加入购物车')
  } catch (err) {
    alert(err.message)
  }
}
</script>