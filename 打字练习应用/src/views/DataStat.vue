<template>
  <div class="stats-page">
    <div class="page-header">
      <h1>📊 数据统计</h1>
      <p>追踪你的打字练习进度和成绩</p>
    </div>

    <div class="overview-cards">
      <div class="overview-card">
        <div class="overview-icon">🎯</div>
        <div class="overview-content">
          <div class="overview-value">{{ totalStats.totalPractices }}</div>
          <div class="overview-label">总练习次数</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon">⚡</div>
        <div class="overview-content">
          <div class="overview-value">{{ totalStats.avgWpm }}</div>
          <div class="overview-label">平均WPM</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon">✅</div>
        <div class="overview-content">
          <div class="overview-value">{{ totalStats.avgAccuracy }}%</div>
          <div class="overview-label">平均正确率</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon">⏱️</div>
        <div class="overview-content">
          <div class="overview-value">{{ formatDuration(totalStats.totalDuration) }}</div>
          <div class="overview-label">总练习时间</div>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3 class="chart-title">近7天练习趋势</h3>
        <div ref="trendChart" class="chart-container"></div>
      </div>
      <div class="chart-card">
        <h3 class="chart-title">模式分布</h3>
        <div ref="modeChart" class="chart-container"></div>
      </div>
    </div>

    <div class="best-records">
      <h3 class="section-title">最佳记录</h3>
      <div class="records-grid">
        <div class="record-card" v-for="(record, mode) in bestRecords" :key="mode">
          <div class="record-icon">{{ getModeIcon(mode as string) }}</div>
          <div class="record-info">
            <div class="record-mode">{{ getModeName(mode as string) }}</div>
            <div class="record-stats" v-if="record">
              <span class="record-wpm">{{ record.wpm }} WPM</span>
              <span class="record-accuracy">{{ record.accuracy }}%</span>
            </div>
            <div class="record-empty" v-else>
              暂无记录
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-records">
      <h3 class="section-title">最近记录</h3>
      <div v-if="recentRecords.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>还没有练习记录，开始你的第一次练习吧！</p>
      </div>
      <div v-else class="records-table">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>模式</th>
              <th>WPM</th>
              <th>正确率</th>
              <th>用时</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in recentRecords" :key="record.id">
              <td>{{ formatDate(record.date) }}</td>
              <td>{{ getModeName(record.mode) }}</td>
              <td>{{ record.wpm }}</td>
              <td :class="{ 'low-accuracy': record.accuracy < 90 }">{{ record.accuracy }}%</td>
              <td>{{ formatDuration(record.duration) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { db } from '../api/db'
import type { TypingRecord } from '../api/db'

const totalStats = ref({
  totalPractices: 0,
  avgWpm: 0,
  avgAccuracy: 0,
  totalDuration: 0
})

const bestRecords = ref<Record<string, TypingRecord | null>>({
  letter: null,
  word: null,
  essay_en: null,
  essay_cn: null
})

const recentRecords = ref<TypingRecord[]>([])

const trendChart = ref<HTMLElement | null>(null)
const modeChart = ref<HTMLElement | null>(null)

let trendChartInstance: echarts.ECharts | null = null
let modeChartInstance: echarts.ECharts | null = null

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatDate(dateStr: Date | string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getModeName(mode: string): string {
  const names: Record<string, string> = {
    letter: '字母',
    word: '单词',
    essay_en: '英文短文',
    essay_cn: '中文'
  }
  return names[mode] || mode
}

function getModeIcon(mode: string): string {
  const icons: Record<string, string> = {
    letter: '🔤',
    word: '📝',
    essay_en: '📚',
    essay_cn: '📖'
  }
  return icons[mode] || '📊'
}

function initTrendChart(dailyStats: { date: string; totalWpm: number; totalPractices: number }[]) {
  if (!trendChart.value) return
  
  trendChartInstance = echarts.init(trendChart.value)
  
  const dates = dailyStats.map(d => d.date.slice(5))
  const wpmData = dailyStats.map(d => Math.round(d.totalWpm / Math.max(d.totalPractices, 1)))
  const practiceData = dailyStats.map(d => d.totalPractices)
  
  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' }
    },
    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: [
      {
        type: 'value',
        name: 'WPM',
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8' }
      },
      {
        type: 'value',
        name: '次数',
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8' }
      }
    ],
    series: [
      {
        name: '平均WPM',
        type: 'line',
        data: wpmData,
        smooth: true,
        lineStyle: { color: '#3b82f6', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        }
      },
      {
        name: '练习次数',
        type: 'bar',
        yAxisIndex: 1,
        data: practiceData,
        itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] }
      }
    ]
  }
  
  trendChartInstance.setOption(option)
}

function initModeChart(records: TypingRecord[]) {
  if (!modeChart.value) return
  
  modeChartInstance = echarts.init(modeChart.value)
  
  const modeCounts: Record<string, number> = {
    letter: 0,
    word: 0,
    essay_en: 0,
    essay_cn: 0
  }
  
  records.forEach(r => {
    modeCounts[r.mode]++
  })
  
  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0' },
      formatter: '{b}: {c}次 ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#1e293b',
          borderWidth: 3
        },
        label: {
          show: true,
          color: '#e2e8f0',
          formatter: '{b}\n{d}%'
        },
        data: [
          { value: modeCounts.letter, name: '字母', itemStyle: { color: '#3b82f6' } },
          { value: modeCounts.word, name: '单词', itemStyle: { color: '#10b981' } },
          { value: modeCounts.essay_en, name: '英文短文', itemStyle: { color: '#f59e0b' } },
          { value: modeCounts.essay_cn, name: '中文', itemStyle: { color: '#8b5cf6' } }
        ]
      }
    ]
  }
  
  modeChartInstance.setOption(option)
}

async function loadData() {
  totalStats.value = await db.getTotalStats()
  bestRecords.value = await db.getBestRecords()
  recentRecords.value = await db.getAllRecords()
  
  const dailyStats = await db.getDailyStats(7)
  initTrendChart(dailyStats)
  initModeChart(recentRecords.value)
}

function handleResize() {
  trendChartInstance?.resize()
  modeChartInstance?.resize()
}

onMounted(async () => {
  await loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChartInstance?.dispose()
  modeChartInstance?.dispose()
})
</script>

<style scoped>
.stats-page {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 8px;
}

.page-header p {
  color: #64748b;
  margin: 0;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.overview-card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.overview-icon {
  font-size: 40px;
}

.overview-content {
  display: flex;
  flex-direction: column;
}

.overview-value {
  font-size: 32px;
  font-weight: 700;
  color: #e2e8f0;
}

.overview-label {
  font-size: 14px;
  color: #64748b;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.chart-card {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 16px;
}

.chart-container {
  height: 250px;
}

.best-records {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.record-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.record-icon {
  font-size: 32px;
}

.record-info {
  flex: 1;
}

.record-mode {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.record-stats {
  display: flex;
  gap: 12px;
}

.record-wpm {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.record-accuracy {
  font-size: 24px;
  font-weight: 700;
  color: #10b981;
}

.record-empty {
  font-size: 14px;
  color: #64748b;
}

.recent-records {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #64748b;
  margin: 0;
}

.records-table {
  overflow-x: auto;
}

.records-table table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #334155;
}

.records-table th {
  font-weight: 600;
  color: #94a3b8;
  font-size: 14px;
}

.records-table td {
  color: #e2e8f0;
}

.records-table tr:last-child td {
  border-bottom: none;
}

.low-accuracy {
  color: #ef4444;
}
</style>
