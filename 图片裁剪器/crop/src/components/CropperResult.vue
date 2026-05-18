<template>
  <div class="result-container" v-if="croppedImages.length > 0">
    <h4>裁剪结果：</h4>
    <div class="result-list">
      <img 
        v-for="(img, index) in croppedImages" 
        :key="index"
        :src="img" 
        alt="裁剪结果"
        class="result-img"
      >
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  croppedImages: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.result-container {
  max-width: 1000px;
  margin: 30px auto;
  padding: 0 20px;
}

.result-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.result-img {
  max-height: 120px;
  border: 1px solid #eee;
}
</style>