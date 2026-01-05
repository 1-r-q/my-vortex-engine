<template>
  <div class="world-tactical-map" :class="{ 'is-exiting': isExiting, 'is-switching': isSwitching, 'from-home': fromHome }" ref="mapContainer">
    <!-- 3D Perspective Grid Floor -->
    <div class="grid-floor">
      <div class="grid-lines"></div>
    </div>
    
    <!-- Cinematic Letterbox Bars -->
    <div class="cinema-bar cinema-bar-top">
      <div class="ticker-wrap">
        <div class="ticker">
          <span>◆ VORTEX WORLD MAP SYSTEM v2.1.0 ◆ STRATUM SCAN ACTIVE ◆ STRUCTURE INTEGRITY: 97.2% ◆ DEPTH: VARIABLE ◆ PRESSURE: CRITICAL ◆ CLEARANCE: LEVEL-5 ◆ GEOMAP: SYNCHRONIZED ◆</span>
          <span>◆ VORTEX WORLD MAP SYSTEM v2.1.0 ◆ STRATUM SCAN ACTIVE ◆ STRUCTURE INTEGRITY: 97.2% ◆ DEPTH: VARIABLE ◆ PRESSURE: CRITICAL ◆ CLEARANCE: LEVEL-5 ◆ GEOMAP: SYNCHRONIZED ◆</span>
        </div>
      </div>
    </div>
    <div class="cinema-bar cinema-bar-bottom">
      <div class="ticker-wrap">
        <div class="ticker ticker-reverse">
          <span>▶ UPPER: 상층부 ▶ MIDDLE: 중층부 ▶ LOWER: 하층부 ▶ SURFACE: 지상 ▶ CORE: 기어 코어 ▶ STATUS: MONITORING ▶ ALERT: LOW ▶</span>
          <span>▶ UPPER: 상층부 ▶ MIDDLE: 중층부 ▶ LOWER: 하층부 ▶ SURFACE: 지상 ▶ CORE: 기어 코어 ▶ STATUS: MONITORING ▶ ALERT: LOW ▶</span>
        </div>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="bg-overlay"></div>
    <div class="atmospheric-bg"></div>
    <div class="bg-image" :style="{ backgroundImage: `url(${withBase('/images/Scene/0.png')})` }"></div>
    <div class="scan-line"></div>
    
    <!-- Tactical Map Background Layer -->
    <div class="tactical-bg">
      <!-- Topographic Contour Lines -->
      <svg class="contour-layer" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="contourGlow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <linearGradient id="grad-upper" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#00f0ff" stop-opacity="0.1" />
          </linearGradient>
          <linearGradient id="grad-middle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff8800" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#ff8800" stop-opacity="0.1" />
          </linearGradient>
          <linearGradient id="grad-lower" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#a020f0" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#a020f0" stop-opacity="0.1" />
          </linearGradient>
          <linearGradient id="grad-surface" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#39ff14" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#39ff14" stop-opacity="0.1" />
          </linearGradient>
        </defs>
        <g class="contour-lines" filter="url(#contourGlow)">
          <path d="M-100,200 Q300,150 500,280 T900,200 T1300,320 T1700,180 T2100,300" fill="none" stroke="rgba(255,176,0,0.08)" stroke-width="1"/>
          <path d="M-100,350 Q250,300 450,400 T850,320 T1250,450 T1650,350 T2100,420" fill="none" stroke="rgba(255,176,0,0.06)" stroke-width="1"/>
          <path d="M-100,500 Q350,450 550,550 T950,480 T1350,600 T1750,500 T2100,580" fill="none" stroke="rgba(255,176,0,0.07)" stroke-width="1"/>
          <path d="M-100,650 Q200,600 400,700 T800,620 T1200,750 T1600,650 T2100,720" fill="none" stroke="rgba(255,176,0,0.05)" stroke-width="1"/>
        </g>
      </svg>
      
      <!-- Sonar Rings -->
      <div class="sonar-rings">
        <div class="sonar-ring ring-1"></div>
        <div class="sonar-ring ring-2"></div>
        <div class="sonar-ring ring-3"></div>
      </div>
      
      <!-- Radar Sweep -->
      <div class="radar-sweep"></div>
    </div>
    
    <!-- HUD Scope Frame -->
    <div class="scope-frame">
      <div class="scope-corner scope-tl">⌜</div>
      <div class="scope-corner scope-tr">⌝</div>
      <div class="scope-corner scope-bl">⌞</div>
      <div class="scope-corner scope-br">⌟</div>
    </div>
    
    <!-- CRT Overlay -->
    <div class="crt-overlay"></div>
    <div class="vignette-overlay"></div>

    <!-- Main Content: Spire & Wings -->
    <div class="world-content spire-layout" :class="{ 'zoom-active': detailZone !== null }">
      
      <!-- Center Spire (The Tower) -->
      <div class="center-spire" :class="{ 'spire-enter': showSpire }">
        <div class="spire-shaft">
          <div class="shaft-pattern"></div>
          <div class="energy-flow"></div>
        </div>
        
        <!-- Altitude Markers -->
        <div class="altitude-markers left">
          <div class="alt-mark" style="top: 20%"><span>5000m</span></div>
          <div class="alt-mark" style="top: 10%"><span>3000m</span></div>
          <div class="alt-mark" style="top: -5%"><span>1000m</span></div>
          <div class="alt-mark" style="top: -22%"><span>0m</span></div>
        </div>
        <div class="altitude-markers right">
          <div class="alt-mark" style="top: 20%"><span>UPPER</span></div>
          <div class="alt-mark" style="top: 10%"><span>MIDDLE</span></div>
          <div class="alt-mark" style="top: -5%"><span>LOWER</span></div>
          <div class="alt-mark" style="top: -22%"><span>GROUND</span></div>
        </div>

        <div class="spire-structure">
          <!-- Spire Segments -->
          <div 
            v-for="(zone, idx) in zones" 
            :key="'spire-' + idx"
            class="spire-segment"
            :class="{ 'active': selectedZone === idx }"
            :style="getSegmentStyle(idx)"
          >
            <div class="segment-glow"></div>
            <div class="segment-core"></div>
            <div class="segment-label">{{ zone.shortName }}</div>
          </div>
        </div>
      </div>

      <!-- Connection Lines (SVG) -->
      <svg class="connection-layer" :class="{ 'links-enter': showLinks }">
        <defs>
          <linearGradient id="grad-upper" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(0, 240, 255, 0)" />
            <stop offset="50%" stop-color="rgba(0, 240, 255, 1)" />
            <stop offset="100%" stop-color="rgba(0, 240, 255, 0)" />
          </linearGradient>
          <linearGradient id="grad-middle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 136, 0, 0)" />
            <stop offset="50%" stop-color="rgba(255, 136, 0, 1)" />
            <stop offset="100%" stop-color="rgba(255, 136, 0, 0)" />
          </linearGradient>
          <linearGradient id="grad-lower" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(160, 32, 240, 0)" />
            <stop offset="50%" stop-color="rgba(160, 32, 240, 1)" />
            <stop offset="100%" stop-color="rgba(160, 32, 240, 0)" />
          </linearGradient>
          <linearGradient id="grad-surface" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(57, 255, 20, 0)" />
            <stop offset="50%" stop-color="rgba(57, 255, 20, 1)" />
            <stop offset="100%" stop-color="rgba(57, 255, 20, 0)" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g v-for="(zone, idx) in zones" :key="'conn-' + idx">
          <path 
            v-if="visibleZones.includes(idx)"
            :d="getConnectionPath(idx)"
            class="connection-line"
            :class="{ 'active': selectedZone === idx }"
            fill="none"
            :stroke="getZoneGradient(idx)"
            stroke-width="4"
            filter="url(#lineGlow)"
          />
          <circle 
            v-if="visibleZones.includes(idx)"
            :cx="getConnectionEnd(idx).x" 
            :cy="getConnectionEnd(idx).y" 
            r="5" 
            :fill="zone.themeColor"
          />
        </g>
      </svg>

      <!-- Wing Cards -->
      <div class="wings-container" :class="{ 'modules-enter': showModules }">
        <div 
          v-for="(zone, idx) in zones" 
          :key="idx"
          class="wing-card-wrapper"
          :class="[getWingPositionClass(idx), { 'card-blur': detailZone !== null && detailZone !== idx, 'card-focused': detailZone === idx }]"
          @mouseenter="selectedZone = idx"
          @mouseleave="selectedZone = null"
          @click="openDetail(idx)"
        >
          <Transition name="card-pop">
            <article 
              v-if="visibleZones.includes(idx)"
              class="wing-card"
              :class="{ 'card-active': selectedZone === idx }"
              :style="{ '--theme-color': zone.themeColor }"
            >
              <div class="card-glass-bg"></div>
              <div class="card-scanline"></div>
              
              <!-- Frame & Brackets -->
              <div class="card-frame">
                <div class="bracket tl"></div><div class="bracket tr"></div>
                <div class="bracket bl"></div><div class="bracket br"></div>
              </div>
              
              <!-- Background Pattern -->
              <div class="card-bg-pattern"></div>

              <div class="card-grid">
                <!-- Left: Identity -->
                <div class="card-col-left">
                  <div class="zone-icon-wrapper">
                    <span class="zone-icon">{{ zone.icon }}</span>
                  </div>
                  <div class="zone-id">{{ zone.badge }}</div>
                  <div class="zone-rank">RANK A</div>
                </div>

                <!-- Right: Data -->
                <div class="card-col-right">
                  <h2 class="zone-title">{{ zone.name }}</h2>
                  <p class="zone-desc">{{ zone.subtitle }}</p>
                  
                  <!-- Data Bars -->
                  <div class="data-bars">
                    <div class="data-row">
                      <span class="data-label">DEPTH</span>
                      <div class="progress-track">
                        <div class="progress-fill" :style="{ width: '75%', background: zone.color }"></div>
                      </div>
                      <span class="data-value">{{ zone.depth }}</span>
                    </div>
                    <div class="data-row">
                      <span class="data-label">TEMP</span>
                      <div class="progress-track">
                        <div class="progress-fill" :style="{ width: '60%', background: zone.color }"></div>
                      </div>
                      <span class="data-value">{{ zone.temperature }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Transition>
        </div>
      </div>

    </div>

    <!-- Detail Panel Overlay -->
    <Transition name="panel-slide">
      <div class="detail-panel-overlay" v-if="detailZone !== null" @click.self="closeDetail">
        <div class="detail-panel">
          <div class="panel-header">
            <div class="panel-title-area">
              <span class="panel-badge">{{ zones[detailZone].badge }}</span>
              <h2 class="panel-title">{{ zones[detailZone].name }}</h2>
            </div>
            <button class="panel-close" @click="closeDetail">✕</button>
          </div>
          
          <div class="panel-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">깊이</span>
                <span class="info-value">{{ zones[detailZone].depth }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">압력</span>
                <span class="info-value">{{ zones[detailZone].pressure }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">온도</span>
                <span class="info-value">{{ zones[detailZone].temperature }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">상태</span>
                <span class="info-value" :class="zones[detailZone].statusClass">{{ zones[detailZone].status }}</span>
              </div>
            </div>
            
            <div class="description-area">
              <p>{{ zones[detailZone].description }}</p>
            </div>
            
            <div class="features-list">
              <div class="feature-item" v-for="(feature, idx) in zones[detailZone].features" :key="idx">
                <span class="feature-bullet">▸</span>
                <span class="feature-text">{{ feature }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Right Vertical Info Rail -->
    <div class="info-rail">
      <button class="rail-exit-btn" @click="handleClose" :disabled="isExiting">
        <span class="exit-slot">
          <span class="exit-icon">⏏</span>
          <span class="exit-glow"></span>
        </span>
        <span class="exit-label">복귀</span>
        <span class="exit-sublabel">EJECT</span>
      </button>
      
      <div class="rail-monitor">
        <div class="monitor-header">
          <span class="monitor-logo">◈</span>
          <span class="monitor-title">SENSORS</span>
        </div>
        
        <div class="sensor-grid">
          <div class="sensor-item">
            <div class="sensor-track">
              <div class="sensor-fill" :style="{ height: envData.temp + '%' }"></div>
            </div>
            <span class="sensor-label">TEMP</span>
          </div>
          <div class="sensor-item">
            <div class="sensor-track">
              <div class="sensor-fill" :style="{ height: envData.toxin + '%' }"></div>
            </div>
            <span class="sensor-label">TOXIN</span>
          </div>
          <div class="sensor-item">
            <div class="sensor-track">
              <div class="sensor-fill" :style="{ height: envData.wind + '%' }"></div>
            </div>
            <span class="sensor-label">WIND</span>
          </div>
          <div class="sensor-item">
            <div class="sensor-track">
              <div class="sensor-fill" :style="{ height: envData.pressure + '%' }"></div>
            </div>
            <span class="sensor-label">PRES</span>
          </div>
        </div>
      </div>
      
      <div class="rail-footer">
        <div class="rail-led led-green"></div>
        <span class="rail-id">v2.1</span>
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
        <button class="rail-btn active">
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
          <div class="volume-label">BGM VOL</div>
          <div class="volume-slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              v-model="ambientVolume"
              class="rail-slider"
            />
            <div class="rail-slider-fill" :style="{ width: (ambientVolume * 100) + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="rail-footer">
        <div class="rail-indicator"></div>
        <span class="rail-version">v2.1</span>
      </div>
    </nav>

    <!-- Connection Info -->
    <div class="connection-info">
      <span class="conn-status">● CONNECTED</span>
      <span class="conn-node">WORLD NODE: STRATUM-CORE</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, withBase } from 'vitepress';
import { usePageTransition } from '../../transitionState';
import { useSteamSound } from '../../composables/useSteamSound';

const emit = defineEmits(['close', 'openHistory', 'openMarket', 'openCharacters', 'openSystem']);
const router = useRouter();
const { startTransition } = usePageTransition();
const { playHover, playClick, playCardSelect, playCardFlip, playBack, playTransition, categoryVolumes, setCategoryVolume } = useSteamSound();

const ambientVolume = computed({
  get: () => categoryVolumes.ambient,
  set: (val) => setCategoryVolume('ambient', val)
});

// State
const mapContainer = ref(null);
const isExiting = ref(false);
const isSwitching = ref(false);
const selectedZone = ref(null); // For hover highlight
const detailZone = ref(null); // For click detail
const visibleZones = ref([]);
const currentTime = ref('00:00:00');
const animatedPercent = ref(75);
const fromHome = ref(false); // Track if coming from home

// Check if navigation is from home or another TacticalMap
const checkNavigationSource = () => {
  if (typeof window !== 'undefined') {
    const lastPage = sessionStorage.getItem('vortex-last-page');
    // If coming from home (index) or first visit, show entrance animation
    fromHome.value = !lastPage || lastPage === 'home' || lastPage === 'index';
    // Mark current page
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

// Cinematic Entrance State
const showSpire = ref(false);
const showLinks = ref(false);
const showModules = ref(false);

// Environmental Sensors
const envData = reactive({
  temp: 45,
  toxin: 12,
  wind: 68,
  pressure: 82
});

const dimensions = reactive({
  width: 1920,
  height: 1080
});

// Zone Data
const zones = [
  {
    name: '상층부',
    shortName: 'UPPER',
    subtitle: 'The Needle',
    badge: 'ZONE-01',
    depth: '3,000m ▲',
    pressure: '0.9 atm',
    temperature: '18°C ~ 24°C',
    status: '청정',
    statusClass: 'status-stable',
    themeColor: '#00f0ff',
    icon: '👑',
    description: '구름을 뚫고 솟아오른 백색 대리석과 황금의 도시. 황실과 고위 귀족들이 거주하며, 부유석 코어의 에너지를 가장 먼저 공급받는 풍요의 땅이다. 이곳에서 오토마톤은 노동자가 아닌 \'예술품\'으로 취급된다.',
    features: ['👑 황실 태엽 평의회', '🪽 청동 날개 귀족원', '☁️ 스카이 도크', '🏛️ 대성당']
  },
  {
    name: '중층부',
    shortName: 'MIDDLE',
    subtitle: 'The Flywheel',
    badge: 'ZONE-02',
    depth: '1,000m ~ 3,000m',
    pressure: '1.5 atm',
    temperature: '15°C ~ 60°C',
    status: '과열',
    statusClass: 'status-busy',
    themeColor: '#ff8800',
    icon: '🏭',
    description: '수천 개의 거대 톱니바퀴와 붉은 벽돌 공장이 빽빽하게 들어선 산업 지구. 매연과 소음이 끊이지 않으며, 인간 노동자와 오토마톤이 뒤섞여 제국의 모든 물자를 생산한다. 가장 활기차지만 가장 억압적인 곳.',
    features: ['🏭 왕립 기계창', '🛡️ 표준 계측 보안국', '💰 황금 밸브 상회', '✊ 철의 파동 지부', '⚙️ 은빛 톱니 연대']
  },
  {
    name: '하층부',
    shortName: 'LOWER',
    subtitle: 'The Drill',
    badge: 'ZONE-03',
    depth: '100m ~ 1,000m',
    pressure: '불안정',
    temperature: '10°C ~ 30°C',
    status: '부식',
    statusClass: 'status-unstable',
    themeColor: '#a020f0',
    icon: '🛢️',
    description: '상층과 중층에서 버려진 쓰레기와 오일이 흘러드는 빈민가. 법의 손길이 닿지 않는 무법지대이며, 스크래퍼와 암시장 상인들이 고철을 두고 다투는 생존의 현장이다.',
    features: ['🛢️ 검은 오일 상단', '☣️ 혼종 정비소', '🏚️ 폐기물 처리장', '🪜 하수 배관']
  },
  {
    name: '지상',
    shortName: 'GROUND',
    subtitle: 'The Rust Sea',
    badge: 'ZONE-04',
    depth: '0m (Ground Zero)',
    pressure: '치명적',
    temperature: '예측불가',
    status: '죽음',
    statusClass: 'status-danger',
    themeColor: '#39ff14',
    icon: '☠️',
    description: '과거의 전쟁으로 인해 산성 안개와 녹으로 뒤덮인 죽음의 대지. 유기체는 숨을 쉬는 즉시 폐가 녹아내리며, 오직 특수 코팅된 기계만이 이곳을 밟을 수 있다. 고대 문명의 유산(Over-Tech)이 잠들어 있다.',
    features: ['⚔️ 적녹의 기사단 요새', '🧭 순례자의 길', '🏗️ 거신병의 잔해', '☁️ 산성 안개 지대']
  }
];

// Layout Logic
// Altitude markers: 20%, 10%, -5%, -22%
const spirePcts = [0.12, 0.18, 0.27, 0.34];

const getSpireY = (idx) => {
  // Calculate pixel position relative to .world-content
  // Spire is height: 250vh, top: -4vh
  const h = dimensions.height * 2.5;
  const t = dimensions.height * -0.04;
  return t + (h * spirePcts[idx]);
};

// Altitude markers top 값과 일치시킴
const altitudeMarkerTops = ['37.5%', '47.5%', '62.5%', '74%'];

const getSegmentStyle = (idx) => {
  return {
    position: 'absolute',
    top: altitudeMarkerTops[idx],
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '--segment-color': zones[idx].themeColor
  };
};

const getWingPositionClass = (idx) => {
  // 0: Top-Left, 1: Top-Right, 2: Bottom-Left, 3: Bottom-Right
  const positions = ['pos-tl', 'pos-tr', 'pos-bl', 'pos-br'];
  return positions[idx];
};

const getConnectionPath = (idx) => {
  // Calculate path from Spire Segment to Card
  const centerX = dimensions.width / 2;
  
  const sy = getSpireY(idx);
  const ey = sy; // Horizontal line

  // Card connection points
  const cardX = [centerX - 70, centerX + 70, centerX - 70, centerX + 70];
  
  const ex = cardX[idx];
  
  // For docked look, we want the line to connect the shaft center to the card edge.
  const shaftHalfWidth = 50;
  const startX = idx % 2 === 0 ? centerX - shaftHalfWidth : centerX + shaftHalfWidth;
  
  return `M ${startX} ${sy} L ${ex} ${ey}`;
};

const getConnectionEnd = (idx) => {
  const centerX = dimensions.width / 2;
  const cardX = [centerX - 70, centerX + 70, centerX - 70, centerX + 70];
  return { x: cardX[idx], y: getSpireY(idx) };
};

const getZoneGradient = (idx) => {
  const gradients = ['url(#grad-upper)', 'url(#grad-middle)', 'url(#grad-lower)', 'url(#grad-surface)'];
  return gradients[idx];
};

// Methods
const openDetail = (idx) => {
  playCardSelect();
  detailZone.value = idx;
};

const closeDetail = () => {
  playBack();
  detailZone.value = null;
};

const handleClose = () => {
  if (isExiting.value || isSwitching.value) return;
  playTransition();
  isExiting.value = true;
  // Mark that we're going back to home
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'home');
  }
  // Wait for exit animation: cards (0.3s) -> spire (0.5s) -> sidebars (0.4s)
  setTimeout(() => {
    router.go(withBase('/index.html'));
  }, 1200);
};

const navigateTo = (path) => {
  if (isExiting.value) return;
  playTransition();
  isExiting.value = true;
  setTimeout(() => {
    router.go(path);
  }, 1200);
};

const updateDimensions = () => {
  if (mapContainer.value) {
    const rect = mapContainer.value.getBoundingClientRect();
    dimensions.width = rect.width || window.innerWidth;
    dimensions.height = rect.height || window.innerHeight;
  }
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('ko-KR', { hour12: false });
};

// Lifecycle
let timeInterval;
let sensorInterval;

onMounted(() => {
  // Check navigation source first
  checkNavigationSource();
  
  updateDimensions();
  window.addEventListener('resize', updateDimensions);
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  // Cinematic Entrance Sequence
  setTimeout(() => { showSpire.value = true; }, 500);
  setTimeout(() => { showLinks.value = true; }, 1200);
  setTimeout(() => { 
    showModules.value = true; 
    // Sequentially reveal zones
    zones.forEach((_, idx) => {
      setTimeout(() => {
        visibleZones.value.push(idx);
      }, idx * 150);
    });
  }, 1400);

  // Sensor Animation Loop
  sensorInterval = setInterval(() => {
    envData.temp = Math.max(0, Math.min(100, envData.temp + (Math.random() - 0.5) * 10));
    envData.toxin = Math.max(0, Math.min(100, envData.toxin + (Math.random() - 0.5) * 5));
    envData.wind = Math.max(0, Math.min(100, envData.wind + (Math.random() - 0.5) * 15));
    envData.pressure = Math.max(0, Math.min(100, envData.pressure + (Math.random() - 0.5) * 8));
    
    animatedPercent.value = 70 + Math.random() * 25;
  }, 200);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions);
  if (timeInterval) clearInterval(timeInterval);
  if (sensorInterval) clearInterval(sensorInterval);
});
</script>

<style scoped>
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* WORLD TACTICAL MAP - Base Styles                       */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.world-tactical-map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050505;
  overflow: hidden;
  font-family: 'Share Tech Mono', 'Consolas', monospace;
  color: #ffb000;
  z-index: 1000;
}

/* ━━━━━━ Grid Floor ━━━━━━ */
.grid-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  perspective: 500px;
  overflow: hidden;
  opacity: 0.3;
  pointer-events: none;
}

.grid-lines {
  position: absolute;
  width: 200%;
  height: 200%;
  left: -50%;
  top: 0;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: rotateX(65deg);
  animation: grid-scroll 20s linear infinite;
}

@keyframes grid-scroll {
  0% { transform: rotateX(65deg) translateY(0); }
  100% { transform: rotateX(65deg) translateY(60px); }
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
  border-bottom: 2px solid #ffb000;
  box-shadow: 0 2px 20px rgba(255, 176, 0, 0.3);
}

.cinema-bar-bottom {
  bottom: 0;
  border-top: 2px solid #ffb000;
  box-shadow: 0 -2px 20px rgba(255, 176, 0, 0.3);
}

.ticker-wrap {
  width: 100%;
  overflow: hidden;
}

.ticker {
  display: flex;
  white-space: nowrap;
  animation: ticker-scroll 30s linear infinite;
  font-size: 11px;
  color: #ffb000;
  opacity: 0.7;
  letter-spacing: 1px;
}

.ticker span {
  padding-right: 50px;
}

.ticker-reverse {
  animation-direction: reverse;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ━━━━━━ Background Effects ━━━━━━ */
.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
  z-index: 2;
}

.atmospheric-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, 
    rgba(0, 40, 80, 0.4) 0%,      /* Deep Blue/Gold (Stratosphere) */
    rgba(180, 100, 0, 0.3) 40%,   /* Orange/Brown (Smog) */
    rgba(80, 0, 120, 0.3) 70%,    /* Purple/Neon (Cyberpunk) */
    rgba(20, 80, 20, 0.4) 100%    /* Toxic Green (Pollution) */
  );
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 1;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-size: 90%;
  background-repeat: no-repeat;
  background-position: center calc(50% + 60px);
  opacity: 0.4;
  mix-blend-mode: normal;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.5s ease-out, filter 0.5s ease-out;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255,176,0,0.4), transparent);
  animation: scan 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 50;
}

