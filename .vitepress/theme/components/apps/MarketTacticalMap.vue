<template>
  <MobileMarket 
    v-if="isMobile" 
    :workshopItems="workshopItems" 
    :blackMarketItems="blackMarketItems" 
    @close="handleClose" 
  />
  <div 
    class="market-tactical-map" 
    :class="[activeTab, { 'is-exiting': isExiting, 'is-switching': isSwitching, 'from-home': fromHome }]" 
    ref="mapContainer" v-else
  >
    <!-- 3D Perspective Grid Floor -->
    <div class="grid-floor">
      <div class="grid-lines"></div>
    </div>
    
    <!-- Cinematic Letterbox Bars -->
    <div class="cinema-bar cinema-bar-top" :class="{ 'market-mode': activeTab === 'market' }">
      <div class="ticker-label" :class="{ 'glitch-label': activeTab === 'market' }">
        <span class="label-text" :data-text="activeTab === 'market' ? '암호화 채널 //' : '실시간 뉴스 //'">{{ activeTab === 'market' ? '암호화 채널 //' : '실시간 뉴스 //' }}</span>
      </div>
      <div class="ticker-wrap">
        <div class="ticker" :class="{ 'glitch-ticker': activeTab === 'market' }">
          <span 
            v-for="(msg, i) in currentTickerMessages" 
            :key="i" 
            class="ticker-msg"
            :class="{ 'glitch-text': activeTab === 'market' }"
            :data-text="'⚠ ' + msg"
          >⚠ {{ msg }}</span>
          <span 
            v-for="(msg, i) in currentTickerMessages" 
            :key="'dup-'+i" 
            class="ticker-msg"
            :class="{ 'glitch-text': activeTab === 'market' }"
            :data-text="'⚠ ' + msg"
          >⚠ {{ msg }}</span>
        </div>
      </div>
    </div>
    <div class="cinema-bar cinema-bar-bottom" :class="{ 'market-mode': activeTab === 'market' }">
      <div class="ticker-label ticker-label-bottom" :class="{ 'glitch-label': activeTab === 'market' }">
        <span class="label-text" :data-text="activeTab === 'market' ? '위험 경보 //' : '공지사항 //'">{{ activeTab === 'market' ? '위험 경보 //' : '공지사항 //' }}</span>
      </div>
      <div class="ticker-wrap">
        <div 
          class="ticker" 
          :class="[
            { 'glitch-ticker': activeTab === 'market' }, 
            { 'ticker-reverse': activeTab === 'workshop' },
            { 'ticker-reverse-market': activeTab === 'market' }
          ]"
        >
          <span 
            v-for="(msg, i) in bottomTickerMessages" 
            :key="i" 
            class="ticker-msg"
            :class="{ 'glitch-text': activeTab === 'market' }"
            :data-text="'☠ ' + msg"
          >☠ {{ msg }}</span>
          <span 
            v-for="(msg, i) in bottomTickerMessages" 
            :key="'dup-'+i" 
            class="ticker-msg"
            :class="{ 'glitch-text': activeTab === 'market' }"
            :data-text="'☠ ' + msg"
          >☠ {{ msg }}</span>
        </div>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="bg-overlay"></div>
    <div class="scan-line"></div>
    <div class="vignette-overlay"></div>
    
    <!-- CRT Scanlines -->
    <div class="crt-overlay"></div>

    <!-- Tab Switch Control -->
    <div class="tab-switch-panel">
      <div class="tab-bg"></div>
      <button 
        class="tab-btn workshop"
        :class="{ active: activeTab === 'workshop' }"
        @click="switchTab('workshop')"
      >
        <span class="tab-icon">🔧</span>
        <span class="tab-label">정비소</span>
        <span class="tab-sublabel">WORKSHOP</span>
      </button>
      <button 
        class="tab-btn market"
        :class="{ active: activeTab === 'market' }"
        @click="switchTab('market')"
      >
        <span class="tab-icon">💀</span>
        <span class="tab-label">암시장</span>
        <span class="tab-sublabel">BLACK MARKET</span>
      </button>
      <div class="tab-slider" :class="activeTab"></div>
    </div>

    <!-- Main Arsenal Grid (4x2) -->
    <div class="arsenal-grid-wrapper">
      <Transition name="grid-switch" mode="out-in">
        <div :key="activeTab" class="arsenal-grid">
          <div 
            v-for="(item, idx) in currentItems" 
            :key="item.id"
            class="arsenal-card"
            :class="{ 
              'is-hovered': hoveredCard === idx,
              'is-revealed': itemStates[item.id]?.revealed,
              'market': activeTab === 'market'
            }"
            :style="{ '--delay': idx * 0.1 + 's' }"
            @mouseenter="handleCardEnter(item, idx)"
            @mouseleave="handleCardLeave(item, idx)"
            @click="handleItemClick(item)"
          >
            <!-- Card Glow -->
            <div class="card-glow"></div>
            
            <!-- Card Frame -->
            <div class="card-frame">
              <!-- Corner Brackets -->
              <div class="corner tl"></div>
              <div class="corner tr"></div>
              <div class="corner bl"></div>
              <div class="corner br"></div>
              
              <!-- Encrypted Layer (Market Only) -->
              <div v-if="activeTab === 'market' && !itemStates[item.id]?.revealed" class="encrypted-layer">
                <div class="noise-bg"></div>
                <div class="lock-symbol">🔒</div>
                <div class="censor-bar">RESTRICTED_DATA</div>
                <div class="id-tag">{{ item.id }}</div>
                <div v-if="itemStates[item.id]?.decrypting" class="decrypt-progress">
                  <div class="progress-bar"></div>
                  <div class="decrypt-text">DECRYPTING...</div>
                </div>
              </div>

              <!-- Revealed Content -->
              <div v-else class="card-content">
                <!-- Item Visual -->
                <div class="item-visual">
                  <div class="item-icon-bg"></div>
                  <span class="item-icon">{{ item.icon }}</span>
                </div>
                
                <!-- Item Info -->
                <div class="item-info">
                  <div class="item-header">
                    <span class="item-id">{{ item.id }}</span>
                    <span class="item-stock">QTY: {{ item.stock }}</span>
                  </div>
                  <h3 class="item-name">{{ item.name }}</h3>
                  <div class="item-price">
                    <span class="price-value">{{ item.price }}</span>
                    <span class="price-unit">G</span>
                  </div>
                </div>

                <!-- Hologram Overlay on Hover -->
                <div class="hologram-overlay">
                  <div class="holo-scanline"></div>
                  <div class="holo-content">
                    <div class="holo-desc">{{ item.desc }}</div>
                    <div class="holo-action">
                      {{ activeTab === 'market' ? '[ PURCHASE ]' : '[ REQUISITION ]' }}
                    </div>
                  </div>
                  <div class="holo-glitch"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Feedback Toast -->
    <Transition name="toast-slide">
      <div v-if="feedbackMsg" :key="toastKey" class="feedback-toast">
        <div class="toast-icon">✓</div>
        <div class="toast-content">{{ feedbackMsg }}</div>
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
            <div class="gauge-fill-vertical gauge-animated" :style="{ height: animatedPercent + '%' }"></div>
          </div>
          <span class="gauge-percent gauge-glow">{{ Math.round(animatedPercent) }}%</span>
        </div>
        
        <!-- Status Blocks -->
        <div class="rail-status-blocks">
          <div class="status-block">
            <span class="block-icon">💰</span>
            <span class="block-value">{{ currentItems.length }}</span>
            <span class="block-label">ITEMS</span>
          </div>
          
          <div class="block-divider"></div>
          
          <div class="status-block">
            <span class="block-icon">◉</span>
            <span class="block-value glow-green">
              {{ activeTab === 'market' ? 'DARK' : 'SAFE' }}
            </span>
            <span class="block-label">MODE</span>
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
        <button class="rail-btn" @click="switchModule(withBase('/characters/index.html'))">
          <div class="btn-slot">
            <span class="btn-icon">👤</span>
            <span class="btn-glow"></span>
          </div>
          <span class="btn-label">인물</span>
          <span class="btn-sublabel">CHARS</span>
        </button>
        <button class="rail-btn active">
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
      <span class="conn-node">{{ activeTab === 'market' ? 'DARKNET NODE: SHADOW-13' : 'WORKSHOP NODE: MAINT-07' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, withBase } from 'vitepress';
import MobileMarket from './mobile/MobileMarket.vue';
import { usePageTransition } from '../../transitionState';
import { useSteamSound } from '../../composables/useSteamSound';

const emit = defineEmits(['close', 'openHistory', 'openWorld', 'openCharacters', 'openSystem']);
const router = useRouter();
const { startTransition } = usePageTransition();
const { playHover, playClick, playCardSelect, playBuy, playToggleOn, playToggleOff, playBack, playTransition, playBeepConfirm, playDataTransmit, playScan, categoryVolumes, setCategoryVolume } = useSteamSound();

const ambientVolume = computed({
  get: () => categoryVolumes.ambient,
  set: (val) => setCategoryVolume('ambient', val)
});

const isMobile = ref(false);
const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth <= 768;
  }
};

