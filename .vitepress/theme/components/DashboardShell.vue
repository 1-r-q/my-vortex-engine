<template>
  <div class="tactical-dashboard">
    <div class="dashboard-bg"></div>
    <div class="vignette"></div>
    <div class="noise"></div>

    <div class="grid-container">
      <!-- Header -->
      <header class="panel header-panel">
        <div class="header-left">
          <div class="logo-symbol" @click="goHome">◈</div>
          <div class="header-title" @click="goHome">
            <span class="brand">VORTEX_ENGINE</span>
            <span class="version">v19.0.4</span>
          </div>
        </div>
        <div class="header-center">
          <div class="status-bar">
            <span class="status-text">모듈 상태:</span>
            <span class="status-value online">{{ pageTitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <a href="javascript:void(0)" @click="goHome" class="top-menu-item">메인으로</a>
        </div>
      </header>

      <!-- Nav -->
      <nav class="panel nav-panel">
        <div class="corner-bracket top-left"></div>
        <div class="corner-bracket top-right"></div>
        <div class="corner-bracket bottom-left"></div>
        <div class="corner-bracket bottom-right"></div>

        <div class="panel-header-sm">:: 네비게이션 ::</div>
        <ul class="nav-list">
          <li v-for="(item, index) in navItems" :key="index" class="nav-item">
            <a href="javascript:void(0)" @click="handleNavClick(item)" class="nav-link" :class="{ active: currentPath === item.link }">
              <div class="nav-content">
                <span class="nav-num">0{{ index + 1 }}</span>
                <span class="nav-text">{{ item.text }}</span>
              </div>
              <div class="nav-arrow"></div>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Main Content Slot -->
      <main class="panel main-panel">
        <div class="corner-bracket top-left"></div>
        <div class="corner-bracket top-right"></div>
        <div class="corner-bracket bottom-left"></div>
        <div class="corner-bracket bottom-right"></div>
        <div class="rivet r-tl"></div>
        <div class="rivet r-tr"></div>
        <div class="rivet r-bl"></div>
        <div class="rivet r-br"></div>

        <div class="content-wrapper">
          <slot></slot>
        </div>
      </main>

      <!-- Info Sidebar -->
      <aside class="panel info-panel">
        <div class="info-section">
          <div class="panel-header-sm">:: 데이터 분석 ::</div>
          <div class="info-text">
            <slot name="info">
              데이터 로딩 완료.<br>
              보안 레벨: 3등급<br>
              열람 승인됨.
            </slot>
          </div>
        </div>
        <div class="info-section flex-grow">
          <div class="panel-header-sm">:: 시스템 로그 ::</div>
          <div class="log-console">
            <div v-for="(log, i) in logs" :key="i" class="log-line">
              <span class="log-time">[{{ log.time }}]</span> {{ log.msg }}
            </div>
          </div>
        </div>
      </aside>

      <!-- Footer -->
      <footer class="panel footer-panel">
        <div class="footer-label">시스템_메시지 //</div>
        <div class="ticker-container">
          <div class="ticker-content">
            <span>>>> 보안 프로토콜 준수 요망</span>
            <span>>>> 외부 접속 시도 차단됨</span>
            <span>>>> 데이터 무결성 검증 완료</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vitepress';
import { triggerTransition } from '../transitionState';

const router = useRouter();

const props = defineProps({
  pageTitle: { type: String, default: '대기 중' }
});

const navItems = [
  { text: '역사', link: '/guide/history' },
  { text: '세계', link: '/world/map' },
  { text: '인물', link: '/characters/' },
  { text: '에셋', link: '/assets/list' },
  { text: '위협', link: '/threats/database' },
  { text: '규칙', link: '/guide/system' }
];

const currentPath = ref('');
const logs = ref([]);

const addLog = (msg) => {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  logs.value.unshift({ time, msg });
  if (logs.value.length > 10) logs.value.pop();
};

const handleNavClick = (item) => {
  if (currentPath.value === item.link) return;
  router.go(item.link);
};

const goHome = () => {
  triggerTransition('system-reboot', () => {
    router.go('/');
  });
};

onMounted(() => {
  currentPath.value = window.location.pathname;
  addLog('시스템 초기화 완료');
  addLog('사용자 인증 성공');
  addLog(`${props.pageTitle} 모듈 로드됨`);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Share+Tech+Mono&display=swap');

:root {
  --c-bg: rgba(20, 10, 5, 0.95);
  --c-panel: rgba(20, 15, 10, 0.9);
  --c-border: #8b5a2b;
  --c-primary: #ffb000;
  --c-secondary: #c5a059;
  --c-text: #e0d0b0;
  --c-text-dim: #8a7b6b;
  --font-main: 'Share Tech Mono', monospace;
  --font-display: 'Black Ops One', cursive;
}

.tactical-dashboard {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: var(--c-bg);
  color: var(--c-text);
  font-family: var(--font-main);
  overflow: hidden;
  user-select: none;
}

.dashboard-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at center, rgba(255, 176, 0, 0.05) 0%, transparent 70%),
              repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px);
  z-index: 0;
}

.vignette {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.9) 100%);
  z-index: 11;
  pointer-events: none;
}

.noise {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.03;
  z-index: 12;
  pointer-events: none;
}

