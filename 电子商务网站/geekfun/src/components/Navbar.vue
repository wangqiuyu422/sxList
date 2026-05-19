<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">GeekFun</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">产品</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/orders">订单</router-link>
          </li>
        </ul>
        <!-- 购物车按钮 -->
        <button class="btn btn-outline-light position-relative" data-bs-toggle="offcanvas" data-bs-target="#cartSidebar">
          购物车
          <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ cartCount }}
          </span>
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
</script>