// State
const mapContainer = ref(null);
const isExiting = ref(false);
const isSwitching = ref(false);
const fromHome = ref(false);
const activeTab = ref('workshop');
const hoveredCard = ref(null);
const feedbackMsg = ref('');
const toastKey = ref(0);
const currentTime = ref('00:00:00');
const animatedPercent = ref(75);
const itemStates = reactive({});
const decryptTimers = {};
let toastTimer = null;
let timeInterval = null;
let percentInterval = null;

// Check if navigation is from home or another TacticalMap
const checkNavigationSource = () => {
  if (typeof window !== 'undefined') {
    const lastPage = sessionStorage.getItem('vortex-last-page');
    fromHome.value = !lastPage || lastPage === 'home' || lastPage === 'index';
    sessionStorage.setItem('vortex-last-page', 'tacticalmap');
  }
};

const switchModule = (path) => {
  if (isSwitching.value || isExiting.value) return;
  playTransition();
  isSwitching.value = true;
  setTimeout(() => {
    router.go(path);
  }, 500);
};

// Data - Top Ticker (Main News)
const marketTickerMessages = [
  '암호화 수준 최대치 도달... 추적 불가 상태',
  '신규 계약: "청소부" 의뢰 접수 (보상: 500G)',
  '바이오 부품 시세 급등 (+15%) - 공급 부족',
  '수배: "VORTEX_RUNNER" 생사 무관 (3000G)',
  '증기 밸브 불법 개조품 입고 - 재고 한정'
];

