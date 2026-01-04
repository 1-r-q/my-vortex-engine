<template>
  <div class="tactical-map home-nexus" ref="mapContainer" :class="{ 'shake-screen': isShaking, 'system-ready': isSystemReady, 'is-exiting': isExiting }">
    <!-- Cinematic Overlays -->
    <div v-if="showFlash" class="cinematic-flash"></div>
    <div v-if="showBlackout" class="cinematic-blackout">
      <div class="cinematic-dialogue" :class="{ 'fade-out': dialogueFading }">
        {{ dialogueContent }}<span class="cursor">_</span>
      </div>
    </div>

    <!-- Active Module Overlay -->
    <Transition name="module-fade">
      <component 
        v-if="activeModule" 
        :is="modules[activeModule]" 
        @close="closeModule"
        @openHistory="openModule('history')"
        @openWorld="openModule('world')"
        @openCharacters="openModule('characters')"
        @openMarket="openModule('market')"
        @openSystem="openModule('system')"
        class="module-overlay"
      />
    </Transition>

    <!-- 3D Perspective Grid Floor -->
    <div class="grid-floor">
      <div class="grid-lines"></div>
    </div>
    
    <!-- Cinematic Letterbox Bars -->
    <div class="cinema-bar cinema-bar-top" :class="{ 'ui-exit-up': isLaunching }">
      <div class="ticker-wrap">
        <div class="ticker">
          <span>◆ VORTEX ENGINE SYSTEM v19.0.4 ◆ CORE REACTOR: ONLINE ◆ OUTPUT: 100% ◆ PRESSURE: STABLE ◆ CLEARANCE: ADMIN ◆ PROTOCOL: NEXUS ◆</span>
          <span>◆ VORTEX ENGINE SYSTEM v19.0.4 ◆ CORE REACTOR: ONLINE ◆ OUTPUT: 100% ◆ PRESSURE: STABLE ◆ CLEARANCE: ADMIN ◆ PROTOCOL: NEXUS ◆</span>
        </div>
      </div>
    </div>
    <div class="cinema-bar cinema-bar-bottom" :class="{ 'ui-exit-down': isLaunching }">
      <div class="ticker-wrap">
        <div class="ticker ticker-reverse">
          <span>▶ SYSTEM: READY ▶ WAITING FOR INPUT ▶ INITIATE SEQUENCE ▶ CHECKING PERIPHERALS... OK ▶ NETWORK: SECURE ▶</span>
          <span>▶ SYSTEM: READY ▶ WAITING FOR INPUT ▶ INITIATE SEQUENCE ▶ CHECKING PERIPHERALS... OK ▶ NETWORK: SECURE ▶</span>
        </div>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="bg-overlay"></div>
    <div class="scan-line"></div>
    
    <!-- Tactical Map Background Layer -->
    <div class="tactical-bg" :class="{ 'accelerate-mode': isLaunching }">
      <!-- 1. Left Background: The Ghost Gear -->
      <svg class="ghost-gear" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="200" fill="none" stroke="#ffb000" stroke-width="2" stroke-dasharray="10 10" />
        <circle cx="250" cy="250" r="150" fill="none" stroke="#ffb000" stroke-width="1" />
        <path d="M250 50 L250 450 M50 250 L450 250" stroke="#ffb000" stroke-width="1" />
        <g class="gear-teeth">
          <path v-for="i in 12" :key="i" :transform="`rotate(${i * 30} 250 250)`" d="M240 20 L260 20 L260 40 L240 40 Z" fill="#ffb000" opacity="0.5" />
        </g>
      </svg>
      <div class="gear-label" style="top: 10%; left: 5%;">SYS_L-01</div>
      <div class="gear-label" style="top: 15%; left: 5%;">RATIO: 4.2</div>

      <!-- 2. Right Background: Data Cloud & Ruler -->
      <div class="right-data-cloud">
        <div class="vertical-ruler"></div>
        <div class="hex-cluster">
          <div class="hex-bg" v-for="n in 5" :key="n"></div>
        </div>
      </div>

      <!-- 3. Center Frame: Tactical Bracket (REMOVED) -->
      <!-- <div class="tactical-bracket"></div> -->

      <!-- 4. Floating Particles: Digital Dust -->
      <div class="digital-dust">
        <div v-for="n in 20" :key="n" class="dust-particle" :style="getDustStyle(n)"></div>
      </div>

      <!-- Giant Dashed Rings (Background Density) -->
      <div class="giant-ring ring-left"></div>
      <div class="giant-ring ring-right"></div>
      <div class="giant-ring ring-center-large"></div>

      <!-- Floating Data Particles -->
      <div class="floating-particles">
        <div v-for="(item, i) in floatingItems" :key="i" class="float-data" :style="item.style">
          {{ item.text }}
        </div>
      </div>

      <!-- Schematic Overlay (New) -->
      <div class="schematic-overlay">
        <div class="schematic-ring ring-1"></div>
        <div class="schematic-ring ring-2"></div>
        <div class="schematic-line line-1"></div>
        <div class="schematic-line line-2"></div>
      </div>

      <!-- Topographic Contour Lines -->
      <svg class="contour-layer" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="contourGlow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
        <g class="contour-lines" filter="url(#contourGlow)">
          <circle cx="960" cy="540" r="300" fill="none" stroke="rgba(255,176,0,0.05)" stroke-width="1" stroke-dasharray="10 5" />
          <circle cx="960" cy="540" r="450" fill="none" stroke="rgba(255,176,0,0.03)" stroke-width="1" />
          <circle cx="960" cy="540" r="600" fill="none" stroke="rgba(255,176,0,0.02)" stroke-width="1" stroke-dasharray="20 10" />
        </g>
      </svg>
      
      <!-- Sector Grid Lines -->
      <div class="sector-grid">
        <div class="sector-line sector-h1"></div>
        <div class="sector-line sector-h2"></div>
        <div class="sector-line sector-v1"></div>
        <div class="sector-line sector-v2"></div>
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

    <!-- 🔗 Energy Connections (X-Link) -->
    <svg class="connection-layer" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <defs>
        <filter id="energyGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255, 176, 0, 0)" />
          <stop offset="50%" stop-color="rgba(255, 176, 0, 0.8)" />
          <stop offset="100%" stop-color="rgba(255, 176, 0, 0)" />
        </linearGradient>
      </defs>
      
      <!-- Lines to Left Sidebar -->
      <path d="M 960 475 L 80 300" class="energy-path" id="path-tl" />
      <path d="M 960 475 L 80 780" class="energy-path" id="path-bl" />
      
      <!-- Lines to Right Sidebar -->
      <path d="M 960 475 L 1720 300" class="energy-path" id="path-tr" />
      <path d="M 960 475 L 1720 780" class="energy-path" id="path-br" />
      <!-- Flowing Data Packets (Enhanced) -->
      <circle r="3" fill="#ffb000" filter="url(#energyGlow)">
        <animateMotion dur="1.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#path-tl" />
        </animateMotion>
      </circle>
      <circle r="2" fill="#ffffff" filter="url(#energyGlow)">
        <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.75s" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#path-tl" />
        </animateMotion>
      </circle>

      <circle r="3" fill="#ffb000" filter="url(#energyGlow)">
        <animateMotion dur="2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#path-bl" />
        </animateMotion>
      </circle>

      <circle r="3" fill="#ffb000" filter="url(#energyGlow)">
        <animateMotion dur="1.8s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#path-tr" />
        </animateMotion>
      </circle>
      <circle r="2" fill="#ffffff" filter="url(#energyGlow)">
        <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.9s" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#path-tr" />
        </animateMotion>
      </circle>

      <circle r="3" fill="#ffb000" filter="url(#energyGlow)">
        <animateMotion dur="2.2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#path-br" />
        </animateMotion>
      </circle>
    </svg>

    <!-- ☢️ Center Stage: "The Gyro-Reactor" -->
    <div class="nexus-core" :class="{ 'core-overdrive': isLaunching }">
      <!-- Ring 1 (Outer): Thick Dashed -->
      <div class="gyro-ring ring-outer-dashed"></div>
      
      <!-- Ring 2 (Middle): Scale Ruler -->
      <div class="gyro-ring ring-middle-scale">
        <div class="scale-marks"></div>
        <div class="scale-ticks-extra"></div>
      </div>
      
      <!-- Ring 3 (Inner): Energy Band -->
      <div class="gyro-ring ring-inner-energy"></div>
      
      <!-- Core Energy Effects -->
      <div class="core-energy-glow"></div>
      <div class="core-particles">
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
      </div>
      
      <!-- Hologram Title (Redesigned) -->
      <div class="core-hologram">
        <div class="holo-projection">
          <div class="holo-logo glitch-text" data-text="VORTEX ENGINE">VORTEX ENGINE</div>
          <div class="holo-pointer">▽</div>
          <div class="holo-scanline"></div>
        </div>
      </div>

      <!-- Main Action Button -->
      <button class="initiate-btn" :class="{ 'launching': isLaunching }" @click="runSequence" @mouseenter="playHover">
        <div class="btn-ring"></div>
        <div class="btn-content">
          <span class="btn-text">INITIATE</span>
          <span class="btn-sub">SEQUENCE</span>
        </div>
        <div class="btn-glow-effect"></div>
      </button>
    </div>

    <!-- Left Vertical Command Rail -->
    <nav class="command-rail" :class="{ 'ui-exit-left': isLaunching }">
      <div class="rail-header">
        <span class="rail-logo">⚙</span>
        <span class="rail-title">CMD</span>
      </div>
      <div class="rail-buttons">
        <button class="rail-btn" @click="openModule('history')" @mouseenter="playHover" :class="{ active: activeModule === 'history' }">
          <div class="btn-slot"><span class="btn-icon">📜</span><span class="btn-glow"></span></div>
          <span class="btn-label">역사</span><span class="btn-sublabel">HISTORY</span>
        </button>
        <button class="rail-btn" @click="openModule('world')" @mouseenter="playHover" :class="{ active: activeModule === 'world' }">
          <div class="btn-slot"><span class="btn-icon">🌍</span><span class="btn-glow"></span></div>
          <span class="btn-label">세계</span><span class="btn-sublabel">WORLD</span>
        </button>
        <button class="rail-btn" @click="openModule('characters')" @mouseenter="playHover" :class="{ active: activeModule === 'characters' }">
          <div class="btn-slot"><span class="btn-icon">👤</span><span class="btn-glow"></span></div>
          <span class="btn-label">인물</span><span class="btn-sublabel">CHARS</span>
        </button>
        <button class="rail-btn" @click="openModule('market')" @mouseenter="playHover" :class="{ active: activeModule === 'market' }">
          <div class="btn-slot"><span class="btn-icon">📦</span><span class="btn-glow"></span></div>
          <span class="btn-label">에셋</span><span class="btn-sublabel">ASSETS</span>
        </button>
        <button class="rail-btn" @click="openModule('system')" @mouseenter="playHover" :class="{ active: activeModule === 'system' }">
          <div class="btn-slot"><span class="btn-icon">⚖️</span><span class="btn-glow"></span></div>
          <span class="btn-label">규칙</span><span class="btn-sublabel">RULES</span>
        </button>
      </div>
      
      <!-- Volume Control -->
      <div class="rail-volume-control">
        <div class="volume-label">BGM</div>
        <div class="volume-slider-container">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            :value="ambientVolume" 
            @input="updateVolume"
            class="rail-slider"
          />
          <div class="rail-slider-fill" :style="{ width: (ambientVolume * 100) + '%' }"></div>
        </div>
      </div>

      <div class="rail-footer">
        <div class="rail-indicator"></div>
        <span class="rail-version">v19.0</span>
      </div>
    </nav>

    <!-- Right Vertical Info Rail: "Full Monitoring Stack" -->
    <div class="info-rail" :class="{ 'ui-exit-right': isLaunching }">
      <div class="rail-monitor">
        <div class="monitor-header">
          <span class="monitor-logo">◈</span>
          <span class="monitor-title">SYSTEM MONITOR</span>
        </div>
        
        <!-- 1. System Vitals -->
        <div class="vital-bars">
          <div class="vital-row">
            <span class="vital-label">CPU</span>
            <div class="vital-track">
              <div class="vital-fill" :style="{ width: cpuLoad + '%' }"></div>
            </div>
            <span class="vital-value">{{ cpuLoad }}%</span>
          </div>
          <div class="vital-row">
            <span class="vital-label">MEM</span>
            <div class="vital-track">
              <div class="vital-fill" :style="{ width: memLoad + '%' }"></div>
            </div>
            <span class="vital-value">{{ memLoad }}%</span>
          </div>
          <div class="vital-row">
            <span class="vital-label">TMP</span>
            <div class="vital-track">
              <div class="vital-fill" :style="{ width: tempLoad + '%' }"></div>
            </div>
            <span class="vital-value">{{ tempLoad }}°C</span>
          </div>
        </div>

        <!-- 2. Hex-Radar -->
        <div class="hex-radar-widget">
          <div class="radar-hex-grid">
            <div class="hex-shape"></div>
            <div class="hex-scan"></div>
          </div>
          <div class="radar-label">SCANNING...</div>
        </div>

        <!-- 3. Waveform -->
        <div class="waveform-widget">
          <div class="waveform-screen">
            <div class="waveform-line"></div>
            <div class="waveform-line delay-1"></div>
            <div class="waveform-line delay-2"></div>
          </div>
          <div class="waveform-label">AUDIO_IN</div>
        </div>
      </div>
      
      <!-- 4. Terminal Log -->
      <div class="rail-terminal-log">
        <div class="log-container" ref="logContainer">
          <div v-for="(log, i) in systemLogs" :key="i" class="log-line">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-msg">{{ log.msg }}</span>
          </div>
        </div>
      </div>
      
      <div class="rail-footer">
        <div class="rail-led led-green"></div>
        <span class="rail-id">MON-01</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, withBase } from 'vitepress';
