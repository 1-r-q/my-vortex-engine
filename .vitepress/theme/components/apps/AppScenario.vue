<template>
  <MobileScenario v-if="isMobile" @close="handleClose" />

  <div class="mission-terminal" :class="{ 'closing': isClosing, 'system-active': isLoaded, 'content-active': isContentLoaded }" v-else>
    <!-- Left Panel: Data Cartridge Bay -->
    <aside class="cartridge-bay">
      <div class="bay-header">
        <div class="header-title">DATA_CARTRIDGES</div>
        <div class="header-sub">STORAGE_UNIT_09</div>
      </div>
      
      <div class="cartridge-list">
        <div 
          v-for="(chapter, index) in chapters" 
          :key="index"
          class="cartridge-slot"
          :class="{ 'active': selectedIndex === index, 'locked': !unlockedIndices.includes(index) }"
          :style="{ '--delay': (index * 0.1) + 's' }"
          @click="selectChapter(index)"
          @mouseover="playHover"
        >
          <div class="data-chip">
            <div class="chip-connector"></div>
            <div class="chip-body">
              <div class="chip-id">REC-{{ 900 + index }}</div>
              <div class="chip-label">{{ chapter.title }}</div>
              <div class="chip-status-light"></div>
            </div>
            <div class="lock-overlay" v-if="!unlockedIndices.includes(index)">
              <span class="lock-icon">🔒</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bay-footer">
        <div class="capacity-bar">
          <div class="fill" :style="{ width: capacityPercentage + '%' }"></div>
        </div>
        <div class="capacity-text">CAPACITY: {{ displayedCapacity }}%</div>
      </div>
    </aside>

    <!-- Right Panel: Tactical Viewport -->
    <main class="tactical-viewport">
      <div class="monitor-frame">
        <!-- Rivets -->
        <div class="rivet top-left"></div>
        <div class="rivet top-right"></div>
        <div class="rivet bottom-left"></div>
        <div class="rivet bottom-right"></div>

        <!-- CRT Screen Content -->
        <div class="crt-screen">
          <!-- Scanlines & Grid -->
          <div class="screen-grid"></div>
          <div class="screen-scanline"></div>
          <div class="screen-glow"></div>

          <!-- Content Wrapper -->
          <div class="screen-content">
            
            <!-- Header Section -->
            <header class="briefing-header">
              <div class="top-decor">
                <div class="hazard-stripe"></div>
                <div class="header-right-group">
                  <div class="mini-radar">
                    <div class="radar-grid"></div>
                    <div class="radar-sweep"></div>
                  </div>
                  <div class="classification-stamp">TOP SECRET // EYES ONLY</div>
                </div>
              </div>
              
              <div class="mission-title-row">
                <div class="title-deco-line"></div>
                <span class="title-serial left">OP-{{ 900 + selectedIndex }}</span>
                <h1 class="mission-title">{{ selectedChapter.title }}</h1>
                <span class="title-serial right">REV.04</span>
                <div class="title-deco-line"></div>
              </div>

              <!-- Operation Parameter Bar -->
              <div class="op-param-bar">
                <span> TIME: {{ selectedChapter.time }}</span><span class="sep">|</span>
                <span> LOC: {{ selectedChapter.loc }}</span><span class="sep">|</span>
                <span> WEATHER: {{ selectedChapter.weather }}</span><span class="sep">|</span>
                <span> DIFFICULTY: {{ selectedChapter.difficulty }}</span>
              </div>

              <div class="header-divider"></div>
            </header>

            <!-- Body Section -->
            <div class="briefing-body" v-if="isUnlocked">
              
              <!-- Info Card: Situation -->
              <div class="info-card situation">
                <div class="card-label">>> SITUATION_REPORT</div>
                <p class="card-text">{{ selectedChapter.bg }}</p>
              </div>

              <div class="row-split">
                <!-- Info Card: Threat (Alert) -->
                <div class="info-card threat alert-box">
                  <div class="card-label">>> THREAT_ASSESSMENT</div>
                  <p class="card-text">{{ selectedChapter.crisis }}</p>
                </div>

                <!-- Info Card: Risk (Alert) -->
                <div class="info-card risk alert-box" v-if="selectedChapter.stagnation">
                  <div class="card-label">>> CRITICAL_FAILURE_RISK</div>
                  <p class="card-text">{{ selectedChapter.stagnation }}</p>
                </div>
              </div>

              <!-- Info Card: Objective -->
              <div class="info-card objective" v-if="selectedChapter.objective">
                <div class="card-label">>> MISSION_OBJECTIVE</div>
                <p class="card-text">{{ selectedChapter.objective }}</p>
              </div>

            </div>

            <!-- Locked View -->
            <div class="locked-view" v-else @click="handleLockInteraction">
              <div class="access-denied-box" :class="{ 'interactive': selectedChapter.relatedChar }">
                <div class="denied-title">ACCESS DENIED</div>
                <div class="denied-sub">ENCRYPTED DATA STREAM DETECTED</div>
                <div class="hex-dump">{{ randomHex }}</div>
                <div class="decrypt-hint" v-if="selectedChapter.relatedChar">
                  >> SIGNAL DETECTED: {{ selectedChapter.relatedChar }} <<
                  <br>
                  <span class="click-count" v-if="clickCounts[selectedIndex] > 0">
                    DECRYPTING... {{ Math.min(clickCounts[selectedIndex] * 5, 99) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer Controls -->
            <footer class="control-panel">
              <button class="nav-btn" @click="handleClose">
                <span class="btn-text">ABORT / RETURN</span>
              </button>
              
              <div class="ignition-wrapper">
                <a 
                  v-if="isUnlocked"
                  target="_blank" 
                  class="ignition-switch"
                >
                  <div class="switch-cover"></div>
                  <span class="switch-text">INITIATE SIMULATION</span>
                  <div class="switch-glow"></div>
                </a>
                <div v-else class="ignition-switch disabled">
                  <span class="switch-text">LOCKED</span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </main>
    <!-- Hidden Dialog Overlay -->
    <div class="hidden-dialog" v-if="showHiddenDialog">
      <div class="dialog-box">
        <div class="dialog-header">>> INCOMING TRANSMISSION <<</div>
        <div class="dialog-content">{{ hiddenDialogText }}</div>
        <div class="dialog-footer">ACCESS GRANTED</div>
      </div>
    </div>

    <!-- Password Dialog -->
    <div class="hidden-dialog" v-if="showPasswordDialog">
      <div class="dialog-box password-mode" :class="{ 'access-denied-shake': passwordError }">
        <div class="dialog-header">>> SECURITY CHECKPOINT <<</div>
        <div class="dialog-content">
          <p style="color: #ffb000; margin-bottom: 10px;">ENTER ACCESS CODE:</p>
          <input 
            type="text" 
            v-model="passwordInput" 
            @keyup.enter="checkPassword"
            class="terminal-input" 
            :class="{ 'error': passwordError }"
            placeholder="INPUT_CODE"
            autofocus
          />
        </div>
        <div class="dialog-footer">
          <button class="action-btn" @click="checkPassword">VERIFY</button>
          <button class="action-btn cancel" @click="handleCancelPassword">CANCEL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { usePageTransition } from '../../transitionState';
import { useSteamSound } from '../../composables/useSteamSound';
import { withBase } from 'vitepress';
import MobileScenario from './mobile/MobileScenario.vue';

const emit = defineEmits(['close']);
const { startTransition } = usePageTransition();
const { playClick, playUnlock, playHover, playFail, playCancel } = useSteamSound();
const isClosing = ref(false);
const isLoaded = ref(false);
const isContentLoaded = ref(false);

const isMobile = ref(false);
const checkMobile = () => {
    if (typeof window !== 'undefined') {
        isMobile.value = window.innerWidth <= 768;
    }
};

const handleClose = () => {
  isClosing.value = true;
  setTimeout(() => {
    startTransition('gear-wipe', withBase('/index.html'));
  }, 600);
};

const selectedIndex = ref(0);
const randomHex = ref('');
const unlockedIndices = ref([0]); // Chapter 1 is unlocked by default
const clickCounts = ref({}); // Track clicks for hidden unlock
const showHiddenDialog = ref(false);
const hiddenDialogText = ref('');
const showPasswordDialog = ref(false);
const passwordInput = ref('');
const passwordError = ref(false);

let hexInterval = null;

const chapters = [
  {
    title: '폐기장의 각성',
    bg: '폐기장 구역. 새벽의 안개와 부식된 기계 잔해가 가득하다. 스캐빈저의 경보음이 울리고 있다.',
    crisis: '동력 저하 및 외부 위협 감지. 즉각적인 탈출 필요.',
    stagnation: '기체 부식 가속 및 적 증원.',
    objective: '출구 확보 및 기체 점검 → 2장으로 이동.',
    time: '0430', loc: 'SCRAPYARD', weather: 'FOG', difficulty: 'NORMAL'
  },
  {
    title: '검은 거래와 신분',
    bg: '하층 암시장 구역. 현재 수배 중이며 불량품으로 식별되었습니다. 긴급 수리 및 보급이 필요합니다. (가이드: 눈에 띄는 상태. 뇌물을 통해 상층 지도를 얻고 신분을 세탁하십시오.)',
    crisis: '현상금 사냥꾼 다수 포진. 신원 발각 시 즉결 처형 위험. 중층 밀항 루트 확보 시급.',
    stagnation: '수배망 확대 및 사냥꾼 추적 개시. 상인들의 거래 거부 및 신고 접수.',
    objective: '수리 완료 및 밀항 지도 확보 → 3장으로 이동.',
    requiredPassword: 'NEEDLE_AND_THREAD',
    time: '2200', loc: 'BLACK MARKET', weather: 'SMOG', difficulty: 'NORMAL'
  },
  {
    title: '강철의 뱃속으로',
    bg: '중앙 배관 구역 진입. 자동 감시기 및 고압 증기 함정이 다수 분포합니다. (가이드: 스캔 감지됨. 출구는 공장으로 연결됩니다. 즉시 은신처를 탐색하십시오.)',
    crisis: '수직 통로 돌파 필요. 발각 시 집중 포화 사격 예상.',
    stagnation: '배관 내 압력 및 온도 임계치 초과(장갑 손상) 및 청소 로봇 군집 활성화.',
    objective: '중층 진입 및 추적 따돌리기 → 4장으로 이동.',
    requiredPassword: 'SPIDER_LILY',
    time: '0300', loc: 'PIPELINE', weather: 'STEAM', difficulty: 'HARD'
  },
  {
    title: '톱니바퀴의 선택',
    bg: '중층 공장 지구. 고립된 상태에서 거대 세력과 접촉했습니다. (가이드: 동력로 불안정. 설계도가 없으면 폭발할 위험이 있습니다. 연구소 잠입을 권장합니다.)',
    crisis: '핵심 코드 결여로 인한 기능 정지 임박. 수리 데이터는 왕립 기계창에 존재.',
    stagnation: '세력 소속 강요(납치 위협) 및 동력로 과부하로 인한 성능 저하.',
    objective: '거점 확보 및 잠입 준비 완료 → 5장으로 이동.',
    requiredPassword: 'RED_LENS',
    time: '1400', loc: 'FACTORY', weather: 'CLEAR', difficulty: 'NORMAL'
  },
  {
    title: '창조의 비밀',
    bg: '기계창 심층부 도달. 추적기(X)의 감시망이 작동 중입니다. (가이드: 단순한 고철이 아닙니다. 지상 유물 공명기가 확인되었습니다. 좌표 확보 후 하강하십시오.)',
    crisis: '메인 서버 접속 시도. 진실(지상 탐사기) 확인. 오직 μ타입 기체만이 산성 안개를 견딜 수 있음.',
    stagnation: '독가스 살포 및 폐기 프로토콜 가동으로 인한 탈출 경로 차단.',
    objective: '기원 근거 및 좌표 확보 후 지상으로 하강 → 6장으로 이동.',
    requiredPassword: 'GHOST_PROTOCOL',
    time: '0000', loc: 'DEEP LAB', weather: 'TOXIC', difficulty: 'VERY HARD'
  },
  {
    title: '녹슨 바다의 심연',
    bg: '지상 구역 진입. 고농도 산성 안개 및 기계수가 출몰합니다. (가이드: 파장 감지됨. 유물은 신의 심장과 같습니다. 제국군이 접근 중이니 탈출하십시오.)',
    crisis: '방호막 내구도 한계 도달. 고대 유물 신호 감지. 기사단 및 괴수 포위망 돌파 필요.',
    stagnation: '방호막 효력 상실로 인한 장갑 대파 위기 및 거대 괴수(레비아탄) 접근.',
    objective: '유물 확보 및 기체 각성 → 7장으로 이동.',
    requiredPassword: 'BLOOD_THRONE',
    time: '1800', loc: 'GROUND ZERO', weather: 'ACID STORM', difficulty: 'EXTREME'
  },
  {
    title: '포위망 돌파',
    bg: '중층 복귀 완료. 보안국장의 계엄령이 선포되었습니다. (가이드: 은신 종료. 정면을 돌파하여 상층 승강기를 탈취하십시오. 사냥 개시가 선언되었습니다.)',
    crisis: '퇴로 차단됨. 무력으로 포위망 분쇄 및 상층 승강기 탈취 필요.',
    stagnation: '포위망 급격히 축소(적 병력 2배 증원) 및 공중 폭격 개시.',
    objective: '국장 격파 및 상층 경로 확보 → 8장으로 이동.',
    requiredPassword: 'IRON_HAMMER',
    time: '1000', loc: 'MID-LAYER', weather: 'WAR', difficulty: 'HARD'
  },
  {
    title: '천공의 가면무도회',
    bg: '상층 귀족원 구역. 난공불락의 황금 방벽이 가동 중입니다. (가이드: 코드 확보 중 발각되었습니다. 문 앞에 괴물이 존재합니다. 진정한 힘을 개방하십시오.)',
    crisis: '귀족 신분 위장 잠입 시도. 내통자를 통한 게이트 개방 필요. 황제 각성 및 수호자 접근 감지.',
    stagnation: '정예 저격수 배치 및 사병단의 집중 포화 사격.',
    objective: '황실 코드 확보 → 9장으로 이동.',
    requiredPassword: 'GOLDEN_FAN',
    time: '2000', loc: 'UPPER CITY', weather: 'GOLD DUST', difficulty: 'HARD'
  },
  {
    title: '백금의 수호자',
    bg: '황궁 정문. 최강의 기체(0호기)가 앞을 가로막습니다. 동일한 기원을 가진 완성체입니다. (가이드: 동형 기체를 파괴하고 자신을 증명하십시오. 문을 열고 설계자와 대면하십시오.)',
    crisis: '생사를 건 사투. 모든 장애물 제거 후 남은 것은 황제와 코어뿐.',
    stagnation: '무한 증원 병력 투입 및 광역 섬멸 병기 발동.',
    objective: '근위대 격파 및 황궁 진입 → 10장으로 이동.',
    requiredPassword: 'PLATINUM_WING',
    time: '1200', loc: 'PALACE GATE', weather: 'HOLY LIGHT', difficulty: 'BOSS'
  },
  {
    title: '최후의 태엽',
    bg: '황제와의 대면. 도시의 운명을 결정할 순간입니다. (가이드: 모든 계산이 종료되었습니다. 당신의 의지가 곧 법입니다. 선택하십시오.)',
    crisis: '절대 명령권 발동 및 코어 임계점 도달. 대화 또는 파괴의 선택.',
    stagnation: '코어 붕괴 시작 및 도시 추락 카운트다운 개시.',
    objective: '결말 선택 및 후일담.',
    requiredPassword: 'CLOCKWORK_HEART',
    time: '2359', loc: 'THRONE ROOM', weather: 'VOID', difficulty: 'FINAL'
  }
];

const selectedChapter = computed(() => chapters[selectedIndex.value]);
const isUnlocked = computed(() => unlockedIndices.value.includes(selectedIndex.value));

const handleLockInteraction = () => {
  const chapter = selectedChapter.value;
  
  // Password Unlock Logic
  if (chapter.requiredPassword && !unlockedIndices.value.includes(selectedIndex.value)) {
    showPasswordDialog.value = true;
    passwordInput.value = '';
    passwordError.value = false;
    return;
  }

  if (!chapter.relatedChar) return;

  const idx = selectedIndex.value;
  if (!clickCounts.value[idx]) clickCounts.value[idx] = 0;
  
  clickCounts.value[idx]++;

  if (clickCounts.value[idx] >= 20 && !unlockedIndices.value.includes(idx)) {
    // Unlock
    playUnlock();
    hiddenDialogText.value = `${chapter.relatedChar}: "${chapter.hiddenDialogue}"`;
    showHiddenDialog.value = true;
    unlockedIndices.value.push(idx);
    
    // Auto hide dialog after 5s
    setTimeout(() => {
      showHiddenDialog.value = false;
    }, 5000);
  }
};

const checkPassword = () => {
  if (passwordInput.value === selectedChapter.value.requiredPassword) {
    playUnlock();
    unlockedIndices.value.push(selectedIndex.value);
    showPasswordDialog.value = false;
    hiddenDialogText.value = "ACCESS GRANTED. DECRYPTION SUCCESSFUL.";
    showHiddenDialog.value = true;
    setTimeout(() => { showHiddenDialog.value = false; }, 2000);
  } else {
    playFail();
    passwordError.value = true;
    setTimeout(() => { passwordError.value = false; }, 500);
  }
};

const handleCancelPassword = () => {
  playCancel();
  showPasswordDialog.value = false;
};

const capacityPercentage = computed(() => {
  // Calculate percentage based on current index (1-based) vs total chapters
  const progress = ((selectedIndex.value + 1) / chapters.length) * 100;
  return Math.round(progress);
});

const displayedCapacity = ref(0);

watch(capacityPercentage, (newVal) => {
  const start = displayedCapacity.value;
  const end = newVal;
  const duration = 800; // ms
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    
    displayedCapacity.value = Math.round(start + (end - start) * ease);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
}, { immediate: true });
  
const selectChapter = (index) => {
  playClick();
  selectedIndex.value = index;
};

// Random Hex Stream for Locked Effect
const updateHex = () => {
  let hex = '';
  for(let i=0; i<40; i++) {
    hex += Math.floor(Math.random()*16).toString(16).toUpperCase() + ' ';
  }
  randomHex.value = hex;
};

// Persistence for unlocked chapters
watch(unlockedIndices, (newVal) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-unlocked-chapters', JSON.stringify(newVal));
  }
}, { deep: true });

