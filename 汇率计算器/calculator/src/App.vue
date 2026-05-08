<template>
  <p class="title">汇率计算器</p>
  <ul>
    <!-- 基础货币输入框 -->
    <li>
      <span>{{ baseCurrency }}</span>
      <input
        type="number"
        v-model.number="amount"
        min="0"
        step="0.01"
        placeholder="请输入金额"
      />
    </li>
    <!-- 循环渲染其他货币，点击切换 -->
    <li
      v-for="currency in otherCurrency"
      :key="currency"
      @click="swapCurrency(currency)"
    >
      <span>{{ currency }}</span>
      <span>{{ calculateExchange(baseCurrency, amount, currency) }}</span>
    </li>
  </ul>
  <p class="intro">点击鼠标可以切换货币种类</p>
</template>

<script setup>
import { ref, computed } from 'vue'

// 1. 定义固定汇率（实训要求写死）
const rate = { CNY: 1, JPY: 22.19, HKD: 1.2, USD: 0.14, EUR: 0.12 }

// 2. 响应式数据：基础货币、输入金额
const baseCurrency = ref('CNY')
const amount = ref(1)

// 3. 计算属性：筛选出非基础货币的列表
const otherCurrency = computed(() => {
  return Object.keys(rate).filter(currency => currency !== baseCurrency.value)
})

// 4. 计算兑换金额
const calculateExchange = (base, num, target) => {
  return (num * (rate[target] / rate[base])).toFixed(2)
}

// 5. 点击切换基础货币
const swapCurrency = (target) => {
  baseCurrency.value = target
}
</script>

<style scoped>
/* 标题样式 */
p.title {
  text-align: center;
  font-size: 18px;
  margin: 30px 0 10px 0;
}

/* 说明文字 */
p.intro {
  text-align: center;
  font-size: 14px;
}

/* 列表容器 */
ul {
  margin: 0 auto;
  width: 200px;
  list-style-type: none;
  border: 2px solid #999;
  border-radius: 10px;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
}

/* 列表项 */
li {
  padding: 10px;
}

/* 第一个列表项（输入框）布局 */
li:first-child {
  display: flex;
  border-bottom: 2px solid #999;
}

/*  hover 效果 */
li:not(:first-child):hover {
  background-color: #ddd;
  cursor: pointer;
}

/* 文字样式 */
span {
  cursor: default;
}
span:last-child {
  float: right;
}

/* 输入框样式 */
input {
  text-align: right;
  border: none;
  font-size: 16px;
  width: 100px;
  margin-left: auto;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
  outline: none;
  border-bottom: 1px solid #000;
}
</style>