<template>
  <div class="mobile-system-view">
    <div class="mobile-header">
      <h2>시스템 (SYSTEM)</h2>
    </div>

    <!-- Grid Menu -->
    <div class="m-grid-menu">
       <!-- Rulebook -->
       <button class="m-menu-card" @click="openLink('/threats/database.html')">
          <div class="card-icon">⚖️</div>
          <div class="card-label">
            <div class="card-title">핵심 규칙</div>
            <div class="card-desc">Vortex System Basic Rules</div>
          </div>
          <div class="card-arrow">➜</div>
       </button>
       
       <!-- RNG (Disabled) -->
       <div class="m-menu-card disabled">
          <div class="card-icon">🎲</div>
          <div class="card-label">
            <div class="card-title">주사위 엔진</div>
            <div class="card-desc">데스크탑 전용 (Desktop Only)</div>
          </div>
       </div>
       
       <!-- Combat (Disabled) -->
       <div class="m-menu-card disabled">
          <div class="card-icon">⚔️</div>
          <div class="card-label">
            <div class="card-title">전투 시뮬레이션</div>
            <div class="card-desc">데스크탑 전용 (Desktop Only)</div>
          </div>
       </div>
       
       <!-- Char Creation (Disabled) -->
       <div class="m-menu-card disabled">
          <div class="card-icon">🏗️</div>
          <div class="card-label">
             <div class="card-title">캐릭터 빌더</div>
             <div class="card-desc">데스크탑 전용 (Desktop Only)</div>
          </div>
       </div>
    </div>


    <!-- System Status Log -->
    <div class="m-system-log">
       <div class="log-head">> 시스템 로그 (SYSTEM LOG)</div>
       <div class="log-content">
          <div class="log-line"><span class="info">[INFO]</span> Mobile Access Detected</div>
          <div class="log-line"><span class="warn">[WARN]</span> 3D Modules Disabled</div>
          <div class="log-line"><span class="sys">[SYS]</span> Running Lite Mode</div>
          <div class="log-line"><span class="ok">[OK]</span> Core Protocols Loaded</div>
       </div>
    </div>

    <MobileNavbar />
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import MobileNavbar from './MobileNavbar.vue'

const emit = defineEmits(['close'])

const openLink = (path) => {
    if (path.includes('threats/database.html')) {
        alert('데스크탑 전용입니다.');
        return;
    }
    window.location.href = withBase(path)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+KR:wght@400;700&display=swap');

.mobile-system-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 60px; /* Space for Navbar */
  background-color: #050505;
  color: #c0c0c0;
  font-family: 'Share Tech Mono', 'Noto Sans KR', monospace;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  padding-top: max(0px, env(safe-area-inset-top));
  height: calc(60px + env(safe-area-inset-top));
  border-bottom: 1px solid #333;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.back-btn {
  background: none;
  border: 1px solid #333;
  color: #ffb000;
  padding: 6px 12px;
  margin-right: 15px;
}

.m-grid-menu {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.m-menu-card {
  display: flex;
  align-items: center;
  background: #111;
  border: 1px solid #333;
  padding: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.m-menu-card:active { transform: scale(0.98); background: #222; }

.m-menu-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-style: dashed;
}

.card-icon {
  font-size: 24px;
  margin-right: 15px;
  width: 30px;
  display: flex;
  justify-content: center;
}

.card-label {
  flex: 1;
}

.card-title {
  color: #eee;
  font-weight: bold;
  font-size: 1rem;
}

.card-desc {
  font-size: 0.8rem;
  color: #777;
}

.card-arrow {
  color: #ffb000;
  font-weight: bold;
}

.m-system-log {
  background: #000;
  border-top: 1px solid #333;
  padding: 16px;
  height: 25%;
  overflow-y: auto;
  font-size: 0.8rem;
  padding-bottom: 80px; /* Navbar */
}

.log-head {
  color: #ffb000;
  margin-bottom: 10px;
  border-bottom: 1px solid #222;
  padding-bottom: 5px;
}

.log-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.log-line span {
  color: #00f0ff;
  margin-right: 5px;
}

.log-line span.warn {
  color: #ff8800;
}
</style>
