<template>
  <div class="mobile-chars-wrapper">
    <!-- Header -->
    <header class="mc-header">
      <div class="mc-header-row">
        <h1 class="mc-title">PERSONNEL_DB</h1>
        <button v-if="selectedCharacter" class="mc-back-btn" @click="handleBack">
           ◀ BACK
        </button>
      </div>
      
      <!-- Filters (Only visible on list) -->
      <div class="mc-filters" v-if="!selectedCharacter">
        <div class="mc-filter-row">
           <button 
             v-for="layer in layers" 
             :key="layer.id"
             class="mc-filter-chip"
             :class="{ active: selectedLayerId === layer.id }"
             @click="selectedLayerId = layer.id"
           >
             {{ layer.shortName }}
           </button>
        </div>
      </div>
    </header>

    <!-- Character List -->
    <div class="mc-content" v-if="!selectedCharacter">
      <div v-for="faction in filteredFactions" :key="faction.id" class="mc-faction-group">
        <h3 class="mc-faction-title" :style="{ color: faction.color }">{{ faction.name }}</h3>
        
        <div class="mc-char-grid">
          <div 
            v-for="char in faction.characters" 
            :key="char.id" 
            class="mc-char-card"
            @click="selectCharacter(char, faction)"
          >
            <div class="mc-char-thumb">
               <img v-if="char.image" :src="withBase(char.image)" loading="lazy" />
               <div v-else class="mc-thumb-placeholder">{{ char.name[0] }}</div>
            </div>
            <div class="mc-char-mini-info">
              <div class="mc-name">{{ char.name }}</div>
              <div class="mc-role">{{ char.role }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredFactions.length === 0" class="mc-empty">
        NO DATA IN THIS SECTOR
      </div>
    </div>

    <!-- Character Detail View -->
    <div class="mc-detail-view" v-else>
      <div class="mc-detail-header" :style="{ borderBottomColor: currentFactionColor }">
        <div class="mc-detail-img-box" @click="openGallery">
           <img v-if="selectedCharacter.image" :src="withBase(selectedCharacter.image)" />
           <div v-else class="mc-detail-placeholder">{{ selectedCharacter.name[0] }}</div>
           <div class="mc-img-overlay">
             <span class="view-text">📷 보기</span>
           </div>
        </div>
        <div class="mc-detail-title-box">
          <h2 class="mc-d-name">{{ selectedCharacter.name }}</h2>
          <div class="mc-d-role" :style="{ color: currentFactionColor }">{{ selectedCharacter.role }}</div>
          <div class="mc-d-rank">{{ getRank(selectedCharacter.stats) }}</div>
        </div>
      </div>
      
      <div class="mc-detail-body">
        <button class="mc-gallery-btn" @click="openGallery">
           📷 전체 갤러리 보기
        </button>

        <section class="mc-section">
          <div class="mc-sec-title">>> 능력치 (STATS)</div>
          <div class="mc-stats-grid">
            <div class="mc-stat-item" v-for="(val, key) in selectedCharacter.stats" :key="key">
              <span class="mc-stat-label">{{ key.toUpperCase() }}</span>
              <div class="mc-stat-bar">
                <div class="mc-stat-fill" :style="{ width: (val/200)*100 + '%', background: currentFactionColor }"></div>
              </div>
              <span class="mc-stat-val">{{ val }}</span>
            </div>
          </div>
        </section>

        <section class="mc-section">
          <div class="mc-sec-title">>> 프로필 (PROFILE)</div>
          <p class="mc-desc-text">{{ selectedCharacter.description }}</p>
        </section>

        <section class="mc-section" v-if="selectedCharacter.quotes && selectedCharacter.quotes.length">
          <div class="mc-sec-title">>> 음성 기록 (VOICE LOG - INTERACTIVE)</div>
          <div 
            class="mc-quote-box interactive" 
            @click="handleQuoteClick"
            :class="{ 'unlocked': isHiddenUnlocked }"
          >
            <div class="quote-content">"{{ currentQuote }}"</div>
            <div class="quote-meta">
              <span v-if="isHiddenUnlocked" class="meta-label unlocked">🔓 HIDDEN DATA FOUND</span>
              <span v-else class="meta-label">🔒 ACCESSING CORE... ({{ clickCount }}/10)</span>
              <span class="tap-hint">TAP TO PLAY ▶</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <MobileGallery 
      v-if="selectedCharacter"
      :is-open="isGalleryOpen"
      :character-name="selectedCharacter.name"
      :character-id="selectedCharacter.id || 'Unknown ID'"
      :character-image="selectedCharacter.image ? withBase(selectedCharacter.image) : ''"
      @close="closeGallery"
    />
    <MobileNavbar />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { withBase } from 'vitepress';
import { characterData } from '../../../data/characterData';
import MobileNavbar from './MobileNavbar.vue';
import MobileGallery from './MobileGallery.vue';

const emit = defineEmits(['close']);

// Local State
const selectedLayerId = ref('upper');
const selectedCharacter = ref(null);
const currentFactionColor = ref('#ffb000');
const isGalleryOpen = ref(false);

// Interaction State
const clickCount = ref(0);
const isHiddenUnlocked = ref(false);
const currentQuote = ref('');

const layers = [
  { id: 'upper', shortName: 'UPPER' },
  { id: 'middle', shortName: 'MIDDLE' },
  { id: 'lower', shortName: 'LOWER' },
  { id: 'ground', shortName: 'GROUND' }
];

const filteredFactions = computed(() => {
  if (!characterData) return [];
  return characterData.filter(f => f.layer === selectedLayerId.value);
});

// Character Selection & Logic
const selectCharacter = (char, faction) => {
  selectedCharacter.value = char;
  currentFactionColor.value = faction.color || '#ffb000';
  
  // Load Persistence
  if (typeof window !== 'undefined') {
    const key = `vortex-char-clicks-${char.id}`;
    const stored = localStorage.getItem(key);
    clickCount.value = stored ? parseInt(stored) : 0;
    
    // Check unlock status (10 clicks)
    isHiddenUnlocked.value = clickCount.value >= 10;
  } else {
    clickCount.value = 0;
    isHiddenUnlocked.value = false;
  }
  
  // Reset Quote to first one
  if (char.quotes && char.quotes.length > 0) {
    currentQuote.value = char.quotes[0];
  }
};

const handleQuoteClick = () => {
    if (!selectedCharacter.value) return;
    
    // Increment Click
    clickCount.value++;
    
    // Save Persistence
    if (typeof window !== 'undefined') {
        localStorage.setItem(`vortex-char-clicks-${selectedCharacter.value.id}`, clickCount.value.toString());
    }
    
    // Unlock Check
    if (!isHiddenUnlocked.value && clickCount.value >= 10) {
        isHiddenUnlocked.value = true;
        // Optional: Play unlock sound effect here if we had the audio context
        alert("ACCESS GRANTED: HIDDEN ARCHIVES UNLOCKED");
    }
    
    // Cycle Quote
    const char = selectedCharacter.value;
    let pool = [...char.quotes];
    
    // Add hidden quotes if unlocked
    if (isHiddenUnlocked.value && char.hiddenQuotes) {
        pool = [...pool, ...char.hiddenQuotes];
    }
    
    // Random pick from pool (different from current if possible)
    if (pool.length > 1) {
        let nextQuote;
        do {
            nextQuote = pool[Math.floor(Math.random() * pool.length)];
        } while (nextQuote === currentQuote.value);
        currentQuote.value = nextQuote;
    } else {
        currentQuote.value = pool[0];
    }
};

const handleBack = () => {
  if (selectedCharacter.value) {
    selectedCharacter.value = null;
  }
};

const openGallery = () => {
  if (selectedCharacter.value && selectedCharacter.value.image) {
    isGalleryOpen.value = true;
  }
};

const closeGallery = () => {
  isGalleryOpen.value = false;
};

const getRank = (stats) => {
  if (!stats) return 'UNKNOWN';
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  if (total >= 600) return 'CLASS: DEUS';
  if (total >= 500) return 'CLASS: EXCEED';
  if (total >= 400) return 'CLASS: PLATINUM';
  if (total >= 300) return 'CLASS: BRASS';
  return 'CLASS: STANDARD';
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.mobile-chars-wrapper {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  background: #080808;
  color: #ccc;
  font-family: 'Share Tech Mono', 'Noto Sans KR', sans-serif;
  z-index: 9999;
  display: flex; flex-direction: column;
  padding-bottom: 60px; /* Navbar Space */
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mc-header {
  padding: 15px;
  padding-top: max(15px, env(safe-area-inset-top));
  background: rgba(17, 17, 17, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid #333;
}

.mc-header-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}

.mc-title { margin: 0; font-size: 1.2rem; color: #ffb000; letter-spacing: 1px; }

.mc-quote-box.interactive {
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  border-left: 3px solid #666;
}

.mc-quote-box.interactive:active {
  background: #222;
  transform: scale(0.99);
}

.mc-quote-box.unlocked {
  border-left-color: #ff3333; /* Red for hidden unlocked */
  background: rgba(255, 51, 51, 0.05);
}

.quote-content {
  margin-bottom: 10px;
  font-size: 1.1rem;
  line-height: 1.5;
}

.quote-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: #555;
  border-top: 1px dotted #333;
  padding-top: 8px;
}

.meta-label.unlocked {
  color: #ff3333;
  font-weight: bold;
  animation: flicker 2s infinite;
}

.tap-hint {
  color: #ffb000;
  font-weight: bold;
}

@keyframes flicker {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.mc-back-btn {
  background: #222; border: 1px solid #444; color: #fff;
  padding: 8px 16px; font-family: inherit; font-size: 0.8rem;
  transition: transform 0.1s;
}
.mc-back-btn:active { transform: scale(0.95); }

.mc-filters { width: 100%; overflow-x: auto; scrollbar-width: none; }
.mc-filters::-webkit-scrollbar { display: none; }
.mc-filter-row { display: flex; gap: 8px; }

.mc-filter-chip {
  padding: 6px 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  color: #666;
  font-family: inherit;
  font-size: 0.8rem;
  border-radius: 15px;
  white-space: nowrap;
}

.mc-filter-chip.active {
  background: #ffb000; color: #000; border-color: #ffb000; font-weight: bold;
}

.mc-content {
  flex: 1; overflow-y: auto; padding: 15px;
}

.mc-faction-group { margin-bottom: 25px; }
.mc-faction-title { 
  margin: 0 0 10px 0; font-size: 1rem; border-bottom: 1px dashed #444; padding-bottom: 5px; 
}

.mc-char-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}

.mc-char-card {
  background: #151515; border: 1px solid #333;
  border-radius: 4px; overflow: hidden;
  display: flex; flex-direction: column;
  transition: all 0.2s;
}
.mc-char-card:active { transform: scale(0.98); opacity: 0.9; }

.mc-char-thumb {
  height: 120px; background: #000; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}

.mc-char-thumb img { width: 100%; height: 100%; object-fit: cover; }
.mc-thumb-placeholder { font-size: 2rem; color: #333; font-weight: bold; }

.mc-char-mini-info { padding: 8px; }
.mc-name { color: #fff; font-weight: bold; font-size: 0.9rem; margin-bottom: 4px; }
.mc-role { color: #888; font-size: 0.7rem; }

/* Detail View */
.mc-detail-view { flex: 1; overflow-y: auto; background: #050505; }
.mc-detail-header {
  padding: 20px; background: linear-gradient(180deg, #111 0%, #050505 100%);
  display: flex; gap: 20px;
  border-bottom: 3px solid #ffb000;
}

.mc-detail-img-box {
  width: 100px; height: 120px; background: #000; border: 1px solid #444;
  flex-shrink: 0; overflow: hidden;
  position: relative;
}
.mc-detail-img-box img { width: 100%; height: 100%; object-fit: cover; }

.mc-img-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s;
}
.mc-detail-img-box:active .mc-img-overlay { opacity: 1; }

.view-text { color: #fff; font-size: 0.8rem; font-weight: bold; text-shadow: 0 0 5px #000; }

.mc-gallery-btn {
  width: 100%; padding: 12px; margin-bottom: 20px;
  background: #222; border: 1px solid #444; color: #ffb000;
  font-family: inherit; font-weight: bold;
  border-radius: 4px; transition: all 0.2s;
}
.mc-gallery-btn:active { transform: scale(0.98); background: #333; }

.mc-detail-title-box { flex: 1; }
.mc-d-name { margin: 0 0 5px 0; font-size: 1.5rem; color: #fff; line-height: 1.2; }
.mc-d-role { font-size: 0.9rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
.mc-d-rank { font-size: 0.8rem; color: #666; border: 1px solid #333; display: inline-block; padding: 2px 6px; }

.mc-detail-body { padding: 20px; }
.mc-section { margin-bottom: 30px; }
.mc-sec-title { color: #666; font-size: 0.8rem; margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 5px; }

.mc-desc-text { line-height: 1.6; color: #bbb; font-size: 0.95rem; }

.mc-stat-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.mc-stat-label { width: 40px; font-size: 0.7rem; color: #666; text-align: right; }
.mc-stat-bar { flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden; }
.mc-stat-fill { height: 100%; }
.mc-stat-val { width: 30px; font-size: 0.8rem; color: #fff; text-align: right; }

.mc-quote-box {
  padding: 15px; background: #111; border-left: 3px solid #666;
  font-style: italic; color: #ddd;
}
</style>