@keyframes scan {
  0%, 100% { top: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; }
}

/* ━━━━━━ Tactical Background ━━━━━━ */
.tactical-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.contour-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.sonar-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sonar-ring {
  position: absolute;
  border: 1px solid rgba(255, 176, 0, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 { width: 200px; height: 200px; }
.ring-2 { width: 350px; height: 350px; }
.ring-3 { width: 500px; height: 500px; }

.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 176, 0, 0.15) 30deg, transparent 60deg);
  border-radius: 50%;
  animation: radar-spin 6s linear infinite;
  pointer-events: none;
}

@keyframes radar-spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ━━━━━━ Scope Frame ━━━━━━ */
.scope-frame {
  position: absolute;
  inset: 40px;
  pointer-events: none;
  z-index: 10;
}

.scope-corner {
  position: absolute;
  font-size: 28px;
  color: rgba(255, 176, 0, 0.5);
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.3);
}

.scope-tl { top: 0; left: 0; }
.scope-tr { top: 0; right: 0; }
.scope-bl { bottom: 0; left: 0; }
.scope-br { bottom: 0; right: 0; }

/* ━━━━━━ CRT Overlay ━━━━━━ */
.crt-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  z-index: 90;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%);
  pointer-events: none;
  z-index: 91;
}

/* ━━━━━━ Main Content: Spire Layout ━━━━━━ */
.world-content {
  position: absolute;
  inset: 28px 0;
  z-index: 10;
}

