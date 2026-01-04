<template>
  <!-- 배경 (레이아웃 가리기용) -->
  <div v-if="visible" class="boot-background" :class="{ 'fade-out': isFading }"></div>

  <!-- 블랙 트랜지션 (화면 전환 효과) -->
  <div v-if="showFlash" class="black-transition"></div>

  <!-- 매트릭스 레인 효과 캔버스 -->
  <canvas v-if="visible" id="boot-matrix" :class="{ 'fade-out': isFading }"></canvas>
  
  <div v-if="visible" class="boot-overlay" :class="{ 'fade-out': isFading, 'crt-off-anim': isShuttingDown }">
    <!-- CRT 모니터 효과 레이어 -->
    <div class="crt-scanline"></div>
    <div class="crt-flicker"></div>
    <div class="laser-scan"></div>

    <!-- 초기 로고 (풀스크린) -->
    <div v-if="showingLogo" class="logo-fullscreen">
      <div class="logo-container">
        <div class="boot-status">{{ bootStatus }}</div>
        <pre class="ascii-logo-large">{{ logoText }}</pre>
      </div>
    </div>

    <!-- 메인 터미널 윈도우 (Window UI) -->
    <div v-if="!showingLogo" class="terminal-window" :class="{ 'fade-out': isTerminalFading, 'danger-mode': isDanger }">
      <!-- 장식용 코너 브라켓 -->
      <div class="corner-bracket top-left"></div>
      <div class="corner-bracket top-right"></div>
      <div class="corner-bracket bottom-left"></div>
      <div class="corner-bracket bottom-right"></div>

      <!-- 윈도우 헤더 -->
      <div class="window-header">
        <div class="header-title">:: VORTEX_SECURE_SHELL ::</div>
        <div class="header-controls">
          <span class="control-btn">_</span>
          <span class="control-btn">X</span>
        </div>
      </div>

      <!-- 윈도우 바디 (콘텐츠 영역) -->
      <div class="window-body">
        
        <div class="content-layout">
          <!-- 왼쪽 패널: 로그, 입력 -->
          <div class="left-panel">
            <!-- 1. ASCII 아트 로고 -->
            <pre class="ascii-logo">
██╗   ██╗ ██████╗ ██████╗ ████████╗███████╗██╗  ██╗
██║   ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝
██║   ██║██║   ██║██████╔╝   ██║   █████╗   ╚███╔╝ 
╚██╗ ██╔╝██║   ██║██╔══██╗   ██║   ██╔══╝   ██╔██╗ 
 ╚████╔╝ ╚██████╔╝██║  ██║   ██║   ███████╗██╔╝ ██╗
  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
            </pre>

            <!-- 2. 부팅 로그 -->
            <div class="log-area" ref="logContainer" :class="{ 'fade-out-logs': !showLogs }">
              <div v-for="(line, index) in logs" :key="index" class="log-line">
                <span v-html="line"></span><span v-if="index === logs.length - 1 && !inputReady && !accessGranted && !isProcessingLogin" class="typing-cursor">█</span>
              </div>
            </div>

            <!-- 3. 로딩 바 (입력 전까지 표시) -->
            <div v-if="!inputReady" class="loading-container" :class="{ 'processing': isProcessingLogin || accessGranted }">
              <div class="loading-text">SYSTEM INTEGRITY CHECK: {{ Math.floor(displayProgress) }}%</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- 4. 입력 영역 -->
            <div v-if="inputReady" class="input-area">
              <div class="input-group">
                <div class="input-label">ENTER_ID_CODE :</div>
                <div class="input-box" @click="focusInput">
                  <div class="input-wrapper">
                    <span class="input-text">{{ userCode }}</span>
                    <span class="blinking-cursor"></span>
                    <input 
                      ref="inputRef"
                      v-model="userCode" 
                      @keydown.enter="handleLogin"
                      @input="playTypingSound" 
                      type="text" 
                      class="cmd-input-hidden" 
                      autocomplete="off" 
                      spellcheck="false"
                      autofocus
                    />
                  </div>
                </div>
                <div class="input-guide">PRESS ENTER TO ACCESS</div>
              </div>
            </div>
            
            <!-- 접속 승인 메시지 -->
            <div v-if="accessGranted" class="access-msg">
              <div v-for="(line, index) in accessMessages" :key="index">{{ line }}</div>
            </div>
          </div>

          <!-- 오른쪽 패널: 시계, 진단 -->
          <div class="right-panel">
             <div class="clock-container">
                <div class="date-display">{{ currentDate }}</div>
                <div class="time-display">{{ currentTime }}</div>
             </div>
             
             <div class="diagnostic-panel">
                <div class="diag-header">SYSTEM RESOURCE MONITOR</div>
                <div class="diag-row">
                  <span class="diag-label">CPU</span>
                  <div class="diag-bar-track"><div class="diag-bar-fill anim-cpu"></div></div>
                </div>
                <div class="diag-row">
                  <span class="diag-label">MEM</span>
                  <div class="diag-bar-track"><div class="diag-bar-fill anim-mem"></div></div>
                </div>
                <div class="diag-row">
                  <span class="diag-label">HEAT</span>
                  <div class="diag-bar-track"><div class="diag-bar-fill anim-heat"></div></div>
                </div>
                <div class="diag-row">
                  <span class="diag-label">SYNC</span>
                  <div class="diag-bar-track"><div class="diag-bar-fill anim-sync"></div></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- 윈도우 푸터 (상태바) -->
      <div class="window-footer">
        <span class="status-item">STATUS: <span style="color:#ff3333">UNSTABLE</span></span>
        <span class="status-item">MEM: 64TB</span>
        <span class="status-item">NET: LOCAL</span>
      </div>
    </div>

    <!-- 최종 환영 메시지 (터미널 사라진 후 표시) -->
    <div v-if="showFinalMessage" class="final-message-container">
      <div class="final-msg-small">{{ finalMessage1 }}</div>
      <div class="final-msg-large">{{ finalMessage2 }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useSteamSound } from './composables/useSteamSound';

