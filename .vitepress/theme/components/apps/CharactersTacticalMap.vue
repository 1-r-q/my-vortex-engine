<template>
  <MobileCharacters v-if="isMobile" @close="handleClose" />

  <div 
    class="characters-tactical-map" 
    :class="{ 'is-exiting': isExiting, 'is-switching': isSwitching, 'from-home': fromHome }" 
    ref="mapContainer" v-else
  >
    <!-- 3D Perspective Grid Floor -->
    <div class="grid-floor">
      <div class="grid-lines"></div>
    </div>
    
    <!-- Cinematic Letterbox Bars -->
    <div class="cinema-bar cinema-bar-top">
      <div class="ticker-wrap">
        <div class="ticker">
          <span>◆ PERSONNEL DATABASE v3.7.2 ◆ BIO-SCAN ACTIVE ◆ IDENTITY VERIFIED ◆ CLEARANCE: LEVEL-7 ◆ NEURAL LINK: STABLE ◆ ARCHIVE: SYNCHRONIZED ◆</span>
          <span>◆ PERSONNEL DATABASE v3.7.2 ◆ BIO-SCAN ACTIVE ◆ IDENTITY VERIFIED ◆ CLEARANCE: LEVEL-7 ◆ NEURAL LINK: STABLE ◆ ARCHIVE: SYNCHRONIZED ◆</span>
        </div>
      </div>
    </div>
    <div class="cinema-bar cinema-bar-bottom">
      <div class="ticker-wrap">
        <div class="ticker ticker-reverse">
          <span>▶ FACTION: {{ selectedFaction?.name || 'N/A' }} ▶ LAYER: {{ selectedLayer?.name || 'N/A' }} ▶ PERSONNEL COUNT: {{ currentCharacters.length }} ▶ STATUS: ONLINE ▶</span>
          <span>▶ FACTION: {{ selectedFaction?.name || 'N/A' }} ▶ LAYER: {{ selectedLayer?.name || 'N/A' }} ▶ PERSONNEL COUNT: {{ currentCharacters.length }} ▶ STATUS: ONLINE ▶</span>
        </div>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="bg-overlay"></div>
    <div class="scan-line"></div>
    <div class="vignette-overlay"></div>
    <div class="crt-overlay"></div>

    <!-- Layer Tabs (Top) -->
    <div class="layer-tabs-panel">
      <button 
        v-for="layer in layers" 
        :key="layer.id"
        class="layer-tab"
        :class="{ active: selectedLayerId === layer.id }"
        :style="{ '--layer-color': layer.color }"
        @click="selectLayer(layer.id)"
      >
        <span class="tab-icon">◈</span>
        <span class="tab-label">{{ layer.name.split(':')[0] }}</span>
      </button>
    </div>

    <!-- Faction Selector (Below Layers) -->
    <div class="faction-selector" v-if="filteredFactions.length > 0">
      <button 
        v-for="faction in filteredFactions" 
        :key="faction.id"
        class="faction-btn"
        :class="{ active: selectedFactionId === faction.id }"
        :style="{ '--faction-color': faction.color }"
        @click="selectFaction(faction.id)"
      >
        {{ faction.name }}
      </button>
    </div>

    <!-- Character Grid (Adaptive) -->
    <div class="character-grid-wrapper" :class="{ 'hero-mode': isHeroMode }">
      <Transition name="grid-switch" mode="out-in">
        <!-- HERO MODE: 3명 이하 -->
        <div v-if="isHeroMode" :key="'hero-' + selectedFactionId" class="char-grid hero-mode">
          <div 
            v-for="(char, idx) in currentCharacters.slice(0, 3)" 
            :key="char.id"
            class="char-card"
            :class="{ 'is-selected': selectedCharacterId === char.id }"
            :style="{ '--delay': idx * 0.15 + 's', '--faction-color': selectedFaction?.color }"
            @click="selectCharacter(char)"
          >
            <!-- Corner Brackets -->
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>

            <!-- Image Section -->
            <div class="char-img-wrapper">
              <img 
                v-if="char.image" 
                :src="withBase(char.image)" 
                :alt="char.name" 
                class="char-img"
                @error="handleImageError($event)" 
              />
              <div v-else class="char-img-placeholder" :style="{ background: selectedFaction?.color }">
                <span>{{ char.name.charAt(0) }}</span>
              </div>
            </div>

            <!-- Character Info Header -->
            <div class="char-info">
              <h2 class="char-name">{{ char.name }}</h2>
              
              <!-- Meta Bar -->
              <div class="char-meta-bar">
                <span class="meta-item">[ RACE: {{ char.type === 'machine' ? 'MACHINE' : 'HUMAN' }} ]</span>
                <span class="meta-divider">|</span>
                <span class="meta-item">[ ROLE: {{ char.role?.toUpperCase() || 'UNKNOWN' }} ]</span>
              </div>
              
              <!-- Faction & Rank -->
              <div class="char-sub-info">
                <span class="char-faction">{{ selectedFaction?.name }}</span>
                <span class="char-rank">{{ getRank(char.stats) }}</span>
              </div>
            </div>
            
            <!-- Description Terminal Box -->
            <div class="char-desc-box" v-if="char.description">
              <div class="desc-header">
                <span class="desc-prompt">&gt;_</span>
                <span class="desc-title">PROFILE DATA</span>
              </div>
              <p class="desc-text">{{ char.description }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="currentCharacters.length === 0" class="empty-state hero-empty">
            <span class="empty-icon">⚠</span>
            <span class="empty-text">해당 세력의 인물 데이터가 없습니다</span>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Character Detail Panel (Right Side) -->
    <Transition name="panel-slide">
      <div v-if="selectedCharacter" class="character-detail-panel">
        <button class="panel-close" @click="playCancel(); selectedCharacterId = null">✕</button>
        
        <div class="panel-header">
          <div class="panel-avatar clickable" @click="openGallery">
            <img v-if="selectedCharacterDetailImage" :src="withBase(selectedCharacterDetailImage)" :alt="selectedCharacter.name" />
            <div v-else class="avatar-placeholder large">{{ selectedCharacter.name.charAt(0) }}</div>
            
            <div class="gallery-hint">
              <span class="hint-icon">⌖</span>
              <span class="hint-text">GALLERY</span>
            </div>
          </div>
          <div class="panel-title">
            <h2>{{ selectedCharacter.name }}</h2>
            <div class="panel-role">{{ selectedCharacter.role }}</div>
            <div class="panel-rank">{{ getRank(selectedCharacter.stats) }}</div>
          </div>
        </div>

        <div class="panel-stats">
          <div class="stat-row" v-for="(val, key) in selectedCharacter.stats" :key="key">
            <span class="stat-label">{{ getStatLabel(key, selectedCharacter.type) }}</span>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill" :style="{ width: Math.min(val / 2, 100) + '%' }"></div>
            </div>
            <span class="stat-value">{{ val }}</span>
          </div>
        </div>

        <div class="panel-desc">
          <h4>프로필</h4>
          <p>{{ selectedCharacter.description }}</p>
        </div>

        <div class="panel-quote" v-if="selectedCharacter.quotes?.length">
          <h4>음성 기록</h4>
          
          <div class="quote-box" @click="nextQuote">
            <span class="quote-mark">"</span>
            <span class="quote-text" :class="{ 'hidden-quote': isHiddenUnlocked && currentQuoteIndex >= (selectedCharacter.quotes?.length || 0) }">{{ typedText }}<span class="typing-cursor" v-if="isTyping">|</span></span>
            <span class="quote-mark">"</span>
          </div>
          
          <!-- Password 해금 -->
          <div class="password-reveal" v-if="isPasswordUnlocked && selectedCharacter.unlockPassword">
            <div class="password-header">
              <span class="password-icon">🔑</span>
              <span class="password-label">UNLOCK CODE {{ selectedCharacter.scenarioStage || '?' }}</span>
            </div>
            <div class="password-value">{{ selectedCharacter.unlockPassword }}</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Right Vertical Info Rail -->
    <div class="info-rail">
      <!-- Exit Button -->
      <button class="rail-exit-btn" @click="handleClose" :disabled="isExiting">
        <span class="exit-slot">
          <span class="exit-icon">⏏</span>
          <span class="exit-glow"></span>
        </span>
        <span class="exit-label">복귀</span>
        <span class="exit-sublabel">EJECT</span>
      </button>
      
      <!-- Status Monitor Section -->
      <div class="rail-monitor">
        <div class="monitor-header">
          <span class="monitor-logo">◈</span>
          <span class="monitor-title">MON</span>
        </div>
        
        <!-- Animated Gauge -->
        <div class="rail-gauge">
          <div class="gauge-track">
            <div class="gauge-fill-vertical" :style="{ height: animatedPercent + '%' }"></div>
          </div>
          <span class="gauge-percent gauge-glow">{{ Math.round(animatedPercent) }}%</span>
        </div>
        
        <!-- Status Blocks -->
        <div class="rail-status-blocks">
          <div class="status-block">
            <span class="block-icon">👤</span>
            <span class="block-value">{{ currentCharacters.length }}</span>
            <span class="block-label">CHARS</span>
          </div>
          
          <div class="block-divider"></div>
          
          <div class="status-block">
            <span class="block-icon">◉</span>
            <span class="block-value glow-green">OK</span>
            <span class="block-label">STATUS</span>
          </div>
          
          <div class="block-divider"></div>
          
          <div class="status-block">
            <span class="block-icon">⏱</span>
            <span class="block-value">{{ currentTime.split(':').slice(0,2).join(':') }}</span>
            <span class="block-label">TIME</span>
          </div>
          
          <div class="block-divider"></div>
          
          <div class="status-block">
            <span class="block-icon">⚡</span>
            <span class="block-value glow-green">98.7%</span>
            <span class="block-label">POWER</span>
          </div>
        </div>
      </div>
      
      <!-- Crypto Log Stream -->
      <div class="rail-crypto-log">
        <div class="crypto-line">0xAF3E::OK</div>
        <div class="crypto-line">0x7B2C::RX</div>
        <div class="crypto-line">0xD4F1::TX</div>
        <div class="crypto-line">0x92E8::OK</div>
        <div class="crypto-line">0x1A5D::RX</div>
        <div class="crypto-line">0xC7B3::TX</div>
      </div>
      
      <!-- Footer -->
      <div class="rail-footer">
        <div class="rail-led led-green"></div>
        <span class="rail-id">v3.7</span>
      </div>
    </div>

    <!-- Left Vertical Command Rail -->
    <nav class="command-rail">
      <div class="rail-header">
        <span class="rail-logo">⚙</span>
        <span class="rail-title">CMD</span>
      </div>
      <div class="rail-buttons">
        <button class="rail-btn" @click="switchModule(withBase('/guide/history.html'))">
          <div class="btn-slot">
            <span class="btn-icon">📜</span>
            <span class="btn-glow"></span>
          </div>
          <span class="btn-label">역사</span>
          <span class="btn-sublabel">HISTORY</span>
        </button>
        <button class="rail-btn" @click="switchModule(withBase('/world/map.html'))">
          <div class="btn-slot">
            <span class="btn-icon">🌍</span>
            <span class="btn-glow"></span>
          </div>
          <span class="btn-label">세계</span>
          <span class="btn-sublabel">WORLD</span>
        </button>
        <button class="rail-btn active">
          <div class="btn-slot">
            <span class="btn-icon">👤</span>
            <span class="btn-glow"></span>
          </div>
          <span class="btn-label">인물</span>
          <span class="btn-sublabel">CHARS</span>
        </button>
        <button class="rail-btn" @click="switchModule(withBase('/assets/list.html'))">
          <div class="btn-slot">
            <span class="btn-icon">📦</span>
            <span class="btn-glow"></span>
          </div>
          <span class="btn-label">상점</span>
          <span class="btn-sublabel">ASSETS</span>
        </button>
        <button class="rail-btn" @click="switchModule(withBase('/threats/database.html'))">
          <div class="btn-slot">
            <span class="btn-icon">⚖️</span>
            <span class="btn-glow"></span>
          </div>
          <span class="btn-label">규칙</span>
          <span class="btn-sublabel">RULES</span>
        </button>

        <!-- Volume Control -->
        <div class="rail-volume-control">
          <span class="volume-label">BGM VOL</span>
          <div class="volume-slider-container">
            <div class="rail-slider-fill" :style="{ width: (ambientVolume * 100) + '%' }"></div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              v-model="ambientVolume"
              class="rail-slider"
            />
          </div>
        </div>
      </div>
      <div class="rail-footer">
        <div class="rail-indicator"></div>
        <span class="rail-version">v3.7</span>
      </div>
    </nav>

    <!-- Connection Info -->
    <div class="connection-info">
      <span class="conn-status">● CONNECTED</span>
      <span class="conn-node">PERSONNEL NODE: BIO-ARCHIVE-07</span>
    </div>

    <!-- Gallery Modal -->
    <CharacterGalleryModal 
      :is-open="showGallery" 
      :character-name="selectedCharacter?.name"
      :character-id="selectedCharacter?.id"
      :character-image="selectedCharacter?.image"
      @close="showGallery = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, withBase } from 'vitepress';
import CharacterGalleryModal from './CharacterGalleryModal.vue';
import { usePageTransition } from '../../transitionState';
import { useSteamSound } from '../../composables/useSteamSound';
import { characterData } from '../../data/characterData';
import { isPasswordUnlocked as checkPasswordUnlocked, unlockPassword, isHiddenQuotesUnlocked as checkHiddenUnlocked, unlockHiddenQuotes } from '../../stores/unlockedStore';
import MobileCharacters from './mobile/MobileCharacters.vue';

const emit = defineEmits(['close', 'openHistory', 'openWorld', 'openMarket', 'openSystem']);
const router = useRouter();
const { startTransition } = usePageTransition();
const { playHover, playClick, playCardSelect, playTyping, playUnlock, playBack, playTransition, playSelect, playCancel, categoryVolumes, setCategoryVolume } = useSteamSound();

const isMobile = ref(false);
const checkMobile = () => {
    if (typeof window !== 'undefined') {
        isMobile.value = window.innerWidth <= 768;
    }
};

const ambientVolume = computed({
  get: () => categoryVolumes.ambient,
  set: (val) => setCategoryVolume('ambient', val)
});

// State
const mapContainer = ref(null);
const isExiting = ref(false);
const isSwitching = ref(false);
const fromHome = ref(false);
const currentTime = ref('00:00:00');
const animatedPercent = ref(75);
const selectedLayerId = ref('upper');
const selectedFactionId = ref(null);
const selectedCharacterId = ref(null);
const showGallery = ref(false);
const currentQuoteIndex = ref(0);
const quoteClickCount = ref(0); // 클릭 횟수 추적
const typedText = ref(''); // 타이핑되는 텍스트
const isTyping = ref(false); // 타이핑 중 여부
let timeInterval = null;
let percentInterval = null;
let typingInterval = null; // 타이핑 인터벌

// Check if navigation is from home or another TacticalMap
const checkNavigationSource = () => {
  if (typeof window !== 'undefined') {
    const lastPage = sessionStorage.getItem('vortex-last-page');
    fromHome.value = !lastPage || lastPage === 'home' || lastPage === 'index';
    sessionStorage.setItem('vortex-last-page', 'tacticalmap');
  }
};

// Layers Definition
const layers = [
  { id: 'upper', name: '상층: 천공의 바늘', desc: '황실과 귀족들이 거주하는 하늘의 도시', color: '#FFD700' },
  { id: 'middle', name: '중층: 강철의 뱃속', desc: '거대한 공장과 시민들의 거주지', color: '#A0A0A0' },
  { id: 'lower', name: '하층: 녹슨 뿌리', desc: '버려진 기계들과 빈민가', color: '#32CD32' },
  { id: 'ground', name: '지상: 침묵의 바다', desc: '오염된 대지와 고대 유적', color: '#8B4513' }
];

const selectedLayer = computed(() => layers.find(l => l.id === selectedLayerId.value));

const filteredFactions = computed(() => {
  if (!selectedLayerId.value) return [];
  return characterData.filter(f => f.layer === selectedLayerId.value);
});

const selectedFaction = computed(() => 
  characterData.find(f => f.id === selectedFactionId.value)
);

const currentCharacters = computed(() => {
  if (!selectedFaction.value) return [];
  return selectedFaction.value.characters || [];
});

// Hero Mode: 항상 활성화
const isHeroMode = computed(() => {
  return true;
});

const selectedCharacter = computed(() => {
  if (!selectedFaction.value || !selectedCharacterId.value) return null;
  return selectedFaction.value.characters.find(c => c.id === selectedCharacterId.value);
});

// 상세정보 패널용 이미지 (characters1 폴더 사용)
const selectedCharacterDetailImage = computed(() => {
  if (!selectedCharacter.value?.image) return null;
  // /images/characters/Name.png -> /images/characters1/Name.png
  return selectedCharacter.value.image.replace('/images/characters/', '/images/characters1/');
});

const currentQuote = computed(() => {
  if (!selectedCharacter.value?.quotes?.length) return '';
  return selectedCharacter.value.quotes[currentQuoteIndex.value] || '';
});

// Hidden Quotes 해금 상태 (10회 이상 클릭 또는 이미 해금됨)
const isHiddenUnlocked = computed(() => {
  if (!selectedCharacterId.value) return false;
  return quoteClickCount.value >= 10 || checkHiddenUnlocked(selectedCharacterId.value);
});

// Password 해금 상태 (20회 이상 클릭 또는 이미 해금됨)
const isPasswordUnlocked = computed(() => {
  if (!selectedCharacterId.value) return false;
  return quoteClickCount.value >= 20 || checkPasswordUnlocked(selectedCharacterId.value);
});

// 모든 사용 가능한 quotes (해금 상태에 따라)
const availableQuotes = computed(() => {
  if (!selectedCharacter.value) return [];
  const baseQuotes = selectedCharacter.value.quotes || [];
  const hiddenQuotes = selectedCharacter.value.hiddenQuotes || [];
  
  if (isHiddenUnlocked.value) {
    return [...baseQuotes, ...hiddenQuotes];
  }
  return baseQuotes;
});

// 현재 표시할 quote (해금 상태 반영)
const displayQuote = computed(() => {
  if (!availableQuotes.value.length) return '';
  const index = currentQuoteIndex.value % availableQuotes.value.length;
  return availableQuotes.value[index] || '';
});

// 타이핑 효과 시작
const startTyping = (text) => {
  if (typingInterval) clearInterval(typingInterval);
  typedText.value = '';
  isTyping.value = true;
  let i = 0;
  const speed = 30; // 타이핑 속도 (ms)
  
  typingInterval = setInterval(() => {
    if (i < text.length) {
      typedText.value += text.charAt(i);
      playTyping();
      i++;
    } else {
      clearInterval(typingInterval);
      isTyping.value = false;
    }
  }, speed);
};

// 해금 진행률 (10회 기준)
const unlockProgress = computed(() => Math.min(quoteClickCount.value / 10 * 100, 100));

// Password 해금 진행률 (20회 기준)
const passwordProgress = computed(() => Math.min(quoteClickCount.value / 20 * 100, 100));

// Stat labels
const statLabels = {
  human: { pressure: '근력', precision: '기량', steam: '체력', calculation: '지능' },
  machine: { pressure: '압력', precision: '정밀', steam: '증기', calculation: '연산' }
};

const getStatLabel = (key, type) => {
  const labels = statLabels[type] || statLabels.machine;
  return labels[key] || key.toUpperCase();
};

// Radar Chart Helper Functions
const getHexagonPoints = (cx, cy, radius) => {
  const points = [];
  for (let i = 0; i < 4; i++) {
    const angle = (i * 90 - 90) * Math.PI / 180;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(' ');
};

const getRadarPoints = (stats, cx, cy, maxRadius) => {
  if (!stats) return '';
  const keys = Object.keys(stats);
  const points = keys.map((key, i) => {
    const value = Math.min(stats[key] / 200, 1); // Normalize to 0-1
    const radius = value * maxRadius;
    const angle = (i * 90 - 90) * Math.PI / 180;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  });
  return points.join(' ');
};

const getRadarPointsArray = (stats, cx, cy, maxRadius) => {
  if (!stats) return [];
  const keys = Object.keys(stats);
  return keys.map((key, i) => {
    const value = Math.min(stats[key] / 200, 1);
    const radius = value * maxRadius;
    const angle = (i * 90 - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
};

const getRank = (stats) => {
  if (!stats) return '?';
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  if (total >= 600) return '데우스 엑스 마키나';
  if (total >= 500) return '초월한 합금';
  if (total >= 400) return '빛나는 백금';
  if (total >= 300) return '정밀한 황동';
  if (total >= 200) return '강화된 강철';
  if (total >= 100) return '투박한 무쇠';
  return '삐걱이는 고철';
};

// Methods
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toTimeString().split(' ')[0];
};

const selectLayer = (id, silent = false) => {
  if (!silent) playSelect();
  selectedLayerId.value = id;
  selectedFactionId.value = null;
  selectedCharacterId.value = null;
  
  const firstFaction = characterData.find(f => f.layer === id);
  if (firstFaction) {
    selectFaction(firstFaction.id, silent);
  }
};

const selectFaction = (id, silent = false) => {
  if (!silent) playClick();
  selectedFactionId.value = id;
  selectedCharacterId.value = null;
};

const selectCharacter = (char) => {
  playCardSelect();
  selectedCharacterId.value = char.id;
  currentQuoteIndex.value = 0;
  quoteClickCount.value = 0; // 캐릭터 변경 시 카운터 리셋
  // 첫 번째 대사 타이핑 시작
  const faction = characterData.find(f => f.id === selectedFactionId.value);
  const character = faction?.characters.find(c => c.id === char.id);
  if (character?.quotes?.length) {
    startTyping(character.quotes[0]);
  }
};

const openGallery = () => {
  if (selectedCharacter.value) {
    playSelect();
    showGallery.value = true;
  }
};

const nextQuote = () => {
  if (!availableQuotes.value.length) return;
  playTyping();
  quoteClickCount.value++; // 클릭 카운터 증가
  
  // 10회 도달 시 Hidden Quotes 해금 상태 영구 저장
  if (quoteClickCount.value === 10 && selectedCharacterId.value) {
    playUnlock();
    unlockHiddenQuotes(selectedCharacterId.value);
  }
  
  // 20회 도달 시 Password 해금 상태 영구 저장
  if (quoteClickCount.value === 20 && selectedCharacterId.value) {
    playUnlock();
    unlockPassword(selectedCharacterId.value);
  }
  
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % availableQuotes.value.length;
  // 새 대사 타이핑 시작
  startTyping(displayQuote.value);
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
};

const handleClose = () => {
  if (isExiting.value || isSwitching.value) return;
  playTransition();
  isExiting.value = true;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'home');
  }
  setTimeout(() => {
    router.go(withBase('/index.html'));
  }, 400);
};

const switchModule = (path) => {
  if (isExiting.value || isSwitching.value) return;
  playTransition();
  isSwitching.value = true;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'tacticalmap');
  }
  setTimeout(() => {
    router.go(path);
  }, 400);
};

