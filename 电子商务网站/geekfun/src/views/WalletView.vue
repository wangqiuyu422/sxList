<template>
  <div class="wallet-container">
    <div class="wallet-wrapper">
      <div class="wallet-header">
        <h1>我的钱包</h1>
        <p class="subtitle">管理您的 GeekCoin 虚拟货币</p>
      </div>

      <div class="balance-card">
        <div class="balance-header">
          <span class="balance-icon-large">💰</span>
          <h2>当前余额</h2>
        </div>
        <div class="balance-amount-large">
          {{ store.balance }}
          <span class="currency-unit">GeekCoin</span>
        </div>
      </div>

      <div class="wallet-actions">
        <div class="action-card">
          <h3>充值 GeekCoin</h3>
          <p>选择充值金额</p>
          <div class="recharge-options">
            <button 
              v-for="amount in rechargeAmounts" 
              :key="amount"
              class="recharge-btn"
              :class="{ active: selectedAmount === amount }"
              @click="selectedAmount = amount"
            >
              {{ amount }} GeekCoin
            </button>
          </div>
          <button 
            class="submit-recharge"
            :class="{ loading: store.loading }"
            :disabled="store.loading || !selectedAmount"
            @click="handleRecharge"
          >
            <span v-if="store.loading">充值中...</span>
            <span v-else>确认充值</span>
          </button>
          <p v-if="store.error" class="error-message">{{ store.error }}</p>
        </div>

        <div class="action-card">
          <h3>充值记录</h3>
          <div v-if="rechargeHistory.length === 0" class="empty-history">
            <p>暂无充值记录</p>
          </div>
          <div v-else class="history-list">
            <div v-for="(record, index) in rechargeHistory" :key="index" class="history-item">
              <div class="history-info">
                <span class="history-amount">+{{ record.amount }} GeekCoin</span>
                <span class="history-time">{{ record.time }}</span>
              </div>
              <span class="history-status success">成功</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'

const store = useStore()

const selectedAmount = ref(0)
const rechargeAmounts = [10, 50, 100, 200, 500]

const rechargeHistory = computed(() => {
  const history = localStorage.getItem('rechargeHistory')
  return history ? JSON.parse(history) : []
})

const handleRecharge = async () => {
  if (!selectedAmount.value) return
  
  try {
    await store.rechargeBalance(selectedAmount.value)
    
    const newRecord = {
      amount: selectedAmount.value,
      time: new Date().toLocaleString()
    }
    
    const history = rechargeHistory.value
    history.unshift(newRecord)
    localStorage.setItem('rechargeHistory', JSON.stringify(history))
    
    alert(`充值成功！您已获得 ${selectedAmount.value} GeekCoin`)
    selectedAmount.value = 0
  } catch (error) {
    console.error('充值失败:', error)
  }
}
</script>

<style scoped>
.wallet-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 80px 20px 40px;
}

.wallet-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.wallet-header {
  text-align: center;
  margin-bottom: 32px;
}

.wallet-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px;
}

.wallet-header .subtitle {
  color: #666;
  margin: 0;
}

.balance-card {
  background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: #fff;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(26, 115, 232, 0.3);
}

.balance-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.balance-icon-large {
  font-size: 2.5rem;
}

.balance-header h2 {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
  margin: 0;
}

.balance-amount-large {
  font-size: 3.5rem;
  font-weight: 700;
}

.currency-unit {
  font-size: 1.25rem;
  font-weight: 400;
  margin-left: 8px;
  opacity: 0.9;
}

.wallet-actions {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.action-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 8px;
}

.action-card p {
  color: #666;
  margin: 0 0 20px;
}

.recharge-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.recharge-btn {
  padding: 12px 20px;
  font-size: 0.9rem;
  color: #666;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recharge-btn:hover {
  background: #f0f0f0;
  border-color: #ddd;
}

.recharge-btn.active {
  color: #1a73e8;
  background: #e8f0fe;
  border-color: #1a73e8;
}

.submit-recharge {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background: #1a73e8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-recharge:hover:not(:disabled) {
  background: #1557b0;
}

.submit-recharge:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #e53935;
  font-size: 0.85rem;
  margin: 12px 0 0;
  text-align: center;
}

.empty-history {
  text-align: center;
  padding: 24px;
}

.empty-history p {
  color: #999;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-amount {
  font-weight: 600;
  color: #111;
}

.history-time {
  font-size: 0.8rem;
  color: #999;
}

.history-status {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
}

.history-status.success {
  color: #388e3c;
  background: #e8f5e9;
}
</style>
