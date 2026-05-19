<template>
  <div class="container py-5">
    <h2 class="mb-4">我的订单</h2>
    <div v-if="store.orders.length === 0" class="text-center text-muted mt-5">
      暂无订单
    </div>
    <div v-else class="row g-4">
      <div class="col-md-4 col-lg-3" v-for="order in store.orders" :key="order.id">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">{{ order.id }}</h5>
            <p class="card-text text-muted">{{ order.createTime }}</p>
            <span :class="order.status === '已支付' ? 'text-success' : 'text-danger'" class="d-block mb-2">
              {{ order.status }}
            </span>
            <router-link :to="`/orders/${order.id}`" class="btn btn-outline-primary btn-sm">查看详情</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../store'

const store = useStore()
</script>