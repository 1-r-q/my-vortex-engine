<template>
  <!-- 클라이언트 준비 전 로딩 화면 -->
  <div v-if="!isClientReady" class="boot-loading">
    <div class="loading-text">INITIALIZING...</div>
  </div>
  
  <!-- 부팅 스크린 -->
  <BootScreen v-else-if="!isBooted" @close-boot="onBootComplete" />
  
  <!-- 메인 콘텐츠 -->
  <div v-else class="main-content-wrapper notranslate" translate="no">
    <canvas id="layout-matrix-canvas"></canvas>
    
    <!-- Global Page Transition Overlay (Disabled) -->
    <!-- <div class="transition-overlay" 
         :class="[transitionState.type, transitionState.phase]" 
         v-if="transitionState.isTransitioning">
      
      <div class="gear-wipe-container" v-if="transitionState.type === 'gear-wipe'">
        <div class="gear-bg"></div>
        <div class="gear-set">
          <div class="gear gear-tl">
            <svg viewBox="0 0 100 100">
              <path d="M50 0 L60 10 L70 0 L80 10 L90 0 L100 20 L80 40 L100 60 L80 80 L60 100 L40 80 L20 100 L0 80 L20 60 L0 40 L20 20 L0 0 L20 0 L30 10 L40 0 Z" fill="#8b5a2b" />
              <circle cx="50" cy="50" r="30" fill="#3e2723" />
              <circle cx="50" cy="50" r="10" fill="#1a1005" />
            </svg>
          </div>
          <div class="gear gear-br">
            <svg viewBox="0 0 100 100">
              <path d="M50 0 L60 10 L70 0 L80 10 L90 0 L100 20 L80 40 L100 60 L80 80 L60 100 L40 80 L20 100 L0 80 L20 60 L0 40 L20 20 L0 0 L20 0 L30 10 L40 0 Z" fill="#cd7f32" />
              <circle cx="50" cy="50" r="30" fill="#5d4037" />
              <circle cx="50" cy="50" r="10" fill="#1a1005" />
            </svg>
          </div>
          <div class="gear gear-c">
            <svg viewBox="0 0 100 100">
              <path d="M50 5 L55 15 L65 5 L70 15 L80 5 L95 20 L85 30 L95 40 L85 50 L95 60 L85 70 L95 80 L80 95 L70 85 L60 95 L50 85 L40 95 L30 85 L20 95 L5 80 L15 70 L5 60 L15 50 L5 40 L15 30 L5 20 L20 5 L30 15 L40 5 Z" fill="#ffb000" />
              <circle cx="50" cy="50" r="20" fill="#3e2723" />
            </svg>
          </div>
        </div>
        <div class="steam-overlay"></div>
      </div>

      <div class="blast-door-container" v-if="transitionState.type === 'blast-door'">
        <div class="door-panel left">
          <div class="hazard-stripe"></div>
        </div>
        <div class="door-panel right">
          <div class="hazard-stripe"></div>
        </div>
        <div class="door-lock-mech">
          <div class="lock-ring"></div>
          <div class="lock-core"></div>
          <div class="lock-status">LOCKED</div>
        </div>
      </div>

      <div class="crt-blink-container" v-if="transitionState.type === 'crt-blink'">
        <div class="crt-content">
          <div class="crt-text">LOADING PERSONAL DATA...</div>
        </div>
        <div class="crt-white-dot"></div>
      </div>

      <div class="blueprint-scan-container" v-if="transitionState.type === 'blueprint-scan'">
        <div class="blueprint-grid"></div>
        <div class="scan-line"></div>
      </div>

      <div class="system-reboot-container" v-if="transitionState.type === 'system-reboot'">
        <div class="terminal-screen">
          <div class="term-line">INITIALIZING CORE...</div>
          <div class="term-line">LOADING RULES...</div>
          <div class="term-line">CHECKING INTEGRITY...</div>
          <div class="term-line">SYSTEM READY</div>
        </div>
      </div>

    </div> -->

    <CustomHome v-if="frontmatter.layout === 'home'" />
    
    <Layout v-else>
      <template #sidebar-nav-after>
        <div class="sound-control-panel">
          <div class="control-header">
            <span class="control-icon">🔊</span>
            <span class="control-label">AMBIENCE</span>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              :value="ambientVolume" 
              @input="updateVolume"
              class="steam-slider"
            />
            <div class="slider-track"></div>
            <div class="slider-fill" :style="{ width: (ambientVolume * 100) + '%' }"></div>
          </div>
          <div class="volume-value">{{ Math.round(ambientVolume * 100) }}%</div>
        </div>
      </template>
    </Layout>
  </div>
