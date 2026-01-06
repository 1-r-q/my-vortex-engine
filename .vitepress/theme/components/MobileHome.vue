<template>
  <div class="mobile-home" :class="{ 'shake-anim': isLaunching }" @touchstart.once="handleInteraction" @click.once="handleInteraction">
    <div class="mobile-header">
      <div class="logo">VORTEX ENGINE</div>
      <div class="sub-logo">SYSTEM v19.0.4</div>
    </div>

    <!-- Central Interactive Element -->
    <div class="mobile-core">
      <div class="core-circle pulse-anim"></div>
      <div class="core-overlay"></div>
      <button class="init-btn" @click="$emit('runSequence')">
        INITIATE
      </button>
    </div>

    <!-- Navigation List -->
    <div class="mobile-nav">
      <button class="nav-btn" @click="$emit('openModule', 'scenario')">
        <span class="icon">🎯</span>
        <span class="label">작전 (LOG)</span>
      </button>
      <button class="nav-btn" @click="$emit('openModule', 'history')">
        <span class="icon">📜</span>
        <span class="label">역사 (HISTORY)</span>
      </button>
      <button class="nav-btn" @click="$emit('openModule', 'world')">
        <span class="icon">🌍</span>
        <span class="label">세계 (WORLD)</span>
      </button>
      <button class="nav-btn" @click="$emit('openModule', 'characters')">
        <span class="icon">👤</span>
        <span class="label">인물 (CHARS)</span>
      </button>
      <button class="nav-btn" @click="$emit('openModule', 'market')">
        <span class="icon">📦</span>
        <span class="label">자산 (ASSETS)</span>
      </button>
      <button class="nav-btn" @click="$emit('openModule', 'system')">
        <span class="icon">⚖️</span>
        <span class="label">규칙 (RULES)</span>
      </button>
    </div>

    <!-- Status Footer -->
    <div class="mobile-footer">
      <div class="status-row">
        <span>SYS: ONLINE</span>
        <span>NET: SECURE</span>
      </div>
      <div class="version-row">VORTEX MOBILE INTERFACE</div>
    </div>

    <!-- Cinematic Overlays (Animation) -->
    <div v-if="showFlash" class="cinematic-flash"></div>
    <div v-if="showBlackout" class="cinematic-blackout">
      <div class="cinematic-dialogue" :class="{ 'fade-out': dialogueFading }">
        {{ dialogueContent }}<span class="cursor">_</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSteamSound } from '../composables/useSteamSound';

const props = defineProps({
  isLaunching: Boolean,
  showFlash: Boolean,
  showBlackout: Boolean,
  dialogueContent: String,
  dialogueFading: Boolean
});

defineEmits(['openModule', 'runSequence']);

const { playAmbient, playClick } = useSteamSound();

const handleInteraction = () => {
    playAmbient();
}
</script>

<style scoped>
.mobile-home {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #050505;
  color: #ffb000;
  font-family: 'Share Tech Mono', monospace;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: max(20px, env(safe-area-inset-top));
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  z-index: 1000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 176, 0, 0.3);
  padding-bottom: 15px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.sub-logo {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 5px;
}

.mobile-core {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.core-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 176, 0, 0.5);
  border-radius: 50%;
  animation: spin 10s linear infinite;
}

.init-btn {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 176, 0, 0.1);
  border: 2px solid #ffb000;
  color: #ffb000;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 176, 0, 0.2);
  transition: all 0.3s;
  z-index: 10;
}

.init-btn:active {
  background: #ffb000;
  color: #000;
  transform: scale(0.95);
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.nav-btn {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 176, 0, 0.3);
  color: #ffb000;
  font-family: inherit;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.1s;
}

.nav-btn:active {
  background: rgba(255, 176, 0, 0.2);
  transform: scale(0.98);
}

.nav-btn .icon {
  font-size: 20px;
  margin-right: 15px;
  width: 30px;
  text-align: center;
}

.mobile-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 10px;
  opacity: 0.5;
  border-top: 1px solid rgba(255, 176, 0, 0.2);
  padding-top: 10px;
}

.status-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 5px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pulse-anim {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.5; transform: scale(1); }
}

.shake-anim {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite both;
  color: #ff3333 !important; /* Turn red on launch */
  border-color: #ff3333 !important;
}

.shake-anim .core-circle {
  border-color: #ff3333 !important;
  animation-duration: 0.2s !important;
}

.shake-anim .init-btn {
  background: #ff3333 !important;
  color: #000 !important;
  box-shadow: 0 0 50px #ff3333 !important;
  transform: scale(1.1);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
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
  padding: 20px;
  text-align: center;
}

.cinematic-dialogue {
  font-family: 'Share Tech Mono', 'Noto Sans KR', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.5;
  color: #ffb000;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.8);
  transition: all 1s ease;
  white-space: pre-wrap;
}

.cinematic-dialogue.fade-out {
  opacity: 0;
  filter: blur(5px);
}

.cursor {
  animation: blink 1s infinite;
  display: inline-block;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