const navigateTo = (path) => {
  handleClose();
  setTimeout(() => {
    router.go(path);
  }, 800);
};

// Lifecycle
onMounted(() => {
  checkNavigationSource();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  percentInterval = setInterval(() => {
    animatedPercent.value = 70 + Math.sin(Date.now() / 1000) * 25;
  }, 50);

  // Auto-select first layer and faction
  if (layers.length > 0) {
    selectLayer(layers[0].id, true);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (timeInterval) clearInterval(timeInterval);
  if (percentInterval) clearInterval(percentInterval);
  if (typingInterval) clearInterval(typingInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Noto+Sans+KR:wght@400;500;700&display=swap');

/* ━━━━━━ CSS Variables ━━━━━━ */
.characters-tactical-map {
  --c-primary: #ffb000;
  --c-secondary: #ff8800;
  --c-accent: #ffe066;
  --c-bg: #0a0502;
  --c-glow: rgba(255, 176, 0, 0.5);
  
  position: fixed;
  inset: 0;
  background: var(--c-bg);
  font-family: 'Share Tech Mono', monospace;
  color: var(--c-primary);
  overflow: hidden;
  z-index: 9999;
}

/* ━━━━━━ Background Effects ━━━━━━ */
.grid-floor {
  position: absolute;
  inset: 0;
  perspective: 800px;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  width: 200%;
  height: 200%;
  left: -50%;
  top: 0;
  background-image: 
    linear-gradient(var(--c-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--c-primary) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.05;
  transform: rotateX(65deg) translateY(-30%);
  animation: grid-scroll 20s linear infinite;
}

@keyframes grid-scroll {
  0% { transform: rotateX(65deg) translateY(-30%); }
  100% { transform: rotateX(65deg) translateY(-10%); }
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, var(--c-bg) 80%);
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--c-primary), transparent);
  opacity: 0.3;
  animation: scan-move 4s linear infinite;
}

@keyframes scan-move {
  0% { top: 0; }
  100% { top: 100%; }
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.8);
}

.crt-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1000;
}