import { useSteamSound } from '../composables/useSteamSound';
import HistoryTacticalMap from './apps/HistoryTacticalMap.vue';
import WorldTacticalMap from './apps/WorldTacticalMap.vue';
import CharactersTacticalMap from './apps/CharactersTacticalMap.vue';
import MarketTacticalMap from './apps/MarketTacticalMap.vue';
import SystemTacticalMap from './apps/SystemTacticalMap.vue';

const router = useRouter();
const { 
  playHover, playClick, playClickHeavy, playGearEngage, playPressureBuild, 
  playExplosion, playTyping, playTransition, playWarp, playAmbient, 
  playDataTransmit, playSequenceStart, setCategoryVolume, getCategoryVolume, preloadSound 
} = useSteamSound();
// const { startTransition } = usePageTransition(); // Removed global transition
const currentTime = ref('00:00:00');
const activeModule = ref(null);
const isExiting = ref(false); // New state for exit animation
const ambientVolume = ref(getCategoryVolume('ambient')); // Background volume state

const updateVolume = (e) => {
  const val = parseFloat(e.target.value);
  ambientVolume.value = val;
  setCategoryVolume('ambient', val);
};
let timeInterval;
let vitalInterval;
let logInterval;

// Cinematic State
const isSystemReady = ref(false);
const isLaunching = ref(false);
const isShaking = ref(false);
const showFlash = ref(false);
const showBlackout = ref(false);
const dialogueContent = ref('');
const dialogueFading = ref(false);