const workshopTickerMessages = [
  '워크샵 진단: 모든 시스템 정상 가동 중',
  '정비 일정: 섹터 7구역 점검 대기 중',
  '재고 알림: 탄약 보급 필요 (잔여 23%)',
  '코어 온도 안정 (45°C) - 냉각 효율 양호',
  '제작기 대기 중... 신규 주문 접수 가능'
];

// Data - Bottom Ticker (Alerts & Bulletins)
const marketBottomMessages = [
  '경고: 보안국 순찰 강화 - 3구역 회피 권장',
  '밀거래 채널 #7 일시 폐쇄 - 대체 경로 탐색 중',
  '익명 정보원: "용광로 근처 조심해라"',
  '신규 판매자 검증 중... 신뢰도 확인 필요',
  '암호 키 갱신 주기: 12시간 후 만료'
];

const workshopBottomMessages = [
  '공지: 야간 정비 서비스 운영 (22:00-06:00)',
  '신규 부품 입고: 고압 증기 밸브 (Type-C)',
  '정비사 추천: 오버홀 후 윤활 필수',
  '금일 할인: 센서 세척 30% 할인 적용',
  '대기열: 현재 3건 처리 중'
];

const currentTickerMessages = computed(() => {
  return activeTab.value === 'market' ? marketTickerMessages : workshopTickerMessages;
});

const bottomTickerMessages = computed(() => {
  return activeTab.value === 'market' ? marketBottomMessages : workshopBottomMessages;
});

const blackMarketItems = [
  { id: 'BM-01', name: '내산 코팅제', price: 15, stock: 42, icon: '🧪', desc: '산성비로부터 장비를 보호합니다. (24h)' },
  { id: 'BM-02', name: '광학 미채', price: 80, stock: 5, icon: '👁️', desc: '빛을 굴절시켜 투명화합니다. 에너지 소모 극심.' },
  { id: 'BM-03', name: '고출력 코어', price: 120, stock: 2, icon: '⚡', desc: '출력 200% 증폭. 폭발 위험 있음.' },
  { id: 'BM-04', name: '해킹 툴', price: 50, stock: 12, icon: '💻', desc: '보안국 표준 잠금장치 무력화.' },
  { id: 'BM-05', name: '아드레날린', price: 30, stock: 15, icon: '💉', desc: '일시적 반응속도 향상. 부작용: 시야 흐림.' },
  { id: 'BM-06', name: 'EMP 수류탄', price: 45, stock: 8, icon: '💣', desc: '반경 10m 내 모든 전자기기 마비.' },
  { id: 'BM-07', name: '구형 장갑', price: 60, stock: 4, icon: '🛡️', desc: '무겁지만 튼튼한 구세대 군용 장갑.' },
  { id: 'BM-08', name: '정제된 에테르', price: 100, stock: 20, icon: '✨', desc: '고순도 연료. 증기기관 효율 급증.' }
];