</template>

<script setup>  
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';

// [경로 수정 완료] 
// components 폴더가 아니라 같은 위치(theme 폴더)에 있으므로 ./ 파일명 사용
import BootScreen from './BootScreen.vue'; 
import CustomHome from './components/CustomHome.vue'; 
import { transitionState } from './transitionState'; 
import { useSteamSound } from './composables/useSteamSound';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
const { setCategoryVolume, getCategoryVolume, playHover, playClick, categoryVolumes } = useSteamSound();

const ambientVolume = computed({
  get: () => categoryVolumes.ambient,
  set: (val) => setCategoryVolume('ambient', val)
});

const updateVolume = (e) => {
  const val = parseFloat(e.target.value);
  ambientVolume.value = val;
};

// --- [CORE LOGIC: SESSION CONTROL] ---
// 클라이언트 준비 상태 (SSR/하이드레이션 문제 해결)
const isClientReady = ref(false);
const isBooted = ref(typeof window !== 'undefined' && sessionStorage.getItem('vortex_booted') === 'true');
const isChecking = ref(true);
let matrixInterval = null;

// --- [MATRIX EFFECT LOGIC] ---
const initMatrix = () => {
  const canvas = document.getElementById('layout-matrix-canvas');
  if (!canvas) return; // 캔버스 없으면 중단
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const characters = "010101VORTEX_SYSTEM_BOOT_FAILURE_RETRY"; 
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = [];

  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  const draw = () => {
    // 잔상 효과
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 텍스트 색상: 테마에 맞춰 Amber(#ffb000)
    ctx.fillStyle = '#ffb000'; 
    ctx.font = 'bold ' + fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };

  if (matrixInterval) clearInterval(matrixInterval);
  matrixInterval = setInterval(draw, 50);

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;
  };
  window.addEventListener('resize', handleResize);
  
  window._matrixCleanup = () => {
    clearInterval(matrixInterval);
    window.removeEventListener('resize', handleResize);
  };
};

// [EVENT] 부팅 화면 종료 시 실행
const onBootComplete = () => {
  console.log("[SYSTEM] BOOT SEQUENCE COMPLETE");
  isBooted.value = true;
  
  // 초기 볼륨 설정
  ambientVolume.value = getCategoryVolume('ambient') || 0.3;
  
  // ★ 세션 스토리지에 기록 (브라우저 닫기 전까지 유지)
  sessionStorage.setItem('vortex_booted', 'true');
  
  // 화면 전환 후 매트릭스 시작
  nextTick(() => {
    initMatrix();
  });
};

// [LIFECYCLE] 앱 로드 시 판단
onMounted(() => {
  // 클라이언트에서만 sessionStorage 확인 (SSR 하이드레이션 문제 해결)
  if (sessionStorage.getItem('vortex_booted')) {
    isBooted.value = true;
    nextTick(() => {
      initMatrix();
    });
  }
  
  // 클라이언트 준비 완료
  isClientReady.value = true;
  isChecking.value = false;

  // 전역 사운드 이벤트 리스너
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .VPButton, .link, .item, .rail-btn, .control-btn')) {
      playClick();
    }
  });
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, .VPButton, .link, .item, .rail-btn, .control-btn');
    if (target) {
      // 같은 요소 내부에서의 이동은 무시
      if (!e.relatedTarget || !target.contains(e.relatedTarget)) {
        playHover();
      }
    }
  });
});

onUnmounted(() => {
  if (window._matrixCleanup) window._matrixCleanup();
});
</script>

<style>
/* 전역 배경 투명화 (매트릭스 레인이 뒤에 보이도록) */
:root {
  --vp-c-bg: transparent !important;
  --vp-c-bg-alt: rgba(0, 0, 0, 0.5) !important;
}
body {
  background-color: #050505; /* 실제 배경색은 body에 지정 */
  margin: 0;
}
</style>

<style scoped>
/* 초기 로딩 화면 */
.boot-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050505;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.boot-loading .loading-text {
  color: #ffb000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2rem;
  letter-spacing: 4px;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* 매트릭스 캔버스 스타일 */
#layout-matrix-canvas {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh;
  z-index: -1; /* 콘텐츠 뒤로 이동 */
  pointer-events: none;
  opacity: 0.25; /* 존재감을 줄임 */
}

/* --- Page Transition Styles --- */
.transition-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 9999;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* A. Gear Wipe */
.gear-wipe-container {
  position: absolute;
  width: 100%; height: 100%;
  background: #000; /* Base background */
  opacity: 0;
  transition: opacity 0.5s;
}
.in .gear-wipe-container { opacity: 1; }
.out .gear-wipe-container { opacity: 0; transition-delay: 1s; }

