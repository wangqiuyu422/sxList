<template>
  <div id="app">
    <Navbar />
    <CartSidebar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import CartSidebar from './components/CartSidebar.vue'
import Footer from './components/Footer.vue'
</script>