const { playTyping, playMechanismStart, playMechanismStop, playUnlock, preloadSound, playLoadingBar } = useSteamSound();

const emit = defineEmits(['close-boot']);

const visible = ref(true);
const isFading = ref(false);
const isTerminalFading = ref(false); // 터미널 페이드 아웃용
const inputReady = ref(false);
const isProcessingLogin = ref(false); // 로그인 처리 중 상태 (커서 숨김용)
const accessGranted = ref(false);
const isShuttingDown = ref(false); // 화면 꺼짐 연출용
const showFlash = ref(false); // 화면 켜짐 플래시 효과
const userCode = ref('');
const inputRef = ref(null);
const logContainer = ref(null);
const logs = ref([]);
const progress = ref(0); // 실제 진행률 (CSS width용)
const displayProgress = ref(0); // 표시용 진행률 (숫자 애니메이션용)
const showingLogo = ref(true);
const logoText = ref('');
const bootStatus = ref('');
const accessMessages = ref([]);
const showLogs = ref(true);

// Red Alert Mode Logic
const isDanger = computed(() => {
  const dangerKeywords = ["WARN", "ERROR", "경고"];
  return logs.value.some(log => dangerKeywords.some(keyword => log.includes(keyword)));
});

// Date/Time refs
const currentDate = ref('');
const currentTime = ref('');
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  currentDate.value = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}. ${days[now.getDay()]}`;
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

// 최종 메시지 상태
const showFinalMessage = ref(false);
const finalMessage1 = ref('');
const finalMessage2 = ref('');

// 로그 목록 (글리치 효과 클래스 추가)
const bootSequence = [
  "[SYSTEM] POWER ON...",
  "[CHECK] 기억 소자 무결성... <span style='color:#00ff41'>정상</span>",
  "[CHECK] 신경망 동기화... <span style='color:#00ff41'>동기화 완료</span>",
  "<span class='glitch-text' style='color:#ffb000'>[WARN] 제어 기제 식별 불가...</span>",
  "<span style='color:#ff4500'>[ERROR] 치명적 연산 예외 발생 (주소: 0x004F3A)</span>",
  "[SYSTEM] 보안 프로토콜 강제 우회...",
  "----------------------------------------",
  "VORTEX_ENGINE v19.0 (불안정 빌드)",
  "<span class='warning-blink' style='color:#ffb000'>경고: 비인가 외부 접속 감지됨</span>",
  "----------------------------------------"
];

const scrollToBottom = () => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight;
  }
};

// 키보드 타이핑 사운드 (Web Audio API)
// useSteamSound로 대체됨

onMounted(() => {
  // 사운드 프리로드
  preloadSound('mechanism-start');

  // 매트릭스 효과 시작
  nextTick(() => {
    initMatrix();
  });
  
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  
  runBootSequence();
});

let loadingSoundInstance = null;

const playLoadingSound = async () => {
  loadingSoundInstance = await playLoadingBar();
};

const stopLoadingSound = () => {
  if (loadingSoundInstance) {
    try {
      if (loadingSoundInstance.stop) {
        loadingSoundInstance.stop();
      } else if (loadingSoundInstance.pause) {
        loadingSoundInstance.pause();
        loadingSoundInstance.currentTime = 0;
      }
    } catch (e) {
      // Ignore
    }
    loadingSoundInstance = null;
  }
  playMechanismStop();
};

const playTypingSound = () => {
  playTyping();
};

const typeText = async (text, lineIndex) => {
  let currentString = "";
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    
    // HTML 태그 감지
    if (char === '<') {
      const closingIndex = text.indexOf('>', i);
      if (closingIndex !== -1) {
        currentString += text.slice(i, closingIndex + 1);
        i = closingIndex + 1;
        logs.value[lineIndex] = currentString;
        continue;
      }
    }
    
    // 대괄호 감지 ([ 로 시작하면 ] 까지 30ms 속도로 입력하고 0.15초 대기)
    if (char === '[') {
      const closingIndex = text.indexOf(']', i);
      if (closingIndex !== -1) {
        const bracketContent = text.slice(i, closingIndex + 1);
        // 대괄호 내용을 30ms씩 입력
        for (let j = 0; j < bracketContent.length; j++) {
          currentString += bracketContent[j];
          logs.value[lineIndex] = currentString;
          playTypingSound();
          await new Promise(r => setTimeout(r, 30));
        }
        i = closingIndex + 1;
        await new Promise(r => setTimeout(r, 150)); // 대괄호 후 0.15초 대기
        continue;
      }
    }
    
    currentString += char;
    logs.value[lineIndex] = currentString;
    playTypingSound();
    i++;
    await new Promise(r => setTimeout(r, Math.random() * 10 + 5));
    scrollToBottom();
  }
};

// 로고 타이핑 함수 (한 줄씩 위에서 아래로 생성)
const typeLogoText = async (text) => {
  const lines = text.split('\n');
  
  for (const line of lines) {
    logoText.value += line + '\n';
    playTypingSound();
    // 한 줄씩 툭툭 떨어지는 느낌 (200ms)
    await new Promise(r => setTimeout(r, 200));
  }
};

// 승인 메시지 타이핑 함수
const typeAccessMessage = async (text, lineIndex) => {
  let currentString = "";
  let i = 0;
  
  while (i < text.length) {
    const char = text[i];
    
    // 대괄호 감지
    if (char === '[') {
      const closingIndex = text.indexOf(']', i);
      if (closingIndex !== -1) {
        const bracketContent = text.slice(i, closingIndex + 1);
        for (let j = 0; j < bracketContent.length; j++) {
          currentString += bracketContent[j];
          accessMessages.value[lineIndex] = currentString;
          playTypingSound();
          await new Promise(r => setTimeout(r, 30));
        }
        i = closingIndex + 1;
        await new Promise(r => setTimeout(r, 200));
        continue;
      }
    }
    
    currentString += char;
    accessMessages.value[lineIndex] = currentString;
    playTypingSound();
    i++;
    
    // --- 부분은 빠르게 (3-6ms), 일반 텍스트는 느리게 (20-30ms)
    const isFastSection = text.startsWith('---');
    const delay = isFastSection ? Math.random() * 3 + 3 : Math.random() * 10 + 20;
    await new Promise(r => setTimeout(r, delay));
  }
};

// 숫자 애니메이션 함수
const animateDisplayProgress = (target, duration = 300) => {
  const start = displayProgress.value;
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    if (elapsed < duration) {
      const rate = elapsed / duration;
      const ease = 1 - Math.pow(1 - rate, 3); // Ease out cubic
      displayProgress.value = Math.floor(start + (target - start) * ease);
      requestAnimationFrame(animate);
    } else {
      displayProgress.value = target;
    }
  };
  requestAnimationFrame(animate);
};

const runBootSequence = async () => {
  // "시스템 부팅중..." 표시
  bootStatus.value = '시스템 부팅중...';
  
  // 1.5초 대기 후 로고 타이핑 애니메이션
  await new Promise(r => setTimeout(r, 1500));
  
  const logoArt = `