.gear-set {
  position: absolute;
  width: 100%; height: 100%;
  overflow: hidden;
}

.gear {
  position: absolute;
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.8));
}
.gear svg { width: 100%; height: 100%; }

/* Gear TL: Top Left, Huge */
.gear-tl {
  top: -50%; left: -50%;
  width: 150vmax; height: 150vmax;
  transform: translate(-20%, -20%) rotate(0deg);
  transition: transform 1.5s cubic-bezier(0.7, 0, 0.3, 1);
}
.in .gear-tl { transform: translate(0, 0) rotate(45deg); }
.out .gear-tl { transform: translate(-20%, -20%) rotate(90deg); }

/* Gear BR: Bottom Right, Huge */
.gear-br {
  bottom: -50%; right: -50%;
  width: 150vmax; height: 150vmax;
  transform: translate(20%, 20%) rotate(0deg);
  transition: transform 1.5s cubic-bezier(0.7, 0, 0.3, 1);
}
.in .gear-br { transform: translate(0, 0) rotate(-45deg); }
.out .gear-br { transform: translate(20%, 20%) rotate(-90deg); }

/* Gear C: Center, Small */
.gear-c {
  top: 50%; left: 50%;
  width: 40vmax; height: 40vmax;
  transform: translate(-50%, -50%) scale(0) rotate(0deg);
  transition: transform 1.2s cubic-bezier(0.5, 1.5, 0.5, 1) 0.3s;
  z-index: 10;
}
.in .gear-c { transform: translate(-50%, -50%) scale(1) rotate(180deg); }
.out .gear-c { transform: translate(-50%, -50%) scale(0) rotate(360deg); transition-delay: 0s; }

.steam-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 1s;
}
.in .steam-overlay { opacity: 1; transition-delay: 1s; }

