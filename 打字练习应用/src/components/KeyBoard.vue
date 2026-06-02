<template>
  <div class="keyboard-container">
    <div class="keyboard-row">
      <div
        v-for="key in topRow"
        :key="key"
        :class="getKeyClass(key)"
        @click="handleKeyClick(key)"
      >
        {{ key }}
      </div>
    </div>
    <div class="keyboard-row">
      <div class="key-key w-12">
        Caps
      </div>
      <div
        v-for="key in middleRow"
        :key="key"
        :class="getKeyClass(key)"
        @click="handleKeyClick(key)"
      >
        {{ key }}
      </div>
      <div class="key-key w-12">
        Enter
      </div>
    </div>
    <div class="keyboard-row">
      <div class="key-key w-14">
        Shift
      </div>
      <div
        v-for="key in bottomRow"
        :key="key"
        :class="getKeyClass(key)"
        @click="handleKeyClick(key)"
      >
        {{ key }}
      </div>
      <div class="key-key w-14">
        Shift
      </div>
    </div>
    <div class="keyboard-row">
      <div class="key-key w-20">
        Ctrl
      </div>
      <div class="key-key w-14">
        Win
      </div>
      <div class="key-key w-14">
        Alt
      </div>
      <div class="key-key w-40 bg-slate-600">
        Space
      </div>
      <div class="key-key w-14">
        Alt
      </div>
      <div class="key-key w-14">
        Menu
      </div>
      <div class="key-key w-14">
        Ctrl
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  activeKey: string | null
  correctKey: string | null
  wrongKey: string | null
}>()

const emit = defineEmits<{
  (e: 'keypress', key: string): void
}>()

const topRow = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Back']
const middleRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|']
const bottomRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', '<', '>', '?']

const pressedKeys = ref<Set<string>>(new Set())

watch(() => props.activeKey, (newKey) => {
  if (newKey) {
    pressedKeys.value.add(newKey.toUpperCase())
    setTimeout(() => {
      pressedKeys.value.delete(newKey.toUpperCase())
    }, 150)
  }
})

function getKeyClass(key: string): string {
  const classes = ['key-key']
  
  if (pressedKeys.value.has(key.toUpperCase()) || props.activeKey?.toUpperCase() === key.toUpperCase()) {
    classes.push('active')
  }
  
  if (props.correctKey?.toUpperCase() === key.toUpperCase()) {
    classes.push('correct')
  }
  
  if (props.wrongKey?.toUpperCase() === key.toUpperCase()) {
    classes.push('wrong')
  }
  
  return classes.join(' ')
}

function handleKeyClick(key: string) {
  if (key === 'Back') {
    emit('keypress', 'backspace')
  } else if (key === 'Space') {
    emit('keypress', ' ')
  } else {
    emit('keypress', key.toLowerCase())
  }
}
</script>

<style scoped>
.keyboard-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.keyboard-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.key-key {
  width: 40px;
  height: 48px;
  background: #334155;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
  border: 1px solid #475569;
}

.key-key:hover {
  background: #475569;
}

.key-key.active {
  background: #3b82f6;
  transform: scale(0.95);
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
}

.key-key.correct {
  background: #10b981;
}

.key-key.wrong {
  background: #ef4444;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
</style>
