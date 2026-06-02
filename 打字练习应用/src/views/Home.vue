<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">⌨️</div>
        <h1 class="hero-title">提升你的打字技能</h1>
        <p class="hero-description">通过科学的练习方法，快速提高打字速度和准确率</p>
      </div>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-value">{{ totalStats.totalPractices }}</div>
        <div class="stat-label">练习次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-value">{{ totalStats.avgWpm }}</div>
        <div class="stat-label">平均WPM</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-value">{{ totalStats.avgAccuracy }}%</div>
        <div class="stat-label">平均正确率</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-value">{{ formatDuration(totalStats.totalDuration) }}</div>
        <div class="stat-label">总练习时间</div>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title">选择练习模式</h2>
      <div class="features-grid">
        <div class="feature-card" @click="$router.push('/letter')">
          <div class="feature-icon">🔤</div>
          <h3>字母练习</h3>
          <p>基础字母和符号练习，掌握正确指法</p>
          <div class="feature-badge">入门</div>
        </div>
        <div class="feature-card" @click="$router.push('/word')">
          <div class="feature-icon">📝</div>
          <h3>单词练习</h3>
          <p>常用单词和短语练习，提升输入流畅度</p>
          <div class="feature-badge">进阶</div>
        </div>
        <div class="feature-card" @click="$router.push('/essay-en')">
          <div class="feature-icon">📚</div>
          <h3>英文短文</h3>
          <p>精选英文文章，模拟真实打字场景</p>
          <div class="feature-badge">高级</div>
        </div>
        <div class="feature-card" @click="$router.push('/essay-cn')">
          <div class="feature-icon">📖</div>
          <h3>中文短句</h3>
          <p>经典诗句和常用句子，练习中文输入</p>
          <div class="feature-badge">高级</div>
        </div>
      </div>
    </div>

    <div class="tips-section">
      <h2 class="section-title">练习小贴士</h2>
      <div class="tips-list">
        <div class="tip-item">
          <span class="tip-number">1</span>
          <p>保持正确的坐姿和指法姿势</p>
        </div>
        <div class="tip-item">
          <span class="tip-number">2</span>
          <p>专注于准确率而非速度，熟能生巧</p>
        </div>
        <div class="tip-item">
          <span class="tip-number">3</span>
          <p>每天坚持练习15-30分钟效果最佳</p>
        </div>
        <div class="tip-item">
          <span class="tip-number">4</span>
          <p>定期查看统计数据，跟踪进步</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '../api/db'

const totalStats = ref({
  totalPractices: 0,
  avgWpm: 0,
  avgAccuracy: 0,
  totalDuration: 0
})

onMounted(async () => {
  totalStats.value = await db.getTotalStats()
})

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}
</script>

<style scoped>
.home-page {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
}

.hero-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  color: #94a3b8;
  max-width: 500px;
  margin: 0 auto;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin: 40px 0;
}

.stat-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.features-section {
  margin: 60px 0;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 24px;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: #3b82f6;
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 8px;
}

.feature-card p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
}

.feature-badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 20px;
}

.tips-section {
  margin: 60px 0;
}

.tips-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tip-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 20px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
}

.tip-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.tip-item p {
  color: #94a3b8;
  margin: 0;
  font-size: 14px;
}
</style>