const workshopItems = [
  { id: 'WS-01', name: '긴급 수리', price: 10, stock: '∞', icon: '🩹', desc: '전투 중 입은 가벼운 손상을 땜질합니다.' },
  { id: 'WS-02', name: '정밀 오버홀', price: 50, stock: '∞', icon: '🔬', desc: '전체 분해 및 세척. 내구도 완충.' },
  { id: 'WS-03', name: '관절 윤활', price: 20, stock: '∞', icon: '🛢️', desc: '마찰 계수 감소. 민첩성 향상.' },
  { id: 'WS-04', name: '센서 세척', price: 5, stock: '∞', icon: '🚿', desc: '광학 센서의 이물질 제거. 명중률 상승.' },
  { id: 'WS-05', name: '밸브 교체', price: 15, stock: '∞', icon: '⚙️', desc: '노후 밸브 교체. 증기 누출 방지.' },
  { id: 'WS-06', name: '방열판 증설', price: 40, stock: '∞', icon: '❄️', desc: '과열 방지. 연사 속도 증가.' },
  { id: 'WS-07', name: '탄약 보급', price: 8, stock: '∞', icon: '📦', desc: '표준 규격 탄약 상자.' },
  { id: 'WS-08', name: '데이터 백업', price: 200, stock: '1', icon: '💾', desc: '현재 기억 데이터를 서버에 저장.' }
];

const currentItems = computed(() => {
  return activeTab.value === 'market' ? blackMarketItems : workshopItems;
});

// Initialize item states
const initItemStates = () => {
  blackMarketItems.forEach(item => {
    if (!itemStates[item.id]) {
      itemStates[item.id] = { revealed: false, decrypting: false };
    }
  });
};

// Methods
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toTimeString().split(' ')[0];
};

const switchTab = (tab) => {
  if (activeTab.value !== tab) {
    tab === 'market' ? playToggleOn() : playToggleOff();
  }
  activeTab.value = tab;
};

const handleCardEnter = (item, idx) => {
  hoveredCard.value = idx;
  playHover();
  
  if (activeTab.value === 'market' && !itemStates[item.id]?.revealed) {
    if (!itemStates[item.id]) itemStates[item.id] = { revealed: false, decrypting: false };
    itemStates[item.id].decrypting = true;
    playScan();
    
    if (decryptTimers[item.id]) clearTimeout(decryptTimers[item.id]);
    decryptTimers[item.id] = setTimeout(() => {
      itemStates[item.id].revealed = true;
      itemStates[item.id].decrypting = false;
      playBeepConfirm();
    }, 400);
  }
};

const handleCardLeave = (item, idx) => {
  hoveredCard.value = null;
  
  if (activeTab.value === 'market') {
    if (decryptTimers[item.id]) clearTimeout(decryptTimers[item.id]);
    if (itemStates[item.id]) {
      itemStates[item.id].revealed = false;
      itemStates[item.id].decrypting = false;
    }
  }
};

const handleItemClick = (item) => {
  if (activeTab.value === 'market' && !itemStates[item.id]?.revealed) return;
  
  playBuy();
  if (toastTimer) clearTimeout(toastTimer);
  
  const action = activeTab.value === 'market' ? 'PURCHASED' : 'REQUISITIONED';
  feedbackMsg.value = `>> ${item.name} ${action}. -${item.price}G`;
  toastKey.value++;
  
  toastTimer = setTimeout(() => { 
    feedbackMsg.value = ''; 
    toastTimer = null;
  }, 2000);
};

const handleClose = () => {
  if (isExiting.value || isSwitching.value) return;
  isExiting.value = true;
  playTransition();
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'home');
  }
  
  setTimeout(() => {
    router.go(withBase('/index.html'));
  }, 400);
};

