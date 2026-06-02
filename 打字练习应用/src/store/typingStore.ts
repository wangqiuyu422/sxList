import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TypingRecord } from '../api/db'
import { db } from '../api/db'

export type PracticeMode = 'letter' | 'word' | 'essay_en' | 'essay_cn'

export interface TypingState {
  currentMode: PracticeMode
  isPracticing: boolean
  startTime: number | null
  totalChars: number
  correctChars: number
  typedChars: string
  currentIndex: number
}

export const useTypingStore = defineStore('typing', () => {
  const currentMode = ref<PracticeMode>('letter')
  const isPracticing = ref(false)
  const startTime = ref<number | null>(null)
  const totalChars = ref(0)
  const correctChars = ref(0)
  const typedChars = ref('')
  const currentIndex = ref(0)

  const wpm = computed(() => {
    if (!isPracticing.value || !startTime.value || typedChars.value.length === 0) return 0
    const minutes = (Date.now() - startTime.value) / 60000
    return Math.round((typedChars.value.length / 5) / Math.max(minutes, 0.1))
  })

  const accuracy = computed(() => {
    if (totalChars.value === 0) return 100
    return Math.round((correctChars.value / totalChars.value) * 10000) / 100
  })

  const duration = computed(() => {
    if (!startTime.value) return 0
    return Math.round((Date.now() - startTime.value) / 1000)
  })

  function setMode(mode: PracticeMode) {
    currentMode.value = mode
  }

  function startPractice() {
    isPracticing.value = true
    startTime.value = Date.now()
    totalChars.value = 0
    correctChars.value = 0
    typedChars.value = ''
    currentIndex.value = 0
  }

  function endPractice(): Omit<TypingRecord, 'id'> {
    const record: Omit<TypingRecord, 'id'> = {
      mode: currentMode.value,
      wpm: wpm.value,
      accuracy: accuracy.value,
      totalChars: totalChars.value,
      correctChars: correctChars.value,
      duration: duration.value,
      date: new Date()
    }
    
    db.addRecord(record)
    
    isPracticing.value = false
    startTime.value = null
    totalChars.value = 0
    correctChars.value = 0
    typedChars.value = ''
    currentIndex.value = 0
    
    return record
  }

  function typeChar(correct: boolean) {
    totalChars.value++
    if (correct) {
      correctChars.value++
    }
    currentIndex.value++
  }

  function addTypedChar(char: string) {
    typedChars.value += char
  }

  function reset() {
    isPracticing.value = false
    startTime.value = null
    totalChars.value = 0
    correctChars.value = 0
    typedChars.value = ''
    currentIndex.value = 0
  }

  return {
    currentMode,
    isPracticing,
    startTime,
    totalChars,
    correctChars,
    typedChars,
    currentIndex,
    wpm,
    accuracy,
    duration,
    setMode,
    startPractice,
    endPractice,
    typeChar,
    addTypedChar,
    reset
  }
})
