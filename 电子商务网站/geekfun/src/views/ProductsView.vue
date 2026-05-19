<template>
  <div class="container py-5">
    <h2 class="mb-4">产品列表</h2>
    <div class="row g-4">
      <div class="col-md-4 col-lg-3" v-for="product in store.products" :key="product.id">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store'
import ProductCard from '../components/ProductCard.vue'

const store = useStore()
</script>