.spire-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transform: scale(0.85);
  transform-origin: center center;
}

/* ━━━━━━ Central Spire ━━━━━━ */
.center-spire {
  position: absolute;
  left: 50%;
  top: -30vh;
  bottom: auto;
  height: 250vh;
  width: 100px;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.spire-shaft {
  width: 100%;
  height: 100%;
  background: rgba(10, 15, 20, 0.95);
  border-left: 4px solid rgba(60, 60, 70, 0.8);
  border-right: 4px solid rgba(60, 60, 70, 0.8);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
}

.shaft-pattern {
  position: absolute;
  inset: 0;
  /* Truss Structure Pattern */
  background-image: 
    linear-gradient(0deg, transparent 48%, rgba(100, 100, 100, 0.3) 49%, rgba(100, 100, 100, 0.3) 51%, transparent 52%),
    linear-gradient(45deg, transparent 48%, rgba(60, 60, 60, 0.2) 49%, rgba(60, 60, 60, 0.2) 51%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(60, 60, 60, 0.2) 49%, rgba(60, 60, 60, 0.2) 51%, transparent 52%);
  background-size: 100% 60px;
}

.energy-flow {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(0, 255, 255, 0.05) 40%, 
    rgba(0, 255, 255, 0.2) 50%, 
    rgba(0, 255, 255, 0.05) 60%, 
    transparent 100%
  );
  background-size: 100% 300%;
  animation: flow 4s linear infinite;
  mix-blend-mode: screen;
}