// Lifecycle
onMounted(() => {
  checkNavigationSource();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  initItemStates();
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  // Percent oscillation
  percentInterval = setInterval(() => {
    animatedPercent.value = 70 + Math.sin(Date.now() / 1000) * 25;
  }, 50);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (timeInterval) clearInterval(timeInterval);
  if (percentInterval) clearInterval(percentInterval);
  if (toastTimer) clearTimeout(toastTimer);
  Object.values(decryptTimers).forEach(timer => clearTimeout(timer));
});

// Clear toast on tab switch
watch(activeTab, () => {
  feedbackMsg.value = '';
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Noto+Sans+KR:wght@400;500;700&display=swap');

/* ━━━━━━ CSS Variables ━━━━━━ */
.market-tactical-map {
  --c-primary: #01ffff;
  --c-secondary: #008080;
  --c-accent: #00ffaa;
  --c-bg: #001428;
  --c-glow: rgba(0, 255, 255, 0.5);
  
  position: fixed;
  inset: 0;
  background: var(--c-bg);
  font-family: 'Share Tech Mono', monospace;
  color: var(--c-primary);
  overflow: hidden;
  z-index: 9999;
}

/* Market Mode (Dark Crimson Theme - 불법 거래소) */
.market-tactical-map.market {
  --c-primary: #ff3355;
  --c-secondary: #8b0000;
  --c-accent: #ff6b6b;
  --c-bg: #050002;
  --c-glow: rgba(255, 51, 85, 0.4);
  --c-danger: #ff0033;
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

.market-tactical-map.market .vignette-overlay {
  box-shadow: inset 0 0 250px rgba(80, 0, 0, 0.7);
  animation: vignette-pulse 4s infinite;
}

@keyframes vignette-pulse {
  0%, 100% { box-shadow: inset 0 0 250px rgba(80, 0, 0, 0.6); }
  50% { box-shadow: inset 0 0 300px rgba(120, 0, 20, 0.8); }
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

.cinema-bar.market-mode {
  background: linear-gradient(180deg, rgba(20,0,0,0.98) 0%, rgba(10,0,0,0.98) 100%);
  border-color: var(--c-danger) !important;
}

/* Danger Warning Strip for Market Cinema Bars */
.cinema-bar.market-mode::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 0, 0, 0.03) 10px,
    rgba(255, 0, 0, 0.03) 20px
  );
  pointer-events: none;
  animation: stripe-move 20s linear infinite;
}

@keyframes stripe-move {
  0% { background-position: 0 0; }
  100% { background-position: 100px 0; }
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

/* Ticker Label */
.ticker-label {
  background: var(--c-primary);
  color: #000;
  font-weight: bold;
  padding: 0 1.2rem;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 0.75rem;
  letter-spacing: 1px;
  min-width: 140px;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.ticker-label-bottom {
  min-width: 120px;
}

.cinema-bar.market-mode .ticker-label {
  background: linear-gradient(90deg, #cc0022, #660011);
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255,50,50,0.8);
  font-weight: bold;
}

/* Market Label - 정비소와 동일한 정적 스타일 */
.ticker-label.glitch-label .label-text {
  position: relative;
}

.ticker-wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem;
}

.ticker {
  display: inline-block;
  white-space: nowrap;
  animation: ticker-scroll 60s linear infinite;
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: var(--c-primary);
  padding-left: 100%;
}

.ticker-msg {
  margin-right: 3rem;
  position: relative;
}

.ticker-reverse {
  animation-direction: reverse;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

/* Market Mode Ticker - 정비소와 동일한 애니메이션, 색상만 다름 */
.ticker.glitch-ticker {
  animation: ticker-scroll 60s linear infinite;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 100, 100, 0.6);
}

/* 암시장 하단 티커 - 역방향 (오른쪽→왼쪽) */
.ticker.ticker-reverse-market {
  animation: ticker-scroll 60s linear infinite reverse;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 100, 100, 0.6);
}

/* Market Mode Text - 정비소와 동일, 색상만 다름 */
.ticker-msg.glitch-text {
  position: relative;
  color: #ffffff;
  text-shadow: 0 0 4px rgba(255, 80, 80, 0.8), 0 0 12px rgba(255, 50, 50, 0.4);
}

/* ━━━━━━ Tab Switch Panel ━━━━━━ */
.tab-switch-panel {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0;
  z-index: 600;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--c-primary);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 0 30px var(--c-glow);
}

.tab-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  font-family: inherit;
  transition: all 0.3s ease;
  z-index: 2;
}

