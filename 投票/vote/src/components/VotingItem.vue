<template>
  <div class="voting-item">
    <!-- 具名插槽：展示候选人名称 -->
    <h3>
      <slot name="candidate-name"></slot>
    </h3>
    <p>当前票数：{{ voteCount }}</p>

    <!-- 普通投票：单次+1 -->
    <button @click="addOneVote" class="btn">投1票</button>

    <!-- 加权投票：输入0-10票 -->
    <div class="weight-vote">
      <input
        type="number"
        v-model.number="weightNum"
        min="0"
        max="10"
        placeholder="0-10票"
      >
      <button @click="addWeightVote" class="btn primary">投指定票数</button>
    </div>
  </div>
</template>

<script setup>
// 接收父组件传递的票数（props）
const props = defineProps({
  voteCount: {
    type: Number,
    required: true
  }
})

// 自定义事件：向父组件发送投票指令
const emit = defineEmits(['add-vote', 'add-weight-vote'])

// 加权投票输入值
const weightNum = ref(0)

// 单次投票
const addOneVote = () => {
  emit('add-vote')
}

// 加权投票
const addWeightVote = () => {
  // 校验票数范围 0-10
  if (weightNum < 0 || weightNum > 10) {
    alert('请输入0-10之间的票数！')
    return
  }
  emit('add-weight-vote', weightNum)
  // 投票后清空输入框
  weightNum.value = 0
}
</script>

<style scoped>
.voting-item {
  border: 1px solid #eee;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  width: 300px;
}
.btn {
  padding: 6px 12px;
  margin: 5px;
  cursor: pointer;
}
.primary {
  background: #42b983;
  color: white;
  border: none;
}
.weight-vote {
  margin-top: 10px;
}
input {
  padding: 6px;
  width: 80px;
}
</style>