/* ━━━━━━ Cinema Bars ━━━━━━ */
.cinema-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 55px;
  background: linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(10,5,0,0.95) 100%);
  z-index: 500;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.cinema-bar-top {
  top: 0;
  border-bottom: 2px solid var(--c-primary);
  box-shadow: 0 2px 20px var(--c-glow);
}

.cinema-bar-bottom {
  bottom: 0;
  border-top: 2px solid var(--c-primary);
  box-shadow: 0 -2px 20px var(--c-glow);
}

.ticker-wrap {
  width: 100%;
  overflow: hidden;
}

.ticker {
  display: inline-block;
  white-space: nowrap;
  animation: ticker-scroll 30s linear infinite;
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: var(--c-primary);
  opacity: 0.7;
}

.ticker-reverse {
  animation-direction: reverse;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ━━━━━━ Layer Tabs ━━━━━━ */
.layer-tabs-panel {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 600;
}

.layer-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
  clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
}

.layer-tab.active {
  border-color: var(--layer-color);
  color: var(--layer-color);
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 20px color-mix(in srgb, var(--layer-color) 30%, transparent);
}

.layer-tab:hover:not(.active) {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.tab-icon {
  font-size: 1rem;
}

.tab-label {
  font-size: 0.9rem;
  font-family: 'Noto Sans KR', sans-serif;
}

/* ━━━━━━ Faction Selector ━━━━━━ */
.faction-selector {
  position: absolute;
  top: 130px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 600;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
}

.faction-btn {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.faction-btn.active {
  border-color: var(--faction-color);
  color: var(--faction-color);
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 0 15px color-mix(in srgb, var(--faction-color) 30%, transparent);
}

.faction-btn:hover:not(.active) {
  border-color: rgba(255, 255, 255, 0.3);
}

/* ━━━━━━ Character Grid Wrapper ━━━━━━ */
.character-grid-wrapper {
  position: absolute;
  top: 50px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Corner Brackets */
.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--faction-color, var(--c-primary));
  opacity: 0.4;
  transition: all 0.3s;
}

.corner.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.corner.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.corner.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.corner.br { bottom: 0; right: 0; border-left: none; border-top: none; }

/* Avatar Placeholder */
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #000;
  font-weight: bold;
}