// Vitals State
const cpuLoad = ref(45);
const memLoad = ref(62);
const tempLoad = ref(58);

// Logs State
const systemLogs = ref([
  { time: '00:00:01', msg: 'SYS_INIT... OK' },
  { time: '00:00:02', msg: 'CORE_LINK... ESTABLISHED' },
  { time: '00:00:03', msg: 'SECURITY... VERIFIED' }
]);
const logContainer = ref(null);

const modules = {
  history: HistoryTacticalMap,
  world: WorldTacticalMap,
  characters: CharactersTacticalMap,
  market: MarketTacticalMap,
  system: SystemTacticalMap
};

const openModule = (moduleName) => {
  // activeModule.value = moduleName;
  const routes = {
    history: withBase('/guide/history.html'),
    world: withBase('/world/map.html'),
    characters: withBase('/characters/index.html'),
    market: withBase('/assets/list.html'),
    system: withBase('/threats/database.html')
  };

  const targetUrl = routes[moduleName];
  if (targetUrl) {
    // Sound: Gear engage + transition
    playGearEngage();
    playTransition();
    
    // Mark navigation source for sidebar entrance animation
    sessionStorage.setItem('vortex-last-page', 'home');
    
    // Trigger Exit Animation
    isExiting.value = true;
    
    // Navigate after animation completes (1.2s)
    setTimeout(() => {
      router.go(targetUrl);
    }, 1200);
  } else {
    activeModule.value = moduleName;
  }
};

const closeModule = () => {
  activeModule.value = null;
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', { hour12: false });
};

const updateVitals = () => {
  cpuLoad.value = Math.min(99, Math.max(10, cpuLoad.value + Math.floor(Math.random() * 10) - 5));
  memLoad.value = Math.min(99, Math.max(20, memLoad.value + Math.floor(Math.random() * 6) - 3));
  tempLoad.value = Math.min(90, Math.max(40, tempLoad.value + Math.floor(Math.random() * 4) - 2));
};

const addLog = () => {
  const messages = [
    'PACKET_RX: 0x4F2A', 'PING: 12ms', 'MEM_GC: COMPLETED', 'SYNC_CHECK: OK', 
    'DATA_STREAM: ACTIVE', 'ENCRYPTION: AES-256', 'NODE_07: ONLINE', 'SCAN_COMPLETE'
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });
  
  systemLogs.value.push({ time: now, msg });
  if (systemLogs.value.length > 10) systemLogs.value.shift();
  
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
};

