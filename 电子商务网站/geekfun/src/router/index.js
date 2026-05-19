import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import OrderListView from '../views/OrderListView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import OrderCreateView from '../views/OrderCreateView.vue'
import WalletView from '../views/WalletView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/products', name: 'products', component: ProductsView },
  { path: '/products/:id', name: 'product-detail', component: ProductDetailView },
  { path: '/orders', name: 'orders', component: OrderListView },
  { path: '/orders/create', name: 'order-create', component: OrderCreateView },
  { path: '/orders/:id', name: 'order-detail', component: OrderDetailView },
  { path: '/wallet', name: 'wallet', component: WalletView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router