@keyframes flow {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}

.altitude-markers {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 0;
  pointer-events: none;
}

.altitude-markers.left {
  right: 100%;
  margin-right: 5px;
  align-items: flex-end;
  border-right: 2px solid rgba(255, 176, 0, 0.3);
}

.altitude-markers.right {
  left: 100%;
  margin-left: 5px;
  align-items: flex-start;
  border-left: 2px solid rgba(255, 176, 0, 0.3);
}

.alt-mark {
  color: rgba(255, 176, 0, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  padding: 0 10px;
  height: 20px;
  line-height: 20px;
}

.altitude-markers.left .alt-mark::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 8px;
  height: 2px;
  background: rgba(255, 176, 0, 0.8);
}

.altitude-markers.right .alt-mark::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 8px;
  height: 2px;
  background: rgba(255, 176, 0, 0.8);
}

.spire-structure {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ━━━━━━ Zone Nodes ━━━━━━ */

.spire-segment {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.segment-core {
  width: 12px;
  height: 12px;
  background: #333;
  border: 2px solid rgba(255, 176, 0, 0.5);
  transform: rotate(45deg);
  transition: all 0.3s ease;
}

.segment-glow {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 176, 0, 0.2);
  transform: rotate(45deg);
  opacity: 0;
  transition: all 0.3s ease;
}

.spire-segment.active .segment-core {
  background: #ffb000;
  box-shadow: 0 0 15px #ffb000;
  border-color: #fff;
}

.spire-segment.active .segment-glow {
  opacity: 1;
  transform: rotate(45deg) scale(1.2);
  border-color: #ffb000;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.3);
}

.segment-label {
  position: absolute;
  
  /* [수정] 가로 중앙 정렬 핵심 로직 */
  left: 50%;
  transform: translate(-50%, -50%); /* 자신의 너비/높이 절반만큼 이동하여 정중앙 맞춤 */
  
  /* [수정] 세로 위치 (박스 내부 정중앙을 원하면 50%, 하단 배치를 원하면 80% 유지) */
  top: 80%; 
  
  /* 스타일 유지 */
  font-size: 10px;
  color: rgba(255, 176, 0, 0.5);
  letter-spacing: 2px;
  white-space: nowrap;
  opacity: 0.5;
  transition: all 0.3s ease;
  text-align: center; /* 텍스트 자체도 가운데 정렬 */
  pointer-events: none; /* 클릭 방해 금지 */
}

.spire-segment.active .segment-label {
  color: #ffb000;
  opacity: 1;
  text-shadow: 0 0 5px #ffb000;
}

/* Connection Lines */
.connection-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
}

