<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="gallery-modal-overlay" @click.self="close">
      <div class="gallery-modal-content">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-decor">
            <span class="decor-icon">◈</span>
            <span class="decor-line"></span>
          </div>
          <h2 class="modal-title">VISUAL ARCHIVE: {{ characterName }}</h2>
          <button class="close-btn" @click="close">
            <span class="btn-text">CLOSE</span>
            <span class="btn-icon">✕</span>
          </button>
        </div>

        <!-- Main Viewport -->
        <div class="main-viewport">
          <div class="viewport-frame">
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>
            
            <div class="image-container" v-if="currentImage">
              <img :src="currentImage" :alt="characterName" class="main-image" />
              <div class="scan-line"></div>
              
              <!-- Description Box -->
              <div class="image-caption-box">
                <div class="caption-inner">
                  <div class="caption-header">
                    <span class="caption-icon">◈</span>
                    <span class="caption-title">ANALYSIS DATA</span>
                  </div>
                  <div class="caption-content">
                    {{ getImageDescription(currentIdx) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="loading-state">
              <span>{{ images.length === 0 ? 'NO VISUAL DATA FOUND' : 'SEARCHING ARCHIVES...' }}</span>
            </div>

            <!-- Navigation -->
            <button class="nav-btn prev" @click="prevImage" :disabled="images.length <= 1">
              &lt;
            </button>
            <button class="nav-btn next" @click="nextImage" :disabled="images.length <= 1">
              &gt;
            </button>
          </div>
        </div>

        <!-- Thumbnails -->
        <div class="thumbnails-strip">
          <div 
            v-for="(img, idx) in images" 
            :key="idx"
            class="thumb-item"
            :class="{ active: currentIdx === idx }"
            @click="currentIdx = idx"
          >
            <img :src="img" loading="lazy" />
            <div class="thumb-overlay"></div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="modal-footer">
          <span class="file-info">FILE: {{ currentFileName }}</span>
          <span class="count-info">{{ currentIdx + 1 }} / {{ images.length }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps({
  isOpen: Boolean,
  characterName: String,
  characterId: String,
  characterImage: String // Used to derive folder name
});

const emit = defineEmits(['close']);

const images = ref([]);
const currentIdx = ref(0);

// Glob import to find images in public/images
const imageGlobs = import.meta.glob('../../../../public/images/**/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });

const loadImages = () => {
  // We need to determine the folder name.
  // Strategy:
  // 1. Try to derive from characterImage (e.g. /images/characters/Victoria.png -> Victoria)
  // 2. Fallback to characterName (if it happens to be English)
  
  let targetFolder = '';
  
  if (props.characterImage) {
    const filename = props.characterImage.split('/').pop(); // Victoria.png
    if (filename) {
      targetFolder = filename.split('.')[0]; // Victoria
    }
  }
  
  if (!targetFolder && props.characterName) {
    targetFolder = props.characterName;
  }
  
  if (!targetFolder) return;
  
  const targetName = targetFolder.trim().toLowerCase();
  const foundImages = [];

  for (const path in imageGlobs) {
    // path example: ../../../../public/images/Aria/1.png
    const normalizedPath = path.replace(/\\/g, '/');
    
    // We look for '/public/images/' to identify the root of our search
    const publicMarker = '/public/images/';
    const index = normalizedPath.indexOf(publicMarker);
    
    if (index !== -1) {
      // Extract the path starting from /images/ for the URL
      // normalizedPath: .../public/images/Aria/1.png
      // urlPath: /images/Aria/1.png
      const urlPath = normalizedPath.substring(index + '/public'.length);
      
      // To check the folder name, we look at what comes after /images/
      const pathAfterImages = urlPath.substring('/images/'.length); // Aria/1.png
      
      const parts = pathAfterImages.split('/');
      if (parts.length > 0) {
        const folderName = parts[0];
        
        // Check if folder matches character name (case-insensitive)
        if (folderName.toLowerCase() === targetName) {
           foundImages.push(withBase(urlPath));
        }
      }
    }
  }
  
  // Sort by filename (numeric if possible)
  foundImages.sort((a, b) => {
    const aName = a.split('/').pop();
    const bName = b.split('/').pop();
    return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
  });

  images.value = foundImages;
  currentIdx.value = 0;
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadImages();
  }
});

const currentImage = computed(() => images.value[currentIdx.value]);
const currentFileName = computed(() => {
    if (!currentImage.value) return 'N/A';
    return currentImage.value.split('/').pop();
});

const getImageDescription = (idx) => {
  if (!images.value[idx]) return 'NO DATA';
  
  const url = images.value[idx];
  const filename = url.split('/').pop(); // e.g., "1.png"
  
  const descriptionMap = {
    '1.png': '기본',
    '2.png': '기쁨',
    '3.png': '분노',
    '4.png': '슬픔',
    '5.png': '당황',
    '6.png': '홍조'
  };

  if (descriptionMap[filename]) {
    return descriptionMap[filename];
  }

  // Fallback for other files
  return `ARCHIVE_RECORD_${String(idx + 1).padStart(2, '0')}`;
};

const nextImage = () => {
  if (images.value.length === 0) return;
  currentIdx.value = (currentIdx.value + 1) % images.value.length;
};

const prevImage = () => {
  if (images.value.length === 0) return;
  currentIdx.value = (currentIdx.value - 1 + images.value.length) % images.value.length;
};

const close = () => {
  emit('close');
};

// Keyboard navigation
const handleKeydown = (e) => {
  if (!props.isOpen) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.gallery-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Share Tech Mono', monospace;
}

.gallery-modal-content {
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  background: rgba(10, 5, 2, 0.95);
  border: 1px solid #ffb000;
  box-shadow: 0 0 30px rgba(255, 176, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  color: #ffb000;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  padding-bottom: 10px;
}

.header-decor {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffb000;
}

.modal-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
  margin: 0;
}

.close-btn {
  background: transparent;
  border: 1px solid #ffb000;
  color: #ffb000;
  padding: 5px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #ffb000;
  color: #000;
}

/* Main Viewport */
.main-viewport {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  overflow: hidden;
}

.viewport-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 1px solid rgba(255, 176, 0, 0.2);
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 176, 0, 0.5);
  animation: scan 3s linear infinite;
  pointer-events: none;
}

