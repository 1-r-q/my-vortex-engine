<template>
  <div class="mobile-world-view">
    <div class="mobile-header">
      <h2>WORLD GEOMAP</h2>
    </div>

    <!-- Filter Tabs -->
    <div class="mobile-filter-bar">
      <div 
        v-for="filter in ['ALL', 'UPPER', 'MIDDLE', 'LOWER', 'GROUND']" 
        :key="filter"
        class="filter-tab"
        :class="{ active: currentFilter === filter }"
        @click="currentFilter = filter"
      >
        {{ filter === 'ALL' ? 'ALL' : filter[0] }}
      </div>
    </div>

    <!-- Zone List -->
    <div class="mobile-zone-list">
      <div 
        v-for="(zone, index) in filteredZones" 
        :key="index" 
        class="m-zone-card"
        :style="{ '--zone-color': zone.themeColor }"
        @click="selectedZone = zone"
      >
        <div class="m-zone-header">
          <div class="m-zone-titles">
            <span class="m-badge">{{ zone.badge }}</span>
            <span class="m-name">{{ zone.name }}</span>
          </div>
          <div class="m-status-indicator" :class="zone.statusClass">{{ zone.status }}</div>
        </div>
        
        <div class="m-zone-subtitle">{{ zone.subtitle }}</div>
        
        <div class="m-zone-stats">
          <div class="stat-mini">
            <span class="label">DEPTH</span>
            <span class="value">{{ zone.depth }}</span>
          </div>
          <div class="stat-mini">
            <span class="label">TEMP</span>
            <span class="value">{{ zone.temperature }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <MobileNavbar />

    <!-- Detail Modal -->
    <div v-if="selectedZone" class="m-detail-modal-overlay" @click.self="selectedZone = null">
      <div class="m-detail-modal" :style="{ '--zone-color': selectedZone.themeColor }">
        <div class="m-modal-header">
          <div class="header-main">
            <span class="m-badge-lg">{{ selectedZone.badge }}</span>
            <h3>{{ selectedZone.name }}</h3>
          </div>
          <button class="close-btn" @click="selectedZone = null">✕</button>
        </div>

        <div class="m-modal-scroll">
            <div class="m-modal-section">
                <p class="m-desc-text">{{ selectedZone.description }}</p>
            </div>

            <div class="m-modal-section">
                <h4>ENVIRONMENT</h4>
                <div class="m-stat-grid">
                    <div class="stat-row">
                        <span class="s-label">DEPTH</span>
                        <span class="s-value">{{ selectedZone.depth }}</span>
                    </div>
                    <div class="stat-row">
                        <span class="s-label">PRESSURE</span>
                        <span class="s-value">{{ selectedZone.pressure }}</span>
                    </div>
                    <div class="stat-row">
                        <span class="s-label">TEMP</span>
                        <span class="s-value">{{ selectedZone.temperature }}</span>
                    </div>
                    <div class="stat-row">
                        <span class="s-label">STATUS</span>
                        <span class="s-value" :class="selectedZone.statusClass">{{ selectedZone.status }}</span>
                    </div>
                </div>
            </div>

            <div class="m-modal-section" v-if="selectedZone.features">
                <h4>KEY FEATURES</h4>
                <ul class="m-feature-list">
                    <li v-for="(feat, i) in selectedZone.features" :key="i">{{ feat }}</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MobileNavbar from './MobileNavbar.vue'

const props = defineProps({
  zones: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])

const currentFilter = ref('ALL')
const selectedZone = ref(null)

const filteredZones = computed(() => {
  if (currentFilter.value === 'ALL') return props.zones
  return props.zones.filter(z => z.shortName === currentFilter.value)
})

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+KR:wght@400;700&display=swap');

.mobile-world-view {
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
  overflow: hidden;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-header {
  min-height: 60px;
  height: auto;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  padding-top: max(10px, env(safe-area-inset-top));
  border-bottom: 1px solid #333;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: 1px solid #333;
  color: #ffb000;
  padding: 6px 12px;
  font-family: inherit;
  margin-right: 15px;
  cursor: pointer;
}

.mobile-header h2 {
  font-size: 1.2rem;
  color: #ffb000;
  margin: 0;
  letter-spacing: 1px;
}

.mobile-filter-bar {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #333;
  background: #080808;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none; /* Firefox */
}
.mobile-filter-bar::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.filter-tab {
  flex: 1;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9rem;
  border-right: 1px solid #1a1a1a;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #1a1a1a;
  color: #ffb000;
  box-shadow: inset 0 -2px 0 #ffb000;
}

.mobile-zone-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 75px; /* Navbar Space */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.m-zone-card {
  background: #0f0f0f;
  border: 1px solid #333;
  border-left: 3px solid var(--zone-color, #ffb000);
  padding: 12px;
  border-radius: 2px;
  cursor: pointer;
}

.m-zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.m-zone-titles {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-badge {
    background: #222;
    padding: 2px 6px;
    font-size: 0.7rem;
    color: var(--zone-color);
    border: 1px solid #333;
}

.m-name {
    font-weight: bold;
    color: #eee;
    font-size: 1rem;
}

.m-status-indicator {
    font-size: 0.7rem;
    padding: 2px 5px;
    border-radius: 2px;
    background: #111;
}

.status-stable { color: #00f0ff; border: 1px solid #00f0ff; }
.status-busy { color: #ff8800; border: 1px solid #ff8800; }
.status-unstable { color: #a020f0; border: 1px solid #a020f0; }
.status-danger { color: #ff0000; border: 1px solid #ff0000; }

.m-zone-subtitle {
    font-size: 0.85rem;
    color: #888;
    margin-bottom: 12px;
}

.m-zone-stats {
    display: flex;
    gap: 15px;
    font-size: 0.75rem;
    color: #666;
    border-top: 1px solid #222;
    padding-top: 8px;
}

.stat-mini .label { margin-right: 5px; color: #444; }
.stat-mini .value { color: #aaa; }

/* Detail Modal */
.m-detail-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.85);
    z-index: 10000;
    display: flex;
    align-items: flex-end;
}

.m-detail-modal {
    width: 100%;
    height: 85%;
    background: #0c0c0c;
    border-top: 2px solid var(--zone-color);
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease-out;
}

.m-modal-header {
    padding: 16px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.header-main h3 {
    margin: 5px 0 0 0;
    font-size: 1.4rem;
    color: var(--zone-color);
}

.m-badge-lg {
    font-size: 0.7rem;
    background: #222;
    padding: 2px 6px;
    color: #fff;
    border: 1px solid #444;
}

.m-zone-card:active {
  transform: scale(0.98);
  background: #1a1a1a;
}
.close-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 1.5rem;
    padding: 10px; /* Larger touch target */
}

.m-modal-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.m-modal-section {
    margin-bottom: 25px;
}

.m-modal-section h4 {
    font-size: 0.8rem;
    color: #555;
    border-bottom: 1px solid #222;
    padding-bottom: 5px;
    margin-bottom: 10px;
}

.m-desc-text {
    line-height: 1.6;
    font-size: 0.95rem;
    color: #ccc;
}

.m-stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.stat-row {
    background: #111;
    padding: 8px;
    display: flex;
    flex-direction: column;
}

.s-label { font-size: 0.7rem; color: #555; margin-bottom: 2px; }
.s-value { font-size: 0.9rem; color: #eee; }

.m-feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.m-feature-list li {
    padding: 8px 0;
    border-bottom: 1px solid #1a1a1a;
    font-size: 0.9rem;
    color: #aaa;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
</style>
