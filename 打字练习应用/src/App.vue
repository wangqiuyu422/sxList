<template>
  <div class="app-container">
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-logo" @click="$router.push('/')">
          <span class="logo-icon">⌨️</span>
          <span class="logo-text">Tappy</span>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/stats" class="nav-link">统计</router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #e2e8f0;
  background: rgba(59, 130, 246, 0.1);
}

.nav-link.router-link-active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

.main-content {
  padding-top: 70px;
  min-height: calc(100vh - 70px);
}
</style>
