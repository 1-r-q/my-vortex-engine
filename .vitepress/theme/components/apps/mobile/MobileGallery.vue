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
      <div class="image-container" @click="handleImageClick">
        <img 
            :src="currentImageSrc" 
            :alt="characterName" 
            class="gallery-image"
            decoding="async" 
            loading="eager"
        />
        <div class="scanlines"></div>
        <div class="glitch-overlay"></div>
        
        <!-- Emotion Label Overlay (Top Right now for better visibility) -->
        <div class="emotion-label-overlay">
          {{ currentEmotionLabel }}
        </div>

        <!-- Touch Hint -->
        <div class="touch-hint" v-if="clickCount < 3">TAP SCREEN</div>
      </div>
      
      <!-- Variant Selector -->
      <div class="variant-selector">
        <button 
          v-for="(img, index) in galleryImages" 
          :key="img.id"
          class="variant-btn"
          :class="{ active: selectedVariant === index }"
          @click.stop="selectedVariant = index"
        >
          {{ index === 0 ? '소개' : index }}
        </button>
      </div>

      <!-- Dialogue / Info Box -->
      <div class="gallery-info-box">
        <div class="info-header">
           <h2 class="char-name">{{ characterName }}</h2>
           <span class="click-counter" :class="{ 'gold': isHiddenUnlocked }">
              SYNC: {{ Math.min(clickCount * 5, 100) }}%
           </span>
        </div>
        
        <div class="dialogue-area" :class="{ 'special': isHiddenUnlocked }">
            <div class="dialogue-text">"{{ displayedQuote }}"<span class="cursor" v-if="isTyping">_</span></div>
            <div class="dialogue-meta" v-if="showPasswordAlert">
                Warning: Encrypted Data Exposed
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { withBase } from 'vitepress';
import { characterData } from '../../../data/characterData';
import { useSteamSound } from '../../../composables/useSteamSound';

const props = defineProps({
  isOpen: Boolean,
  characterName: String,
  characterId: String,
  characterImage: String
});

const emit = defineEmits(['close']);

const { playTyping, playClick, playDataTransmit } = useSteamSound();

const selectedVariant = ref(0);
const clickCount = ref(0);
const isHiddenUnlocked = ref(false); // 10 clicks
const isPasswordUnlocked = ref(false); // 20 clicks
const currentQuote = ref('');
const displayedQuote = ref('');
const isTyping = ref(false);
const typingTimeout = ref(null);
const showPasswordAlert = ref(false);

const emotionLabels = [
  '소개 (Intro)',
  '기본 (Normal)',
  '기쁨 (Joy)',
  '분노 (Anger)',
  '슬픔 (Sorrow)',
  '당황 (Panic)',
  '부끄러움 (Shy)'
];

const currentEmotionLabel = computed(() => {
  return emotionLabels[selectedVariant.value] || '알 수 없음 (Unknown)';
});

// Find full character data for quotes
const fullCharacterData = computed(() => {
  if (!props.characterId) return null;
  // Flatten characterData structure
  for (const faction of characterData) {
    const found = faction.characters.find(c => c.id === props.characterId);
    if (found) return found;
  }
  return null;
});

// Persistence & Initialization
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.characterId) {
    selectedVariant.value = 0;
    loadPersistence();
    // Start with a random normal quote
    if (fullCharacterData.value && fullCharacterData.value.quotes?.length) {
      pickRandomQuote();
    }
  } else {
    // Reset when closed
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    showPasswordAlert.value = false;
  }
});

const loadPersistence = () => {
    if (typeof window === 'undefined') return;
    const key = `vortex-char-clicks-${props.characterId}`;
    const stored = localStorage.getItem(key);
    clickCount.value = stored ? parseInt(stored) : 0;
    isHiddenUnlocked.value = clickCount.value >= 10;
    isPasswordUnlocked.value = clickCount.value >= 20;
};

const savePersistence = () => {
    if (typeof window === 'undefined') return;
    const key = `vortex-char-clicks-${props.characterId}`;
    localStorage.setItem(key, clickCount.value.toString());
};

