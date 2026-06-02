<template>
  <div class="train-page">
    <div class="page-header">
      <h1>🔤 字母练习</h1>
      <p>掌握基础字母和符号，培养正确指法习惯</p>
    </div>

    <div class="practice-area">
      <TypingBox
        :display-text="currentText"
        :is-practicing="isPracticing"
        :wpm="typingStore.wpm"
        :accuracy="typingStore.accuracy"
        :duration="typingStore.duration"
        :current-index="typingStore.currentIndex"
        @type="handleType"
        @complete="handleComplete"
        @reset="handleReset"
      />
    </div>

    <div class="control-panel">
      <button
        v-if="!isPracticing"
        class="btn-primary"
        @click="startPractice"
      >
        {{ hasStarted ? '继续练习' : '开始练习' }}
      </button>
      <button
        v-else
        class="btn-secondary"
        @click="resetPractice"
      >
        重置练习
      </button>
      <select
        v-if="!isPracticing"
        class="difficulty-select"
        v-model="currentSetIndex"
      >
        <option v-for="(_set, index) in practiceSets" :key="index" :value="index">
          练习组 {{ index + 1 }}
        </option>
      </select>
    </div>

    <div class="keyboard-section">
      <h3 class="section-title">虚拟键盘</h3>
      <KeyBoard
        :active-key="activeKey"
        :correct-key="correctKey"
        :wrong-key="wrongKey"
        @keypress="handleKeyPress"
      />
    </div>

    <div class="result-modal" v-if="showResult" @click.self="showResult = false">
      <div class="result-card">
        <div class="result-header">
          <div class="result-icon">🎉</div>
          <h2>练习完成！</h2>
        </div>
        <div class="result-stats">
          <div class="result-stat">
            <span class="result-label">打字速度</span>
            <span class="result-value">{{ lastResult?.wpm || 0 }} WPM</span>
          </div>
          <div class="result-stat">
            <span class="result-label">正确率</span>
            <span class="result-value">{{ lastResult?.accuracy || 0 }}%</span>
          </div>
          <div class="result-stat">
            <span class="result-label">用时</span>
            <span class="result-value">{{ formatTime(lastResult?.duration || 0) }}</span>
          </div>
        </div>
        <div class="result-actions">
          <button class="btn-primary" @click="startPractice">再练一次</button>
          <button class="btn-secondary" @click="goHome">返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TypingBox from '../components/TypingBox.vue'
import KeyBoard from '../components/KeyBoard.vue'
import { useTypingStore } from '../store/typingStore'
import letterData from '../data/letter.json'

const typingStore = useTypingStore()

const practiceSets = letterData.practiceSets
const currentSetIndex = ref(0)
const isPracticing = ref(false)
const hasStarted = ref(false)
const showResult = ref(false)
const activeKey = ref<string | null>(null)
const correctKey = ref<string | null>(null)
const wrongKey = ref<string | null>(null)
const lastResult = ref<{ wpm: number; accuracy: number; duration: number } | null>(null)

const currentText = computed(() => practiceSets[currentSetIndex.value])

function handleType(char: string, correct: boolean) {
  activeKey.value = char
  typingStore.typeChar(correct)
  typingStore.addTypedChar(char)
  
  if (correct) {
    correctKey.value = char
    setTimeout(() => { correctKey.value = null }, 200)
  } else {
    wrongKey.value = char
    setTimeout(() => { wrongKey.value = null }, 300)
  }
  
  setTimeout(() => { activeKey.value = null }, 150)
}

function handleComplete() {
  isPracticing.value = false
  lastResult.value = {
    wpm: typingStore.wpm,
    accuracy: typingStore.accuracy,
    duration: typingStore.duration
  }
  typingStore.endPractice()
  showResult.value = true
}

function handleReset() {
  typingStore.reset()
}

function startPractice() {
  isPracticing.value = true
  hasStarted.value = true
  typingStore.setMode('letter')
  typingStore.startPractice()
}

function resetPractice() {
  isPracticing.value = false
  typingStore.reset()
}

function handleKeyPress(key: string) {
  if (!isPracticing.value) return
  
  if (key === 'backspace') {
    handleReset()
  } else {
    const index = typingStore.currentIndex
    const correct = key === currentText.value[index]
    handleType(key, correct)
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function goHome() {
  showResult.value = false
  hasStarted.value = false
}

function handleKeyDown(e: KeyboardEvent) {
  if (!isPracticing.value) return
  activeKey.value = e.key
}

function handleKeyUp() {
  activeKey.value = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
.train-page {
  padding: 40px 24px;
  max-width: 800px;
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

.practice-area {
  margin-bottom: 24px;
}

.control-panel {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.difficulty-select {
  padding: 10px 16px;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.difficulty-select:focus {
  border-color: #3b82f6;
}

.keyboard-section {
  margin-top: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
  text-align: center;
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.result-card {
  background: #1e293b;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid #334155;
}

.result-header {
  margin-bottom: 32px;
}

.result-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.result-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.result-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 32px;
}

.result-stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-label {
  font-size: 14px;
  color: #64748b;
}

.result-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.result-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