.connection-line {
  opacity: 0.6;
  transition: all 0.3s ease;
  fill: none;
}

.connection-line.active {
  opacity: 1;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.5));
}

/* Wing Cards */
.wings-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.wing-card-wrapper {
  position: absolute;
  width: 530px;
  height: 280px;
  pointer-events: auto;
  cursor: pointer;
}

/* Positioning - Docked closer to shaft */
.pos-tl { 
  top: 50%; 
  left: 50%; 
  margin-left: -700px; 
  margin-top: -380px;
}
.pos-tr { 
  top: 50%; 
  left: 50%; 
  margin-left: 170px; 
  margin-top: -240px; 
}
.pos-bl { 
  top: 50%; 
  left: 50%; 
  margin-left: -700px; 
  margin-top: -20px; 
}
.pos-br { 
  top: 50%; 
  left: 50%; 
  margin-left: 170px; 
  margin-top: 140px; 
}

.wing-card {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  background: rgba(10, 12, 15, 0.95);
  border: 1px solid var(--theme-color, #ffb000);
  box-shadow: 0 0 15px rgba(var(--theme-color), 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.wing-card:hover, .wing-card.card-active {
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(var(--theme-color), 0.3);
  z-index: 100;
}

/* Frame & Brackets */
.card-frame {
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.bracket {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--theme-color);
  transition: all 0.3s ease;
}

.bracket.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.bracket.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.bracket.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.bracket.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

.wing-card:hover .bracket {
  width: 15px;
  height: 15px;
  box-shadow: 0 0 5px var(--theme-color);
}

/* Background Pattern */
.card-bg-pattern {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.02) 10px,
    rgba(255, 255, 255, 0.02) 11px
  );
  z-index: 0;
}

/* Grid Layout */
.card-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* Left Column: Identity */
.card-col-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  padding: 15px;
  gap: 10px;
}