const navigateTo = (path) => {
  router.go(path);
};

const typeWriter = async (text) => {
  for (let i = 0; i < text.length; i++) {
    dialogueContent.value += text[i];
    // Sound: Typewriter click
    playTyping();
    await new Promise(r => setTimeout(r, 100));
  }
};

const runSequence = async () => {
  try {
    if (isLaunching.value) return;
    
    // Check if sequence was already run before
    if (typeof window !== 'undefined') {
      const alreadyRan = sessionStorage.getItem('vortex-sequence-ran');
      if (alreadyRan) {
        // Skip animation, go directly to scenario
        sessionStorage.setItem('vortex-last-page', 'home');
        router.go(withBase('/scenario/'));
        return;
      }
    }
    
    isLaunching.value = true;
    isShaking.value = true;
    
    // Phase 1: Overdrive (2.5s)
    // Sound: Turbine spin up, alarm
    console.log('Phase 1: Overdrive');
    if (playSequenceStart) playSequenceStart(7.5); // Sequence start sound (sequence.wav) with 6.5s duration
    
    // 1.5초 딜레이 후 압력 사운드 재생 (제거됨)
    /*
    setTimeout(() => {
      if (playPressureBuild) playPressureBuild();
    }, 2000);
    */
    
    await new Promise(r => setTimeout(r, 2500));
    
    // Phase 2: The Flash (1.5s)
    // Sound: Explosion / Warp bang
    console.log('Phase 2: Flash');
    // if (playExplosion) playExplosion(); // 제거됨
    showFlash.value = true;
    
    await new Promise(r => setTimeout(r, 1500));
    
    // Phase 3: The Voice (3.0s+)
    // Sound: Silence, then typing sounds
    console.log('Phase 3: Voice');
    isShaking.value = false;
    showFlash.value = false;
    showBlackout.value = true;
    
    await new Promise(r => setTimeout(r, 1000)); // Brief pause in darkness
    
    await typeWriter("오래도 걸렸군요. 슬슬 녹이 스는 줄 알았습니다, 깡통 씨.");
    
    await new Promise(r => setTimeout(r, 2000)); // Read time
    
    // Phase 4: Deployment
    // Sound: Digital disperse
    console.log('Phase 4: Deploy');
    dialogueFading.value = true;
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Mark sequence as ran
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vortex-sequence-ran', 'true');
    }
    
    // Router Push
    // Sound: CRT On / Grid expand
    navigateTo(withBase('/scenario/'));
  } catch (error) {
    console.error("Sequence Error:", error);
    // Fallback navigation
    navigateTo(withBase('/scenario/'));
  }
};

const tacticalTexts = ['SEC_04', 'LAT: 45.2', '[LOCKED]', 'SYS_RDY', 'NEXUS', 'A-77', 'ZOOM_x4', 'TRGT_ACQ', '0x4F', '///'];
const getParticleStyle = () => {
  const left = Math.random() * 100;
  const delay = Math.random() * 20;
  const duration = 20 + Math.random() * 30;
  const size = 8 + Math.random() * 4;
  return {
    left: `${left}%`,
    animationDelay: `-${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}px`
  };
};

const getDustStyle = (n) => {
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = 5 + Math.random() * 10;
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `-${delay}s`,
    animationDuration: `${duration}s`
  };
};

const floatingItems = ref(Array.from({ length: 25 }, (_, i) => ({
  id: i,
  text: tacticalTexts[Math.floor(Math.random() * tacticalTexts.length)],
  style: getParticleStyle()
})));

// 첫 사용자 인터랙션 시 배경음 재생
const startAmbientOnInteraction = () => {
  playAmbient();
  document.removeEventListener('click', startAmbientOnInteraction);
  document.removeEventListener('touchstart', startAmbientOnInteraction);
  document.removeEventListener('keydown', startAmbientOnInteraction);
};

onMounted(() => {
  // 즉시 재생 시도 (이전 페이지에서 인터랙션이 있었다면 작동)
  playAmbient();

  // 배경음은 사용자 인터랙션 후에만 재생
  document.addEventListener('click', startAmbientOnInteraction);
  document.addEventListener('touchstart', startAmbientOnInteraction);
  document.addEventListener('keydown', startAmbientOnInteraction);
  
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  vitalInterval = setInterval(updateVitals, 1500);
  logInterval = setInterval(addLog, 2500);

  // Cinematic Boot Trigger
  setTimeout(() => {
    isSystemReady.value = true;
  }, 100);
  
  // Preload sequence sound for instant playback
  preloadSound('sequence-start');
});

