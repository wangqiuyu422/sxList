<template>
  <div class="container py-5" v-if="order">
    <div class="card">
      <div class="card-header">
        <h3>订单详情 {{ order.id }}</h3>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th>产品</th>
              <th>单价</th>
              <th>数量</th>
              <th>小计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>¥{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>¥{{ item.price * item.quantity }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4">
          <p>订单编号：{{ order.id }}</p>
          <p>下单时间：{{ order.createTime }}</p>
          <p>订单状态：<span :class="order.status === '已支付' ? 'text-success' : 'text-danger'">{{ order.status }}</span></p>
          <h4 class="mt-3">合计：¥{{ order.totalPrice }}</h4>
          
          <!-- 支付按钮 -->
          <button 
            v-if="order.status === '待支付'" 
            class="btn btn-success mt-3" 
            @click="handlePay"
            :disabled="store.loading"
          >
            {{ store.loading ? '支付中...' : '去支付' }}
          </button>
        </div>
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

const order = computed(() => store.getOrderById(route.params.id))

const handlePay = async () => {
  try {
    await store.payOrder(order.value.id)
    alert('支付成功')
  } catch (err) {
    alert(err.message)
  }
}
</script>