.avatar-placeholder.large {
  width: 100px;
  height: 100px;
  font-size: 3rem;
  border-radius: 50%;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.3);
  width: 100%;
  height: 100%;
}

.empty-icon {
  font-size: 3rem;
}

.empty-text {
  font-size: 1rem;
}

/* ━━━━━━ Character Detail Panel ━━━━━━ */
.character-detail-panel {
  position: fixed;
  top: 55px;
  right: 100px;
  bottom: 55px;
  width: 320px;
  background: rgba(0, 0, 0, 0.95);
  border-left: 2px solid var(--c-primary);
  z-index: 450;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: rgba(255, 50, 50, 0.2);
  border: 1px solid rgba(255, 50, 50, 0.5);
  color: #ff5050;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.panel-close:hover {
  background: rgba(255, 50, 50, 0.4);
}

.panel-header {
  display: flex;
  gap: 15px;
  align-items: center;
}

.panel-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--c-primary);
  position: relative;
  transition: all 0.3s ease;
}

.panel-avatar.clickable {
  cursor: pointer;
}

.panel-avatar.clickable:hover {
  border-color: #fff;
  box-shadow: 0 0 15px var(--c-primary);
  transform: scale(1.05);
}

.gallery-hint {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.panel-avatar.clickable:hover .gallery-hint {
  opacity: 1;
}

.hint-icon {
  font-size: 1.2rem;
  color: var(--c-primary);
  margin-bottom: 2px;
}

.hint-text {
  font-size: 0.5rem;
  color: #fff;
  letter-spacing: 1px;
}

.panel-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel-title h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #fff;
  font-family: 'Noto Sans KR', sans-serif;
}

