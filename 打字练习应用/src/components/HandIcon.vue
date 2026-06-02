<template>
  <div class="hand-icon" :class="{ left: isLeft }">
    <svg viewBox="0 0 100 100" :class="{ flip: !isLeft }">
      <circle cx="50" cy="20" r="8" fill="#f59e0b" />
      <rect x="45" y="28" width="10" height="35" fill="#f59e0b" rx="3" />
      <g class="fingers">
        <rect x="20" y="30" width="12" height="30" fill="#fbbf24" rx="3" class="finger finger-1">
          <text x="26" y="48" font-size="6" fill="#d97706">Q</text>
        </rect>
        <rect x="34" y="32" width="12" height="28" fill="#fbbf24" rx="3" class="finger finger-2">
          <text x="40" y="48" font-size="6" fill="#d97706">W</text>
        </rect>
        <rect x="48" y="35" width="12" height="25" fill="#fbbf24" rx="3" class="finger finger-3">
          <text x="54" y="48" font-size="6" fill="#d97706">E</text>
        </rect>
        <rect x="62" y="32" width="12" height="28" fill="#fbbf24" rx="3" class="finger finger-4">
          <text x="68" y="48" font-size="6" fill="#d97706">R</text>
        </rect>
        <rect x="76" y="30" width="12" height="30" fill="#fbbf24" rx="3" class="finger finger-5">
          <text x="82" y="48" font-size="6" fill="#d97706">T</text>
        </rect>
      </g>
    </svg>
    <div class="label">{{ isLeft ? '左手' : '右手' }}</div>
    <div v-if="activeFinger !== null" class="finger-hint">
      第 {{ activeFinger + 1 }} 指
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLeft: boolean
  activeFinger: number | null
}>()
</script>

<style scoped>
.hand-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.hand-icon svg {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.hand-icon svg.flip {
  transform: scaleX(-1);
}

.hand-icon svg .finger {
  transition: all 0.2s ease;
}

.hand-icon svg .finger.active {
  fill: #10b981;
  transform: translateY(3px);
}

.label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.finger-hint {
  font-size: 11px;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.finger.active {
  animation: pulse 0.5s ease-in-out infinite;
}
</style>
