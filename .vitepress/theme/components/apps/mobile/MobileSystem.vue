<template>
  <div class="mobile-system-view">
    <div class="mobile-header">
      <button @click="$emit('close')" class="back-btn">◀ MENU</button>
      <h2>SYSTEM ROOT</h2>
    </div>

    <!-- Grid Menu -->
    <div class="m-grid-menu">
       <!-- Rulebook -->
       <button class="m-menu-card" @click="openLink('/threats/database.html')">
          <div class="card-icon">⚖️</div>
          <div class="card-label">
            <div class="card-title">CORE RULES</div>
            <div class="card-desc">Vortex System Basic Rules</div>
          </div>
          <div class="card-arrow">➜</div>
       </button>
       
       <!-- RNG (Disabled) -->
       <div class="m-menu-card disabled">
          <div class="card-icon">🎲</div>
          <div class="card-label">
            <div class="card-title">RNG ENGINE</div>
            <div class="card-desc">Optimized for Desktop</div>
          </div>
       </div>
       
       <!-- Combat (Disabled) -->
       <div class="m-menu-card disabled">
          <div class="card-icon">⚔️</div>
          <div class="card-label">
            <div class="card-title">COMBAT SIM</div>
            <div class="card-desc">Optimized for Desktop</div>
          </div>
       </div>
       
       <!-- Char Creation (Disabled) -->
       <div class="m-menu-card disabled">
          <div class="card-icon">🏗️</div>
          <div class="card-label">
             <div class="card-title">BUILDER</div>
             <div class="card-desc">Optimized for Desktop</div>
          </div>
       </div>
    </div>
    
    <!-- System Status Log -->
    <div class="m-system-log">
       <div class="log-head">> SYSTEM LOG_</div>
       <div class="log-content">
          <div class="log-line"><span class="info">[INFO]</span> Mobile Access Detected</div>
          <div class="log-line"><span class="warn">[WARN]</span> Rendering 3D modules... failed</div>
          <div class="log-line"><span class="sys">[SYS]</span> Fallback to Lite Mode</div>
          <div class="log-line"><span class="ok">[OK]</span> Core protocols loaded</div>
          <div class="log-line"><span class="ok">[OK]</span> Connection Stable</div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'

const emit = defineEmits(['close'])

const openLink = (path) => {
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
  background-color: #050505;
  color: #c0c0c0;
  font-family: 'Share Tech Mono', 'Noto Sans KR', monospace;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #333;
  background: #0a0a0a;
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
}

.m-menu-card {
  display: flex;
  align-items: center;
  background: #111;
  border: 1px solid #333;
  padding: 15px;
  text-align: left;
  cursor: pointer;
}

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
  height: 35%;
  overflow-y: auto;
  font-size: 0.8rem;
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