.panel-role {
  font-size: 0.85rem;
  color: var(--c-primary);
}

.panel-rank {
  font-size: 0.7rem;
  opacity: 0.6;
  margin-top: 5px;
}

.panel-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  width: 50px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.stat-bar-bg {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-secondary), var(--c-primary));
  transition: width 0.3s;
}

.stat-value {
  width: 35px;
  text-align: right;
  font-size: 0.85rem;
  color: var(--c-primary);
}

.panel-desc h4,
.panel-quote h4 {
  margin: 0 0 10px 0;
  font-size: 0.8rem;
  color: var(--c-primary);
  border-bottom: 1px solid rgba(255, 176, 0, 0.2);
  padding-bottom: 5px;
}

.panel-desc p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Noto Sans KR', sans-serif;
}

.quote-box {
  background: rgba(255, 176, 0, 0.05);
  border: 1px solid rgba(255, 176, 0, 0.2);
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.quote-box:hover {
  background: rgba(255, 176, 0, 0.1);
}

.quote-mark {
  font-size: 1.5rem;
  color: var(--c-primary);
  opacity: 0.5;
}

.quote-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 타이핑 커서 */
.typing-cursor {
  display: inline-block;
  color: var(--c-primary);
  font-weight: bold;
  animation: cursor-blink 0.7s infinite;
  margin-left: 2px;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.quote-text.hidden-quote {
  color: #ff88ff;
  text-shadow: 0 0 10px rgba(255, 136, 255, 0.5);
}

.quote-hint {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  margin-top: 5px;
}

/* Password Reveal */
.password-reveal {
  margin-top: 15px;
  padding: 12px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.4);
  border-radius: 4px;
  animation: password-unlock 0.5s ease;
}

@keyframes password-unlock {
  0% { transform: scale(0.9); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.password-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.password-icon {
  font-size: 1rem;
}

.password-label {
  font-size: 0.7rem;
  color: #00ff88;
  letter-spacing: 2px;
}

.password-value {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  color: #00ff88;
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px dashed rgba(0, 255, 136, 0.5);
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
}

/* Panel Transition */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* ━━━━━━ Grid Transition ━━━━━━ */
.grid-switch-enter-active,
.grid-switch-leave-active {
  transition: all 0.3s ease;
}

.grid-switch-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.grid-switch-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* ━━━━━━ Info Rail (Right) ━━━━━━ */
.info-rail {
  position: fixed;
  right: 0;
  top: 55px;
  bottom: 55px;
  width: 100px;
  background: linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(5,3,0,0.95) 100%);
  border-left: 2px solid var(--c-primary);
  z-index: 400;
  display: flex !important;
  flex-direction: column;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  transition: opacity 0.3s ease;
  view-transition-name: info-rail;
}

.info-rail:hover {
  opacity: 1;
}

/* Exit Button */
.rail-exit-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.8rem 0.3rem;
  background: linear-gradient(180deg, rgba(80,20,20,0.9) 0%, rgba(40,10,10,0.95) 100%);
  border: none;
  border-bottom: 2px solid rgba(255, 85, 85, 0.5);
  color: #ff6666;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
}

.exit-slot {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(60,15,15,0.9) 0%, rgba(30,8,8,0.95) 100%);
  border: 2px solid rgba(255, 85, 85, 0.4);
  border-radius: 4px;
}

