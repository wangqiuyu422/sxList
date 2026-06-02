<template>
  <div class="train-page">
    <div class="page-header">
      <h1>📖 中文短句练习</h1>
      <p>经典诗句和常用句子，练习中文输入</p>
    </div>

    <div class="mode-tabs">
      <button
        :class="['mode-tab', { active: currentMode === 'sentence' }]"
        @click="currentMode = 'sentence'"
      >
        常用句子
      </button>
      <button
        :class="['mode-tab', { active: currentMode === 'poem' }]"
        @click="currentMode = 'poem'"
      >
        古诗词
      </button>
    </div>

    <div v-if="!isPracticing" class="content-preview">
      <div v-if="currentMode === 'poem' && currentPoem" class="poem-preview">
        <h3>{{ currentPoem.title }}</h3>
        <p class="poem-author">—— {{ currentPoem.author }}</p>
        <p class="poem-content">{{ currentPoem.content }}</p>
      </div>
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
      <button
        v-if="!isPracticing"
        class="btn-secondary"
        @click="shuffleContent"
      >
        🔀 换一个
      </button>
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
import { useTypingStore } from '../store/typingStore'
import cnData from '../data/cnSentence.json'

const typingStore = useTypingStore()

const currentMode = ref<'sentence' | 'poem'>('sentence')
const currentSentenceIndex = ref(0)
const currentPoemIndex = ref(0)
const isPracticing = ref(false)
const hasStarted = ref(false)
const showResult = ref(false)
const lastResult = ref<{ wpm: number; accuracy: number; duration: number } | null>(null)

const sentences = cnData.sentences
const poems = cnData.poems

const currentPoem = computed(() => poems[currentPoemIndex.value])

const currentText = computed(() => {
  if (currentMode.value === 'poem' && currentPoem.value) {
    return currentPoem.value.content
  }
  return sentences[currentSentenceIndex.value] || ''
})

function shuffleContent() {
  if (currentMode.value === 'sentence') {
    currentSentenceIndex.value = Math.floor(Math.random() * sentences.length)
  } else {
    currentPoemIndex.value = Math.floor(Math.random() * poems.length)
  }
}

function handleType(char: string, correct: boolean) {
  typingStore.typeChar(correct)
  typingStore.addTypedChar(char)
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
  typingStore.setMode('essay_cn')
  typingStore.startPractice()
}

function resetPractice() {
  isPracticing.value = false
  typingStore.reset()
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

onMounted(() => {
  shuffleContent()
})

onUnmounted(() => {})
</script>

<style scoped>
.train-page {
  padding: 40px 24px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
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

.mode-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}

.mode-tab {
  padding: 10px 24px;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 20px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab:hover {
  border-color: #475569;
  color: #e2e8f0;
}

.mode-tab.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: #fff;
}

.content-preview {
  margin-bottom: 24px;
}

.poem-preview {
  background: linear-gradient(135deg, #1e293b, #1e1b4b);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid #334155;
}

.poem-preview h3 {
  font-size: 20px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 8px;
}

.poem-author {
  font-size: 14px;
  color: #8b5cf6;
  margin: 0 0 16px;
}

.poem-content {
  font-size: 18px;
  color: #94a3b8;
  line-height: 2;
  margin: 0;
  font-family: '楷体', 'KaiTi', serif;
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
  flex-wrap: wrap;
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
