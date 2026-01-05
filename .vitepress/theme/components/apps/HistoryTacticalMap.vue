<template>
  <div class="tactical-map" :class="{ 'is-exiting': isExiting, 'is-switching': isSwitching, 'from-home': fromHome }" ref="mapContainer">
    <!-- 3D Perspective Grid Floor -->
    <div class="grid-floor">
      <div class="grid-lines"></div>
    </div>
    
    <!-- Cinematic Letterbox Bars -->
    <div class="cinema-bar cinema-bar-top">
      <div class="ticker-wrap">
        <div class="ticker">
          <span>◆ VOLTEX ARCHIVE SYSTEM v3.7.2 ◆ SECTOR SCAN ACTIVE ◆ NODE INTEGRITY: 99.7% ◆ UPLINK: STABLE ◆ ENCRYPTION: AES-512 ◆ CLEARANCE: LEVEL-7 ◆ DATABASE: SYNCHRONIZED ◆ BACKUP: 2026.01.03 ◆</span>
          <span>◆ VOLTEX ARCHIVE SYSTEM v3.7.2 ◆ SECTOR SCAN ACTIVE ◆ NODE INTEGRITY: 99.7% ◆ UPLINK: STABLE ◆ ENCRYPTION: AES-512 ◆ CLEARANCE: LEVEL-7 ◆ DATABASE: SYNCHRONIZED ◆ BACKUP: 2026.01.03 ◆</span>
        </div>
      </div>
    </div>
    <div class="cinema-bar cinema-bar-bottom">
      <div class="ticker-wrap">
        <div class="ticker ticker-reverse">
          <span>▶ LAT: 47.3521°N ▶ LON: 126.7845°E ▶ ALT: 2,847m ▶ PRESSURE: 0.72 atm ▶ TEMP: -12°C ▶ WIND: 45 kn NW ▶ VISIBILITY: 12km ▶ HAZARD: MODERATE ▶</span>
          <span>▶ LAT: 47.3521°N ▶ LON: 126.7845°E ▶ ALT: 2,847m ▶ PRESSURE: 0.72 atm ▶ TEMP: -12°C ▶ WIND: 45 kn NW ▶ VISIBILITY: 12km ▶ HAZARD: MODERATE ▶</span>
        </div>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="bg-overlay"></div>
    <div class="scan-line"></div>
    
    <!-- Tactical Map Background Layer -->
    <div class="tactical-bg">
      <!-- Topographic Contour Lines (등고선) -->
      <svg class="contour-layer" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="contourGlow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
        <!-- 등고선 패턴들 -->
        <g class="contour-lines" filter="url(#contourGlow)">
          <path d="M-100,200 Q300,150 500,280 T900,200 T1300,320 T1700,180 T2100,300" fill="none" stroke="rgba(255,176,0,0.08)" stroke-width="1"/>
          <path d="M-100,350 Q250,300 450,400 T850,320 T1250,450 T1650,350 T2100,420" fill="none" stroke="rgba(255,176,0,0.06)" stroke-width="1"/>
          <path d="M-100,500 Q350,450 550,550 T950,480 T1350,600 T1750,500 T2100,580" fill="none" stroke="rgba(255,176,0,0.07)" stroke-width="1"/>
          <path d="M-100,650 Q200,600 400,700 T800,620 T1200,750 T1600,650 T2100,720" fill="none" stroke="rgba(255,176,0,0.05)" stroke-width="1"/>
          <path d="M-100,800 Q300,750 500,850 T900,780 T1300,900 T1700,800 T2100,880" fill="none" stroke="rgba(255,176,0,0.06)" stroke-width="1"/>
          <path d="M-100,950 Q250,900 450,980 T850,920 T1250,1050 T1650,950 T2100,1020" fill="none" stroke="rgba(255,176,0,0.04)" stroke-width="1"/>
        </g>
      </svg>
      
      <!-- Sector Grid Lines (구획선) -->
      <div class="sector-grid">
        <div class="sector-line sector-h1"></div>
        <div class="sector-line sector-h2"></div>
        <div class="sector-line sector-v1"></div>
        <div class="sector-line sector-v2"></div>
        <div class="sector-line sector-diag1"></div>
        <div class="sector-line sector-diag2"></div>
      </div>
      
      <!-- Sonar/Radar Rings (동심원) -->
      <div class="sonar-rings">
        <div class="sonar-ring ring-1"></div>
        <div class="sonar-ring ring-2"></div>
        <div class="sonar-ring ring-3"></div>
        <div class="sonar-ring ring-4"></div>
      </div>
      
      <!-- Radar Sweep Animation -->
      <div class="radar-sweep"></div>
      
      <!-- Sector Labels (장식 텍스트) -->
      <div class="sector-labels">
        <span class="sector-label" style="top: 12%; left: 8%;">SECTOR-07</span>
        <span class="sector-label" style="top: 15%; right: 12%;">ZONE-ALPHA</span>
        <span class="sector-label" style="bottom: 18%; left: 6%;">RESTRICTED</span>
        <span class="sector-label" style="bottom: 12%; right: 8%;">SECTOR-12</span>
        <span class="sector-label coord" style="top: 35%; left: 3%;">47°21'N</span>
        <span class="sector-label coord" style="top: 65%; right: 4%;">126°45'E</span>
        <span class="sector-label warning" style="top: 50%; left: 2%;">⚠ HAZARD</span>
        <span class="sector-label" style="bottom: 35%; right: 3%;">GRID-09-C</span>
      </div>
      
      <!-- Flickering Hex Codes (깜빡이는 좌표/코드) -->
      <div class="hex-codes-layer">
        <span class="hex-code" style="top: 8%; left: 15%;">0xAF3E</span>
        <span class="hex-code" style="top: 22%; left: 88%;">0x7B2C</span>
        <span class="hex-code" style="top: 38%; left: 5%;">0xD4F1</span>
        <span class="hex-code" style="top: 55%; right: 8%;">0x92E8</span>
        <span class="hex-code" style="top: 72%; left: 12%;">0x1A5D</span>
        <span class="hex-code" style="top: 85%; right: 15%;">0xC7B3</span>
        <span class="hex-code" style="top: 18%; left: 45%;">NODE::4721</span>
        <span class="hex-code" style="top: 78%; left: 55%;">REF::0092</span>
        <span class="hex-code" style="top: 42%; right: 18%;">SYS::ACTIVE</span>
        <span class="hex-code" style="bottom: 25%; left: 35%;">MEM::0x8F2A</span>
      </div>
    </div>
    
    <!-- HUD Scope Frame (전술 스코프 프레임) -->
    <div class="scope-frame">
      <div class="scope-corner scope-tl">⌜</div>
      <div class="scope-corner scope-tr">⌝</div>
      <div class="scope-corner scope-bl">⌞</div>
      <div class="scope-corner scope-br">⌟</div>
      <div class="scope-edge scope-edge-top"></div>
      <div class="scope-edge scope-edge-bottom"></div>
      <div class="scope-edge scope-edge-left"></div>
      <div class="scope-edge scope-edge-right"></div>
    </div>
    
    <!-- CRT Scanlines Overlay -->
    <div class="crt-overlay"></div>
    
    <!-- Enhanced Vignette -->
    <div class="vignette-overlay"></div>
    
    <!-- Background Decorative Gears -->
    <div class="bg-gear bg-gear-1"></div>
    <div class="bg-gear bg-gear-2"></div>
    <div class="bg-gear bg-gear-3"></div>

    <!-- Rotating System Container -->
    <div class="orbit-system" :style="{ width: dimensions.width + 'px', height: dimensions.height + 'px' }">
      
      <!-- SVG Connector Layer -->
      <svg class="connector-layer" :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`">
        <defs>
          <!-- Energy Cable Gradient -->
          <linearGradient id="cableGradient" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style="stop-color:#ff6600;stop-opacity:0.3" />
            <stop offset="50%" style="stop-color:#ffb000;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffe066;stop-opacity:0.8" />
          </linearGradient>
          
          <!-- Core Glow Filter -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur1"/>
            <feGaussianBlur stdDeviation="6" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Strong Glow for Sparks -->
          <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur1"/>
            <feGaussianBlur stdDeviation="8" result="blur2"/>
            <feGaussianBlur stdDeviation="12" result="blur3"/>
            <feMerge>
              <feMergeNode in="blur3"/>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Spark Radial Gradient -->
          <radialGradient id="sparkGradient">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="40%" style="stop-color:#ffcc00;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0" />
          </radialGradient>
          
          <!-- Node Glow Gradient -->
          <radialGradient id="nodeGlow">
            <stop offset="0%" style="stop-color:#ffb000;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ff8800;stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:#ff6600;stop-opacity:0" />
          </radialGradient>
        </defs>
        
        <!-- Central Hub Node -->
        <circle 
          :cx="center.x" :cy="center.y" 
          r="8" 
          fill="url(#nodeGlow)" 
          filter="url(#glowStrong)"
          class="center-node"
        />
        <circle 
          :cx="center.x" :cy="center.y" 
          r="3" 
          fill="#ffffff"
          class="center-core"
        />
        
        <!-- Central Radial Lines (Center → Each Card) -->
        <g v-for="(pos, idx) in cardPositions" :key="'radial-' + idx">
          <!-- Background Glow Trail -->
          <path 
            v-if="visibleLines.includes(idx)"
            :d="`M${center.x},${center.y} L${pos.x},${pos.y}`"
            class="energy-line-glow"
          />
          
          <!-- Main Energy Cable -->
          <path 
            v-if="visibleLines.includes(idx)"
            :d="`M${center.x},${center.y} L${pos.x},${pos.y}`"
            class="energy-line"
            :id="'cable-' + idx"
          />
          
          <!-- Pulsing Core Line -->
          <path 
            v-if="visibleLines.includes(idx)"
            :d="`M${center.x},${center.y} L${pos.x},${pos.y}`"
            class="energy-line-core"
          />
          
          <!-- Data Packets flowing along lines (지속적인 데이터 흐름) -->
          <g v-if="visibleCards.includes(idx)" class="data-packets">
            <circle r="3" fill="#ffcc00" filter="url(#glow)" class="data-packet">
              <animateMotion dur="3s" repeatCount="indefinite" begin="0s">
                <mpath :href="'#cable-' + idx" />
              </animateMotion>
            </circle>
            <circle r="2" fill="#ff8800" filter="url(#glow)" class="data-packet">
              <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
                <mpath :href="'#cable-' + idx" />
              </animateMotion>
            </circle>
            <circle r="2.5" fill="#ffaa00" filter="url(#glow)" class="data-packet">
              <animateMotion dur="3s" repeatCount="indefinite" begin="2s">
                <mpath :href="'#cable-' + idx" />
              </animateMotion>
            </circle>
          </g>
          
          <!-- End Node (at card position) -->
          <g v-if="visibleCards.includes(idx)" class="end-node-group">
            <circle 
              :cx="pos.x" :cy="pos.y" 
              r="12" 
              fill="url(#nodeGlow)" 
              filter="url(#glow)"
              class="end-node-glow"
            />
            <circle 
              :cx="pos.x" :cy="pos.y" 
              r="5" 
              fill="#ffb000"
              stroke="#ffffff"
              stroke-width="1"
              class="end-node-core"
            />
          </g>
        </g>
        
        <!-- Ambient Data Flow Particles (after all cards visible) -->
        <g v-if="visibleCards.length === events.length" class="ambient-particles">
          <circle 
            v-for="n in 8" 
            :key="'ambient-' + n"
            r="2"
            fill="#ffb000"
            :opacity="0.4"
            filter="url(#glow)"
          >
            <animateMotion 
              :dur="`${3 + n * 0.5}s`" 
              repeatCount="indefinite"
              :begin="`${n * 0.3}s`"
            >
              <mpath :href="'#cable-' + (n % 4)" />
            </animateMotion>
          </circle>
        </g>
      </svg>

      <!-- Spark Elements (CSS animated, follows line direction) -->
      <template v-for="(pos, idx) in cardPositions" :key="'spark-' + idx">
        <div 
          v-if="visibleLines.includes(idx)"
          class="spark-container"
          :style="{
            '--start-x': center.x + 'px',
            '--start-y': center.y + 'px',
            '--end-x': pos.x + 'px',
            '--end-y': pos.y + 'px'
          }"
        >
          <div class="spark-fuse"></div>
          <div class="spark-trail spark-trail-1"></div>
          <div class="spark-trail spark-trail-2"></div>
          <div class="spark-trail spark-trail-3"></div>
        </div>
      </template>

      <!-- Data Cards -->
      <div 
        v-for="(item, idx) in events" 
        :key="idx"
        class="card-wrapper"
        :style="{ 
          left: cardPositions[idx].x + 'px', 
          top: cardPositions[idx].y + 'px' 
        }"
      >
        <Transition name="card-pop">
          <article 
            v-if="visibleCards.includes(idx)"
            class="data-card"
            :class="{ 'card-active': activeCard === idx }"
            @mouseenter="activeCard = idx"
            @mouseleave="activeCard = null"
          >
            <div class="card-glow"></div>
            <div class="card-frame">
              <!-- Decorative Gears -->
              <div class="card-gear gear-tl"></div>
              <div class="card-gear gear-br"></div>

              <!-- Corner Brackets -->
              <div class="corner tl"></div>
              <div class="corner tr"></div>
              <div class="corner bl"></div>
              <div class="corner br"></div>
              
              <!-- External Guide Lines (보조선) -->
              <div class="guide-line guide-h-top"></div>
              <div class="guide-line guide-h-bottom"></div>
              <div class="guide-line guide-v-left"></div>
              <div class="guide-line guide-v-right"></div>
              
              <!-- Connection Dots (접속 포인트) -->
              <div class="conn-dot conn-dot-1"></div>
              <div class="conn-dot conn-dot-2"></div>
              <div class="conn-dot conn-dot-3"></div>
              
              <!-- Card Header -->
              <div class="card-header">
                <span class="era-badge">
                  <TypeWriter :text="item.year" :delay="200" :speed="50" />
                </span>
                <div class="header-badges">
                  <span class="badge badge-secure">SECURE</span>
                  <span class="integrity" :class="getIntegrityClass(item.integrity)">
                    {{ item.integrity }}%
                  </span>
                </div>
              </div>
              
              <!-- Status Tags -->
              <div class="status-tags">
                <span class="tag tag-archived">ARCHIVED</span>
                <span class="tag tag-verified">✓ VERIFIED</span>
              </div>
              
              <!-- Card Content -->
              <h3 class="card-title">
                <TypeWriter :text="item.title" :delay="400" :speed="40" />
              </h3>
              <p class="card-desc" :class="{ 'show': activeCard === idx }">
                <TypeWriter 
                  v-if="activeCard === idx" 
                  :text="item.desc" 
                  :delay="0" 
                  :speed="20" 
                  :silent="true"
                />
              </p>
              
              <!-- Card Footer -->
              <div class="card-footer">
                <span class="record-id">REC_{{ String(idx + 1).padStart(3, '0') }}</span>
                <span class="status-indicator"></span>
              </div>
            </div>
          </article>
        </Transition>
      </div>
    </div>

    <!-- Right Vertical Info Rail -->
    <div class="info-rail">
      <!-- Exit Button (System Eject) -->
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
        
        <!-- Animated Sync Gauge -->
        <div class="rail-gauge">
          <div class="gauge-track">
            <div class="gauge-fill-vertical gauge-animated"></div>
          </div>
          <span class="gauge-percent gauge-glow">{{ Math.round(animatedPercent) }}%</span>
        </div>
        
        <!-- Status Blocks (Vertical Stack) -->
        <div class="rail-status-blocks">
          <div class="status-block">
            <span class="block-icon">▣</span>
            <span class="block-value">{{ visibleCards.length }}/{{ events.length }}</span>
            <span class="block-label">NODES</span>
          </div>
          
          <div class="block-divider"></div>
          
          <div class="status-block">
            <span class="block-icon">◉</span>
            <span class="block-value glow-green" :class="{ 'syncing': visibleCards.length < events.length }">
              {{ visibleCards.length < events.length ? 'SYNC' : 'OK' }}
            </span>
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
      
      <!-- Decorative: Crypto Log Stream -->
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

    <!-- Central Title Hub (화면 정중앙) -->
    <div class="central-title-hub">
      <!-- Rotating Gear Background -->
      <div class="hub-gear-bg">
        <div class="gear-spinner"></div>
        <div class="gear-spinner gear-spinner-reverse"></div>
      </div>
      
      <!-- Tactical Frame Overlay -->
      <div class="hub-tactical-frame">
        <div class="frame-corner frame-tl"></div>
        <div class="frame-corner frame-tr"></div>
        <div class="frame-corner frame-bl"></div>
        <div class="frame-corner frame-br"></div>
        <div class="frame-edge frame-edge-top"></div>
        <div class="frame-edge frame-edge-bottom"></div>
        <div class="frame-edge frame-edge-left"></div>
        <div class="frame-edge frame-edge-right"></div>
      </div>
      
      <!-- Compact Circular Core Hub -->
      <div class="hub-core-circle">
        <!-- Outer Gear Rings -->
        <div class="core-gear-ring gear-outer"></div>
        <div class="core-gear-ring gear-middle"></div>
        <div class="core-outer-ring"></div>
        <div class="core-inner-ring"></div>
        
        <!-- Data Stream Particles -->
        <div class="core-data-streams">
          <div class="data-stream stream-1"></div>
          <div class="data-stream stream-2"></div>
          <div class="data-stream stream-3"></div>
          <div class="data-stream stream-4"></div>
        </div>
        
        <!-- Pulse Rings -->
        <div class="core-pulse pulse-1"></div>
        <div class="core-pulse pulse-2"></div>
        
        <!-- Core Content (Simplified) -->
        <div class="core-content">
          <div class="core-title">VORTEX</div>
          <div class="core-status">
            <span class="status-dot"></span>
            <span>ONLINE</span>
          </div>
        </div>
        
        <!-- Scan Lines -->
        <div class="core-scan-line"></div>
        <div class="core-scan-line scan-line-2"></div>
        
        <!-- Corner Bolts -->
        <div class="core-bolt bolt-tl">⌘</div>
        <div class="core-bolt bolt-tr">⌘</div>
        <div class="core-bolt bolt-bl">⌘</div>
        <div class="core-bolt bolt-br">⌘</div>
      </div>
    </div>

    <!-- Left Vertical Command Rail -->
    <nav class="command-rail">
      <div class="rail-header">
        <span class="rail-logo">⚙</span>
        <span class="rail-title">CMD</span>
      </div>
      <div class="rail-buttons">
        <button class="rail-btn active">
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
      <span class="conn-node">ARCHIVE NODE: CENTRAL-07</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, h, defineComponent } from 'vue';
import { useRouter, withBase } from 'vitepress';
import { usePageTransition } from '../../transitionState';
import { useSteamSound } from '../../composables/useSteamSound';

const { playHover, playClick, playCardSelect, playBack, playTransition, playSelect, playDataTransmit, playTyping, categoryVolumes, setCategoryVolume } = useSteamSound();

const ambientVolume = computed({
  get: () => categoryVolumes.ambient,
  set: (val) => setCategoryVolume('ambient', val)
});

const goHome = () => {
  playBack();
  router.go(withBase('/'));
};

// TypeWriter Component
const TypeWriter = defineComponent({
  props: {
    text: { type: String, required: true },
    delay: { type: Number, default: 0 },
    speed: { type: Number, default: 50 },
    silent: { type: Boolean, default: false }
  },
  setup(props) {
    const displayText = ref('');
    const started = ref(false);
    
    onMounted(() => {
      setTimeout(() => {
        started.value = true;
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < props.text.length) {
            displayText.value += props.text.charAt(i);
            if (!props.silent) playTyping();
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, props.speed);
      }, props.delay);
    });
    
    return () => h('span', { class: 'typewriter' }, [
      displayText.value,
      started.value && displayText.value.length < props.text.length 
        ? h('span', { class: 'cursor' }, '▊') 
        : null
    ]);
  }
});

const emit = defineEmits(['close', 'openWorld', 'openMarket', 'openCharacters', 'openSystem']);
const router = useRouter();
const { startTransition } = usePageTransition();

// Reactive state
const mapContainer = ref(null);
const activeCard = ref(null);
const currentTime = ref('00:00:00');
const dimensions = reactive({ width: 1920, height: 1080 });
const center = reactive({ x: 960, y: 540 });
const visibleLines = ref([]);
const visibleCards = ref([]);
const animatedPercent = ref(75);
const isExiting = ref(false);
const isSwitching = ref(false);
const fromHome = ref(false);

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

// Handle Exit Animation Sequence
const handleClose = () => {
  if (isExiting.value || isSwitching.value) return;
  playTransition();
  isExiting.value = true;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-last-page', 'home');
  }
  
  // Quick transition to home
  setTimeout(() => {
    router.go(withBase('/index.html'));
  }, 400);
};

// Animated percent oscillation (60-100)
const events = [
  {
    year: 'Pre-War',
    title: '거신 전쟁',
    desc: '구인류 국가 간의 전쟁. 거대 증기 병기들이 동원되어 지표면의 80%가 파괴되었다.',
    integrity: 98
  },
  {
    year: 'Year 50',
    title: '대재앙과 독무',
    desc: '화학 병기 유출로 녹색 독무가 지상을 덮쳤다. 인류는 지하와 고지대로 흩어졌다.',
    integrity: 95
  },
  {
    year: 'Year 120',
    title: '보르텍시아 건국',
    desc: '부유석 발견 후 천공 요새 건설. 선택받은 자들만이 하늘로 올라갔다.',
    integrity: 100
  },
  {
    year: 'Current',
    title: '현재의 교착',
    desc: '상층의 부패, 중층의 과부하, 하층의 무질서가 위태로운 균형을 이루고 있다.',
    integrity: 99
  }
];

// Calculate card positions in rectangular corners (diagonal lines from center)
const cardPositions = computed(() => {
  // 4 corners: top-left, top-right, bottom-right, bottom-left (X-layout)
  // Rebalance: Reduce radius to avoid sidebar overlap
  const offsetX = dimensions.width * 0.18; 
  const offsetY = dimensions.height * 0.20;
  
  // Sidebar widths (approximate)
  const leftSidebarW = 120; // 100px + margin
  const rightSidebarW = 300; // 280px + margin
  const cardHalfW = 170; // Card width 340 / 2
  const cardHalfH = 100; // Card height approx 200 / 2
  const padding = 20;

  // Safety boundaries
  const minX = leftSidebarW + padding + cardHalfW;
  const maxX = dimensions.width - (rightSidebarW + padding + cardHalfW);
  const minY = padding + cardHalfH;
  const maxY = dimensions.height - (padding + cardHalfH);

  const safeX = (x) => Math.max(minX, Math.min(maxX, x));
  const safeY = (y) => Math.max(minY, Math.min(maxY, y));
  
  const positions = [
    { x: safeX(center.x - offsetX), y: safeY(center.y - offsetY) }, // Top-Left
    { x: safeX(center.x + offsetX), y: safeY(center.y - offsetY) }, // Top-Right
    { x: safeX(center.x + offsetX), y: safeY(center.y + offsetY) }, // Bottom-Right
    { x: safeX(center.x - offsetX), y: safeY(center.y + offsetY) }, // Bottom-Left
  ];
  
  return positions;
});

// Utility functions
const getIntegrityClass = (val) => {
  if (val >= 90) return 'high';
  if (val >= 60) return 'medium';
  return 'low';
};

const navigateTo = (path) => {
  router.go(path);
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('ko-KR', { hour12: false });
};

// Calculate dimensions based on container size
const updateDimensions = () => {
  if (mapContainer.value) {
    const rect = mapContainer.value.getBoundingClientRect();
    dimensions.width = rect.width || window.innerWidth;
    dimensions.height = rect.height || window.innerHeight;
    center.x = dimensions.width / 2;
    center.y = dimensions.height / 2; // 화면 정중앙
  }
};

// Sequentially reveal cards (Central radial: Line shoots out → Card appears)
const revealCards = () => {
  events.forEach((_, idx) => {
    // Line shoots from center at: idx * 2800ms (더 긴 간격)
    setTimeout(() => {
      visibleLines.value.push(idx);
    }, idx * 500 + 400);

    // Card appears exactly when spark arrives (2초 후)
    setTimeout(() => {
      visibleCards.value.push(idx);
    }, idx * 500 + 100 + 600); // 라인 시작 + 애니메이션 2초
  });
};

// Lifecycle
let timeInterval;
let resizeObserver;

onMounted(() => {
  checkNavigationSource();
  
  nextTick(() => {
    updateDimensions();
    
    resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (mapContainer.value) {
      resizeObserver.observe(mapContainer.value);
    }
    
    // Start card reveal sequence
    revealCards();
  });
  
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  // Animated percent oscillation
  let percentDirection = 1;
  setInterval(() => {
    animatedPercent.value += percentDirection * (Math.random() * 3 + 1);
    if (animatedPercent.value >= 100) {
      animatedPercent.value = 100;
      percentDirection = -1;
    } else if (animatedPercent.value <= 60) {
      animatedPercent.value = 60;
      percentDirection = 1;
    }
  }, 150);
  
  window.addEventListener('resize', updateDimensions);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  window.removeEventListener('resize', updateDimensions);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
/* Google Fonts - 영문: Orbitron, Share Tech Mono / 한글: Noto Sans KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');

/* ━━━━━━ Base Container ━━━━━━ */
.tactical-map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
  background: #050505;
  font-family: 'Share Tech Mono', 'Noto Sans KR', monospace;
  color: #e0d0b0;
  overflow: hidden;
  font-size: 1.1rem; /* 전체 1.2배 스케일 */
}

/* ━━━━━━ EXIT ANIMATION SEQUENCE ━━━━━━ */
.tactical-map.is-exiting {
  pointer-events: none;
}

/* Module switching (Content only) */
.tactical-map.is-switching .orbit-system,
.tactical-map.is-switching .tactical-bg,
.tactical-map.is-switching .grid-floor,
.tactical-map.is-switching .cinema-bar,
.tactical-map.is-switching .central-title-hub {
  animation: fade-out 0.5s ease-out forwards;
}

.tactical-map.is-switching .command-rail,
.tactical-map.is-switching .info-rail {
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

/* Phase 1: Cards fold in place (no position change) */
.tactical-map.is-exiting .data-card {
  animation: card-fold-close 0.8s ease-in forwards !important;
}

@keyframes card-fold-close {
  0% {
    transform: scale(1) perspective(800px) rotateX(0deg);
    opacity: 1;
    filter: brightness(1);
  }
  30% {
    filter: brightness(1.5);
  }
  100% {
    transform: scale(0.8) perspective(800px) rotateX(90deg);
    opacity: 0;
    filter: brightness(0);
  }
}

/* Lines retract - reverse playback of line-draw animation */
.tactical-map.is-exiting .energy-line,
.tactical-map.is-exiting .energy-line-glow,
.tactical-map.is-exiting .energy-line-core {
  animation: line-draw 1.2s ease-in-out reverse forwards !important;
}

/* Center core/node disappear when exiting */
.tactical-map.is-exiting .center-core,
.tactical-map.is-exiting .center-node {
  animation: instant-vanish 0.15s ease-out forwards !important;
}

/* Data packets & end nodes disappear immediately when lines start */
.tactical-map.is-exiting .data-packet,
.tactical-map.is-exiting .data-packets,
.tactical-map.is-exiting .end-node-group {
  animation: instant-vanish 0.15s ease-out forwards !important;
}

@keyframes instant-vanish {
  to { 
    opacity: 0; 
    visibility: hidden;
  }
}

/* Phase 2: Core shutdown - animate inner element, not the positioned hub */
.tactical-map.is-exiting .central-title-hub .hub-core-circle {
  animation: core-shutdown 0.8s ease-in 0.4s forwards;
}

@keyframes core-shutdown {
  0% {
    opacity: 1;
    filter: brightness(1);
    transform: scale(1);
  }
  50% {
    filter: brightness(2);
  }
  100% {
    opacity: 0;
    filter: brightness(0);
    transform: scale(0.3);
  }
}

/* Core rings stop and collapse */
.tactical-map.is-exiting .core-gear-ring,
.tactical-map.is-exiting .core-outer-ring,
.tactical-map.is-exiting .core-scan-line {
  animation: ring-collapse 0.8s ease-in 0.4s forwards !important;
}

@keyframes ring-collapse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* Pulse rings accelerate and fade */
.tactical-map.is-exiting .core-pulse {
  animation: pulse-burst 0.4s ease-out forwards !important;
}

@keyframes pulse-burst {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

/* Module switching (Content only) */
.tactical-map.is-switching .orbit-system,
.tactical-map.is-switching .tactical-bg,
.tactical-map.is-switching .grid-floor,
.tactical-map.is-switching .cinema-bar,
.tactical-map.is-switching .bg-overlay,
.tactical-map.is-switching .central-title-hub,
.tactical-map.is-switching .connector-layer,
.tactical-map.is-switching .spark-container,
.tactical-map.is-switching .card-wrapper,
.tactical-map.is-switching .sonar-rings,
.tactical-map.is-switching .sector-grid,
.tactical-map.is-switching .hex-codes-layer,
.tactical-map.is-switching .scope-frame,
.tactical-map.is-switching .crt-overlay,
.tactical-map.is-switching .vignette-overlay {
  animation: simple-fade-out 0.5s ease-out forwards;
  pointer-events: none;
}

.tactical-map.is-switching .command-rail,
.tactical-map.is-switching .info-rail {
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

/* Background effects fade */
.tactical-map.is-exiting .sonar-ring {
  animation: sonar-collapse 0.6s ease-in 0.2s forwards;
}

@keyframes sonar-collapse {
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* Sidebars slide out */
.tactical-map.is-exiting .command-rail {
  animation: slide-out-left 0.5s ease-in 0.3s forwards;
}

@keyframes slide-out-left {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.tactical-map.is-exiting .info-rail {
  animation: slide-out-right 0.5s ease-in 0.3s forwards;
}

@keyframes slide-out-right {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Cinema bars close in */
.tactical-map.is-exiting .cinema-bar-top {
  animation: bar-close-top 0.6s ease-in 0.5s forwards;
}

.tactical-map.is-exiting .cinema-bar-bottom {
  animation: bar-close-bottom 0.6s ease-in 0.5s forwards;
}

@keyframes bar-close-top {
  to {
    height: 50vh;
  }
}

@keyframes bar-close-bottom {
  to {
    height: 50vh;
  }
}

/* Overall fade to black */
.tactical-map.is-exiting::after {
  content: '';
  position: fixed;
  inset: 0;
  background: black;
  z-index: 9999;
  animation: fade-to-black 0.4s ease-in 0.8s forwards;
  opacity: 0;
  pointer-events: none;
}

@keyframes fade-to-black {
  to {
    opacity: 1;
  }
}

/* ━━━━━━ 3D Grid Floor ━━━━━━ */
.grid-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  perspective: 400px;
  overflow: hidden;
  z-index: 0;
  opacity: 0.4; /* 배경 투명도 낮춤 */
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  transform: rotateX(65deg) translateY(-50%);
  transform-origin: center bottom;
  animation: grid-scroll 20s linear infinite;
}

@keyframes grid-scroll {
  0% { background-position: 0 0; }
  100% { background-position: 0 80px; }
}

/* ━━━━━━ Cinematic Bars ━━━━━━ */
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
  border-bottom: 2px solid var(--c-primary);
  box-shadow: 0 2px 20px rgba(255, 176, 0, 0.3);
}

.cinema-bar-bottom {
  bottom: 0;
  border-top: 2px solid var(--c-primary);
  box-shadow: 0 -2px 20px rgba(255, 176, 0, 0.3);
}

.ticker-wrap {
  width: 100%;
  overflow: hidden;
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

/* ━━━━━━ Background Effects ━━━━━━ */
.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, 
    rgba(10, 5, 0, 0.1) 0%, 
    rgba(10, 5, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  pointer-events: none;
  z-index: 2;
}

/* ━━━━━━ Tactical Map Background ━━━━━━ */
.tactical-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* Contour Lines (등고선) Layer */
.contour-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.contour-lines path {
  animation: contour-drift 30s ease-in-out infinite alternate;
}

@keyframes contour-drift {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50px); }
}

/* Sector Grid Lines (구획선) */
.sector-grid {
  position: absolute;
  inset: 0;
}

.sector-line {
  position: absolute;
  background: rgba(255, 176, 0, 0.06);
}

.sector-h1 {
  top: 30%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,176,0,0.1) 20%, rgba(255,176,0,0.1) 80%, transparent 100%);
}

.sector-h2 {
  top: 70%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,176,0,0.08) 30%, rgba(255,176,0,0.08) 70%, transparent 100%);
}

.sector-v1 {
  left: 25%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, rgba(255,176,0,0.08) 20%, rgba(255,176,0,0.08) 80%, transparent 100%);
}

.sector-v2 {
  right: 25%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, rgba(255,176,0,0.1) 30%, rgba(255,176,0,0.1) 70%, transparent 100%);
}

.sector-diag1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 150%;
  height: 1px;
  background: rgba(255, 176, 0, 0.04);
  transform-origin: 0 0;
  transform: rotate(25deg);
}

.sector-diag2 {
  position: absolute;
  top: 0;
  right: 0;
  width: 150%;
  height: 1px;
  background: rgba(255, 176, 0, 0.04);
  transform-origin: 100% 0;
  transform: rotate(-25deg);
}

/* Sonar/Radar Rings (동심원) - 거대한 회전 레이더 */
.sonar-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.sonar-ring {
  position: absolute;
  border: 2px dashed rgba(255, 176, 0, 0.06);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 300px;
  height: 300px;
  border-color: rgba(255, 176, 0, 0.15);
  border-style: solid;
  animation: ring-rotate 60s linear infinite;
}

.ring-2 {
  width: 600px;
  height: 600px;
  border-color: rgba(255, 176, 0, 0.1);
  border-style: dashed;
  animation: ring-rotate 90s linear infinite reverse;
}

.ring-3 {
  width: 1000px;
  height: 1000px;
  border-color: rgba(255, 176, 0, 0.06);
  animation: ring-rotate 120s linear infinite;
}

.ring-4 {
  width: 1500px;
  height: 1500px;
  border-color: rgba(255, 176, 0, 0.03);
  border-style: dotted;
  animation: ring-rotate 150s linear infinite reverse;
}

@keyframes ring-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Radar Sweep Animation */
.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1200px;
  height: 1200px;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 350deg,
    rgba(255, 176, 0, 0.08) 355deg,
    rgba(255, 176, 0, 0.15) 358deg,
    rgba(255, 200, 100, 0.2) 360deg
  );
  border-radius: 50%;
  animation: radar-spin 8s linear infinite;
  opacity: 0.6;
  mask-image: radial-gradient(circle, black 0%, black 40%, transparent 50%);
  -webkit-mask-image: radial-gradient(circle, black 0%, black 40%, transparent 50%);
}

@keyframes radar-spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Sector Labels (장식 텍스트) */
.sector-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sector-label {
  position: absolute;
  font-family: 'Share Tech Mono', 'Noto Sans KR', monospace;
  font-size: 0.65rem;
  color: rgba(255, 176, 0, 0.25);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.sector-label.coord {
  font-size: 0.6rem;
  color: rgba(255, 176, 0, 0.15);
}

.sector-label.warning {
  color: rgba(255, 100, 50, 0.2);
  animation: warning-blink 2s ease-in-out infinite;
}

@keyframes warning-blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

/* Background Decorative Gears */
.bg-gear {
  position: absolute;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23ffb000' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='35' fill='none' stroke='%23ffb000' stroke-width='0.3' opacity='0.2'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%23ffb000' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M50 5 L53 15 L47 15 Z M50 95 L53 85 L47 85 Z M5 50 L15 53 L15 47 Z M95 50 L85 53 L85 47 Z M14.6 14.6 L22 25 L18 28 Z M85.4 14.6 L78 25 L82 28 Z M14.6 85.4 L22 75 L18 72 Z M85.4 85.4 L78 75 L82 72 Z' fill='%23ffb000' opacity='0.2'/%3E%3C/svg%3E") no-repeat center/contain;
  opacity: 0.08;
  pointer-events: none;
  z-index: 1;
}

.bg-gear-1 {
  width: 350px;
  height: 350px;
  top: -80px;
  right: -80px;
  animation: bg-gear-spin 180s linear infinite;
}

.bg-gear-2 {
  width: 280px;
  height: 280px;
  bottom: -60px;
  left: -60px;
  animation: bg-gear-spin 150s linear infinite reverse;
}

.bg-gear-3 {
  width: 180px;
  height: 180px;
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
  animation: bg-gear-spin 120s linear infinite;
  opacity: 0.05;
}

@keyframes bg-gear-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 176, 0, 0.5), transparent);
  animation: scan 3s linear infinite;
  pointer-events: none;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.3);
}

@keyframes scan {
  0% { top: -10px; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* ━━━━━━ Orbit System (Rotation) ━━━━━━ */
.orbit-system {
  position: absolute;
  top: 0; left: 0;
  transform-origin: center center;
  /* animation: variable-spin 60s infinite linear; */ /* 회전 중지: 가독성 개선 */
}

@keyframes variable-spin {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(40deg); } /* Normal speed */
  40% { transform: rotate(120deg); } /* Fast burst */
  60% { transform: rotate(160deg); } /* Slow down */
  80% { transform: rotate(200deg); } /* Very slow */
  100% { transform: rotate(360deg); } /* Speed up to finish */
}

/* ━━━━━━ SVG Connector Layer ━━━━━━ */
.connector-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

/* Central Hub Node */
.center-node {
  animation: node-pulse 2s ease-in-out infinite;
}

.center-core {
  animation: core-flicker 0.5s ease-in-out infinite alternate;
}

@keyframes node-pulse {
  0%, 100% { opacity: 0.8; r: 8; }
  50% { opacity: 1; r: 10; }
}

@keyframes core-flicker {
  0% { opacity: 0.9; }
  100% { opacity: 1; }
}

/* Energy Lines - Background Glow Trail */
.energy-line-glow {
  stroke: #ff6600;
  stroke-width: 10;
  fill: none;
  opacity: 0.25;
  filter: url(#glow);
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: line-draw 2s linear forwards;
}

/* Energy Lines - Main Cable */
.energy-line {
  stroke: url(#cableGradient);
  stroke-width: 2;
  fill: none;
  filter: url(#glow);
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: line-draw 2s linear forwards;
}

/* Energy Lines - Bright Core */
.energy-line-core {
  stroke: #ffe066;
  stroke-width: 1;
  fill: none;
  opacity: 0.8;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: line-draw 2s linear forwards;
}

/* Line Draw Animation - 중앙에서 선을 그리듯 뽙어나감 */
@keyframes line-draw {
  0% { 
    stroke-dashoffset: 2000; 
  }
  100% { 
    stroke-dashoffset: 0; 
  }
}

/* ━━━━━━ Spark Container (CSS Based) ━━━━━━ */
.spark-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 6;
}

/* Spark/Fuse - Main spark that travels along line */
.spark-container .spark-fuse {
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ffffff 0%, #ffcc00 40%, #ff6600 70%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 15px #ffb000, 0 0 30px rgba(255, 176, 0, 0.6);
  left: var(--start-x);
  top: var(--start-y);
  transform: translate(-50%, -50%);
  animation: spark-travel 2s linear forwards;
}

/* Trailing sparks */
.spark-trail {
  position: absolute;
  border-radius: 50%;
  left: var(--start-x);
  top: var(--start-y);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px #ffb000;
}

.spark-trail-1 {
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #ffcc00 0%, #ff8800 60%, transparent 100%);
  animation: spark-travel 2s linear 0.05s forwards;
  opacity: 0.7;
}

.spark-trail-2 {
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ffb000 0%, #ff6600 60%, transparent 100%);
  animation: spark-travel 2s linear 0.1s forwards;
  opacity: 0.5;
}

.spark-trail-3 {
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #ff8800 0%, transparent 100%);
  animation: spark-travel 2s linear 0.15s forwards;
  opacity: 0.3;
}

/* Spark Travel Animation - moves from center to card position */
@keyframes spark-travel {
  0% {
    left: var(--start-x);
    top: var(--start-y);
    opacity: 1;
    visibility: visible;
  }
  95% {
    opacity: 1;
  }
  100% {
    left: var(--end-x);
    top: var(--end-y);
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes spark-glow {
  0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.95); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
}

/* Data Particles */
.data-particle {
  animation: particle-fade 2s ease-out forwards;
}

@keyframes particle-fade {
  0% { opacity: 0.6; }
  80% { opacity: 0.4; }
  100% { opacity: 0; }
}

/* End Node at Card */
.end-node-group {
  animation: end-node-spawn 0.3s ease-out forwards;
}

.end-node-glow {
  animation: end-node-pulse 1.5s ease-in-out infinite;
}

.end-node-core {
  animation: end-core-spin 3s linear infinite;
}

@keyframes end-node-spawn {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes end-node-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes end-core-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Ambient Data Flow Particles */
.ambient-particles circle {
  animation: ambient-glow 2s ease-in-out infinite alternate;
}

@keyframes ambient-glow {
  0% { opacity: 0.2; }
  100% { opacity: 0.5; }
}

/* ━━━━━━ Data Cards ━━━━━━ */
.card-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.data-card {
  width: 360px;
  cursor: pointer;
  /* Counter-rotate to keep card upright while system spins */
  /* animation: counter-spin 60s infinite linear; */ /* 회전 중지 */
  transition: transform 0.3s ease;
}

@keyframes counter-spin {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-40deg); }
  40% { transform: rotate(-120deg); }
  60% { transform: rotate(-160deg); }
  80% { transform: rotate(-200deg); }
  100% { transform: rotate(-360deg); }
}

.data-card:hover {
  z-index: 100;
  /* Pause rotation on hover? No, might be jarring. Just scale. */
}

/* Card Pop Animation */
.card-pop-enter-active {
  animation: card-spawn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes card-spawn {
  0% {
    opacity: 0;
    transform: scale(0) translateY(20px);
    filter: brightness(3) blur(10px);
  }
  50% {
    filter: brightness(1.5) blur(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: brightness(1) blur(0);
  }
}

.card-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse at center, 
    rgba(255, 176, 0, 0.2) 0%, 
    rgba(255, 136, 0, 0.1) 40%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.data-card.card-active .card-glow {
  opacity: 1;
}

.card-frame {
  background: linear-gradient(
    135deg,
    rgba(20, 15, 5, 0.85) 0%,
    rgba(10, 8, 2, 0.95) 50%,
    rgba(15, 10, 3, 0.9) 100%
  );
  border: 2px solid rgba(255, 176, 0, 0.5);
  padding: 1.5rem;
  position: relative;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 0 20px rgba(0, 0, 0, 0.9),
    inset 0 0 30px rgba(255, 176, 0, 0.03),
    0 4px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* Holographic Scanline Overlay */
.card-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(255, 176, 0, 0.015) 2px,
    rgba(255, 176, 0, 0.015) 4px
  );
  pointer-events: none;
  z-index: 1;
}

/* Holographic Shimmer Effect */
.card-frame::after {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 200, 100, 0.03) 45%,
    rgba(255, 200, 100, 0.05) 50%,
    rgba(255, 200, 100, 0.03) 55%,
    transparent 60%
  );
  animation: holographic-shimmer 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}

@keyframes holographic-shimmer {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30%, 30%) rotate(5deg); }
}

.data-card.card-active .card-frame {
  border-color: #ffb000;
  box-shadow: 
    0 0 40px rgba(255, 176, 0, 0.4),
    0 0 80px rgba(255, 136, 0, 0.2),
    inset 0 0 40px rgba(255, 176, 0, 0.08),
    0 8px 40px rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    135deg,
    rgba(30, 20, 5, 0.9) 0%,
    rgba(20, 15, 3, 0.95) 50%,
    rgba(25, 18, 5, 0.92) 100%
  );
  transform: translateY(-2px);
}

/* Decorative Gears on Card */
.card-gear {
  position: absolute;
  width: 24px;
  height: 24px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffb000'%3E%3Cpath d='M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 2c-1.3 0-2.5-.4-3.5-1.1l-1.8 1.8c.5.9 1.1 1.7 1.9 2.3l1.2-2.4c.7.3 1.4.4 2.2.4s1.5-.1 2.2-.4l1.2 2.4c.8-.6 1.4-1.4 1.9-2.3l-1.8-1.8c-1 .7-2.2 1.1-3.5 1.1zm6.5-4.5c0-.8-.1-1.5-.4-2.2l2.4-1.2c-.6-.8-1.4-1.4-2.3-1.9l-1.8 1.8c-.7-1-1.1-2.2-1.1-3.5h-2c0 1.3-.4 2.5-1.1 3.5l-1.8-1.8c-.9.5-1.7 1.1-2.3 1.9l2.4 1.2c-.3.7-.4 1.4-.4 2.2s.1 1.5.4 2.2l-2.4 1.2c.6.8 1.4 1.4 2.3 1.9l1.8-1.8c.7 1 1.1 2.2 1.1 3.5h2c0-1.3.4-2.5 1.1-3.5l1.8 1.8c.9-.5 1.7-1.1 2.3-1.9l-2.4-1.2c.3-.7.4-1.4.4-2.2z'/%3E%3C/svg%3E") no-repeat center/contain;
  opacity: 0.4;
  animation: gear-spin 6s linear infinite;
  filter: drop-shadow(0 0 3px rgba(255, 176, 0, 0.3));
  z-index: 0;
}
.gear-tl { top: -12px; left: -12px; }
.gear-br { bottom: -12px; right: -12px; animation-direction: reverse; }

.data-card.card-active .card-gear {
  opacity: 0.6;
  filter: drop-shadow(0 0 5px rgba(255, 176, 0, 0.5));
}

@keyframes gear-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Connection Point */
.card-connection-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ffffff 0%, #ffb000 50%, transparent 100%);
  border-radius: 50%;
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
  box-shadow: 0 0 15px #ffb000, 0 0 30px rgba(255, 176, 0, 0.5);
  animation: connection-pulse 1s ease-in-out infinite;
}

@keyframes connection-pulse {
  0%, 100% { transform: translateY(-50%) scale(1); opacity: 1; }
  50% { transform: translateY(-50%) scale(1.2); opacity: 0.8; }
}

/* Corner Brackets */
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #ffb000;
  opacity: 0.7;
  transition: all 0.3s;
  z-index: 4;
}
.tl { top: 3px; left: 3px; border-right: none; border-bottom: none; }
.tr { top: 3px; right: 3px; border-left: none; border-bottom: none; }
.bl { bottom: 3px; left: 3px; border-right: none; border-top: none; }
.br { bottom: 3px; right: 3px; border-left: none; border-top: none; }

.data-card.card-active .corner {
  opacity: 1;
  box-shadow: 0 0 6px rgba(255, 176, 0, 0.6);
}

/* Card Content */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 176, 0, 0.25);
  padding-bottom: 0.5rem;
  position: relative;
  z-index: 3;
}

.era-badge {
  color: #ffb000;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 0 0 8px rgba(255, 176, 0, 0.5);
  letter-spacing: 2px;
}

.integrity {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.integrity.high { 
  color: #00ff88; 
  border-color: #00ff88; 
  background: rgba(0, 255, 136, 0.1);
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
}
.integrity.medium { 
  color: #ffb000; 
  border-color: #ffb000; 
  background: rgba(255, 176, 0, 0.1);
  box-shadow: 0 0 8px rgba(255, 176, 0, 0.3);
}
.integrity.low { 
  color: #ff5555; 
  border-color: #ff5555; 
  background: rgba(255, 85, 85, 0.1);
  box-shadow: 0 0 8px rgba(255, 85, 85, 0.3);
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title {
  color: #fff;
  font-size: 1.7rem;
  font-weight: 700;
  margin: 1rem 0;
  text-shadow: 
    0 0 15px rgba(255, 176, 0, 0.8),
    0 0 30px rgba(255, 136, 0, 0.5),
    0 0 50px rgba(255, 100, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.9);
  min-height: 1.4em;
  letter-spacing: 2px;
  position: relative;
  z-index: 3;
  font-family: 'Noto Sans KR', sans-serif;
}

.card-desc {
  font-size: 0.95rem;
  color: rgba(224, 208, 176, 0.9);
  line-height: 1.8;
  margin: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.card-desc.show {
  max-height: 150px;
  margin-bottom: 0.8rem;
}

.card-footer {
  margin-top: 0.6rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  color: rgba(102, 85, 0, 0.6);
  position: relative;
  z-index: 3;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.record-id {
  text-shadow: none;
}

.status-indicator {
  width: 5px;
  height: 5px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff88, 0 0 15px rgba(0, 255, 136, 0.5);
  animation: indicator-pulse 1.5s ease-in-out infinite;
}

@keyframes indicator-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.8); }
}

/* TypeWriter cursor */
:deep(.cursor) {
  color: #ffb000;
  animation: cursor-blink 0.5s step-end infinite;
  margin-left: 2px;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ━━━━━━ Right Vertical Info Rail ━━━━━━ */
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
  border: 1px solid rgba(255, 176, 0, 0.3);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.gauge-fill-vertical {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #ffe066, #ffb000, #ff6600);
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
  transition: height 0.15s ease;
}

.gauge-animated {
  animation: gauge-pulse 3s ease-in-out infinite;
}

@keyframes gauge-pulse {
  0%, 100% { height: 60%; }
  50% { height: 100%; }
}

.gauge-percent {
  font-size: 0.9rem;
  color: #ffcc00;
  font-weight: bold;
  letter-spacing: 1px;
}

.gauge-glow {
  text-shadow: 0 0 10px rgba(255, 200, 0, 0.8), 0 0 20px rgba(255, 176, 0, 0.5);
}

/* Status Blocks (Vertical Stack) */
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
  color: #aa8800;
  margin-bottom: 2px;
}

.block-value {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 200, 0, 0.5);
  letter-spacing: 1px;
}

.block-value.glow-green {
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.4);
}

.block-value.syncing {
  color: #ff8800;
  animation: syncing-pulse 0.5s infinite;
  text-shadow: 0 0 10px rgba(255, 136, 0, 0.8);
}

.block-label {
  font-size: 0.5rem;
  color: rgba(255, 176, 0, 0.6);
  letter-spacing: 1px;
  margin-top: 1px;
}

.block-divider {
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 176, 0, 0.3), transparent);
  margin: 0.15rem 0;
}

/* Crypto Log Stream */
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
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.45rem;
  color: rgba(255, 176, 0, 0.4);
  letter-spacing: 0.5px;
  white-space: nowrap;
  animation: crypto-scroll 8s linear infinite;
}

.crypto-line:nth-child(odd) {
  animation-delay: -4s;
  color: rgba(0, 255, 136, 0.3);
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

.info-rail .rail-id {
  font-size: 0.5rem;
  color: #554400;
  letter-spacing: 1px;
}

/* ━━━━━━ Central Title Hub (Compact Core) ━━━━━━ */
.central-title-hub {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.hub-core-circle {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Gear Rings */
.core-gear-ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
}

.gear-outer {
  inset: -15px;
  border-color: rgba(255, 176, 0, 0.15);
  border-style: dashed;
  animation: spin 30s linear infinite;
}

.gear-outer::before {
  content: '⚙ ⚙ ⚙ ⚙';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: rgba(255, 176, 0, 0.2);
  letter-spacing: 60px;
  animation: spin 30s linear infinite reverse;
}

.gear-middle {
  inset: -5px;
  border: 2px solid rgba(255, 176, 0, 0.25);
  animation: spin 20s linear infinite reverse;
}

.core-outer-ring {
  position: absolute;
  inset: 5px;
  border: 2px dashed rgba(255, 176, 0, 0.4);
  border-radius: 50%;
  animation: spin 15s linear infinite;
}

.core-inner-ring {
  position: absolute;
  inset: 15px;
  border: 1px solid rgba(255, 176, 0, 0.6);
  border-radius: 50%;
  box-shadow: 
    0 0 30px rgba(255, 176, 0, 0.2),
    inset 0 0 20px rgba(255, 176, 0, 0.1);
}

/* Data Streams */
.core-data-streams {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.data-stream {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffcc00;
  border-radius: 50%;
  box-shadow: 0 0 8px #ffb000, 0 0 15px rgba(255, 176, 0, 0.5);
}

.stream-1 {
  animation: orbit-stream 3s linear infinite;
}
.stream-2 {
  animation: orbit-stream 3s linear infinite 0.75s;
}
.stream-3 {
  animation: orbit-stream 3s linear infinite 1.5s;
}
.stream-4 {
  animation: orbit-stream 3s linear infinite 2.25s;
}

@keyframes orbit-stream {
  0% { top: 50%; left: 0; opacity: 0; }
  10% { opacity: 1; }
  50% { top: 0; left: 50%; }
  90% { opacity: 1; }
  100% { top: 50%; left: 100%; opacity: 0; }
}

/* Pulse Rings */
.core-pulse {
  position: absolute;
  inset: 20px;
  border: 2px solid rgba(255, 176, 0, 0.5);
  border-radius: 50%;
  animation: core-pulse-anim 2s ease-out infinite;
}

.pulse-2 {
  animation-delay: 1s;
}

@keyframes core-pulse-anim {
  0% {
    transform: scale(1);
    opacity: 0.8;
    border-color: rgba(255, 200, 0, 0.8);
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
    border-color: rgba(255, 136, 0, 0);
  }
}

/* Core Content */
.core-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(15, 12, 5, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%);
  border-radius: 50%;
  border: 2px solid rgba(255, 176, 0, 0.4);
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 50px rgba(0, 0, 0, 0.9),
    inset 0 0 40px rgba(255, 176, 0, 0.03),
    0 0 80px rgba(255, 136, 0, 0.12);
}

/* Floating Labels */
.core-floating-label {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255, 176, 0, 0.5);
  letter-spacing: 2px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 176, 0, 0.2);
  border-radius: 3px;
  animation: float-label 3s ease-in-out infinite;
}

.label-top {
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
}

.label-bottom {
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1.5s;
}

@keyframes float-label {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.core-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffb000;
  letter-spacing: 4px;
  text-shadow: 
    0 0 25px rgba(255, 176, 0, 0.9),
    0 0 50px rgba(255, 136, 0, 0.6),
    0 0 80px rgba(255, 100, 0, 0.3),
    0 3px 6px rgba(0, 0, 0, 0.9);
  animation: title-glow 2s ease-in-out infinite;
}

@keyframes title-glow {
  0%, 100% { 
    text-shadow: 0 0 25px rgba(255, 176, 0, 0.9), 0 0 50px rgba(255, 136, 0, 0.6);
    transform: scale(1);
  }
  50% { 
    text-shadow: 0 0 35px rgba(255, 200, 0, 1), 0 0 70px rgba(255, 176, 0, 0.8);
    transform: scale(1.02);
  }
}

.core-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: #00ff88;
  letter-spacing: 2px;
  padding: 5px 14px;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.4);
  border-radius: 20px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  animation: status-blink 1s infinite;
  box-shadow: 0 0 8px #00ff88;
}

@keyframes status-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.core-data-rate {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: #665500;
  margin-top: 3px;
  letter-spacing: 1px;
}

/* Scan Lines */
.core-scan-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 0, 0.9), transparent);
  transform-origin: center;
  animation: scan-rotate 4s linear infinite;
  opacity: 0.6;
  pointer-events: none;
}

.scan-line-2 {
  width: 160px;
  height: 1px;
  animation: scan-rotate 4s linear infinite reverse;
  animation-delay: 2s;
  opacity: 0.3;
}

@keyframes scan-rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Corner Bolts */
.core-bolt {
  position: absolute;
  font-size: 0.7rem;
  color: rgba(255, 176, 0, 0.3);
  text-shadow: 0 0 5px rgba(255, 176, 0, 0.2);
}

.bolt-tl { top: 25px; left: 25px; }
.bolt-tr { top: 25px; right: 25px; }
.bolt-bl { bottom: 25px; left: 25px; }
.bolt-br { bottom: 25px; right: 25px; }

/* ━━━━━━ Left Command Rail ━━━━━━ */
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

/* ━━━━━━ Hex Codes Layer ━━━━━━ */
.hex-codes-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.hex-code {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: rgba(255, 176, 0, 0.08);
  letter-spacing: 1px;
  animation: hex-flicker 4s infinite ease-in-out;
}

.hex-code:nth-child(odd) {
  animation-delay: -2s;
}

.hex-code:nth-child(3n) {
  animation-duration: 6s;
}

@keyframes hex-flicker {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.15; }
  75% { opacity: 0.03; }
}

/* ━━━━━━ HUD Scope Frame ━━━━━━ */
.scope-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}

.scope-corner {
  position: absolute;
  font-size: 2.5rem;
  color: rgba(255, 176, 0, 0.15);
  font-weight: 100;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.2);
}

.scope-tl { top: 30px; left: 30px; }
.scope-tr { top: 30px; right: 30px; }
.scope-bl { bottom: 30px; left: 30px; }
.scope-br { bottom: 30px; right: 30px; }

.scope-edge {
  position: absolute;
  background: rgba(255, 176, 0, 0.08);
}

.scope-edge-top {
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
}

.scope-edge-bottom {
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
}

.scope-edge-left {
  left: 45px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 80px;
}

.scope-edge-right {
  right: 45px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 80px;
}

/* ━━━━━━ CRT & Vignette Overlays ━━━━━━ */
.crt-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  opacity: 0.5;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

/* ━━━━━━ Card Guide Lines & Decorations ━━━━━━ */
.guide-line {
  position: absolute;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 176, 0, 0.3) 50%,
    transparent 100%
  );
  animation: guide-pulse 2s infinite ease-in-out;
}

.guide-h-top, .guide-h-bottom {
  height: 1px;
  width: 60%;
  left: 20%;
}

.guide-h-top { top: -8px; }
.guide-h-bottom { bottom: -8px; }

.guide-v-left, .guide-v-right {
  width: 1px;
  height: 40%;
  top: 30%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 176, 0, 0.3) 50%,
    transparent 100%
  );
}

.guide-v-left { left: -8px; }
.guide-v-right { right: -8px; }

@keyframes guide-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

.conn-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ffb000;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 176, 0, 0.8),
              0 0 15px rgba(255, 176, 0, 0.4);
  animation: dot-pulse 1.5s infinite ease-in-out;
}

.conn-dot-1 { top: 50%; left: -3px; transform: translateY(-50%); }
.conn-dot-2 { top: -3px; left: 50%; transform: translateX(-50%); }
.conn-dot-3 { bottom: -3px; left: 50%; transform: translateX(-50%); }

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.card-header .badge {
  background: rgba(255, 176, 0, 0.15);
  border: 1px solid rgba(255, 176, 0, 0.3);
  padding: 2px 6px;
  font-size: 0.5rem;
  color: #ffcc00;
  letter-spacing: 1px;
  font-family: 'Share Tech Mono', monospace;
}

.status-tags {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.status-tags .tag {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.2);
  padding: 1px 5px;
  font-size: 0.45rem;
  color: rgba(0, 255, 136, 0.7);
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.5px;
}

.status-tags .tag-archived {
  background: rgba(255, 176, 0, 0.1);
  border-color: rgba(255, 176, 0, 0.3);
  color: rgba(255, 176, 0, 0.7);
}

.status-tags .tag-verified {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.3);
  color: rgba(0, 255, 136, 0.7);
}

/* ━━━━━━ Data Packet Animation ━━━━━━ */
.data-packet {
  filter: drop-shadow(0 0 4px rgba(255, 204, 0, 0.8))
          drop-shadow(0 0 8px rgba(255, 204, 0, 0.5));
}

.data-packets {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.connector-layer.active .data-packets {
  opacity: 1;
}

/* ━━━━━━ Animations ━━━━━━ */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ━━━━━━ Responsive ━━━━━━ */
@media (max-width: 1200px) {
  .data-card {
    width: 240px;
  }
}

@media (max-width: 900px) {
  .data-card {
    width: 200px;
  }
}

/* Sidebar entrance animation (only from home) */
.tactical-map.from-home .command-rail {
  animation: sidebar-enter-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.6s;
  /* opacity: 0; */
  /* transform: translateX(-100%); */
  transition: none;
}

.tactical-map.from-home .info-rail {
  animation: sidebar-enter-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.7s;
  /* opacity: 0; */
  /* transform: translateX(100%); */
  transition: none;
}

@keyframes sidebar-enter-left {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 0.85; }
}

@keyframes sidebar-enter-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
/* Volume Control & Return Button */
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