.exit-icon {
  font-size: 1.5rem;
  z-index: 1;
}

.exit-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,85,85,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.exit-label {
  font-size: 0.75rem;
  font-family: 'Noto Sans KR', sans-serif;
}

.exit-sublabel {
  font-size: 0.5rem;
  color: #994444;
  letter-spacing: 1px;
}

.rail-exit-btn:hover {
  background: linear-gradient(180deg, rgba(120,30,30,0.95) 0%, rgba(60,15,15,0.98) 100%);
  color: #ffffff;
}

.rail-exit-btn:hover .exit-slot {
  border-color: #ff5555;
  box-shadow: 0 0 25px rgba(255, 85, 85, 0.5);
}

.rail-exit-btn:hover .exit-glow {
  opacity: 0.8;
}

/* Monitor Section */
.rail-monitor {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
}

.monitor-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 176, 0, 0.2);
}

.monitor-logo {
  font-size: 1.2rem;
  color: var(--c-primary);
  text-shadow: 0 0 10px var(--c-glow);
}

.monitor-title {
  font-size: 0.7rem;
  color: var(--c-primary);
  letter-spacing: 2px;
  opacity: 0.7;
}

/* Vertical Gauge */
.rail-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0;
}

.gauge-track {
  width: 14px;
  height: 50px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--c-primary);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.gauge-fill-vertical {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, var(--c-accent), var(--c-primary), var(--c-secondary));
  box-shadow: 0 0 10px var(--c-glow);
  transition: height 0.15s ease;
}

.gauge-percent {
  font-size: 0.9rem;
  color: var(--c-primary);
  font-weight: bold;
}

.gauge-glow {
  text-shadow: 0 0 10px var(--c-glow);
}

/* Status Blocks */
.rail-status-blocks {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.4rem 0.2rem;
  flex: 1;
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.3rem;
  width: 100%;
  text-align: center;
}

.block-icon {
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.block-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
}

.block-value.glow-green {
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
}

.block-label {
  font-size: 0.5rem;
  color: var(--c-primary);
  opacity: 0.6;
  letter-spacing: 1px;
}

.block-divider {
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-primary), transparent);
  opacity: 0.3;
}

/* Crypto Log */
.rail-crypto-log {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.4rem;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 176, 0, 0.15);
  overflow: hidden;
  max-height: 80px;
}

.crypto-line {
  font-size: 0.45rem;
  color: var(--c-primary);
  opacity: 0.4;
  letter-spacing: 0.5px;
  animation: crypto-scroll 8s linear infinite;
}

.crypto-line:nth-child(odd) {
  animation-delay: -4s;
  color: #00ff88;
  opacity: 0.3;
}

@keyframes crypto-scroll {
  0% { transform: translateY(0); opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { transform: translateY(-10px); opacity: 0.3; }
}

/* Rail Footer */
.info-rail .rail-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
}

.rail-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.rail-led.led-green {
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
  animation: led-blink 2s infinite;
}

@keyframes led-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.rail-id {
  font-size: 0.5rem;
  opacity: 0.4;
}

/* ━━━━━━ Command Rail (Left) ━━━━━━ */
.command-rail {
  position: fixed;
  left: 0;
  top: 55px;
  bottom: 55px;
  width: 100px;
  background: linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(5,3,0,0.95) 100%);
  border-right: 2px solid var(--c-primary);
  z-index: 400;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 30px rgba(0, 0, 0, 0.5);
  opacity: 0.85;
  transition: opacity 0.3s ease;
  /* view-transition-name: command-rail; */
}

.command-rail:hover {
  opacity: 1;
}

.rail-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  background: rgba(255, 176, 0, 0.08);
}

.rail-logo {
  font-size: 1.6rem;
  color: var(--c-primary);
  animation: gear-spin 10s linear infinite;
  text-shadow: 0 0 15px var(--c-glow);
}

@keyframes gear-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rail-title {
  font-size: 0.8rem;
  color: var(--c-primary);
  letter-spacing: 3px;
  font-weight: bold;
  opacity: 0.7;
}

.rail-buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.3rem;
}

.rail-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.3rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 176, 0, 0.15);
  color: #776600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
}

.btn-slot {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(20,15,5,0.9) 0%, rgba(10,8,2,0.95) 100%);
  border: 2px solid rgba(255, 176, 0, 0.25);
  border-radius: 4px;
  transition: all 0.25s ease;
}

