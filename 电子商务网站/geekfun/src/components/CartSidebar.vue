<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="cartSidebar">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">购物车</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <div v-if="store.cart.length === 0" class="text-center text-muted mt-5">
        购物车中暂无商品...
      </div>
      <div v-else>
        <div v-for="item in store.cart" :key="item.id" class="card mb-3">
          <div class="card-body p-2">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="mb-1">{{ item.name }}</h6>
                <p class="mb-0 text-muted">¥{{ item.price }} × {{ item.quantity }}</p>
              </div>
              <button class="btn btn-sm btn-danger" @click="store.removeFromCart(item.id)">×</button>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between mt-4">
          <h5>总价：¥{{ totalPrice }}</h5>
          <router-link to="/orders/create" class="btn btn-primary" @click="$nextTick(() => document.querySelector('[data-bs-dismiss=offcanvas]').click())">
            确认下单
          </router-link>
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
</script>