onUnmounted(() => {
  document.removeEventListener('click', startAmbientOnInteraction);
  document.removeEventListener('touchstart', startAmbientOnInteraction);
  document.removeEventListener('keydown', startAmbientOnInteraction);
  if (timeInterval) clearInterval(timeInterval);
  if (vitalInterval) clearInterval(vitalInterval);
  if (logInterval) clearInterval(logInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DungGeunMo&display=swap');

.tactical-map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050505;
  overflow: hidden;
  font-family: 'Share Tech Mono', monospace;
  color: #ffb000;
  user-select: none;
}

/* 3D Grid Floor (Updated Perspective) */
.grid-floor {
  position: absolute;
  bottom: 0;
  left: -50%;
  width: 200%;
  height: 40%;
  transform: perspective(600px) rotateX(60deg);
  z-index: 1;
  opacity: 0.4;
  pointer-events: none;
  mask-image: linear-gradient(to top, black 20%, transparent 100%);
}

.grid-lines {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(51, 34, 0, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(51, 34, 0, 0.5) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { background-position: 0 0; }
  100% { background-position: 0 60px; }
}

/* Cinema Bars */
.cinema-bar {
  position: fixed;
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
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  box-shadow: 0 2px 10px rgba(255, 176, 0, 0.1);
}

.cinema-bar-bottom {
  bottom: 0;
  border-top: 1px solid rgba(255, 176, 0, 0.3);
  box-shadow: 0 -2px 10px rgba(255, 176, 0, 0.1);
}

.ticker-wrap {
  width: 100%;
  overflow: hidden;
  opacity: 0.7;
}

.ticker {
  display: flex;
  width: fit-content;
  animation: ticker-scroll 30s linear infinite;
}

.ticker span {
  white-space: nowrap;
  padding: 0 60px;
  font-size: 0.7rem;
  color: rgba(255, 176, 0, 0.5);
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
}

.ticker-reverse {
  animation-direction: reverse;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Background Layers */
.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, #000 90%);
  z-index: 0;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: rgba(255, 176, 0, 0.1);
  opacity: 0.5;
  animation: scan 4s linear infinite;
  z-index: 5;
  pointer-events: none;
}

@keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }

.tactical-bg { position: absolute; inset: 0; z-index: 2; pointer-events: none; }

/* Giant Dashed Rings */
.giant-ring {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px dashed rgba(51, 34, 0, 0.6);
  border-radius: 50%;
  pointer-events: none;
}
.ring-left {
  left: -50px;
  top: calc(50% + 80px);
  width: 140vh;
  height: 140vh;
  animation: spin-slow 240s linear infinite;
}
.ring-right {
  right: calc(-140vh - 150px); /* Positioned to show only part */
  left: auto;
  top: calc(50% - 50px);
  width: 140vh;
  height: 140vh;
  animation: spin-rev 240s linear infinite;
}
.ring-center-large {
  left: 50%;
  width: 180vh;
  height: 180vh;
  border: 1px solid rgba(51, 34, 0, 0.4);
  animation: spin-slow 300s linear infinite reverse;
}

/* Floating Particles */
.floating-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 2;
}
.float-data {
  position: absolute;
  bottom: -50px;
  color: rgba(51, 34, 0, 0.8);
  font-family: 'Share Tech Mono', monospace;
  font-weight: bold;
  animation: float-up linear infinite;
  white-space: nowrap;
  text-shadow: 0 0 2px rgba(51, 34, 0, 0.5);
}
@keyframes float-up {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { transform: translateY(-110vh); opacity: 0; }
}

.contour-layer { width: 100%; height: 100%; opacity: 0.4; }

/* Schematic Overlay */
.schematic-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  opacity: 0.05;
  animation: spin-slow 120s linear infinite;
}

.schematic-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ffb000;
  border-radius: 50%;
}

.ring-1 { width: 100%; height: 100%; border-style: dashed; }
.ring-2 { width: 70%; height: 70%; border: 1px dotted #ffb000; }

.schematic-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 1px;
  background: #ffb000;
  transform-origin: center;
}

.line-1 { transform: translate(-50%, -50%) rotate(45deg); }
.line-2 { transform: translate(-50%, -50%) rotate(-45deg); }

/* Sector Grid */
.sector-grid { position: absolute; inset: 0; opacity: 0.2; }
.sector-line { position: absolute; background: rgba(255, 176, 0, 0.3); }
.sector-h1 { top: 33%; left: 0; width: 100%; height: 1px; }
.sector-h2 { top: 66%; left: 0; width: 100%; height: 1px; }
.sector-v1 { left: 33%; top: 0; width: 1px; height: 100%; }
.sector-v2 { left: 66%; top: 0; width: 1px; height: 100%; }

/* Radar Sweep */
.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150vmax;
  height: 150vmax;
  transform: translate(-50%, -50%);
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 176, 0, 0.05) 60deg, transparent 60.1deg);
  animation: radar-spin 10s linear infinite;
  border-radius: 50%;
}

@keyframes radar-spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

/* Scope Frame */
.scope-frame { position: absolute; inset: 40px; pointer-events: none; z-index: 10; border: 1px solid rgba(255, 176, 0, 0.1); }
.scope-corner { position: absolute; font-size: 28px; color: rgba(255, 176, 0, 0.5); }
.scope-tl { top: 0; left: 0; } .scope-tr { top: 0; right: 0; }
.scope-bl { bottom: 0; left: 0; } .scope-br { bottom: 0; right: 0; }

/* Overlays */
.crt-overlay {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px);
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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* CINEMATIC BOOT SEQUENCE (System Ready)                 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* 1. Core Reactor Boot */
.home-nexus:not(.system-ready) .nexus-core {
  transform: translate(-50%, -50%) scale(0.5);
  filter: brightness(0);
}

.home-nexus.system-ready .nexus-core {
  transition: transform 2.5s cubic-bezier(0.23, 1, 0.33, 1), filter 2.5s ease-out;
}

/* 2. Sidebars Boot */
.home-nexus:not(.system-ready) .command-rail {
  transform: translateX(-50px);
  opacity: 0;
}

.home-nexus.system-ready .command-rail {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s;
}

.home-nexus:not(.system-ready) .info-rail {
  transform: translateX(50px);
  opacity: 0;
}

.home-nexus.system-ready .info-rail {
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s;
}

/* 3. Main Title Boot (Glitch Intro) */
.home-nexus:not(.system-ready) .holo-logo {
  opacity: 0;
  text-shadow: none;
}

.home-nexus.system-ready .holo-logo {
  animation: glitch-intro 0.5s forwards 0.8s;
}