.zone-icon-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-color);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(var(--theme-color), 0.2);
  background: rgba(0, 0, 0, 0.5);
}

.zone-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}

.zone-id {
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  color: var(--theme-color);
  letter-spacing: 1px;
  font-weight: bold;
}

.zone-rank {
  font-size: 10px;
  background: var(--theme-color);
  color: #000;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: bold;
}

/* Right Column: Data */
.card-col-right {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.zone-title {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 2.4rem;
  color: var(--theme-color);
  margin: 0 0 5px 0;
  text-shadow: 0 0 2px #000, 0 0 5px var(--theme-color);
  line-height: 1.2;
}

.zone-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 20px 0;
  line-height: 1.4;
  letter-spacing: 2px;
}

/* Data Bars */
.data-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.data-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
}

.data-label {
  width: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  box-shadow: 0 0 8px var(--theme-color);
}

.data-value {
  width: 50px;
  text-align: right;
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
}

.header-badge {
  font-size: 10px;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 6px;
  border-radius: 2px;
}

/* Old Header Styles (Removed/Hidden) */
.card-header { display: none; }

.card-body {
  display: flex;
  gap: 20px;
  align-items: center;
}

.card-icon-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--theme-color, #ffb000);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(var(--theme-color), 0.2);
}

.card-icon {
  font-size: 36px;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}

.card-info {
  flex: 1;
}

.card-title {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 2rem;
  color: var(--theme-color, #ffb000);
  margin: 0 0 5px 0;
  text-shadow: 0 0 10px rgba(var(--theme-color), 0.4);
  line-height: 1;
}

.card-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 12px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-bottom: 2px;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: rgba(255, 255, 255, 0.5);
}

.stat-value {
  color: #fff;
  font-weight: bold;
}

.card-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--theme-color, #ffb000);
  transition: all 0.3s ease;
}

/* Cinematic Entrance Animations */
.center-spire {
  transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
  height: 0;
  overflow: visible;
}

.center-spire.spire-enter {
  height: 150vh;
}

.connection-layer path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  transition: stroke-dashoffset 1s ease-out;
}

.connection-layer.links-enter path {
  stroke-dashoffset: 0;
}

.wings-container .wing-card-wrapper {
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Initial positions for slide-in */
.wings-container .pos-tl { transform: translateX(50px); }
.wings-container .pos-tr { transform: translateX(-50px); }
.wings-container .pos-bl { transform: translateX(50px); }
.wings-container .pos-br { transform: translateX(-50px); }

.wings-container.modules-enter .wing-card-wrapper {
  opacity: 1;
  transform: translateX(0);
}

/* Zoom Interaction */
.world-content {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.world-content.zoom-active {
  transform: scale(1.1);
}

.wing-card-wrapper.card-blur {
  filter: blur(5px) grayscale(0.8);
  opacity: 0.3;
  pointer-events: none;
  transform: scale(0.9);
}

.wing-card-wrapper.card-focused {
  z-index: 100;
  transform: scale(1.1);
}

.wing-card-wrapper.card-focused .wing-card {
  box-shadow: 0 0 60px rgba(var(--theme-color), 0.4);
  border-width: 3px;
}

.card-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.card-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.card-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.card-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

.wing-card:hover .card-corner {
  width: 12px;
  height: 12px;
  box-shadow: 0 0 5px #ffb000;
}

/* ━━━━━━ Detail Panel Overlay ━━━━━━ */
.detail-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.detail-panel {
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  background: linear-gradient(145deg, rgba(20, 18, 15, 0.98) 0%, rgba(30, 25, 20, 0.95) 100%);
  border: 1px solid #ffb000;
  box-shadow: 
    0 0 50px rgba(255, 176, 0, 0.3),
    inset 0 1px 0 rgba(255, 176, 0, 0.2);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 176, 0, 0.1);
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
}

.panel-title-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.panel-badge {
  font-size: 10px;
  color: #ffb000;
  background: rgba(255, 176, 0, 0.15);
  padding: 4px 10px;
  border: 1px solid rgba(255, 176, 0, 0.4);
  letter-spacing: 1px;
}

.panel-title {
  font-size: 22px;
  color: #ffb000;
  text-shadow: 0 0 15px rgba(255, 176, 0, 0.5);
  margin: 0;
}

.panel-close {
  width: 32px;
  height: 32px;
  background: rgba(255, 50, 50, 0.2);
  border: 1px solid rgba(255, 50, 50, 0.4);
  color: #ff5050;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.panel-close:hover {
  background: rgba(255, 50, 50, 0.4);
  box-shadow: 0 0 15px rgba(255, 50, 50, 0.3);
}

.panel-content {
  padding: 25px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.info-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 176, 0, 0.2);
  padding: 12px;
}