.btn-icon {
  font-size: 1.3rem;
  z-index: 1;
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,176,0,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-label {
  font-size: 0.75rem;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  color: inherit;
}

.btn-sublabel {
  font-size: 0.5rem;
  color: #665500;
  letter-spacing: 1px;
}

.rail-btn:hover {
  background: rgba(255, 176, 0, 0.15);
  border-color: rgba(255, 176, 0, 0.6);
  color: #ffcc00;
  transform: scale(1.08);
  z-index: 10;
}

.rail-btn:hover .btn-slot {
  border-color: #ffb000;
  box-shadow: 0 0 25px rgba(255, 176, 0, 0.5);
}

.rail-btn:hover .btn-glow {
  opacity: 0.8;
}

.rail-btn.active {
  background: rgba(255, 176, 0, 0.15);
  border-color: #ffcc00;
  color: #ffffff;
}

.rail-btn.active .btn-slot {
  border-color: #ffcc00;
  box-shadow: 0 0 25px rgba(255, 200, 0, 0.5);
}

.rail-btn.active .btn-glow {
  opacity: 1;
  animation: glow-pulse 2s infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.command-rail .rail-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
}

.rail-indicator {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #ff6600, #ffb000);
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
  animation: indicator-scan 3s ease-in-out infinite;
}

@keyframes indicator-scan {
  0%, 100% { width: 20px; opacity: 0.5; }
  50% { width: 50px; opacity: 1; }
}

.rail-version {
  font-size: 0.6rem;
  color: #554400;
  letter-spacing: 1px;
}

/* ━━━━━━ Connection Info ━━━━━━ */
.connection-info {
  position: fixed;
  bottom: 55px;
  left: 115px;
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #505050;
  z-index: 200;
  padding: 0.3rem 0;
}

.conn-status {
  color: #00ff88;
}

/* ━━━━━━ Exit Animation ━━━━━━ */
.characters-tactical-map.is-exiting .character-card {
  animation: card-fold-out 0.5s ease-in forwards;
}

@keyframes card-fold-out {
  to {
    opacity: 0;
    transform: scale(0.8) rotateX(45deg);
  }
}

.characters-tactical-map.is-exiting .command-rail {
  animation: slide-out-left 0.5s ease-in 0.2s forwards;
}

@keyframes slide-out-left {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.characters-tactical-map.is-exiting .info-rail {
  animation: slide-out-right 0.5s ease-in 0.2s forwards;
}

@keyframes slide-out-right {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.characters-tactical-map.is-exiting .layer-tabs-panel,
.characters-tactical-map.is-exiting .faction-selector {
  animation: fade-out-up 0.4s ease-in forwards;
}

@keyframes fade-out-up {
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}

.characters-tactical-map.is-exiting .character-detail-panel {
  animation: slide-out-right 0.4s ease-in forwards;
}

/* ━━━━━━ Module Switching Animation ━━━━━━ */
.characters-tactical-map.is-switching .character-grid-wrapper,
.characters-tactical-map.is-switching .layer-tabs-panel,
.characters-tactical-map.is-switching .faction-selector,
.characters-tactical-map.is-switching .character-detail-panel,
.characters-tactical-map.is-switching .cinema-bar,
.characters-tactical-map.is-switching .grid-floor,
.characters-tactical-map.is-switching .bg-overlay,
.characters-tactical-map.is-switching .connection-info {
  animation: fade-out-content 0.4s ease-in forwards;
}

@keyframes fade-out-content {
  to {
    opacity: 0;
    filter: blur(5px);
    transform: scale(0.98);
  }
}

.characters-tactical-map.is-switching .command-rail,
.characters-tactical-map.is-switching .info-rail {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━━━━ HERO MODE (3명 이하) ━━━━━━ */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* Watermark Background */
.hero-watermark {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.watermark-emblem {
  font-size: 35vw;
  font-weight: 900;
  opacity: 0.03;
  font-family: 'Orbitron', sans-serif;
  line-height: 1;
  animation: watermark-pulse 8s ease-in-out infinite;
}

@keyframes watermark-pulse {
  0%, 100% { opacity: 0.02; transform: scale(1); }
  50% { opacity: 0.05; transform: scale(1.02); }
}

.watermark-text {
  font-size: 3vw;
  letter-spacing: 2vw;
  opacity: 0.05;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: -5vw;
}

/* Hero Mode Grid Wrapper */
.character-grid-wrapper.hero-mode {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━━━━ HERO MODE: 50:50 DUAL-PANE SPLIT ━━━━━━ */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 1. 컨테이너 - 100% 영역 채우기 */
.char-grid.hero-mode {
  display: flex;
  justify-content: center;
  align-items: stretch; /* 카드 높이 강제 늘림 */
  gap: 120px;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 620px;
  margin: 0 auto;
  padding: 0 15px; /* 사이드바와 안전거리 */
  box-sizing: border-box;
}

/* 2. 카드 - Flex 기반 균등 분할 */
.char-grid.hero-mode .char-card {
  /* 고정 너비 제거 → flex: 1로 균등 분할 */
  flex: 1;
  max-width: 50%; /* 최대 절반까지 */
  min-width: 300px;
  height: auto; /* stretch로 인해 자동 채움 */
  
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  
  background: rgba(10, 5, 0, 0.95);
  border: 2px solid var(--c-primary);
  box-shadow: 0 0 40px rgba(255, 176, 0, 0.15);
  overflow: hidden;
  position: relative;
  
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: hero-card-appear 0.8s ease-out backwards;
  animation-delay: var(--delay);
}

/* 1명일 때 - 전체 폭의 70% */
.char-grid.hero-mode .char-card:only-child {
  max-width: 70%;
  flex: 0 0 70%;
}

/* 2명일 때 - 50:50 분할 (기본) */
.char-grid.hero-mode .char-card:first-child:nth-last-child(2),
.char-grid.hero-mode .char-card:first-child:nth-last-child(2) ~ .char-card {
  flex: 1;
  max-width: calc(50% - 10px);
}

/* 3명일 때 - 33:33:33 분할 */
.char-grid.hero-mode .char-card:first-child:nth-last-child(3),
.char-grid.hero-mode .char-card:first-child:nth-last-child(3) ~ .char-card {
  flex: 1;
  max-width: calc(33.333% - 14px);
}

@keyframes hero-card-appear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(40px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

.char-grid.hero-mode .char-card:hover {
  border-color: var(--faction-color, var(--c-primary));
  transform: translateY(-8px);
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.6),
    0 0 80px color-mix(in srgb, var(--faction-color, var(--c-primary)) 35%, transparent);
}

.char-grid.hero-mode .char-card.is-selected {
  border-color: var(--faction-color, var(--c-primary));
  border-width: 3px;
  box-shadow: 
    0 0 100px color-mix(in srgb, var(--faction-color, var(--c-primary)) 50%, transparent),
    inset 0 0 40px color-mix(in srgb, var(--faction-color, var(--c-primary)) 15%, transparent);
}

/* Corner Brackets */
.char-grid.hero-mode .char-card .corner {
  width: 25px;
  height: 25px;
  z-index: 10;
}

.char-grid.hero-mode .char-card:hover .corner {
  width: 45px;
  height: 45px;
  opacity: 1;
}

/* 3. 이미지 영역 - 더 크게 확장 */
.char-grid.hero-mode .char-img-wrapper {
  width: 100%;
  flex: 0 0 70%; /* 상단 70%로 확장 */
  min-height: 280px;
  border-bottom: 3px solid var(--c-primary);
  background: linear-gradient(180deg, #0a0502 0%, #000 100%);
  position: relative;
  overflow: hidden;
}

/* 실제 이미지 - 풀 프레임 직사각형 */
.char-grid.hero-mode .char-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center; /* 얼굴 위주 */
  border-radius: 0; /* 원형 제거 */
  filter: sepia(0.15) contrast(1.1) brightness(1.05);
  transition: all 0.5s ease;
}

.char-grid.hero-mode .char-card:hover .char-img {
  transform: scale(1.08);
  filter: sepia(0.05) contrast(1.2) brightness(1.1);
}

/* 이미지 플레이스홀더 */
.char-grid.hero-mode .char-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  font-weight: 900;
  color: rgba(255, 176, 0, 0.15);
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(180deg, rgba(255,176,0,0.05) 0%, transparent 100%);
}

/* 4. 텍스트 정보 - Info Header */
.char-grid.hero-mode .char-info {
  text-align: center;
  padding: 20px 25px 15px;
  width: 100%;
  background: linear-gradient(180deg, rgba(255,176,0,0.03) 0%, transparent 100%);  
}

.char-grid.hero-mode .char-name {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 
    0 0 20px var(--c-primary),
    0 0 40px color-mix(in srgb, var(--c-primary) 50%, transparent);
  margin: 0 0 10px 0;
  letter-spacing: 3px;
  line-height: 1.2;
}

/* Meta Bar - 종족/역할 가로 배치 */
.char-grid.hero-mode .char-meta-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-family: 'Share Tech Mono', monospace;
}

.char-grid.hero-mode .meta-item {
  font-size: 0.85rem;
  color: var(--c-primary);
  letter-spacing: 2px;
}

.char-grid.hero-mode .meta-divider {
  color: rgba(255, 176, 0, 0.4);
  font-size: 1rem;
}

/* Sub Info - Faction & Rank */
.char-grid.hero-mode .char-sub-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.char-grid.hero-mode .char-faction {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
}

.char-grid.hero-mode .char-rank {
  font-size: 0.8rem;
  color: var(--faction-color, var(--c-primary));
  padding: 4px 14px;
  border: 1px solid var(--faction-color, var(--c-primary));
  background: rgba(0, 0, 0, 0.6);
  letter-spacing: 1px;
}

/* 5. Description Terminal Box */
.char-grid.hero-mode .char-desc-box {
  width: 90%;
  margin: 10px auto 15px;
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.5);
  max-height: 120px;
  overflow-y: auto;
}

.char-grid.hero-mode .desc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 176, 0, 0.2);
}

.char-grid.hero-mode .desc-prompt {
  color: var(--c-primary);
  font-size: 0.9rem;
  animation: blink-cursor 1s infinite;
}

@keyframes blink-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.char-grid.hero-mode .desc-title {
  font-size: 0.7rem;
  color: var(--c-primary);
  letter-spacing: 2px;
  opacity: 0.7;
}

.char-grid.hero-mode .desc-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Noto Sans KR', sans-serif;
  margin: 0;
}