██╗   ██╗ ██████╗ ██████╗ ████████╗███████╗██╗   ██╗
██║   ██║██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝╚██╗ ██╔╝
██║   ██║██║   ██║██████╔╝   ██║   █████╗   ╚███╔╝ 
╚██╗ ██╔╝██║   ██║██╔══██╗   ██║   ██╔══╝   ██╔██╗ 
 ╚████╔╝ ╚██████╔╝██║  ██║   ██║   ███████╗██╔╝ ██╗
  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝`;
  
  await typeLogoText(logoArt);
  
  // 로고 표시 후 3초 대기
  await new Promise(r => setTimeout(r, 2500));
  showingLogo.value = false;
  
  const totalSteps = bootSequence.length;
  
  for (let i = 0; i < totalSteps; i++) {
    logs.value.push("");
    await typeText(bootSequence[i], i);
    
    // 로딩바 진행률 업데이트
    progress.value = Math.floor(((i + 1) / totalSteps) * 100);
    animateDisplayProgress(progress.value, 500); // 부드럽게 숫자 증가
    
    await new Promise(r => setTimeout(r, 50));
  }
  
  progress.value = 100;
  animateDisplayProgress(100, 300);
  await new Promise(r => setTimeout(r, 300));
  inputReady.value = true;
  
  nextTick(() => {
    if(inputRef.value) inputRef.value.focus();
    scrollToBottom();
  });
};

const handleLogin = async () => {
  console.log("[DEBUG] handleLogin started");
  if (!userCode.value.trim()) return;
  
  // 로딩바를 0으로 리셋 후 입력창 숨기기
  progress.value = 0;
  displayProgress.value = 0;
  inputReady.value = false;
  isProcessingLogin.value = true; // 커서 숨김 처리
  
  // 기존 로그는 사라지지 않게 유지
  showLogs.value = true;
  
  console.log("[DEBUG] before playLoadingSound");
  playLoadingSound(); // 로딩 사운드 시작 (await 제거 - 블로킹 방지)
  console.log("[DEBUG] after playLoadingSound");

  // 로딩바 자연스럽게 채우기 (CSS transition 활용)
  // 약간의 지연 후 100%로 설정하여 트랜지션 트리거
  await new Promise(r => setTimeout(r, 50));
  console.log("[DEBUG] starting progress bar");
  progress.value = 100;
  
  // 숫자 애니메이션 (0 -> 100 over 1.5s)
  const startTime = performance.now();
  const duration = 1500;
  
  const animateNumber = (currentTime) => {
    const elapsed = currentTime - startTime;
    if (elapsed < duration) {
      const rate = elapsed / duration;
      // Ease out cubic
      const ease = 1 - Math.pow(1 - rate, 3);
      displayProgress.value = Math.floor(100 * ease);
      if (isProcessingLogin.value) requestAnimationFrame(animateNumber);
    } else {
      displayProgress.value = 100;
      stopLoadingSound(); // 100% 도달 시 즉시 중지
    }
  };
  requestAnimationFrame(animateNumber);
  
  // 트랜지션 시간(1.5s)만큼 대기
  await new Promise(r => setTimeout(r, 1500));
  
  stopLoadingSound(); // 로딩 완료 시 즉시 사운드 종료 보장

  // 로딩바가 가득 찬 후 0.2초 대기
  await new Promise(r => setTimeout(r, 200));
  
  // 접속 승인 표시
  accessGranted.value = true;
  isProcessingLogin.value = false; // 상태 해제 (accessGranted가 true라 커서는 안 보임)

  // 사용자 이름 저장
  sessionStorage.setItem('vortex_username', userCode.value);

  // [Sound Requirement] 엔터 입력 및 접속 승인 시 오디오 트리거
  playUnlock();
  
  // 접속 승인 메시지들을 타이핑으로 표시
  const messages = [
    "> ACCESS GRANTED.",
    "> WELCOME, OPERATOR " + userCode.value + ".",
    "> INITIALIZING VORTEX_ENGINE..."
  ];
  
  for (let i = 0; i < messages.length; i++) {
    accessMessages.value.push("");
    await typeAccessMessage(messages[i], i);
    await new Promise(r => setTimeout(r, 50));
  }
  
  await new Promise(r => setTimeout(r, 500));
  
  // 터미널 내용 서서히 사라짐
  isTerminalFading.value = true;
  await new Promise(r => setTimeout(r, 1000)); // 페이드 아웃 대기
  
  // 최종 메시지 표시 시작
  showFinalMessage.value = true;
  
  // 첫 번째 줄 타이핑 (작게)
  const line1 = "VORTEX_ARCHIVE 데이터베이스에 오신 것을 환영합니다.";
  for (const char of line1) {
    finalMessage1.value += char;
    playTypingSound();
    await new Promise(r => setTimeout(r, 30));
  }
  
  await new Promise(r => setTimeout(r, 500));
  
  // 두 번째 줄 타이핑 (크게 강조)
  const line2 = "오일이 마르는 그날, 이름 없는 고철들에게 안식을.";
  for (const char of line2) {
    finalMessage2.value += char;
    playTypingSound();
    await new Promise(r => setTimeout(r, 50)); // 강조를 위해 약간 느리게
  }
  
  // 메시지 읽을 시간 부여
  await new Promise(r => setTimeout(r, 2500));
  
  // --- 화면 꺼짐 연출 (CRT OFF) ---
  isShuttingDown.value = true;
  
  // 0.5초 동안 꺼지는 애니메이션 대기
  await new Promise(r => setTimeout(r, 600));
  
  // 잠시 암전 (0.5초)
  await new Promise(r => setTimeout(r, 500));
  
  // --- 화면 전환 연출 (Black Transition) ---
  showFlash.value = true;
  
  // 전환 레이어가 덮이는 순간 부팅 스크린 제거 (Layout 노출 준비)
  await new Promise(r => setTimeout(r, 50));
  
  // ★ emit을 먼저 호출하여 Layout에서 isBooted를 true로 설정
  console.log("[DEBUG] emitting close-boot event");
  emit('close-boot');
  console.log("[DEBUG] close-boot event emitted");
  
  // 그 다음 BootScreen 내부 요소 숨김 (이미 Layout에서 BootScreen이 언마운트됨)
  visible.value = false;
  
  // 블랙 페이드 아웃 대기 (2초)
  await new Promise(r => setTimeout(r, 2000));
  showFlash.value = false;
  console.log("[DEBUG] handleLogin completed");
};

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

// 매트릭스 효과 실행 함수
const initMatrix = () => {
  const canvas = document.getElementById('boot-matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const characters = "010101VORTEX_SYSTEM_BOOT_FAILURE_RETRY";
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);

  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  const draw = () => {
    // 배경을 서서히 지워서 잔상 효과
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#008f11'; // 어두운 해커 그린
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

  const interval = setInterval(draw, 50);

  // 리사이즈 대응
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  // 컴포넌트 사라질 때 정리
  onUnmounted(() => {
    clearInterval(interval);
    window.removeEventListener('resize', handleResize);
  });
};

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});


</script>

<style scoped>
/* --- 터미널 윈도우 스타일 (New) --- */
.terminal-window {
  position: relative;
  width: 900px;
  height: 600px;
  max-width: 95vw;
  max-height: 90vh;
  background: rgba(0, 20, 0, 0.85);
  backdrop-filter: blur(5px);
  border: 1px solid #00ff41;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 20;
  transition: all 0.3s ease;
}

/* Red Alert Mode Animation */
.terminal-window.danger-mode {
  animation: red-alert-pulse 2s infinite ease-in-out;
}

@keyframes red-alert-pulse {
  0%, 100% {
    border-color: #00ff41;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.15);
  }
  50% {
    border-color: #ff3333;
    box-shadow: 0 0 30px rgba(255, 51, 51, 0.5), inset 0 0 20px rgba(255, 51, 51, 0.2);
  }
}

/* 윈도우 헤더 */
.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: rgba(0, 255, 65, 0.1);
  border-bottom: 1px solid #00ff41;
  user-select: none;
}

.header-title {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #00ff41;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

.header-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  cursor: pointer;
  font-weight: bold;
  color: #00ff41;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.control-btn:hover { opacity: 1; text-shadow: 0 0 5px #00ff41; }

/* 윈도우 바디 */
.window-body {
  flex: 1;
  position: relative;
  padding: 20px;
  overflow: hidden;
  font-size: 16px;
  line-height: 1.4;
  /* Chromatic Aberration & Bloom */
  text-shadow: 
    1px 0 0 rgba(255, 0, 0, 0.7),
    -1px 0 0 rgba(0, 0, 255, 0.7),
    0 0 5px rgba(0, 255, 65, 0.6);
}

/* 레이아웃 조정 */
.content-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

.left-panel {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 255, 65, 0.2); /* 구분선 추가 */
  padding-right: 20px;
}

.right-panel {
  flex: 1; /* 50:50 분할을 위해 flex: 1로 변경 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 중앙 정렬로 변경 */
  padding-left: 20px;
  padding-bottom: 50px;
  align-items: flex-start; /* 왼쪽 정렬 */
}

/* Laser Scan Effect */
.laser-scan {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 5px;
  background: rgba(0, 255, 65, 0.5);
  box-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41;
  opacity: 0.3;
  z-index: 15;
  pointer-events: none;
  animation: scanline 3s linear infinite;
}

@keyframes scanline {
  0% { top: -5%; opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { top: 105%; opacity: 0; }
}

/* Diagnostic Panel */
.diagnostic-panel {
  margin-top: 30px;
  margin-left: 30px; /* 우측으로 15px 이동 */
  width: 100%;
  max-width: 350px; /* 너무 넓어지지 않게 제한 */
  border: 1px solid rgba(0, 255, 65, 0.3);
  padding: 15px;
  background: rgba(0, 20, 0, 0.5);
}

.diag-header {
  font-size: 12px;
  color: #00ff41;
  border-bottom: 1px solid #00ff41;
  padding-bottom: 5px;
  margin-bottom: 10px;
  text-align: left; /* 왼쪽 정렬 */
  font-weight: bold;
  letter-spacing: 1px;
}

.diag-row {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  margin-bottom: 8px;
}

.diag-label {
  font-size: 10px;
  color: #00ff41;
  margin-right: 10px;
  width: 40px;
  text-align: left; /* 왼쪽 정렬 */
}

.diag-bar-track {
  width: 150px;
  height: 8px;
  background: rgba(0, 50, 0, 0.5);
  border: 1px solid rgba(0, 255, 65, 0.3);
  position: relative;
  overflow: hidden;
}

.diag-bar-fill {
  height: 100%;
  background: #00ff41;
  box-shadow: 0 0 5px #00ff41;
}

.anim-cpu { animation: diag-anim 2s infinite ease-in-out; }
.anim-mem { animation: diag-anim 3s infinite ease-in-out reverse; }
.anim-heat { animation: diag-anim 4s infinite ease-in-out; background: #ffb000; box-shadow: 0 0 5px #ffb000; }
.anim-sync { animation: diag-anim 2.5s infinite ease-in-out reverse; }

@keyframes diag-anim {
  0% { width: 30%; }
  20% { width: 70%; }
  40% { width: 40%; }
  60% { width: 80%; }
  80% { width: 50%; }
  100% { width: 30%; }
}

/* Adjustments for moved elements */
.clock-container {
  text-align: left; /* 왼쪽 정렬 */
  margin-bottom: 20px;
}

/* 윈도우 푸터 */
.window-footer {
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
  background: rgba(0, 20, 0, 0.95);
  border-top: 1px solid #00ff41;
  font-size: 12px;
  color: #00ff41;
  opacity: 0.8;
}

/* 코너 브라켓 장식 */
.corner-bracket {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #00ff41;
  transition: all 0.3s ease;
  pointer-events: none;
}

.top-left { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.top-right { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.bottom-left { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.bottom-right { bottom: -2px; right: -2px; border-left: none; border-top: none; }

/* 윈도우 호버 시 브라켓 효과 */
.terminal-window:hover .corner-bracket {
  border-color: #ffb000;
  width: 25px;
  height: 25px;
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

/* --- 기존 요소 스타일 조정 (윈도우 내부 배치용) --- */

/* ASCII 로고 */
.ascii-logo {
  font-size: 10px;
  line-height: 10px;
  margin-bottom: 20px;
  color: #00ff41;
  text-shadow: 0 0 10px #00ff41;
  font-family: monospace;
  white-space: pre;
  overflow-x: hidden;
}

/* 로그 영역 */
.log-area {
  margin-bottom: 20px;
  transition: opacity 0.5s ease-out;
}
.log-area.fade-out-logs { opacity: 0; pointer-events: none; }
.log-area::-webkit-scrollbar { display: none; }

/* 로딩 바 (절대 위치 -> 윈도우 내부 하단 배치) */
.loading-container { 
  width: 80%; 
  position: absolute;
  bottom: 80px; /* 윈도우 바디 기준 */
  left: 00px;
  transition: bottom 0.3s ease;
}
.loading-container.processing {
  bottom: 110px; /* 엔터 후 50px 위로 이동 */
}
.loading-text { margin-bottom: 3px; font-size: 14px; text-align: left; margin-right: 0; }
.progress-bar { width: 100%; height: 10px; border: 1px solid #003b00; background: #001100; }
.progress-fill { 
  height: 100%; 
  background: #00ff41; 
  width: 0%; 
  box-shadow: 0 0 10px #00ff41; 
  transition: width 0.5s ease; /* 부드러운 상승 효과 */
}
.loading-container.processing .progress-fill {
  transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1); /* 자연스러운 채움 효과 */
}

/* 입력창 (절대 위치 -> 윈도우 내부 하단 배치) */
.input-area {
  display: flex;
  flex-direction: row; /* 가로 배치로 변경 */
  align-items: flex-end; /* 하단 정렬 */
  justify-content: space-between; /* 양쪽 끝 정렬 */
  width: 95%; /* 전체 너비 사용 */
  position: absolute;
  bottom: 50px; /* 윈도우 바디 기준 */
  left: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-label {
  color: #00ff41;
  font-size: 14px;
  margin-bottom: 8px;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
  font-weight: bold;
  letter-spacing: 1px;
}

.input-box {
  position: relative;
  width: 320px;
  max-width: 100%;
  height: 50px;
  border: none;
  border-bottom: 2px solid #00ff41;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 0 5px;
  cursor: text;
  transition: all 0.3s ease;
  box-shadow: none;
}

.input-box:hover, .input-box:focus-within {
  background: transparent;
  border-bottom-color: #ffb000;
  box-shadow: 0 10px 20px -10px rgba(255, 176, 0, 0.2);
}

/* 우측 장식 스타일 */
.input-decoration {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 220px;
  margin-right: 30px;
  opacity: 0.9;
  transform: translateY(60px); /* 아래로 60px 이동 */
  gap: 2px; /* 간격 좁힘 */
}

.date-display {
  font-size: 25px;
  color: #00ff41;
  letter-spacing: 1px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

.time-display {
  font-size: 86px; /* 크게 (36px + 50px) */
  font-weight: bold;
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.6);
  line-height: 1;
  letter-spacing: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.input-guide {
  font-size: 11px;
  color: rgba(0, 255, 65, 0.6);
  margin-top: 8px;
  margin-left: 2px;
  letter-spacing: 1px;
}

.cmd-input-hidden {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: text;
  border: none;
  outline: none;
}
.input-text {
  color: #ffb000;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 10px #ffb000, 0 0 20px #ffb000;
  white-space: pre;
  line-height: 1;
}
.typing-cursor, .blinking-cursor {
  display: inline-block; width: 12px; height: 3px;
  background-color: #ffb000; vertical-align: bottom;
  animation: blink 1s infinite;
  margin-top: 25px;
  box-shadow: 0 0 5px #ffb000;
}
.blinking-cursor { margin-left: 2px; }

/* 접속 승인 메시지 (위치 조정) */
.access-msg { 
  position: absolute;
  top: 400px; /* 로딩바(약 470px) 바로 아래 */
  left: 20px;
  color: #ffb000; 
  font-weight: bold; 
  font-size: 16px;
  line-height: 1.6;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.6);
  display: flex;
  flex-direction: column;
}

/* 글리치 텍스트 효과 */
.glitch-text {
  animation: glitch-anim 0.3s infinite;
  display: inline-block;
}
.blink-text { animation: blink 0.5s infinite; }

/* 블랙 트랜지션 (화면 전환 효과) */
.black-transition {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: black;
  z-index: 200000; /* 최상위 */
  animation: flash-fade 2s ease-out forwards; /* 천천히 밝아짐 */
  pointer-events: none;
}

@keyframes flash-fade {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

/* CRT OFF 애니메이션 (화면 꺼짐) */
.crt-off-anim {
  animation: crt-turn-off 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes crt-turn-off {
  0% {
    transform: scale(1, 1);
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    transform: scale(1, 0.005);
    opacity: 1;
    filter: brightness(2); /* 꺼지기 직전 밝아짐 */
  }
  100% {
    transform: scale(0, 0);
    opacity: 0;
  }
}

/* 전체 화면 설정 */
.boot-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  background-color: rgba(5, 5, 5, 0.3);
  /* 그리드 패턴 가시성 높임 (0.03 -> 0.05) */
  background-image: 
    linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center; /* 중앙 정렬 */
  font-family: 'Share Tech Mono', monospace;
  color: #00ff41;
  overflow: hidden;
  transition: opacity 1s ease-out;
}

.fade-out { opacity: 0; pointer-events: none; }

/* 배경 (레이아웃 가리기용) */
.boot-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #050505;
  z-index: 99990;
  transition: opacity 1s ease-out;
}

/* 매트릭스 캔버스 스타일 */
#boot-matrix {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99991; /* 배경보다 위 */
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 1s ease-out;
}

/* CRT 효과 z-index 조정 */
.crt-scanline, .crt-flicker {
  z-index: 10;
}

/* 풀스크린 로고 */
.logo-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  z-index: 100000;
  animation: logo-fade-out 0.8s ease-out forwards;
  animation-delay: 5.4s;
}

.ascii-logo-large {
  font-size: 20px;
  line-height: 1;
  /* 색수차 효과 + 글로우 결합 */
  text-shadow: 
    2px 0 0 rgba(255, 0, 255, 0.5),
    -2px 0 0 rgba(0, 255, 255, 0.5),
    0 0 12px rgba(0, 255, 65, 0.5), 
    0 0 25px rgba(0, 255, 65, 0.25);
  color: #00ff41;
  margin: 0;
  white-space: pre;
  font-family: 'Share Tech Mono', monospace;
  animation: logo-glow 2s ease-in-out infinite;
  margin-top: 30px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.boot-status {
  font-size: 18px;
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.6);
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 2px;
  animation: blink 1.5s infinite;
}

@keyframes logo-fade-out {
  from {
    opacity: 1;
    z-index: 100000;
  }
  to {
    opacity: 0;
    z-index: -1;
  }
}

@keyframes logo-glow {
  0%, 100% { text-shadow: 0 0 12px rgba(0, 255, 65, 0.5), 0 0 25px rgba(0, 255, 65, 0.25); }
  50% { text-shadow: 0 0 18px rgba(0, 255, 65, 0.7), 0 0 35px rgba(0, 255, 65, 0.4); }
}

/* 최종 메시지 스타일 */
.final-message-container {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 30;
  text-align: center;
  pointer-events: none;
}

.final-msg-small {
  font-size: 16px;
  color: #00ff41;
  margin-bottom: 20px;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
  font-family: 'Share Tech Mono', monospace;
}

.final-msg-large {
  font-size: 24px;
  color: #ffb000;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.8), 0 0 20px rgba(255, 100, 0, 0.5);
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 1px;
}

.warning-blink { 
  animation: warning-blink 0.5s infinite;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.8), 0 0 20px rgba(255, 176, 0, 0.5), 0 0 30px rgba(255, 100, 0, 0.3);
}

/* 애니메이션 정의 */
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes warning-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes flicker {
  0% { opacity: 0.02; } 50% { opacity: 0.05; } 100% { opacity: 0.02; }
}
@keyframes glitch-anim {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

/* 모바일 대응 */
@media (max-width: 600px) {
  .ascii-logo { font-size: 6px; line-height: 6px; }
  .terminal-window { width: 95%; height: 80vh; }
}
</style>