.info-label {
  display: block;
  font-size: 10px;
  color: rgba(255, 176, 0, 0.6);
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.info-value {
  font-size: 14px;
  color: #e0d5c0;
}

.info-value.status-stable { color: #00ff64; }
.info-value.status-busy { color: #ffb000; }
.info-value.status-unstable { color: #ff9900; }
.info-value.status-danger { color: #ff3232; }

.description-area {
  margin-bottom: 25px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-left: 2px solid #ffb000;
}

.description-area p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #c0b8a8;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 176, 0, 0.05);
  border: 1px solid rgba(255, 176, 0, 0.15);
}

.feature-bullet {
  color: #ffb000;
}

.feature-text {
  font-size: 12px;
  color: #e0d5c0;
}

/* Panel Slide Animation */
.panel-slide-enter-active {
  animation: panel-in 0.4s ease-out;
}

.panel-slide-leave-active {
  animation: panel-out 0.3s ease-in;
}

@keyframes panel-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes panel-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* ━━━━━━ Info Rail (Right) ━━━━━━ */
.info-rail {
  position: fixed;
  right: 0;
  top: 55px;
  bottom: 55px;
  width: 100px;
  background: linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(5,3,0,0.95) 100%);
  border-left: 2px solid rgba(255, 176, 0, 0.5);
  z-index: 400;
  display: flex !important;
  flex-direction: column;
  box-shadow: 
    -5px 0 30px rgba(0, 0, 0, 0.5),
    inset 10px 0 30px rgba(255, 176, 0, 0.02);
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease;
  view-transition-name: info-rail;
}

.info-rail:hover {
  opacity: 1;
}

/* Exit Button (Eject Switch) */
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
  position: relative;
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
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.5),
    inset 0 -2px 4px rgba(255,85,85,0.05);
  transition: all 0.25s ease;
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
  font-weight: 500;
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
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.5),
    0 0 25px rgba(255, 85, 85, 0.5);
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
  color: #ffcc00;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.monitor-title {
  font-size: 0.7rem;
  color: #aa8800;
  letter-spacing: 2px;
  font-weight: bold;
}

/* Sensor Grid */
.sensor-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
  flex: 1;
  justify-content: center;
}

.sensor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.sensor-track {
  width: 14px;
  height: 60px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 176, 0, 0.3);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.sensor-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #ffe066, #ffb000, #ff6600);
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
  transition: height 0.3s ease;
}

.sensor-label {
  font-size: 0.85rem;
  color: #aa8800;
  letter-spacing: 1px;
  font-weight: bold;
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

.info-rail .rail-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.info-rail .rail-led.led-green {
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88, 0 0 15px rgba(0, 255, 136, 0.5);
  animation: led-blink 2s infinite;
}

@keyframes led-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.info-rail .rail-id {
  font-size: 0.5rem;
  color: #554400;
  letter-spacing: 1px;
}

/* ━━━━━━ Command Rail (Left) ━━━━━━ */
.command-rail {
  position: fixed;
  left: 0;
  top: 55px;
  bottom: 55px;
  width: 100px;
  background: linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(5,3,0,0.95) 100%);
  border-right: 2px solid rgba(255, 176, 0, 0.5);
  z-index: 400;
  display: flex;
  flex-direction: column;
  box-shadow: 
    5px 0 30px rgba(0, 0, 0, 0.5),
    inset -10px 0 30px rgba(255, 176, 0, 0.02);
  
  /* Fixed visible state */
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
  color: #ffcc00;
  animation: gear-spin 10s linear infinite;
  text-shadow: 0 0 15px rgba(255, 176, 0, 0.5);
}

@keyframes gear-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rail-title {
  font-size: 0.8rem;
  color: #aa8800;
  letter-spacing: 3px;
  font-weight: bold;
}

.rail-buttons {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.3rem;
  overflow-y: auto;
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
  position: relative;
  transform-origin: center center;
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
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.5),
    inset 0 -2px 4px rgba(255,176,0,0.05);
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
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.3);
}

.rail-btn:hover .btn-slot {
  border-color: #ffb000;
  transform: scale(1.1);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.5),
    0 0 25px rgba(255, 176, 0, 0.5);
}

.rail-btn:hover .btn-glow {
  opacity: 0.8;
}

.rail-btn:hover .btn-label {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 200, 0, 0.6);
}

.rail-btn:hover .btn-sublabel {
  color: #aa8800;
}

.rail-btn.active {
  background: rgba(255, 176, 0, 0.15);
  border-color: #ffcc00;
  color: #ffffff;
}

.rail-btn.active .btn-slot {
  border-color: #ffcc00;
  background: linear-gradient(180deg, rgba(40,30,5,0.95) 0%, rgba(20,15,2,0.98) 100%);
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.5),
    0 0 25px rgba(255, 200, 0, 0.5),
    inset 0 0 20px rgba(255, 176, 0, 0.15);
}