// Quote Logic
const startTyping = (text) => {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
    typingTimeout.value = null;
  }
  
  displayedQuote.value = '';
  isTyping.value = true;
  let i = 0;
  
  // Faster typing for gallery
  const typeChar = () => {
    if (i < text.length) {
      displayedQuote.value += text.charAt(i);
      i++;
      if (i % 3 === 0) playTyping();
      typingTimeout.value = setTimeout(typeChar, 25);
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
      startTyping("...");
      return;
  }

  const nextQuote = pool[Math.floor(Math.random() * pool.length)];
  currentQuote.value = nextQuote;
  startTyping(nextQuote);
};

// Interaction Handler
const handleImageClick = () => {
  clickCount.value++;
  savePersistence();

  // Check Milestones
  if (clickCount.value === 10 && !isHiddenUnlocked.value) {
      isHiddenUnlocked.value = true;
      playDataTransmit();
      startTyping(">> ACCESS LEVEL UP: HIDDEN ARCHIVES UNLOCKED.");
      return;
  }

  if (clickCount.value === 20 && !isPasswordUnlocked.value) {
      isPasswordUnlocked.value = true;
      // Show Password
      if (fullCharacterData.value?.unlockPassword) {
         playDataTransmit();
         showPasswordAlert.value = true;
         startTyping(`>> SYSTEM: DECRYPTION COMPLETE. KEY: [${fullCharacterData.value.unlockPassword}]`);
      } else {
         startTyping(">> SYSTEM: NO ENCRYPTED KEY FOUND.");
      }
      return;
  }

  playClick();
  pickRandomQuote();
};

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
/* Variant Selector */
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

/* Modal Layout */
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
  background: #111; /* Removed backdrop-filter for performance */
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
  cursor: pointer;
}

.gallery-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

/* Image Container */
.image-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  background: #111;
  overflow: hidden;
  margin-bottom: 10px;
  transform: translateZ(0); 
  will-change: transform;
}

.emotion-label-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  background: rgba(0,0,0,0.7);
  border: 1px solid #ffb000;
  border-radius: 4px;
  color: #ffb000;
  text-align: right;
  font-family: 'Share Tech Mono', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 2;
}

.touch-hint {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: rgba(255,255,255,0.3);
  font-size: 10px;
  animation: blink 2s infinite;
  pointer-events: none;
  z-index: 2;
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  will-change: opacity; 
  position: relative;
  z-index: 1;
}

/* Effects */
/* Mobile Performance Optimization: Simplify gradients if needed in future */
.scanlines {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
  background-size: 100% 3px, 3px 100%;
  pointer-events: none;
  z-index: 3;
  /* Promote to layer to avoid repaint */
  transform: translateZ(0);
}

.glitch-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}

/* Dialogue Box */
.gallery-info-box {
  width: 100%;
  max-width: 400px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.char-name {
  color: #fff;
  font-size: 1.2rem;
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: bold;
}

.click-counter {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  color: #666;
}
.click-counter.gold { color: #ffb000; }

.dialogue-area {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  padding: 15px;
  border-left: 3px solid #666;
  flex: 1;
  min-height: 100px;
  position: relative;
  overflow-y: auto;
  transition: all 0.3s;
}

.dialogue-area.special {
  border-left-color: #ffb000;
  background: rgba(255, 176, 0, 0.05);
}

.dialogue-text {
  color: #ddd;
  font-size: 0.95rem;
  line-height: 1.5;
  font-family: 'Noto Sans KR', sans-serif;
}

.dialogue-meta {
  margin-top: 10px;
  font-size: 0.7rem;
  color: #f33;
  font-weight: bold;
  animation: pulse-red 2s infinite;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: #ffb000;
  margin-left: 2px;
  animation: blink 0.8s infinite;
  vertical-align: middle;
}

@keyframes blink { 
  0%, 100% { opacity: 1; }
  50% { opacity: 0; } 
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse-red {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>
