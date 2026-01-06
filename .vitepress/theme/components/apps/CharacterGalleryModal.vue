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
            
            <div class="image-container" v-if="currentImage" @click="handleImageClick" style="cursor: pointer;">
              <img :src="currentImage" :alt="characterName" class="main-image" />
              <div class="scan-line"></div>
              
              <!-- Top-Right Info Box (Emotion/Status) -->
              <div class="image-info-box">
                <div class="info-header">
                    <span class="info-icon">◈</span>
                    <span class="info-title">VISUAL ANALYSIS</span>
                </div>
                <div class="info-content">
                    <div class="info-row">
                        <span class="label">EMOTION:</span>
                        <span class="value">{{ getImageDescription(currentIdx) }}</span>
                    </div>
                    <!-- Display password if unlocked -->
                    <div class="info-row password-row" v-if="isPasswordUnlocked && fullCharacterData?.unlockPassword">
                        <span class="label text-red">KEY:</span>
                        <span class="value highlight-red">{{ fullCharacterData.unlockPassword }}</span>
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

        <!-- Bottom Layout: Thumbnails + Dialogue -->
        <div class="bottom-layout">
          <!-- Thumbnails (Left) -->
          <div class="thumbnails-container">
            <div class="thumbnails-strip">
              <div 
                v-for="(img, idx) in images" 
                :key="idx"
                class="thumb-item"
                :class="{ active: currentIdx === idx }"
                @click="selectThumbnail(idx)"
                @mouseenter="playHover"
              >
                <img :src="img" loading="lazy" />
                <div class="thumb-overlay"></div>
              </div>
            </div>
          </div>

          <!-- Dialogue (Right) -->
          <div class="dialogue-panel">
            <div class="dialogue-header">
                <span class="char-name">{{ characterName }}</span>
                <div class="sync-status" v-if="clickCount > 0">
                    <span class="label">SYNC</span>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: Math.min(clickCount * 5, 100) + '%' }"></div>
                    </div>
                </div>
            </div>
            <div class="dialogue-body">
                <div class="quote-text" :class="{ 'highlight': isHiddenUnlocked }">
                    "{{ displayedQuote }}"<span v-if="isTyping" class="cursor">_</span>
                </div>
            </div>
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
import { characterData } from '../../data/characterData';
import { useSteamSound } from '../../composables/useSteamSound';
import { unlockPassword, unlockHiddenQuotes } from '../../stores/unlockedStore';

const props = defineProps({
  isOpen: Boolean,
  characterName: String,
  characterId: String,
  characterImage: String // Used to derive folder name
});

const emit = defineEmits(['close']);

const { playClick, playDataTransmit, playTyping, playSelect, playHover, playUnlock, playSound } = useSteamSound();

const images = ref([]);
const currentIdx = ref(0);
const clickCount = ref(0);
const isHiddenUnlocked = ref(false); // 10 clicks
const isPasswordUnlocked = ref(false); // 20 clicks
const currentQuote = ref('');
const displayedQuote = ref('');
const isTyping = ref(false);
const typingTimeout = ref(null);

// Find full character data for quotes/password
const fullCharacterData = computed(() => {
  if (!props.characterId) return null;
  for (const faction of characterData) {
    const found = faction.characters.find(c => c.id === props.characterId);
    if (found) return found;
  }
  return null;
});

// Load Persistence
const loadPersistence = () => {
    if (typeof window === 'undefined' || !props.characterId) return;
    const key = `vortex-char-clicks-${props.characterId}`;
    const stored = localStorage.getItem(key);
    clickCount.value = stored ? parseInt(stored) : 0;
    isHiddenUnlocked.value = clickCount.value >= 10;
    isPasswordUnlocked.value = clickCount.value >= 20;

    // Sync with global store
    if (isHiddenUnlocked.value) unlockHiddenQuotes(props.characterId);
    if (isPasswordUnlocked.value) unlockPassword(props.characterId);
    
    // Pick initial quote
    pickRandomQuote();
};

const savePersistence = () => {
    if (typeof window === 'undefined' || !props.characterId) return;
    const key = `vortex-char-clicks-${props.characterId}`;
    localStorage.setItem(key, clickCount.value.toString());
};

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
      const urlPath = normalizedPath.substring(index + '/public'.length);
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
    loadPersistence();
  } else {
     if (typingTimeout.value) clearTimeout(typingTimeout.value);
  }
});

const startTyping = (text) => {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
    typingTimeout.value = null;
  }
  
  displayedQuote.value = '';
  isTyping.value = true;
  let i = 0;
  
  const typeChar = () => {
    if (i < text.length) {
      displayedQuote.value += text.charAt(i);
      i++;
      if (i % 3 === 0) playTyping();
      typingTimeout.value = setTimeout(typeChar, 30);
    } else {
      isTyping.value = false;
      typingTimeout.value = null;
    }
  };
  typeChar();
};

const pickRandomQuote = () => {
  if (!fullCharacterData.value) return;
  const char = fullCharacterData.value;
  let pool = [...(char.quotes || [])];
  
  if (isHiddenUnlocked.value && char.hiddenQuotes) {
    pool = [...pool, ...char.hiddenQuotes];
  }
  
  if (pool.length === 0) {
      // Default fallback
      startTyping(`ARCHIVE_ACCESS: ${props.characterName} // STANDBY`);
      return;
  }

  const nextQuote = pool[Math.floor(Math.random() * pool.length)];
  currentQuote.value = nextQuote;
  startTyping(nextQuote);
};