/* Scrollbar for desc box */
.char-grid.hero-mode .char-desc-box::-webkit-scrollbar {
  width: 4px;
}

.char-grid.hero-mode .char-desc-box::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.char-grid.hero-mode .char-desc-box::-webkit-scrollbar-thumb {
  background: var(--c-primary);
  opacity: 0.5;
}

/* Quote - 하단 고정 */
.char-grid.hero-mode .char-quote {
  width: 90%;
  padding: 15px 20px;
  margin: auto auto 20px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 4px solid var(--faction-color, var(--c-primary));
  font-style: italic;
}

.char-grid.hero-mode .char-quote .quote-mark {
  font-size: 2rem;
  color: var(--faction-color, var(--c-primary));
  opacity: 0.6;
  line-height: 0;
  vertical-align: text-top;
}

.char-grid.hero-mode .char-quote .quote-text {
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.75);
  font-family: 'Noto Sans KR', sans-serif;
  line-height: 1.6;
}

/* Hero Mode Empty State */
.empty-state.hero-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Hero Mode Exit Animation */
.characters-tactical-map.is-exiting .char-grid.hero-mode .char-card {
  animation: hero-card-exit 0.6s ease-in forwards;
}

@keyframes hero-card-exit {
  to {
    opacity: 0;
    transform: scale(0.8) translateY(-50px);
    filter: blur(10px);
  }
}

.characters-tactical-map.is-exiting .hero-watermark {
  animation: watermark-fade 0.4s ease-in forwards;
}

@keyframes watermark-fade {
  to {
    opacity: 0;
    transform: scale(1.1);
  }
}

/* Sidebar entrance animation (only from home) */
.characters-tactical-map.from-home .command-rail {
  animation: sidebar-enter-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.6s;
  /* opacity: 0; */
  /* transform: translateX(-100%); */
  transition: none;
}

/* Volume Control */
.rail-volume-control {
  padding: 0.8rem 0.5rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
}

.volume-label {
  font-size: 0.6rem;
  color: #ffb000;
  letter-spacing: 1px;
  font-weight: bold;
}

.volume-slider-container {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 176, 0, 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center;
}

.rail-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  z-index: 2;
  cursor: pointer;
  margin: 0;
}

.rail-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: #ffb000;
  border: 1px solid #000;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 176, 0, 0.8);
}

.rail-slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #ffb000;
  border-radius: 2px;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .cinema-bar, .command-rail, .info-rail {
    display: none !important;
  }
  
  .layer-tabs-panel {
    top: 5px;
    width: 95%;
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 5px;
  }
  
  .faction-selector {
    top: 60px;
    width: 95%;
    overflow-x: auto;
    justify-content: flex-start;
    flex-wrap: nowrap;
    padding-bottom: 5px;
  }

  .character-grid-wrapper {
    margin-top: 110px;
    grid-template-columns: 1fr;
    width: 95%;
    height: auto;
    overflow-y: visible; /* Let wrapper scroll if needed, or parent */
    padding-bottom: 20px;
  }
  
  .characters-tactical-map {
    overflow-y: auto; /* Enable vertical scroll on main container */
    -webkit-overflow-scrolling: touch;
  }

  /* Grid Switch Transition fix for mobile */
  .grid-switch-leave-active {
    position: absolute; 
    top: 110px;
    width: 95%;
  }

  /* Hero Mode Stacking */
  .char-grid.hero-mode {
    flex-direction: column;
    height: auto;
    gap: 30px;
  }
  
  .char-card {
    min-height: 500px; /* Ensure ample space for card details */
    height: auto;
  }
}
</style>


<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-char-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #050505; color: #ffb000; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: sans-serif; }
  .mobile-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ffb000; padding-bottom: 15px; margin-bottom: 20px; }
  .back-btn { background: #333; color: #fff; border: 1px solid #ffb000; padding: 8px 16px; font-weight: bold; }
  .mobile-layer-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
  .m-tab-btn { flex: 1; padding: 10px; background: #111; border: 1px solid #444; color: #888; }
  .m-tab-btn.active { background: #ffb000; color: #000; font-weight: bold; }
  .mobile-char-list { display: flex; flex-direction: column; gap: 15px; }
  .m-char-card { display: flex; gap: 15px; background: #1a1a1a; padding: 15px; border: 1px solid #333; border-radius: 4px; }
  .m-char-img { width: 80px; height: 80px; object-fit: cover; border: 1px solid #555; background: #000; }
  .m-char-info { flex: 1; }
  .m-name { font-size: 1.1rem; font-weight: bold; color: #fff; margin-bottom: 5px; }
  .m-role { font-size: 0.9rem; color: #ffb000; margin-bottom: 5px; }
  .m-desc { font-size: 0.8rem; color: #ccc; line-height: 1.4; }
}
</style>
