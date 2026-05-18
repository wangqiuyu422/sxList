<template>
  <div class="cropper-container">
    <!-- 1. 图片上传区域 -->
    <div class="upload-area">
      <input 
        type="file" 
        ref="fileInput"
        accept="image/*" 
        @change="handleFileUpload"
        id="file-upload"
      >
      <label for="file-upload" class="upload-btn">选择文件</label>
      <span v-if="originalImage.name" class="file-name">{{ originalImage.name }}</span>
      <span v-if="originalImage.width" class="image-meta">
        | size: {{ originalImage.width }} × {{ originalImage.height }} 
        ({{ originalImage.naturalWidth }} × {{ originalImage.naturalHeight }})
      </span>
    </div>

    <!-- 2. 图片与裁剪选区画布 -->
    <div 
      class="image-wrapper"
      ref="imageWrapperRef"
      v-if="originalImage.src"
      @mousedown="handleSelectionMouseDown"
    >
      <img 
        ref="imageRef"
        :src="originalImage.src" 
        alt="待裁剪图片"
        @load="handleImageLoad"
      >
      <!-- 裁剪选区 -->
      <div 
        class="selection-box"
        :style="selectionStyle"
        @mousedown.stop="handleBoxMouseDown"
      >
        <!-- 8个缩放控制点 -->
        <div 
          v-for="point in resizePoints" 
          :key="point"
          class="resize-point"
          :class="point"
          @mousedown.stop="handleResizeMouseDown($event, point)"
        ></div>
      </div>
    </div>

    <!-- 3. 操作提示 -->
    <div class="tip-text" v-if="originalImage.src">
      设置选区后，请按回车键确定裁剪结果：
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, defineEmits } from 'vue'

// 定义事件：裁剪完成后向外传递结果
const emit = defineEmits(['crop-complete'])

// 响应式数据
const fileInput = ref(null)
const imageRef = ref(null)
const imageWrapperRef = ref(null)

// 原始图片信息
const originalImage = reactive({
  src: '',
  name: '',
  width: 0,
  height: 0,
  naturalWidth: 0,
  naturalHeight: 0
})

// 选区状态
const selection = reactive({
  x: 50,    // 选区左上角x坐标
  y: 50,    // 选区左上角y坐标
  width: 200,  // 选区宽度
  height: 150, // 选区高度
  isDragging: false, // 是否正在拖拽选区
  isResizing: false,  // 是否正在缩放选区
  resizePoint: ''     // 当前操作的缩放点
})

// 缩放控制点列表
const resizePoints = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'right', 'bottom', 'left']

// 计算选区样式
const selectionStyle = computed(() => {
  return {
    left: `${selection.x}px`,
    top: `${selection.y}px`,
    width: `${selection.width}px`,
    height: `${selection.height}px`
  }
})

// 处理文件上传
const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (event) => {
    originalImage.src = event.target.result
    originalImage.name = file.name
  }
  reader.readAsDataURL(file)
}

// 图片加载完成，记录尺寸
const handleImageLoad = () => {
  const img = imageRef.value
  originalImage.width = img.offsetWidth
  originalImage.height = img.offsetHeight
  originalImage.naturalWidth = img.naturalWidth
  originalImage.naturalHeight = img.naturalHeight

  // 初始化选区：居中显示
  selection.x = (originalImage.width - selection.width) / 2
  selection.y = (originalImage.height - selection.height) / 2
}