const handleImageClick = () => {
  if (!props.isOpen) return;

  const hasPassword = !!fullCharacterData.value?.unlockPassword;
  const maxSync = hasPassword ? 20 : 10;
  
  if (clickCount.value < maxSync) {
    clickCount.value++;
    savePersistence();
  }

  // Check Milestones
  if (clickCount.value === 10 && !isHiddenUnlocked.value) {
      isHiddenUnlocked.value = true;
      unlockHiddenQuotes(props.characterId);
      playUnlock();
      startTyping(">> 시스템 경고: 숨겨진 인격 아카이브가 잠금 해제되었습니다.");
      return;
  }

  if (clickCount.value === 20 && !isPasswordUnlocked.value) {
      isPasswordUnlocked.value = true;
      unlockPassword(props.characterId);
      if (fullCharacterData.value?.unlockPassword) {
         playUnlock();
         startTyping(`>> 복호화 완료. 보안 키: [${fullCharacterData.value.unlockPassword}]`);
      } else {
         startTyping(">> 시스템: 연관된 보안 키를 찾을 수 없습니다.");
      }
      return;
  }

  playClick();
  pickRandomQuote();
};

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
  playSound('click', 0.2); // Lower volume
  currentIdx.value = (currentIdx.value + 1) % images.value.length;
};

const prevImage = () => {
  if (images.value.length === 0) return;
  playSound('click', 0.2); // Lower volume
  currentIdx.value = (currentIdx.value - 1 + images.value.length) % images.value.length;
};

const selectThumbnail = (idx) => {
    if (currentIdx.value !== idx) {
        playSelect();
        currentIdx.value = idx;
    }
};

const close = () => {
  playClick();
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

/* Image Info Box (Top Right) */
.image-info-box {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(10, 5, 2, 0.9);
  border: 1px solid #ffb000;
  padding: 10px 15px;
  min-width: 180px;
  z-index: 20;
  backdrop-filter: blur(4px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  padding-bottom: 5px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: #ffb000;
  letter-spacing: 1px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-family: 'Share Tech Mono', monospace;
}

.info-row .label {
  color: #888;
  margin-right: 10px;
}

.info-row .value {
  color: #fff;
  font-weight: bold;
}

.text-red { color: #ff3333 !important; }
.highlight-red { color: #ff3333 !important; text-shadow: 0 0 5px rgba(255, 50, 50, 0.5); }


/* Bottom Layout */
.bottom-layout {
  display: flex;
  gap: 20px;
  height: 140px;
  margin-top: 15px;
  margin-bottom: 5px;
}

.thumbnails-container {
  flex: 0 0 60%;
  border: 1px solid rgba(255, 176, 0, 0.3);
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
}

.thumbnails-strip {
  height: 100%;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px;
}

.thumb-item {
  height: 100%;
  aspect-ratio: 1;
  cursor: pointer;
  position: relative;
  border: 1px solid transparent;
  opacity: 0.6;
  transition: all 0.3s;
  flex-shrink: 0;
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

/* Dialogue Panel (Moved to Bottom Right) */
.dialogue-panel {
  flex: 1;
  background: rgba(10, 5, 2, 0.95);
  border: 1px solid #ffb000;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255,176,0,0.1);
}

.dialogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255,176,0,0.3);
}

.char-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.0rem;
  color: #ffb000;
  font-weight: bold;
  letter-spacing: 1px;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #888;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 176, 0, 0.2);
  border: 1px solid rgba(255, 176, 0, 0.3);
}

.progress-fill {
  height: 100%;
  background: #ffb000;
  transition: width 0.3s ease;
}

.dialogue-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #ddd;
  font-family: 'Share Tech Mono', monospace;
}

.quote-text {
  white-space: pre-wrap;
}

.quote-text.highlight {
    color: #ffd700;
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

/* Mobile Optimization */
@media (max-width: 768px) {
  .gallery-modal-content {
    width: 100%;
    height: 100%;
    max-width: none;
    border: none;
  }

  .image-info-box {
    position: absolute;
    top: 10px;
    right: 10px;
    left: auto;
    width: auto;
    margin-top: 0;
    font-size: 0.8em;
  }

  .main-viewport {
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  
  .viewport-frame {
     display: flex;
     flex-direction: column;
     align-items: stretch;
  }

  .image-container {
    flex: 1;
    min-height: 0;
  }

  /* Stack bottom layout vertically on mobile */
  .bottom-layout {
    flex-direction: column;
    height: auto;
    gap: 10px;
    margin-top: 10px;
    flex-shrink: 0;
  }

  .thumbnails-container {
    height: 80px; /* Fixed height for thumbnails strip on mobile */
    flex: none;
    width: 100%;
  }
  
  .thumbnails-strip {
    height: 100%;
  }

  .dialogue-panel {
    min-height: 100px;
    max-height: 150px; /* Limit height */
  }

  .nav-btn {
    padding: 20px 10px;
    background: rgba(0,0,0,0.5); 
  }
}

.quote-text {
    font-size: 1.1em;
    line-height: 1.4;
    white-space: pre-wrap;
    /* min-height removed */
}
.quote-text.highlight {
    color: #ffd700;
}
.cursor {
    animation: blink 1s infinite;
}
@keyframes blink { 50% { opacity: 0; } }
</style>