.tab-btn.active {
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* Market mode tab button - 붉은 배경에서 잘 보이는 흰색 */
.market-tactical-map.market .tab-btn.active {
  color: #fff;
  text-shadow: 0 0 5px rgba(0,0,0,0.8);
}

/* Workshop mode tab button - 청록색 배경에서 흰색 글자 */
.market-tactical-map.workshop .tab-btn.active {
  color: #ffffff;
  text-shadow: 0 1px 1px rgba(0,0,0,0.6);
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-label {
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Noto Sans KR', sans-serif;
}

.tab-sublabel {
  font-size: 0.6rem;
  letter-spacing: 2px;
  opacity: 0.7;
}

.tab-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--c-primary);
  border-radius: 4px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

/* Market mode tab slider - 어두운 배경에서 잘 보이는 색상 */
.market-tactical-map.market .tab-slider {
  background: linear-gradient(135deg, #cc0022, #880011);
}

.tab-slider.market {
  transform: translateX(100%);
}

/* ━━━━━━ Arsenal Grid ━━━━━━ */
.arsenal-grid-wrapper {
  position: absolute;
  top: 180px;
  bottom: 80px;
  left: 120px;
  right: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.arsenal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 600px;
}

/* ━━━━━━ Arsenal Card ━━━━━━ */
.arsenal-card {
  position: relative;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: card-appear 0.5s ease-out backwards;
  animation-delay: var(--delay);
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: scale(0.8) rotateX(20deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateX(0deg);
  }
}

.arsenal-card:hover {
  border-color: var(--c-primary);
  transform: translateY(-5px);
  z-index: 10;
}

/* Market Card Styles - 불법 거래소 스타일 */
.arsenal-card.market {
  background: rgba(20, 0, 5, 0.85);
  border: 1px solid rgba(255, 50, 50, 0.2);
  clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%);
  box-shadow: 
    inset 0 0 30px rgba(255, 0, 0, 0.1),
    0 0 15px rgba(0, 0, 0, 0.8);
}

/* Static Noise Background for Market */
.arsenal-card.market::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  animation: static-flicker 0.15s infinite;
}

@keyframes static-flicker {
  0%, 100% { opacity: 0.08; }
  50% { opacity: 0.12; }
}

/* Scan Line Effect for Market Cards */
.arsenal-card.market::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-primary), transparent);
  opacity: 0.4;
  animation: card-scan 2s linear infinite;
  z-index: 10;
  pointer-events: none;
}

@keyframes card-scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.arsenal-card.market:hover {
  animation: violent-shake 0.3s cubic-bezier(.36,.07,.19,.97) both infinite, danger-pulse 0.5s infinite;
  border-color: var(--c-danger);
  transform: none;
  box-shadow: 
    inset 0 0 50px rgba(255, 0, 0, 0.2),
    0 0 30px rgba(255, 50, 50, 0.4),
    0 0 60px rgba(255, 0, 0, 0.2);
}

@keyframes danger-pulse {
  0%, 100% { border-color: var(--c-primary); }
  50% { border-color: var(--c-danger); }
}

@keyframes violent-shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-2px, 0, 0); }
  40%, 60% { transform: translate3d(2px, 0, 0); }
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: var(--c-primary);
  opacity: 0;
  filter: blur(15px);
  transition: opacity 0.3s;
  z-index: -1;
}

.arsenal-card:hover .card-glow {
  opacity: 0.3;
}

.card-frame {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Corner Brackets */
.corner {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid var(--c-primary);
  opacity: 0.5;
  transition: all 0.3s;
}

.corner.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
.corner.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
.corner.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
.corner.br { bottom: 0; right: 0; border-left: none; border-top: none; }

.arsenal-card:hover .corner {
  width: 25px;
  height: 25px;
  opacity: 1;
}

/* ━━━━━━ Encrypted Layer ━━━━━━ */
.encrypted-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(10, 0, 0, 0.95);
  z-index: 5;
  overflow: hidden;
}

/* Encrypted Layer Warning Border */
.encrypted-layer::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  background: linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.3), transparent) border-box;
  animation: border-warning 2s linear infinite;
}

@keyframes border-warning {
  0% { opacity: 0.3; }
  50% { opacity: 0.8; }
  100% { opacity: 0.3; }
}

.noise-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  animation: noise-flicker 0.5s infinite;
}

@keyframes noise-flicker {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}