.grid-container {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main info"
    "footer footer footer";
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: 60px 1fr 30px;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.panel {
  background: var(--c-panel);
  border: 2px solid var(--c-border);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  position: relative;
  display: flex;
  flex-direction: column;
}

.header-panel {
  grid-area: header;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo-symbol {
  font-size: 20px;
  color: var(--c-primary);
  margin-right: 10px;
  cursor: pointer;
}

.header-title {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.brand {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--c-text);
}

.version {
  font-size: 10px;
  color: var(--c-secondary);
}

.status-bar {
  border: 1px solid var(--c-border);
  padding: 5px 15px;
  background: rgba(0,0,0,0.3);
}

.status-value {
  color: var(--c-primary);
  font-weight: bold;
  margin-left: 5px;
}

.nav-panel { 
  grid-area: nav; 
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 20px 10px;
}
.main-panel { grid-area: main; position: relative; overflow: hidden; }
.info-panel { grid-area: info; padding: 10px; gap: 10px; }
.footer-panel { grid-area: footer; flex-direction: row; align-items: center; padding: 0 10px; font-size: 11px; }

.nav-list {
  list-style: none;
  padding: 0 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  
  /* Module Look: Background Box */
  background: linear-gradient(90deg, rgba(20, 10, 0, 0.8), rgba(20, 10, 0, 0.4));
  border: 1px solid rgba(255, 176, 0, 0.2);
  
  /* Left Indicator: Visual Baseline */
  border-left: 4px solid rgba(255, 176, 0, 0.5);
  
  text-decoration: none;
  color: var(--c-text-dim);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 0;
}

/* Hover & Active State */
.nav-link:hover, .nav-link.active {
  /* Background: Brighter */
  background: linear-gradient(90deg, rgba(255, 176, 0, 0.3), rgba(0, 0, 0, 0.5));
  border-color: var(--c-primary);
  
  /* Left Indicator: Active */
  border-left: 8px solid #fff; /* White indicator on hover */
  
  /* Movement: Slide Right */
  transform: translateX(10px);
  
  /* Glow */
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.2);
  color: var(--c-primary);
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 2;
  width: 100%;
}

/* Numbering: Index Box Style */
.nav-num {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--c-primary);
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--c-primary);
  padding: 4px 8px;
  min-width: 40px;
  text-align: center;
  transition: all 0.3s;
  margin-right: 0;
}

.nav-text {
  font-family: var(--font-ui);
  font-size: 1.4rem;
  letter-spacing: 2px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s;
  color: var(--c-primary);
  text-shadow: 0 0 5px rgba(255, 176, 0, 0.3);
}

.nav-arrow {
  width: 8px; height: 8px;
  border-top: 2px solid var(--c-primary);
  border-right: 2px solid var(--c-primary);
  transform: rotate(45deg);
  opacity: 0.5;
  transition: all 0.3s;
}

/* Active/Hover Text Styles */
.nav-link:hover .nav-num, .nav-link.active .nav-num {
  color: #000;
  background: var(--c-primary);
  border-color: #fff;
  box-shadow: 0 0 10px var(--c-primary);
}

.nav-link:hover .nav-text, .nav-link.active .nav-text {
  color: #fff;
  text-shadow: 0 0 10px #fff, 0 0 20px var(--c-primary);
}

.nav-link:hover .nav-arrow, .nav-link.active .nav-arrow {
  border-color: #fff;
  opacity: 1;
  transform: rotate(45deg) translate(5px, -5px);
  box-shadow: 2px -2px 5px var(--c-primary);
}

/* Scanline effect on hover */
.nav-link::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: skewX(-20deg);
  transition: none;
}
.nav-link:hover::after {
  left: 150%;
  transition: left 0.5s ease-in-out;
}

.content-wrapper {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

/* Scrollbar */
.content-wrapper::-webkit-scrollbar { width: 8px; }
.content-wrapper::-webkit-scrollbar-track { background: #1a1208; }
.content-wrapper::-webkit-scrollbar-thumb { background: #8b5a2b; }

.corner-bracket {
  position: absolute;
  width: 15px; height: 15px;
  border: 2px solid var(--c-primary);
  z-index: 10;
}
.top-left { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.top-right { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.bottom-left { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.bottom-right { bottom: -2px; right: -2px; border-left: none; border-top: none; }

.rivet {
  position: absolute;
  width: 6px; height: 6px;
  background: var(--c-secondary);
  border-radius: 50%;
  z-index: 10;
}
.r-tl { top: 5px; left: 5px; }
.r-tr { top: 5px; right: 5px; }
.r-bl { bottom: 5px; left: 5px; }
.r-br { bottom: 5px; right: 5px; }

.panel-header-sm {
  font-size: 11px;
  color: var(--c-primary);
  background: rgba(255, 176, 0, 0.1);
  padding: 5px;
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 5px;
}

.log-console {
  font-size: 10px;
  color: var(--c-text-dim);
  font-family: monospace;
  overflow: hidden;
}

.log-line { margin-bottom: 2px; }
.log-time { color: var(--c-secondary); }

.ticker-container { flex: 1; overflow: hidden; position: relative; height: 15px; }
.ticker-content { display: flex; gap: 30px; position: absolute; animation: ticker 15s linear infinite; white-space: nowrap; }

@keyframes ticker { 0% { left: 100%; } 100% { left: -100%; } }
</style>