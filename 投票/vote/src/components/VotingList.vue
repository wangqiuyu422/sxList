<template>
  <div class="voting-list">
    <h2>候选人投票系统</h2>
    <div class="item-container">
      <!-- 循环渲染4个候选人 -->
      <VotingItem
        v-for="(item, index) in candidateList"
        :key="index"
        :vote-count="item.votes"
        @add-vote="addVote(index)"
        @add-weight-vote="addWeightVote(index, $event)"
      >
        <!-- 具名插槽传递候选人名称 -->
        <template #candidate-name>
          {{ item.name }}
        </template>
      </VotingItem>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 1. 导入子组件（Vue3自动注册，无需手动注册）
import VotingItem from './VotingItem.vue'

// 2. 候选人数据（4个候选人）
const candidateList = ref([
  { name: '候选人A', votes: 0 },
  { name: '候选人B', votes: 0 },
  { name: '候选人C', votes: 0 },
  { name: '候选人D', votes: 0 }
])

// 3. 普通投票：票数+1
const addVote = (index) => {
  candidateList.value[index].votes += 1
}

// 4. 加权投票：增加指定票数
const addWeightVote = (index, num) => {
  candidateList.value[index].votes += num
}
</script>

<style scoped>
.voting-list {
  text-align: center;
  padding: 20px;
}
.item-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>