.lock-symbol {
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: lock-pulse 2s infinite;
}

@keyframes lock-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

.censor-bar {
  background: var(--c-primary);
  color: #000;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.id-tag {
  margin-top: 10px;
  font-size: 0.7rem;
  opacity: 0.5;
}

.decrypt-progress {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
}

.progress-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
  animation: decrypt-fill 0.4s linear forwards;
}

@keyframes decrypt-fill {
  from { width: 0; }
  to { width: 100%; }
}

.decrypt-text {
  font-size: 0.6rem;
  text-align: center;
  margin-top: 5px;
  opacity: 0.7;
  animation: blink 0.3s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.3; }
}

/* ━━━━━━ Card Content ━━━━━━ */
.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.item-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
}

.item-icon-bg {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, var(--c-glow) 0%, transparent 70%);
  opacity: 0.3;
}

.item-icon {
  font-size: 3rem;
  z-index: 1;
}

.item-info {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
  width: 100%;
  text-align: center;
}

.item-header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.7rem;
  opacity: 0.6;
  margin-bottom: 5px;
}

.item-name {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  margin: 0 0 5px 0;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
}

.item-price {
  text-align: center;
  color: var(--c-primary);
}

.price-value {
  font-size: 1.3rem;
  font-weight: bold;
}

.price-unit {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* ━━━━━━ Hologram Overlay ━━━━━━ */
.hologram-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5, 10, 15, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 20px;
  text-align: center;
  z-index: 20;
}

.market-tactical-map.market .hologram-overlay {
  background: rgba(15, 0, 25, 0.98);
}

.arsenal-card:hover .hologram-overlay {
  opacity: 1;
}

.holo-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--c-primary);
  opacity: 0.5;
  animation: holo-scan 1s linear infinite;
}

@keyframes holo-scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.holo-content {
  position: relative;
  z-index: 2;
}

.holo-desc {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Noto Sans KR', sans-serif;
}

.holo-action {
  display: inline-block;
  border: 2px solid var(--c-primary);
  padding: 8px 20px;
  color: var(--c-primary);
  font-weight: bold;
  letter-spacing: 2px;
  transition: all 0.2s;
}

.holo-action:hover {
  background: var(--c-primary);
  color: #000;
}

.holo-glitch {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 255, 255, 0.02) 50%,
    transparent 100%
  );
  animation: glitch-move 3s linear infinite;
  pointer-events: none;
}

.market-tactical-map.market .holo-glitch {
  background: linear-gradient(
    transparent 0%,
    rgba(179, 136, 255, 0.03) 50%,
    transparent 100%
  );
}

@keyframes glitch-move {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* ━━━━━━ Grid Transition ━━━━━━ */
.grid-switch-enter-active,
.grid-switch-leave-active {
  transition: all 0.4s ease;
}

.grid-switch-enter-from {
  opacity: 0;
  transform: scale(0.9) rotateY(10deg);
}

.grid-switch-leave-to {
  opacity: 0;
  transform: scale(1.1) rotateY(-10deg);
}

/* ━━━━━━ Feedback Toast ━━━━━━ */
.feedback-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--c-primary);
  color: #000;
  padding: 15px 30px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 0 30px var(--c-glow);
}

.toast-icon {
  font-size: 1.2rem;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  border-top: 1px solid rgba(255, 255, 255, 0.05);
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  border-bottom: 1px solid var(--c-primary);
  background: rgba(255, 255, 255, 0.03);
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
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
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
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
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
  background: radial-gradient(circle, var(--c-glow) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-label {
  font-size: 0.75rem;
  font-family: 'Noto Sans KR', sans-serif;
}

.btn-sublabel {
  font-size: 0.5rem;
  opacity: 0.5;
  letter-spacing: 1px;
}

.rail-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.rail-btn:hover .btn-slot {
  border-color: var(--c-primary);
  box-shadow: 0 0 15px var(--c-glow);
}

.rail-btn:hover .btn-glow {
  opacity: 0.5;
}

.rail-btn.active {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--c-primary);
  color: #fff;
}

.market-tactical-map.market .rail-btn.active {
  background: rgba(255, 50, 50, 0.15);
  color: #ffffff;
}

.market-tactical-map.market .rail-btn {
  color: rgba(255, 200, 200, 0.5);
}

.market-tactical-map.market .rail-btn:hover {
  color: #ffffff;
  border-color: var(--c-primary);
}

.rail-btn.active .btn-slot {
  border-color: var(--c-primary);
  box-shadow: 0 0 20px var(--c-glow);
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.rail-indicator {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--c-secondary), var(--c-primary));
  box-shadow: 0 0 10px var(--c-glow);
  animation: indicator-scan 3s ease-in-out infinite;
}

