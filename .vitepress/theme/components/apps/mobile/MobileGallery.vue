<template>
  <div v-if="isOpen" class="mobile-gallery-modal">
    <div class="gallery-header">
      <div class="header-left">
        <span class="gallery-icon">🖼️</span>
        <span class="gallery-title">ARCHIVE_VIEWER</span>
      </div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
    
    <div class="gallery-content">
      <div class="image-container">
        <img :src="characterImage" :alt="characterName" class="gallery-image" />
        <div class="scanlines"></div>
        <div class="glitch-overlay"></div>
      </div>
      
      <div class="gallery-info">
        <h2 class="char-name">{{ characterName }}</h2>
        <div class="char-id">{{ characterId }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: Boolean,
  characterName: String,
  characterId: String,
  characterImage: String
});

defineEmits(['close']);
</script>

<style scoped>
.mobile-gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 20000;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.gallery-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  padding-top: max(0px, env(safe-area-inset-top));
  height: calc(50px + env(safe-area-inset-top));
  border-bottom: 1px solid #333;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffb000;
  font-family: 'Share Tech Mono', monospace;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  padding: 5px;
}

.gallery-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  /* aspect-ratio: 1; Removed fixed aspect ratio for better fit */
  height: 60vh; /* Use viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  background: #111;
  overflow: hidden;
  margin-bottom: 20px;
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Effects */
.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
}

.gallery-info {
  text-align: center;
}

.char-name {
  color: #fff;
  font-size: 1.5rem;
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: bold;
}

.char-id {
  color: #666;
  font-family: 'Share Tech Mono', monospace;
  margin-top: 5px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