// 选区拖拽：鼠标按下
const handleBoxMouseDown = (e) => {
  selection.isDragging = true
  const startX = e.clientX
  const startY = e.clientY
  const startSelection = { x: selection.x, y: selection.y }

  // 鼠标移动事件
  const handleMouseMove = (moveEvent) => {
    if (!selection.isDragging) return
    const deltaX = moveEvent.clientX - startX
    const deltaY = moveEvent.clientY - startY

    // 限制选区在图片范围内
    selection.x = Math.max(0, Math.min(startSelection.x + deltaX, originalImage.width - selection.width))
    selection.y = Math.max(0, Math.min(startSelection.y + deltaY, originalImage.height - selection.height))
  }

  // 鼠标松开事件
  const handleMouseUp = () => {
    selection.isDragging = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

// 选区缩放：鼠标按下
const handleResizeMouseDown = (e, point) => {
  selection.isResizing = true
  selection.resizePoint = point
  const startX = e.clientX
  const startY = e.clientY
  const startSelection = { ...selection }

  const handleMouseMove = (moveEvent) => {
    if (!selection.isResizing) return
    const deltaX = moveEvent.clientX - startX
    const deltaY = moveEvent.clientY - startY

    // 根据不同控制点，计算新的选区尺寸和位置
    switch (point) {
      case 'top-left':
        selection.width = Math.max(50, startSelection.width - deltaX)
        selection.height = Math.max(50, startSelection.height - deltaY)
        selection.x = Math.max(0, startSelection.x + deltaX)
        selection.y = Math.max(0, startSelection.y + deltaY)
        break
      case 'top-right':
        selection.width = Math.max(50, startSelection.width + deltaX)
        selection.height = Math.max(50, startSelection.height - deltaY)
        selection.y = Math.max(0, startSelection.y + deltaY)
        break
      case 'bottom-left':
        selection.width = Math.max(50, startSelection.width - deltaX)
        selection.height = Math.max(50, startSelection.height + deltaY)
        selection.x = Math.max(0, startSelection.x + deltaX)
        break
      case 'bottom-right':
        selection.width = Math.max(50, startSelection.width + deltaX)
        selection.height = Math.max(50, startSelection.height + deltaY)
        break
      case 'top':
        selection.height = Math.max(50, startSelection.height - deltaY)
        selection.y = Math.max(0, startSelection.y + deltaY)
        break
      case 'right':
        selection.width = Math.max(50, startSelection.width + deltaX)
        break
      case 'bottom':
        selection.height = Math.max(50, startSelection.height + deltaY)
        break
      case 'left':
        selection.width = Math.max(50, startSelection.width - deltaX)
        selection.x = Math.max(0, startSelection.x + deltaX)
        break
    }

    // 限制选区不超出图片边界
    selection.x = Math.min(selection.x, originalImage.width - selection.width)
    selection.y = Math.min(selection.y, originalImage.height - selection.height)
  }

  const handleMouseUp = () => {
    selection.isResizing = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

// 回车触发裁剪
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && originalImage.src) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 计算真实图片的裁剪比例（适配缩放后的图片）
    const scaleX = originalImage.naturalWidth / originalImage.width
    const scaleY = originalImage.naturalHeight / originalImage.height

    const cropX = selection.x * scaleX
    const cropY = selection.y * scaleY
    const cropW = selection.width * scaleX
    const cropH = selection.height * scaleY

    // 设置画布尺寸
    canvas.width = cropW
    canvas.height = cropH

    // 绘制裁剪后的图片
    const img = new Image()
    img.src = originalImage.src
    img.onload = () => {
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
      // 向外传递裁剪结果
      emit('crop-complete', canvas.toDataURL('image/jpeg'))
    }
  }
}

// 挂载时监听键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

// 卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.cropper-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.upload-btn {
  padding: 6px 12px;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

#file-upload {
  display: none;
}

.file-name {
  font-size: 14px;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  border: 1px solid #eee;
}

.image-wrapper img {
  display: block;
  max-width: 100%;
}

.selection-box {
  position: absolute;
  border: 2px solid #409eff;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  cursor: move;
}

.resize-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 1px solid #409eff;
}

/* 缩放点定位 */
.top-left { top: -5px; left: -5px; cursor: nw-resize; }
.top-right { top: -5px; right: -5px; cursor: ne-resize; }
.bottom-left { bottom: -5px; left: -5px; cursor: sw-resize; }
.bottom-right { bottom: -5px; right: -5px; cursor: se-resize; }
.top { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
.right { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
.bottom { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
.left { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }

.tip-text {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}
</style>