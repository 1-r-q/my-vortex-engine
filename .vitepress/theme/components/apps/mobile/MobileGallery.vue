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
        <img :src="currentImageSrc" :alt="characterName" class="gallery-image" />
        <div class="scanlines"></div>
        <div class="glitch-overlay"></div>
      </div>
      
      <!-- Variant Selector -->
      <div class="variant-selector">
        <button 
          v-for="(img, index) in galleryImages" 
          :key="img.id"
          class="variant-btn"
          :class="{ active: selectedVariant === index }"
          @click="selectedVariant = index"
        >
          {{ index === 0 ? 'DEFAULT' : index }}
        </button>
      </div>

      <div class="gallery-info">
        <h2 class="char-name">{{ characterName }}</h2>
        <div class="char-id">{{ characterId }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps({
  isOpen: Boolean,
  characterName: String,
  characterId: String,
  characterImage: String
});

defineEmits(['close']);

const selectedVariant = ref(0);

// Extract base name for folder lookup
// e.g. "/my-base/images/characters/Aria.png" -> "Aria"
const characterBaseName = computed(() => {
  if (!props.characterImage) return '';
  // Remove query params if any
  const cleanPath = props.characterImage.split('?')[0];
  const parts = cleanPath.split('/');
  const filename = parts[parts.length - 1]; // "Aria.png"
  return filename.replace(/\.[^/.]+$/, ""); // "Aria"
});

const galleryImages = computed(() => {
  if (!characterBaseName.value) return [];
  
  // Index 0 is the passed main image (already processed withBase in parent)
  const images = [{
    id: 'main',
    src: props.characterImage // already full path
  }];
  
  // Add 6 variations
  // We need to assume the folder name matches the character base name
  // raw path: /images/BaseName/1.png
  // We need to wrap this in withBase.
  // Since we don't have access to global base easily inside computed (unless we import useData),
  // we can rely on withBase import from vitepress.
  
  for (let i = 1; i <= 6; i++) {
    images.push({
      id: `var-${i}`,
      src: withBase(`/images/${characterBaseName.value}/${i}.png`)
    });
  }
  
  return images;
});

const currentImageSrc = computed(() => {
  const img = galleryImages.value[selectedVariant.value];
  return img ? img.src : props.characterImage;
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    selectedVariant.value = 0;
  }
});
</script>

<style scoped>
/* ... existing styles ... */
.variant-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding: 4px;
  max-width: 100%;
}

.variant-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 176, 0, 0.3);
  color: #ffb000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
}

.variant-btn.active {
  background: #ffb000;
  color: #000;
  font-weight: bold;
}
</style>


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