@keyframes indicator-scan {
  0%, 100% { width: 20px; opacity: 0.5; }
  50% { width: 50px; opacity: 1; }
}

.rail-version {
  font-size: 0.6rem;
  opacity: 0.4;
}

/* ━━━━━━ Connection Info ━━━━━━ */
.connection-info {
  position: fixed;
  bottom: 55px;
  left: 115px;
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  z-index: 200;
  padding: 0.3rem 0;
}

.conn-status {
  color: #00ff88;
}

/* Module switching (Content only) */
.market-tactical-map.is-switching .arsenal-grid-wrapper,
.market-tactical-map.is-switching .tab-switch-panel,
.market-tactical-map.is-switching .grid-floor,
.market-tactical-map.is-switching .cinema-bar,
.market-tactical-map.is-switching .bg-overlay,
.market-tactical-map.is-switching .scan-line,
.market-tactical-map.is-switching .vignette-overlay {
  animation: fade-out 0.5s ease-out forwards;
}

.market-tactical-map.is-switching .command-rail,
.market-tactical-map.is-switching .info-rail {
  opacity: 1 !important;
  transform: translateX(0) !important;
  animation: none !important;
  z-index: 500;
}

@keyframes fade-out {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* ━━━━━━ Exit Animation ━━━━━━ */
.market-tactical-map.is-exiting .arsenal-card {
  animation: card-fold-out 0.5s ease-in forwards;
}

@keyframes card-fold-out {
  to {
    opacity: 0;
    transform: scale(0.8) rotateX(45deg);
  }
}

.market-tactical-map.is-exiting .command-rail {
  animation: slide-out-left 0.5s ease-in 0.2s forwards;
}

@keyframes slide-out-left {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.market-tactical-map.is-exiting .info-rail {
  animation: slide-out-right 0.5s ease-in 0.2s forwards;
}

@keyframes slide-out-right {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.market-tactical-map.is-exiting .tab-switch-panel {
  animation: fade-out-up 0.4s ease-in forwards;
}

@keyframes fade-out-up {
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px);
  }
}

/* Sidebar entrance animation (only from home) */
.market-tactical-map.from-home .command-rail {
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

  .arsenal-grid-wrapper {
    grid-template-columns: 1fr; /* Single column */
    grid-template-rows: auto;
    width: 95%;
    padding: 10px 0;
    margin-top: 60px; /* Space for tabs */
    height: auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  /* Reset grid areas for arsenal items */
  .arsenal-item {
    grid-area: auto !important;
    height: auto;
    min-height: 150px;
    width: 100%;
  }

  .item-lg {
    height: auto;
    min-height: 300px;
  }

  /* Adjust Tab Switch Panel */
  .tab-switch-panel {
    top: 10px;
    width: 90%;
    height: 40px;
  }
}
</style>


<style scoped>
/* --- Mobile Only Styles --- */
@media (max-width: 768px) {
  .mobile-market-view { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #0a0f0a; color: #50ff50; overflow-y: auto; padding: 20px 20px 80px 20px; z-index: 2000; font-family: monospace; }
  .m-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px dashed #353; }
  .m-title { font-size: 1.4rem; color: #afffaf; }
  .m-credits { font-size: 1.1rem; color: #ffd700; }
  .m-category-tabs { display: flex; gap: 5px; overflow-x: auto; padding: 15px 0; }
  .m-tab { padding: 5px 10px; border: 1px solid #353; color: #595; white-space: nowrap; margin-right: 5px; }
  .m-tab.active { background: #131; color: #fff; border-color: #5f5; }
  .m-item-list { display: flex; flex-direction: column; gap: 15px; }
  .m-item { display: flex; justify-content: space-between; align-items: center; background: #0f150f; padding: 10px; border: 1px solid #242; }
  .m-item-details { flex: 1; margin-right: 10px; }
  .m-name { font-weight: bold; color: #fff; display: block; }
  .m-type { font-size: 0.8rem; color: #7a7; }
  .m-price { color: #ffd700; font-weight: bold; }
}
</style>
