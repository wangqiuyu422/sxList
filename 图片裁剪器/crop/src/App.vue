<template>
  <div class="app">
    <h2>项目五 图片裁剪器应用</h2>
    <ImageCropper @crop-complete="handleCropComplete" />
    <CropperResult :cropped-images="croppedImages" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImageCropper from './components/ImageCropper.vue'
import CropperResult from './components/CropperResult.vue'

// 存储所有裁剪结果
const croppedImages = ref([])

// 接收裁剪结果
const handleCropComplete = (imageData) => {
  croppedImages.value.push(imageData)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: "Microsoft Yahei", sans-serif;
  padding: 30px 0;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>