/* Caption Box */
.image-caption-box {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: rgba(10, 5, 2, 0.9);
  border: 1px solid #ffb000;
  border-left: 4px solid #ffb000;
  padding: 15px;
  min-width: 200px;
  max-width: 300px;
  z-index: 20;
  box-shadow: 0 5px 20px rgba(0,0,0,0.8);
  transform: skewX(-10deg);
  backdrop-filter: blur(4px);
}

.caption-inner {
  transform: skewX(10deg);
}

.caption-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  padding-bottom: 5px;
  margin-bottom: 8px;
  font-size: 0.7rem;
  color: #ffb000;
  opacity: 0.8;
  letter-spacing: 1px;
}

.caption-content {
  font-size: 1rem;
  color: #fff;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
}

@keyframes scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* Navigation Buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ffb000;
  color: #ffb000;
  font-size: 2rem;
  padding: 20px 10px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
}

.nav-btn:hover:not(:disabled) {
  background: #ffb000;
  color: #000;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn.prev { left: 10px; }
.nav-btn.next { right: 10px; }

/* Thumbnails */
.thumbnails-strip {
  height: 80px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 5px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 176, 0, 0.3);
}

.thumb-item {
  height: 100%;
  aspect-ratio: 1;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  opacity: 0.6;
  transition: all 0.3s;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item:hover, .thumb-item.active {
  opacity: 1;
  border-color: #ffb000;
}

.thumb-item.active .thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 176, 0, 0.2);
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Corners */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #ffb000;
  pointer-events: none;
}

.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.br { bottom: 0; right: 0; border-left: none; border-top: none; }

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