@keyframes glitch-intro {
  0% { opacity: 0; transform: scale(1.2); filter: blur(5px); }
  20% { opacity: 1; transform: scale(1); filter: blur(0); }
  40% { opacity: 0.5; text-shadow: 5px 0 #ff00c1; }
  60% { opacity: 1; text-shadow: -5px 0 #00fff9; }
  80% { opacity: 0.8; text-shadow: none; }
  100% { opacity: 1; transform: scale(1); }
}

/* 4. Background Boot */
.home-nexus:not(.system-ready) .tactical-bg {
  opacity: 0;
}

.home-nexus.system-ready .tactical-bg {
  transition: opacity 2s ease-in 1.2s;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* NEXUS CORE - Gyro-Reactor                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.nexus-core {
  position: absolute;
  top: calc(50% + 18px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 2.5s ease-in, filter 2.5s ease-in;
}

.gyro-ring {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 176, 0, 0.1);
  transition: border-color 2.5s ease-in, box-shadow 2.5s ease-in;
}

/* Ring 1: Outer Dashed */
.ring-outer-dashed {
  width: 100%;
  height: 100%;
  border: 4px dashed rgba(255, 176, 0, 0.3);
  animation: spin-slow 60s linear infinite;
}

/* Ring 2: Middle Scale */
.ring-middle-scale {
  width: 80%;
  height: 80%;
  border: 1px solid rgba(255, 176, 0, 0.2);
  animation: spin-rev 40s linear infinite;
}

.scale-marks {
  position: absolute;
  inset: 0;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(255, 176, 0, 0.5) 0deg 1deg,
    transparent 1deg 10deg
  );
  border-radius: 50%;
  mask-image: radial-gradient(transparent 60%, black 61%);
}

.scale-ticks-extra {
  position: absolute;
  inset: 0;
  background: repeating-conic-gradient(
    from 0deg,
    rgba(255, 176, 0, 0.8) 0deg 0.5deg,
    transparent 0.5deg 5deg
  );
  border-radius: 50%;
  mask-image: radial-gradient(transparent 68%, black 69%);
  opacity: 0.5;
}

/* Ring 3: Inner Energy */
.ring-inner-energy {
  width: 50%;
  height: 50%;
  border: 2px solid #ffb000;
  border-left-color: transparent;
  border-right-color: transparent;
  animation: spin-fast 2s linear infinite;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.4);
}

/* Core Energy Glow */
.core-energy-glow {
  position: absolute;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255, 176, 0, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
  z-index: 55;
  transition: all 2.5s ease-in;
}

/* Particles */
.core-particles {
  position: absolute;
  width: 200px;
  height: 200px;
  z-index: 56;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffb000;
  border-radius: 50%;
  opacity: 0;
}

.p1 { top: 50%; left: 50%; animation: particle-fly 2s infinite; }
.p2 { top: 50%; left: 50%; animation: particle-fly 2.5s infinite 0.5s; }
.p3 { top: 50%; left: 50%; animation: particle-fly 2.2s infinite 1s; }
.p4 { top: 50%; left: 50%; animation: particle-fly 2.8s infinite 1.5s; }

@keyframes particle-fly {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + 100px), calc(-50% - 100px)) scale(0); opacity: 0; }
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.core-hologram {
  position: absolute;
  top: -120px; /* Positioned just above the core */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 70;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.holo-projection {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.holo-logo {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 48px;
  color: #ffb000;
  text-shadow: 0 0 15px rgba(255, 176, 0, 0.8), 0 0 30px rgba(255, 176, 0, 0.4);
  letter-spacing: 0.5em;
  position: relative;
  margin-bottom: 10px;
  white-space: nowrap;
}

.holo-pointer {
  font-size: 40px;
  color: #ffb000;
  animation: bounce 2s infinite;
  text-shadow: 0 0 10px #ffb000;
  margin-top: 15px;
}

/* Cinematic Animations */
.shake-screen {
  animation: earthquake 0.1s infinite;
}

@keyframes earthquake {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-5px, 5px); }
  50% { transform: translate(5px, -5px); }
  75% { transform: translate(-5px, -5px); }
  100% { transform: translate(5px, 5px); }
}

/* UI Exit Animations */
.ui-exit-up { transform: translateY(-100%); opacity: 0; transition: all 1.5s ease-in; pointer-events: none; }
.ui-exit-down { transform: translateY(100%); opacity: 0; transition: all 1.5s ease-in; pointer-events: none; }
.ui-exit-left { transform: translateX(-100%); opacity: 0; transition: all 1.5s ease-in; pointer-events: none; }
.ui-exit-right { transform: translateX(100%); opacity: 0; transition: all 1.5s ease-in; pointer-events: none; }

/* Background Acceleration */
.accelerate-mode .giant-ring {
  animation-duration: 0.5s !important;
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  transition: all 2s ease-in;
}
.accelerate-mode .ghost-gear {
  animation-duration: 1s !important;
  opacity: 0.5;
  filter: drop-shadow(0 0 10px #fff);
  transition: all 2s ease-in;
}

.cinematic-flash {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 9999;
  animation: flash-smooth 1.5s ease-in forwards;
}

@keyframes flash-smooth {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.cinematic-blackout {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cinematic-dialogue {
  font-family: 'DungGeunMo', sans-serif;
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #ffb000;
  text-shadow: 0 0 20px rgba(255, 176, 0, 0.8);
  transition: all 1s ease;
}

.cinematic-dialogue.fade-out {
  opacity: 0;
  filter: blur(10px);
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.holo-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(255, 176, 0, 0.1) 51%, transparent 52%);
  background-size: 100% 4px;
  animation: scanline-scroll 1s linear infinite;
  pointer-events: none;
  mix-blend-mode: overlay;
}

@keyframes scanline-scroll {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 0.8; }
  50% { transform: translateY(5px); opacity: 1; }
}

/* Glitch Effect */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #050505; /* Match bg to hide main text momentarily */
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(14px, 9999px, 12px, 0); }
  5% { clip: rect(84px, 9999px, 96px, 0); }
  10% { clip: rect(12px, 9999px, 6px, 0); }
  15% { clip: rect(68px, 9999px, 2px, 0); }
  20% { clip: rect(34px, 9999px, 89px, 0); }
  100% { clip: rect(12px, 9999px, 64px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(64px, 9999px, 12px, 0); }
  5% { clip: rect(14px, 9999px, 96px, 0); }
  10% { clip: rect(32px, 9999px, 6px, 0); }
  15% { clip: rect(88px, 9999px, 2px, 0); }
  20% { clip: rect(14px, 9999px, 89px, 0); }
  100% { clip: rect(52px, 9999px, 64px, 0); }
}

