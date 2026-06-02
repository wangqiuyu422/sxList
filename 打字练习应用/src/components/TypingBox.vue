<template>
  <div class="typing-box">
    <div class="typing-display">
      <span
        v-for="(char, index) in displayText"
        :key="index"
        :class="getCharClass(index)"
      >
        {{ char === ' ' ? '·' : char }}
      </span>
    </div>
    <textarea
      ref="inputRef"
      class="typing-input"
      :placeholder="isPracticing ? '开始输入...' : '点击开始练习'"
      :disabled="!isPracticing"
      @input="handleInput"
      @keydown="handleKeyDown"
      autofocus
    ></textarea>
    <div v-if="showStats" class="typing-stats">
      <div class="stat-item">
        <span class="stat-label">WPM</span>
        <span class="stat-value">{{ wpm }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">正确率</span>
        <span class="stat-value" :class="{ error: accuracy < 90 }">{{ accuracy }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">用时</span>
        <span class="stat-value">{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps<{
  displayText: string
  isPracticing: boolean
  wpm: number
  accuracy: number
  duration: number
  currentIndex: number
  showStats?: boolean
}>()

const emit = defineEmits<{
  (e: 'type', char: string, correct: boolean): void
  (e: 'complete'): void
  (e: 'reset'): void
}>()

const inputRef = ref<HTMLTextAreaElement | null>(null)
const typedText = ref('')
const correctCount = ref(0)

watch(() => props.isPracticing, (newVal) => {
  if (newVal) {
    typedText.value = ''
    correctCount.value = 0
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

watch(() => props.currentIndex, (newIndex) => {
  if (newIndex >= props.displayText.length) {
    emit('complete')
  }
})

function getCharClass(index: number): string {
  const classes: string[] = ['typing-char']
  
  if (index < typedText.value.length) {
    classes.push(typedText.value[index] === props.displayText[index] ? 'correct' : 'wrong')
  } else if (index === typedText.value.length && props.isPracticing) {
    classes.push('current')
  }
  
  return classes.join(' ')
}

function handleInput() {
  if (!inputRef.value || !props.isPracticing) return
  
  const newText = inputRef.value.value
  const delta = newText.length - typedText.value.length
  
  if (delta > 0) {
    const newChar = newText[newText.length - 1]
    const correct = newChar === props.displayText[typedText.value.length]
    
    emit('type', newChar, correct)
    
    if (correct) {
      correctCount.value++
    }
    
    typedText.value = newText
    
    if (typedText.value.length >= props.displayText.length) {
      emit('complete')
    }
  } else if (delta < 0) {
    typedText.value = newText
    emit('reset')
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>

<style scoped>
.typing-box {
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.typing-display {
  font-size: 24px;
  line-height: 1.8;
  margin-bottom: 20px;
  min-height: 100px;
  padding: 16px;
  background: #0f172a;
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
  word-break: break-all;
}

.typing-char {
  color: #64748b;
  transition: all 0.1s ease;
}

.typing-char.current {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 4px;
  animation: blink 1s infinite;
}

.typing-char.correct {
  color: #10b981;
}

.typing-char.wrong {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 4px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.typing-input {
  width: 100%;
  min-height: 100px;
  padding: 16px;
  font-size: 18px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 12px;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
}

.typing-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.typing-input::placeholder {
  color: #475569;
}

.typing-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.typing-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #334155;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #e2e8f0;
}

.stat-value.error {
  color: #ef4444;
}
</style>