.rail-btn.active .btn-label {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 200, 0, 0.6);
}

.rail-btn.active .btn-glow {
  opacity: 1;
  animation: glow-pulse-btn 2s ease-in-out infinite;
}

@keyframes glow-pulse-btn {
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
  bottom: 60px;
  right: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  z-index: 400;
  pointer-events: none;
}

.conn-status {
  font-size: 10px;
  color: #00ff88;
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.5);
  letter-spacing: 1px;
}

.conn-node {
  font-size: 9px;
  color: rgba(255, 176, 0, 0.5);
  letter-spacing: 1px;
}

/* ━━━━━━ Card Pop Animation ━━━━━━ */
.card-pop-enter-active {
  animation: card-spawn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes card-spawn {
  0% {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.5; transform: scale(1); }
}

/* Module switching (Content only) */
.world-tactical-map.is-switching .world-content,
.world-tactical-map.is-switching .tactical-bg,
.world-tactical-map.is-switching .grid-floor,
.world-tactical-map.is-switching .cinema-bar,
.world-tactical-map.is-switching .bg-image,
.world-tactical-map.is-switching .atmospheric-bg,
.world-tactical-map.is-switching .bg-overlay {
  animation: simple-fade-out 0.5s ease-out forwards;
}

.world-tactical-map.is-switching .command-rail,
.world-tactical-map.is-switching .info-rail {
  opacity: 1 !important;
  transform: translateX(0) !important;
  animation: none !important;
  z-index: 500;
}

@keyframes simple-fade-out {
  to {
    opacity: 0;
    filter: blur(5px);
  }
}

/* ━━━━━━ Exit Animation Sequence ━━━━━━ */

/* Phase 1: Cards fly away (T+0s) */
.world-tactical-map.is-exiting .wing-card-wrapper {
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
}

.world-tactical-map.is-exiting .pos-tl {
  transform: translateX(-100px);
  opacity: 0;
  transition-delay: 0s;
}

.world-tactical-map.is-exiting .pos-tr {
  transform: translateX(100px);
  opacity: 0;
  transition-delay: 0.05s;
}

.world-tactical-map.is-exiting .pos-bl {
  transform: translateX(-100px);
  opacity: 0;
  transition-delay: 0.1s;
}

.world-tactical-map.is-exiting .pos-br {
  transform: translateX(100px);
  opacity: 0;
  transition-delay: 0.15s;
}

/* Phase 2: Spire rises up (T+0.3s) */
.world-tactical-map.is-exiting .center-spire {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.8, 1) 0.3s;
  transform: translateX(-50%) translateY(-150%);
  opacity: 0;
}

/* Phase 3: Sidebars exit (T+0.6s) */
.world-tactical-map.is-exiting .command-rail {
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1) 0.6s;
  transform: translateX(-100%);
  opacity: 0;
}

.world-tactical-map.is-exiting .info-rail {
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1) 0.65s;
  transform: translateX(100%);
  opacity: 0;
}

.world-tactical-map.is-exiting .cinema-bar-top {
  transition: all 0.3s ease-out 0.7s;
  transform: translateY(-100%);
  opacity: 0;
}

.world-tactical-map.is-exiting .cinema-bar-bottom {
  transition: all 0.3s ease-out 0.7s;
  transform: translateY(100%);
  opacity: 0;
}

/* Background fade (T+0.5s) */
.world-tactical-map.is-exiting .tactical-bg,
.world-tactical-map.is-exiting .grid-floor,
.world-tactical-map.is-exiting .scope-frame {
  transition: opacity 0.5s ease-out 0.5s;
  opacity: 0;
}

/* Background image and overlays fade to black */
.world-tactical-map.is-exiting .bg-image,
.world-tactical-map.is-exiting .atmospheric-bg,
.world-tactical-map.is-exiting .bg-overlay {
  transition: opacity 0.6s ease-out, filter 0.4s ease-out;
  opacity: 0;
  filter: brightness(0);
}

/* Connection lines fade */
.world-tactical-map.is-exiting .connection-layer {
  transition: opacity 0.3s ease-out 0.1s;
  opacity: 0;
}

/* ━━━━━━ Entrance Animation Sequence ━━━━━━ */

/* Initial state: everything hidden */
.world-tactical-map .bg-image,
.world-tactical-map .atmospheric-bg {
  opacity: 0;
  animation: bg-fade-in 1.5s ease-out 0.3s forwards;
}

.world-tactical-map .grid-floor {
  opacity: 0;
  animation: bg-fade-in 1s ease-out 0.5s forwards;
}

.world-tactical-map .tactical-bg {
  opacity: 0;
  animation: bg-fade-in 1s ease-out 0.8s forwards;
}

@keyframes bg-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Override for bg-image to maintain proper opacity */
.world-tactical-map .bg-image {
  animation: bg-image-fade-in 1.5s ease-out 0.3s forwards;
}

@keyframes bg-image-fade-in {
  from { opacity: 0; }
  to { opacity: 0.4; } /* Match original opacity */
}

/* Override for grid-floor */
.world-tactical-map .grid-floor {
  animation: grid-fade-in 1s ease-out 0.5s forwards;
}

@keyframes grid-fade-in {
  from { opacity: 0; }
  to { opacity: 0.3; } /* Match original opacity */
}

/* Sidebar entrance animation (only from home) */
.world-tactical-map.from-home .command-rail {
  animation: sidebar-enter-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.8s;
  /* opacity: 0; */
  /* transform: translateX(-100%); */
  transition: none;
}

.world-tactical-map.from-home .info-rail {
  animation: sidebar-enter-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.9s;
  /* opacity: 0; */
  /* transform: translateX(100%); */
}

.world-tactical-map.from-home .cinema-bar-top {
  animation: cinema-enter-top 0.4s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
  transform: translateY(-100%);
}

.world-tactical-map.from-home .cinema-bar-bottom {
  animation: cinema-enter-bottom 0.4s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
  transform: translateY(100%);
}

@keyframes sidebar-enter-left {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 0.85; }
}

@keyframes sidebar-enter-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes cinema-enter-top {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes cinema-enter-bottom {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
</style>