.holo-version {
  font-size: 12px;
  color: rgba(255, 176, 0, 0.6);
  margin-top: 8px;
  letter-spacing: 4px;
  font-family: 'Share Tech Mono', monospace;
}

.initiate-btn {
  position: relative;
  width: 140px;
  height: 140px;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 60;
}

.btn-ring {
  position: absolute;
  inset: 5px;
  border: 2px solid #ffb000;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 4s linear infinite;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.btn-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 5px #ffb000;
}

.btn-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.btn-glow-effect {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 176, 0, 0.2) 0%, transparent 70%);
  animation: pulse 2s infinite;
}

.initiate-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 176, 0, 0.4);
}

.initiate-btn:hover .btn-text { color: #ffb000; }

.initiate-btn.launching {
  transform: scale(1.5);
  opacity: 0;
  transition: transform 4s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 4s ease-in;
  pointer-events: none;
}

.initiate-btn.launching .btn-ring {
  animation: spin 0.15s linear infinite;
  border-color: #ffffff;
  box-shadow: 0 0 40px rgba(255, 176, 0, 0.8);
  transition: all 2.5s ease-out;
}

/* Core rings expansion during launch */
.core-overdrive {
  transform: translate(-50%, -50%) scale(1.5);
  filter: brightness(3) drop-shadow(0 0 20px #fff);
  transition: all 2.5s cubic-bezier(0.1, 0.8, 0.2, 1);
}

.core-overdrive .gyro-ring {
  animation-duration: 0.2s !important;
  border-color: #fff !important;
  box-shadow: 0 0 50px #fff !important;
  transition: all 2.5s ease-out;
}

.core-overdrive .core-energy-glow {
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, transparent 70%);
  transform: scale(4);
  opacity: 1;
  transition: all 2.5s ease-out;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* SIDEBARS                                               */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* Left Command Rail */
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

.rail-volume-control {
  padding: 0.8rem 0.5rem;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
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
  pointer-events: none;
  z-index: 1;
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

.rail-footer {
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

/* Right Info Rail */
.info-rail {
  position: absolute;
  right: 0;
  top: 28px;
  bottom: 28px;
  width: 280px; /* Increased width */
  background: rgba(5, 5, 5, 0.9);
  border-left: 1px solid rgba(255, 176, 0, 0.4);
  box-shadow: 0 0 15px rgba(255, 176, 0, 0.1); /* Glow effect */
  display: flex;
  flex-direction: column;
  z-index: 20;
  backdrop-filter: blur(5px);
}

.rail-monitor { flex: 1; display: flex; flex-direction: column; padding: 20px; gap: 25px; } /* Increased padding/gap */

.monitor-header {
  height: 40px; /* Increased height */
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 176, 0, 0.2);
  gap: 12px;
  margin-bottom: 15px;
}

.monitor-logo { color: #ffb000; font-size: 16px; } /* Increased font size */
.monitor-title { font-size: 12px; color: #ffb000; letter-spacing: 1px; font-weight: bold; } /* Increased font size */

/* Vital Bars */
.vital-bars { display: flex; flex-direction: column; gap: 12px; } /* Increased gap */
.vital-row { display: flex; align-items: center; gap: 10px; font-size: 12px; } /* Increased font size */
.vital-label { width: 35px; color: rgba(255, 176, 0, 0.7); } /* Increased width */
.vital-track { flex: 1; height: 6px; background: rgba(255, 176, 0, 0.1); border-radius: 3px; overflow: hidden; } /* Increased height */
.vital-fill { height: 100%; background: #ffb000; transition: width 0.5s ease; box-shadow: 0 0 5px #ffb000; } /* Added glow */
.vital-value { width: 40px; text-align: right; color: #fff; font-weight: bold; }

/* Hex Radar */
.hex-radar-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.radar-hex-grid {
  width: 120px; /* Increased size */
  height: 120px; /* Increased size */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hex-shape {
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, rgba(255,176,0,0.1) 1px, transparent 1px),
    linear-gradient(rgba(255,176,0,0.1) 1px, transparent 1px);
  background-size: 12px 12px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: 1px solid rgba(255, 176, 0, 0.3);
  box-shadow: inset 0 0 20px rgba(255, 176, 0, 0.1);
}
.hex-scan {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #ffb000;
  box-shadow: 0 0 10px #ffb000;
  animation: scan-down 2s linear infinite;
}
.radar-label { font-size: 10px; color: rgba(255, 176, 0, 0.8); letter-spacing: 1px; font-weight: bold; }

@keyframes scan-down { 0% { top: 0; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }

/* Waveform */
.waveform-widget { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.waveform-screen {
  width: 100%;
  height: 60px; /* Increased height */
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 176, 0, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
}
.waveform-line {
  width: 100%;
  height: 2px;
  background: #ffb000;
  animation: wave-jitter 0.8s infinite; /* Slowed down from 0.2s */
  box-shadow: 0 0 5px #ffb000;
}
.delay-1 { animation-delay: 0.05s; opacity: 0.6; }
.delay-2 { animation-delay: 0.1s; opacity: 0.3; }

@keyframes wave-jitter {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(8); } /* Increased jitter */
  100% { transform: scaleY(1); }
}
.waveform-label { font-size: 10px; color: rgba(255, 176, 0, 0.8); }

/* Terminal Log */
.rail-terminal-log {
  flex: 1;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
}
.log-container {
  flex: 1;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
}
.log-line { font-size: 10px; color: rgba(255, 176, 0, 0.9); display: flex; gap: 8px; font-family: monospace; }
.log-time { color: rgba(255, 176, 0, 0.5); }

/* Connections */
.connection-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 15;
  transform: translateY(25px);
}

.energy-path {
  fill: none;
  stroke: rgba(255, 176, 0, 0.2);
  stroke-width: 1;
}

/* Animations */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
@keyframes spin-fast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.05); } 100% { opacity: 0.3; transform: scale(1); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* 3D Perspective Grid Floor */
.grid-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  perspective: 600px;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}

.grid-lines {
  position: absolute;
  width: 300%;
  height: 300%;
  left: -100%;
  top: -50%;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.15) 1px, transparent 1px);
  background-size: 80px 80px;
  transform-origin: center bottom;
  transform: rotateX(60deg) translateY(0);
  animation: grid-flow 10s linear infinite;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
}

@keyframes grid-flow {
  0% { transform: rotateX(60deg) translateY(0); }
  100% { transform: rotateX(60deg) translateY(80px); }
}

/* Background Schematics */
.ghost-gear {
  position: absolute;
  left: -10%;
  top: -15%;
  bottom: auto;
  width: 800px;
  height: 800px;
  opacity: 0.15;
  animation: spin-slow 120s linear infinite;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 0 5px rgba(255, 176, 0, 0.2));
}

.right-data-cloud {
  position: absolute;
  right: 10%;
  top: -10%;
  bottom: auto;
  width: 500px;
  height: 500px;
  border: 1px dashed rgba(255, 176, 0, 0.3);
  border-radius: 50%;
  background: 
    radial-gradient(circle at center, rgba(255,176,0,0.2) 0%, transparent 60%),
    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,176,0,0.1) 11px);
  z-index: 1;
  pointer-events: none;
  animation: spin-rev 60s linear infinite;
}