/* B. Blast Door */
.blast-door-container {
  position: absolute;
  width: 100%; height: 100%;
  z-index: 10;
}
.door-panel {
  position: absolute;
  top: 0; width: 50%; height: 100%;
  background: repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 20px, #222 20px, #222 40px);
  border: 4px solid #333;
  box-shadow: 0 0 50px #000;
  transition: transform 0.6s cubic-bezier(0.6, 0, 0.2, 1); /* Fast slam */
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.door-panel.left { left: 0; transform: translateX(-100%); border-right: 8px solid #444; }
.door-panel.right { right: 0; transform: translateX(100%); border-left: 8px solid #444; }

.in .door-panel.left { transform: translateX(0); }
.in .door-panel.right { transform: translateX(0); }
.out .door-panel.left { transform: translateX(-100%); transition-delay: 0.5s; }
.out .door-panel.right { transform: translateX(100%); transition-delay: 0.5s; }

.hazard-stripe {
  width: 100%; height: 100px;
  background: repeating-linear-gradient(
    -45deg,
    #ffb000,
    #ffb000 20px,
    #000 20px,
    #000 40px
  );
  opacity: 0.8;
}

.door-lock-mech {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 300px; height: 300px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-ring {
  position: absolute;
  width: 100%; height: 100%;
  border: 20px dashed #555;
  border-radius: 50%;
  transform: scale(0) rotate(-180deg);
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.in .lock-ring { transform: scale(1) rotate(0deg); transition-delay: 0.4s; }
.out .lock-ring { transform: scale(0) rotate(180deg); transition-delay: 0s; }

.lock-core {
  position: absolute;
  width: 60%; height: 60%;
  background: #222;
  border: 5px solid #ffb000;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.in .lock-core { transform: scale(1); transition-delay: 0.6s; }
.out .lock-core { transform: scale(0); transition-delay: 0.1s; }

.lock-status {
  position: absolute;
  color: #ff0000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px #ff0000;
  opacity: 0;
}
.in .lock-status { opacity: 1; animation: blink-fast 0.2s infinite; transition-delay: 0.8s; }
.out .lock-status { opacity: 0; }

/* C. CRT Blink */
.crt-blink-container {
  position: absolute;
  width: 100%; height: 100%;
  background: #000;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.in .crt-blink-container { animation: crt-turn-off 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
.out .crt-blink-container { animation: crt-turn-on 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

.crt-content {
  opacity: 0;
  transition: opacity 0.1s;
}
.in .crt-content { opacity: 1; transition-delay: 0.6s; }
.out .crt-content { opacity: 0; }

.crt-text {
  color: #fff;
  font-family: monospace;
  font-size: 1.5rem;
  animation: blink 1s infinite;
}

.crt-white-dot {
  position: absolute;
  width: 10px; height: 10px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px #fff;
  opacity: 0;
}

@keyframes crt-turn-off {
  0% { transform: scale(1, 1); opacity: 0; }
  20% { transform: scale(1, 1); opacity: 1; filter: brightness(2); }
  50% { transform: scale(1, 0.005); opacity: 1; }
  100% { transform: scale(0, 0); opacity: 1; background: #000; }
}

@keyframes crt-turn-on {
  0% { transform: scale(0, 0); opacity: 1; background: #000; }
  50% { transform: scale(1, 0.005); opacity: 1; }
  100% { transform: scale(1, 1); opacity: 0; background: transparent; }
}

/* D. Blueprint Scan */
.blueprint-scan-container {
  position: absolute;
  width: 100%; height: 100%;
  background: #001a33; /* Deep Blue */
  z-index: 15;
  transform: translateY(-100%);
  transition: transform 0.1s; /* Instant reset */
}
.in .blueprint-scan-container { transform: translateY(0); transition: none; } /* Visible */
.out .blueprint-scan-container { transform: translateY(0); opacity: 0; transition: opacity 0.5s 0.5s; }

.blueprint-grid {
  position: absolute;
  width: 100%; height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0;
}
.in .blueprint-grid { opacity: 1; transition: opacity 0.1s 0.5s; }

.scan-line {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 10px;
  background: #00ffff;
  box-shadow: 0 0 20px #00ffff;
  z-index: 20;
}
.in .scan-line { animation: scan-down 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.out .scan-line { animation: scan-down 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

@keyframes scan-down {
  0% { top: -10%; }
  100% { top: 110%; }
}

/* E. System Reboot */
.system-reboot-container {
  position: absolute;
  width: 100%; height: 100%;
  background: #000;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.in .system-reboot-container { opacity: 1; animation: glitch-in 0.2s forwards; }
.out .system-reboot-container { opacity: 0; transition: opacity 0.5s; }

.terminal-screen {
  font-family: 'Share Tech Mono', monospace;
  color: #00ff00;
  font-size: 1.5rem;
  text-align: left;
  width: 80%;
}

.term-line {
  opacity: 0;
  transform: translateY(20px);
}
.in .term-line:nth-child(1) { animation: term-type 0.1s forwards 0.3s; }
.in .term-line:nth-child(2) { animation: term-type 0.1s forwards 0.6s; }
.in .term-line:nth-child(3) { animation: term-type 0.1s forwards 0.9s; }
.in .term-line:nth-child(4) { animation: term-type 0.1s forwards 1.2s; color: #fff; text-shadow: 0 0 10px #fff; }

@keyframes term-type {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glitch-in {
  0% { clip-path: inset(50% 0 50% 0); }
  100% { clip-path: inset(0 0 0 0); }
}

/* --- Shared Animations --- */
@keyframes spin-slow { 100% { transform: rotate(360deg); } }
@keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
@keyframes blink-fast { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }


@keyframes glitch {
  0%, 90% { clip-path: none; transform: translate(0); }
  91% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
  92% { clip-path: inset(50% 0 20% 0); transform: translate(2px, -2px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
  93% { clip-path: inset(10% 0 60% 0); transform: translate(-2px, 2px); text-shadow: 0 2px #ff0000, 0 -2px #00ffff; }
  94% { clip-path: none; transform: translate(0); }
  95% { clip-path: inset(30% 0 20% 0); transform: translate(2px, -2px); text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
  96% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
  97% { clip-path: inset(40% 0 30% 0); transform: translate(2px, -2px); text-shadow: 0 2px #ff0000, 0 -2px #00ffff; }
  98%, 100% { clip-path: none; transform: translate(0); }
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

/* Sound Control Panel */
.sound-control-panel {
  padding: 16px;
  margin-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
  background: rgba(0, 0, 0, 0.2);
}

.control-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #ffb000;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
}

.slider-container {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.steam-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: transparent;
  outline: none;
  z-index: 2;
  cursor: pointer;
}

.steam-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px; /* 터치하기 쉽게 크기 증가 */
  height: 20px;
  background: #ffb000;
  border: 2px solid #000;
  border-radius: 50%;
  box-shadow: 0 0 5px #ffb000;
  cursor: pointer;
  margin-top: -8px; /* 중앙 정렬 조정 */
}

.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 176, 0, 0.2);
  transform: translateY(-50%);
  z-index: 1;
}

.slider-fill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background: #ffb000;
  transform: translateY(-50%);
  z-index: 1;
  box-shadow: 0 0 5px rgba(255, 176, 0, 0.5);
}

.volume-value {
  text-align: right;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: rgba(255, 176, 0, 0.8);
  margin-top: 4px;
}
</style>
