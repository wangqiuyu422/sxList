<template>
  <div class="pomodoro">
    <h2>番茄时钟</h2>

    <!-- 时间显示 -->
    <div class="time-box">
      <span>{{ minutes.toString().padStart(2, '0') }}</span>
      <span>:</span>
      <span>{{ seconds.toString().padStart(2, '0') }}</span>
    </div>

    <!-- 编辑状态：修改时间 -->
    <div v-if="status === 'edit'" class="edit-box">
      <input
        type="number"
        v-model.number="editMinutes"
        min="1"
        max="60"
        placeholder="分钟"
      />
      <button @click="saveEdit">保存</button>
      <button @click="cancelEdit">取消</button>
    </div>

    <!-- 按钮区域 -->
    <div class="btn-box" v-else>
      <!-- 停止状态 -->
      <button v-if="status === 'stop'" @click="startTimer">开始</button>
      <button v-if="status === 'stop'" @click="editTimer">编辑</button>

      <!-- 计时状态 -->
      <button v-if="status === 'running'" @click="pauseTimer">暂停</button>
      <button v-if="status === 'running'" @click="stopTimer">停止</button>

      <!-- 暂停状态 -->
      <button v-if="status === 'paused'" @click="startTimer">继续</button>
      <button v-if="status === 'paused'" @click="stopTimer">停止</button>
      <button v-if="status === 'paused'" @click="editTimer">编辑</button>
    </div>

    <p>当前状态：{{ statusText }}</p>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

// ============= 1. 状态与时间数据 =============
const status = ref('stop') // stop / running / paused / edit
const statusText = ref('停止状态')

// 默认25分钟
const totalMinutes = ref(25)
let remainTime = ref(totalMinutes.value * 60) // 剩余秒数

// 显示分、秒
const minutes = ref(25)
const seconds = ref(0)

// 编辑时使用
const editMinutes = ref(25)

// 定时器ID
let timer = null

// ============= 2. 状态文本更新 =============
const updateStatusText = () => {
  const map = {
    stop: '停止状态',
    running: '计时中',
    paused: '已暂停',
    edit: '编辑中'
  }
  statusText.value = map[status.value]
}

// ============= 3. 时间格式化 =============
const formatTime = () => {
  minutes.value = Math.floor(remainTime.value / 60)
  seconds.value = remainTime.value % 60
}

// ============= 4. 播放提示音 =============
const playAlarm = () => {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3')
  audio.play().catch(() => {})
}

// ============= 5. 核心：计时逻辑 =============
const startTimer = () => {
  if (timer) clearInterval(timer)
  status.value = 'running'
  updateStatusText()

  timer = setInterval(() => {
    remainTime.value--
    formatTime()

    // 时间到
    if (remainTime.value <= 0) {
      clearInterval(timer)
      playAlarm()
      stopTimer()
      alert('番茄时间结束！')
    }
  }, 1000)
}

// 暂停
const pauseTimer = () => {
  clearInterval(timer)
  status.value = 'paused'
  updateStatusText()
}

// 停止
const stopTimer = () => {
  clearInterval(timer)
  status.value = 'stop'
  remainTime.value = totalMinutes.value * 60
  formatTime()
  updateStatusText()
}

// 进入编辑
const editTimer = () => {
  clearInterval(timer)
  editMinutes.value = totalMinutes.value
  status.value = 'edit'
  updateStatusText()
}

// 保存编辑
const saveEdit = () => {
  totalMinutes.value = editMinutes.value
  remainTime.value = totalMinutes.value * 60
  formatTime()
  status.value = 'stop'
  updateStatusText()
}

// 取消编辑
const cancelEdit = () => {
  status.value = 'stop'
  updateStatusText()
}

// 组件销毁清除定时器
onUnmounted(() => clearInterval(timer))

// 初始化
formatTime()
updateStatusText()
</script>

<style scoped>
.pomodoro {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.time-box {
  font-size: 60px;
  font-weight: bold;
  margin: 30px 0;
  color: #e53935;
}

.edit-box {
  margin: 20px 0;
}
.edit-box input {
  width: 80px;
  padding: 8px;
  font-size: 16px;
  margin-right: 10px;
}

.btn-box button, .edit-box button {
  padding: 10px 18px;
  margin: 0 6px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #42b983;
  color: white;
}
.btn-box button:nth-child(2) {
  background: #e53935;
}

p {
  margin-top: 20px;
  color: #666;
}
</style>