onMounted(() => {
  // Load unlocked chapters
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('vortex-unlocked-chapters');
    if (stored) {
      try {
        unlockedIndices.value = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse unlocked chapters', e);
      }
    }
  }

  checkMobile();
  window.addEventListener('resize', checkMobile);

  hexInterval = setInterval(updateHex, 100);
  // Trigger Cinematic Boot Sequence
  setTimeout(() => {
    isLoaded.value = true;
    // Trigger Content Scan after CRT is open
    setTimeout(() => {
      isContentLoaded.value = true;
    }, 800);
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (hexInterval) clearInterval(hexInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Nanum+Gothic+Coding&display=swap');

/* --- Global Layout --- */
.mission-terminal {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #050403;
  color: #ffb000;
  font-family: 'Share Tech Mono', 'Nanum Gothic Coding', monospace;
  overflow: hidden;
  position: fixed;
  top: 0; left: 0;
  z-index: 9999;
  transition: all 0.5s ease-in-out;
}

.mission-terminal.closing {
  animation: turn-off 0.5s forwards;
  pointer-events: none;
}

@keyframes turn-off {
  0% {
    transform: scale(1, 1);
    filter: brightness(1);
    opacity: 1;
  }
  40% {
    transform: scale(1, 0.002);
    filter: brightness(2);
    opacity: 1;
  }
  80% {
    transform: scale(0, 0.002);
    opacity: 1;
  }
  100% {
    transform: scale(0, 0);
    opacity: 0;
  }
}

/* --- Left Panel: Cartridge Bay --- */
.cartridge-bay {
  width: 320px;
  background: #0a0a0a;
  border-right: 4px solid #333;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 15px rgba(0,0,0,0.5);
  z-index: 10;
}

.bay-header {
  padding: 20px;
  background: #111;
  border-bottom: 2px solid #ffb000;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #ffb000;
}

.header-sub {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.cartridge-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 10px;
  background: repeating-linear-gradient(
    0deg,
    #0a0a0a,
    #0a0a0a 19px,
    #111 20px
  );
}

.cartridge-slot {
  margin-bottom: 15px;
  perspective: 1000px;
  cursor: pointer;
}

.data-chip {
  background: #1a1a1a;
  border: 1px solid #444;
  padding: 15px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chip-connector {
  width: 8px;
  height: 30px;
  background: repeating-linear-gradient(
    180deg,
    #d4af37,
    #d4af37 2px,
    #000 2px,
    #000 4px
  );
  border-radius: 2px;
}

.chip-body {
  flex: 1;
}

.chip-id { font-size: 10px; color: #666; }
.chip-label { font-size: 14px; font-weight: bold; color: #aaa; }

.chip-status-light {
  width: 6px; height: 6px;
  background: #333;
  border-radius: 50%;
  box-shadow: 0 0 2px #000;
}

/* Active State */
.cartridge-slot.active .data-chip {
  background: #ffb000;
  border-color: #ffb000;
  transform: translateX(20px);
  box-shadow: -10px 5px 20px rgba(0,0,0,0.8);
}

.cartridge-slot.active .chip-id { color: #805b00; }
.cartridge-slot.active .chip-label { color: #000; }
.cartridge-slot.active .chip-status-light { background: #00ff41; box-shadow: 0 0 5px #00ff41; }

/* Locked State */
.cartridge-slot.locked .data-chip {
  background: repeating-linear-gradient(
    45deg,
    #151515,
    #151515 10px,
    #0f0f0f 10px,
    #0f0f0f 20px
  );
  border-color: #333;
  opacity: 0.7;
}
.cartridge-slot.locked .chip-status-light { background: #ff4500; }

/* Active & Locked State Override */
.cartridge-slot.active.locked .data-chip {
  border-color: #ff4500;
  opacity: 1;
  box-shadow: -10px 5px 20px rgba(255, 69, 0, 0.2);
}
.cartridge-slot.active.locked .chip-label { color: #ff4500; }
.cartridge-slot.active.locked .chip-id { color: #cc3300; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* CINEMATIC BOOT SEQUENCE                                */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* Initial States (Hidden) */
.mission-terminal .tactical-viewport {
  opacity: 0;
  transform-origin: center center;
}

.mission-terminal .cartridge-bay {
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) 0.2s;
}

.mission-terminal .cartridge-slot {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.4s ease-out;
}

.mission-terminal .briefing-header,
.mission-terminal .briefing-body,
.mission-terminal .locked-view,
.mission-terminal .control-panel {
  opacity: 0;
  clip-path: inset(0 0 100% 0); /* Hidden from bottom */
  transition: all 0.5s ease-out;
}

/* Active States (Triggered by isLoaded) */
.mission-terminal.system-active .tactical-viewport {
  animation: crt-turn-on 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.mission-terminal.system-active .cartridge-bay {
  transform: translateX(0);
  opacity: 1;
}

.mission-terminal.system-active .cartridge-slot {
  opacity: 1;
  transform: translateX(0);
  transition-delay: calc(0.5s + var(--delay));
}

/* Content Active States (Triggered by isContentLoaded) */
.mission-terminal.content-active .briefing-header {
  opacity: 1;
  clip-path: inset(0 0 0 0);
}

.mission-terminal.content-active .briefing-body,
.mission-terminal.content-active .locked-view {
  opacity: 1;
  clip-path: inset(0 0 0 0);
  transition-delay: 0.2s;
}

.mission-terminal.content-active .control-panel {
  opacity: 1;
  clip-path: inset(0 0 0 0);
  transition-delay: 0.4s;
}

.mission-terminal .ignition-wrapper {
  flex: 1;
  transform: scale(0);
  opacity: 0;
}

.mission-terminal.content-active .ignition-wrapper {
  animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.6s;
}

/* Keyframes */
@keyframes crt-turn-on {
  0% {
    opacity: 0;
    transform: scale(0.7, 0.002);
    filter: brightness(0);
  }
  30% {
    opacity: 1;
    transform: scale(1, 0.002);
    filter: brightness(1);
  }
  50% {
    transform: scale(1, 1);
    filter: brightness(5); /* Flash */
  }
  100% {
    transform: scale(1, 1);
    filter: brightness(1);
    opacity: 1;
  }
}

@keyframes pop-in {
  0% { transform: scale(0); opacity: 0; filter: brightness(1); }
  70% { transform: scale(1.1); opacity: 1; filter: brightness(3); box-shadow: 0 0 20px #ffb000; }
  100% { transform: scale(1); opacity: 1; filter: brightness(1); box-shadow: none; }
}

.bay-footer {
  padding: 15px;
  background: #111;
  border-top: 1px solid #333;
}

.capacity-bar {
  height: 6px;
  background: #222;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}
.capacity-bar .fill { 
  height: 100%; 
  background: #ffb000; 
  transition: width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.capacity-text { font-size: 10px; color: #666; text-align: right; }


/* --- Right Panel: Tactical Viewport --- */
.tactical-viewport {
  flex: 1;
  padding: 30px;
  display: flex;
  background: #080808;
}

.monitor-frame {
  flex: 1;
  border: 25px solid #2a2a2a;
  border-radius: 15px;
  position: relative;
  background: #000;
  box-shadow: inset 0 0 50px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Rivets */
.rivet {
  position: absolute;
  width: 12px; height: 12px;
  background: radial-gradient(circle at 30% 30%, #666, #222);
  border-radius: 50%;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  z-index: 20;
}
.rivet.top-left { top: -18px; left: -18px; }
.rivet.top-right { top: -18px; right: -18px; }
.rivet.bottom-left { bottom: -18px; left: -18px; }
.rivet.bottom-right { bottom: -18px; right: -18px; }

/* CRT Screen */
.crt-screen {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.screen-grid {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.screen-scanline {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 5;
}

.screen-glow {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  box-shadow: inset 0 0 100px rgba(255, 176, 0, 0.1);
  pointer-events: none;
  z-index: 6;
}

.screen-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header */
.briefing-header {
  margin-bottom: 30px;
}

.top-decor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hazard-stripe {
  height: 8px;
  flex: 1;
  background: repeating-linear-gradient(
    45deg,
    #ffb000,
    #ffb000 10px,
    #000 10px,
    #000 20px
  );
  margin-right: 20px;
}

.header-right-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mini-radar {
  width: 120px;
  height: 80px;
  border: 1px solid rgba(255, 176, 0, 0.3);
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  pointer-events: none;
}

.radar-grid {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    linear-gradient(rgba(255, 176, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.radar-sweep {
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 176, 0, 0.1) 60deg, transparent 60deg);
  animation: radar-spin 4s linear infinite;
  border-radius: 50%;
}

@keyframes radar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.classification-stamp {
  border: 2px solid #ff4500;
  color: #ff4500;
  padding: 5px 15px;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 2px;
  transform: rotate(-2deg);
  opacity: 0.8;
}

.mission-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 10px 0;
}

.title-deco-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffb000, transparent);
  opacity: 0.5;
}

.title-serial {
  font-size: 12px;
  color: #666;
  letter-spacing: 1px;
}

.mission-title {
  font-size: 36px;
  margin: 0;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.op-param-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 0.8rem;
  color: rgba(255, 176, 0, 0.7);
  margin-top: 5px;
}

.op-param-bar .sep {
  color: #444;
}

.header-divider {
  height: 2px;
  background: #ffb000;
  margin-top: 15px;
  box-shadow: 0 0 10px #ffb000;
}

/* Body */
.briefing-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.info-card {
  background: 
    linear-gradient(rgba(255, 176, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 176, 0, 0.03) 1px, transparent 1px),
    rgba(0, 0, 0, 0.4);
  background-size: 20px 20px, 20px 20px, 100% 100%;
  border: 1px solid rgba(255, 176, 0, 0.3);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 10px; height: 10px;
  border-top: 2px solid #ffb000;
  border-left: 2px solid #ffb000;
}

.card-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
  border-bottom: 1px dashed #444;
  padding-bottom: 5px;
}

.card-text {
  font-size: 16px;
  line-height: 1.6;
  color: #e0d0b0;
}

.row-split {
  display: flex;
  gap: 20px;
}

.row-split .info-card {
  flex: 1;
}

.alert-box {
  background: rgba(255, 69, 0, 0.05);
  border-color: #ff4500;
}

.alert-box .card-label { color: #ff4500; border-color: rgba(255, 69, 0, 0.3); }
.alert-box .card-text { color: #ffccaa; }

/* Locked View */
.locked-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.access-denied-box {
  text-align: center;
  border: 2px solid #ff4500;
  padding: 40px;
  background: rgba(255, 69, 0, 0.1);
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.2);
}

.denied-title {
  font-size: 48px;
  font-weight: bold;
  color: #ff4500;
  animation: blink 1s infinite;
}

.denied-sub {
  font-size: 18px;
  color: #ff4500;
  margin-top: 10px;
  opacity: 0.8;
}

.hex-dump {
  margin-top: 20px;
  margin-left: 20px;
  font-family: monospace;
  color: #888;
  width: 300px;
  word-break: break-all;
}

@keyframes blink { 50% { opacity: 0; } }

/* Footer Controls */
.control-panel {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.nav-btn {
  background: transparent;
  border: 1px solid #444;
  color: #888;
  padding: 0 30px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 9999; /* Force top layer */
  pointer-events: auto;
}
.nav-btn:hover {
  border-color: #ff4500;
  color: #ff4500;
  background: rgba(255, 69, 0, 0.1);
  box-shadow: 0 0 15px rgba(255, 69, 0, 0.3);
}
.nav-btn:active {
  transform: scale(0.95);
}

.ignition-switch {
  width: 100%;
  height: 70px;
  background: repeating-linear-gradient(
    45deg,
    #ffb000,
    #ffb000 10px,
    #e6a000 10px,
    #e6a000 20px
  );
  background-size: 200% 200%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #000 !important; /* Force black text */
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 2px;
  position: relative;
  clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
  transition: all 0.1s;
  overflow: hidden;
  /* Bevel Effect */
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
  border: 2px solid rgba(255,255,255,0.2); /* Fallback if clip-path not supported, but clip-path hides border usually. Use inset shadow mostly */
}

.ignition-switch:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
  box-shadow: 0 0 30px rgba(255, 176, 0, 0.5);
  animation: stripes-move 1s linear infinite;
}

@keyframes stripes-move {
  0% { background-position: 0 0; }
  100% { background-position: 50px 50px; }
}

.ignition-switch:active {
  transform: scale(0.98);
}

.ignition-switch.disabled {
  background: #333;
  color: #555;
  pointer-events: none;
}

.switch-glow {
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  transform: skewX(-20deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #111; }

/* Hidden Dialog */
.hidden-dialog {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s;
}

.dialog-box {
  background: #000;
  border: 2px solid #ffb000;
  padding: 30px;
  width: 600px;
  box-shadow: 0 0 50px rgba(255, 176, 0, 0.5);
  text-align: center;
}

.dialog-header {
  color: #ff4500;
  font-weight: bold;
  letter-spacing: 3px;
  margin-bottom: 20px;
  animation: blink 1s infinite;
}

.dialog-content {
  font-size: 24px;
  color: #fff;
  margin-bottom: 30px;
  font-family: 'Nanum Gothic Coding', monospace;
}

.dialog-footer {
  color: #00ff41;
  font-size: 18px;
  letter-spacing: 5px;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Interactive Lock */
.access-denied-box.interactive {
  cursor: pointer;
  transition: all 0.3s;
}
.access-denied-box.interactive:hover {
  border-color: #ffb000;
  background: rgba(255, 176, 0, 0.1);
}
.decrypt-hint {
  margin-top: 20px;
  color: #ffb000;
  font-size: 14px;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

/* Password Input Styles */
.terminal-input {
  background: #000;
  border: 1px solid #ffb000;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 24px;
  padding: 10px;
  width: 80%;
  text-align: center;
  outline: none;
  text-transform: uppercase;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}
.terminal-input:focus {
  box-shadow: 0 0 15px rgba(255, 176, 0, 0.3);
}
.terminal-input.error {
  border-color: #ff4500;
  color: #ff4500;
  animation: shake 0.3s;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.action-btn {
  background: rgba(0, 0, 0, 0.8);
  color: #ffb000;
  border: 1px solid #ffb000;
  padding: 12px 30px;
  font-family: 'Share Tech Mono', monospace;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin: 0 15px;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(255, 176, 0, 0.2);
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 176, 0, 0.4), transparent);
  transition: left 0.5s;
}

.action-btn:hover {
  background: #ffb000;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.8);
  text-shadow: none;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.cancel {
  border-color: #ff4500;
  color: #ff4500;
  box-shadow: inset 0 0 20px rgba(255, 69, 0, 0.2);
}

.action-btn.cancel:hover {
  background: #ff4500;
  color: #000;
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.8);
}

/* Shake Animation & Red Effect */
.access-denied-shake {
  animation: shake-hard 0.5s cubic-bezier(.36,.07,.19,.97) both;
  border-color: #ff0000 !important;
  box-shadow: 0 0 50px rgba(255, 0, 0, 0.8) !important;
  background: rgba(50, 0, 0, 0.9) !important;
}

.access-denied-shake .dialog-header {
  color: #ff0000 !important;
  text-shadow: 0 0 10px #ff0000;
}

.access-denied-shake .dialog-content p {
  color: #ff4500 !important;
}

@keyframes shake-hard {
  10%, 90% { transform: translate3d(-2px, 0, 0) rotate(-1deg); }
  20%, 80% { transform: translate3d(4px, 0, 0) rotate(2deg); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0) rotate(-2deg); }
  40%, 60% { transform: translate3d(8px, 0, 0) rotate(2deg); }
}

::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #ffb000; }

/* Mobile Optimization */
@media (max-width: 768px) {
  .mission-terminal {
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
  }
  
  .cartridge-bay {
    width: 100%;
    height: 120px;
    border-right: none;
    border-bottom: 2px solid #8b5a2b;
    flex-shrink: 0;
  }
  
  .cartridge-list {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 10px;
    gap: 15px;
  }
  
  .cartridge-slot {
    width: 200px;
    height: 80px;
    flex-shrink: 0;
  }
  
  .tactical-viewport {
    flex: 1;
    overflow: hidden; /* Contains scroll inside */
  }
  
  .monitor-frame {
    /* Adjust frame */
    padding: 10px;
  }
  
  .briefing-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .op-param-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .op-param-bar span {
    font-size: 0.7rem;
  }
  
  .briefing-body {
    padding: 10px;
  }
  
  .info-card {
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .mission-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .control-btn {
    width: 100%;
  }
}
</style>

<style scoped>
/* --- Mobile Only Styles --- */
.mobile-scenario-view { padding: 80px 20px 20px; color: #ffb000; height: 100vh; overflow-y: auto; background: #000; }
.mobile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ffb000; padding-bottom: 10px; }
.mobile-close-btn { background: #333; color: white; border: 1px solid #ffb000; padding: 5px 15px; }

.mobile-chapter-card { border: 1px solid #444; margin-bottom: 10px; background: #111; }
.m-chapter-header { padding: 15px; display: flex; align-items: center; gap: 10px; cursor: pointer; }

.m-title { flex: 1; font-weight: bold; }
.m-chapter-body { padding: 15px; border-top: 1px dashed #444; background: #0a0a0a; }

.m-meta-row { display: flex; gap: 15px; font-size: 0.8em; color: #888; margin-bottom: 10px; }
.m-desc { margin-bottom: 10px; line-height: 1.4; }
.m-alert, .m-obj { padding: 8px; background: #220; border-left: 3px solid #ffb000; margin-top: 5px; font-size: 0.9em; }
.m-access-denied { color: red; font-weight: bold; text-align: center; }
.m-hint { text-align: center; font-size: 0.8em; color: #666; margin-top: 5px; }
</style>