.right-data-cloud::before {
  content: '';
  position: absolute;
  inset: 80px;
  border: 1px dotted rgba(255, 176, 0, 0.1);
  border-radius: 50%;
  animation: spin 30s linear infinite;
}

/* Digital Dust (Floating Particles) */
.digital-dust {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.dust-particle {
  position: absolute;
  top: 0 !important; /* Override inline style to ensure full-screen rise */
  width: 3px;
  height: 3px;
  background: #ffb000;
  box-shadow: 0 0 4px #ffb000;
  opacity: 0;
  animation: dust-rise 15s linear infinite;
}

@keyframes dust-rise {
  0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
  20% { opacity: 0.5; }
  80% { opacity: 0.5; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

/* Module Overlay */
.module-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
}

.module-fade-enter-active,
.module-fade-leave-active {
  transition: opacity 0.5s ease;
}

.module-fade-enter-from,
.module-fade-leave-to {
  opacity: 0;
}

/* --- Exit Animation States --- */

/* Phase 1: Sidebars & HUD (T+0.0s) */
.is-exiting .command-rail {
  transform: translateX(-100px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-exiting .info-rail {
  transform: translateX(100px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-exiting .cinema-bar,
.is-exiting .grid-floor,
.is-exiting .tactical-bg,
.is-exiting .scope-frame,
.is-exiting .connection-layer {
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

/* Phase 2: Core Implosion (T+0.4s) - Energy condenses to a point */
.is-exiting .nexus-core {
  transform: translate(-50%, -50%) scale(0) rotate(180deg) !important;
  filter: brightness(2) !important;
  opacity: 0 !important;
  transition: transform 1s cubic-bezier(0.4, 0, 0.8, 1) 0.4s,
              filter 1s cubic-bezier(0.4, 0, 0.8, 1) 0.4s,
              opacity 1s cubic-bezier(0.4, 0, 0.8, 1) 0.4s !important;
}

/* Gyro rings slow down gradually - deceleration effect */
.is-exiting .gyro-ring {
  animation-play-state: running !important;
}

.is-exiting .ring-outer-dashed {
  animation: spin-decelerate-outer 2s cubic-bezier(0.1, 0, 0.9, 1) forwards !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4) !important;
}

.is-exiting .ring-middle-scale {
  animation: spin-decelerate-middle 2s cubic-bezier(0.1, 0, 0.9, 1) forwards !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.3) !important;
}

.is-exiting .ring-inner-energy {
  animation: spin-decelerate-inner 2s cubic-bezier(0.1, 0, 0.9, 1) forwards !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.6) !important;
}

/* Deceleration keyframes - start fast, end slow */
@keyframes spin-decelerate-outer {
  0% { transform: rotate(0deg) scale(1); opacity: 1; }
  30% { transform: rotate(60deg) scale(0.9); opacity: 0.8; }
  60% { transform: rotate(100deg) scale(0.6); opacity: 0.5; }
  100% { transform: rotate(120deg) scale(0); opacity: 0; }
}

@keyframes spin-decelerate-middle {
  0% { transform: rotate(0deg) scale(1); opacity: 1; }
  30% { transform: rotate(-50deg) scale(0.85); opacity: 0.75; }
  60% { transform: rotate(-80deg) scale(0.5); opacity: 0.4; }
  100% { transform: rotate(-100deg) scale(0); opacity: 0; }
}

@keyframes spin-decelerate-inner {
  0% { transform: rotate(0deg) scale(1); opacity: 1; }
  30% { transform: rotate(80deg) scale(0.8); opacity: 0.7; }
  60% { transform: rotate(130deg) scale(0.4); opacity: 0.35; }
  100% { transform: rotate(150deg) scale(0); opacity: 0; }
}

.is-exiting .core-energy-glow {
  transform: scale(2) !important;
  opacity: 0 !important;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%) !important;
  transition: all 1.2s ease-out 0.4s !important;
}

.is-exiting .initiate-btn {
  transform: scale(0) !important;
  opacity: 0 !important;
  transition: all 0.8s ease-out 0.4s !important;
}

.is-exiting .core-hologram {
  opacity: 0 !important;
  transform: translateX(-50%) scale(0.5) !important;
  transition: all 0.4s ease-out 0.2s !important;
}

/* Optional: Hide overlays during exit */
.is-exiting .cinematic-flash,
.is-exiting .cinematic-blackout {
  display: none;
}
</style>
