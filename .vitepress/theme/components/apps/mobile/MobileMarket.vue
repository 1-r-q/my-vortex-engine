<template>
  <div class="mobile-market-view">
    <div class="mobile-header">
      <h2>자산 / 제작소 (MARKET)</h2>
    </div>

    <!-- Mode Tabs -->
    <div class="mode-tabs">
      <button 
        class="mode-btn" 
        :class="{ active: activeTab === 'workshop' }"
        @click="activeTab = 'workshop'"
      >
        제작소 (WORKSHOP)
      </button>
      <button 
        class="mode-btn danger" 
        :class="{ active: activeTab === 'market' }"
        @click="activeTab = 'market'"
      >
        암시장 (BLACK MARKET)
      </button>
    </div>

    <!-- Filter/Balance Bar -->
    <div class="market-bar">
      <div class="credits">CREDITS: 9,999 G</div>
    </div>

    <!-- Item List -->
    <div class="mobile-item-list" :class="activeTab">
      <div 
        v-for="item in currentItems" 
        :key="item.id" 
        class="m-item-card"
        :class="{ 'black-market-card': activeTab === 'market' }"
        @click="purchase(item)"
      >
        <div class="card-left">
          <div class="item-icon">{{ item.icon }}</div>
        </div>
        <div class="card-right">
          <div class="item-head">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">{{ item.price }} G</span>
          </div>
          <div class="item-desc">{{ item.desc }}</div>
          <div class="item-meta">
            <span class="item-id">{{ item.id }}</span>
            <span class="item-stock">QTY: {{ item.stock }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <MobileNavbar />

    <div class="toast-popup" v-if="toastMsg">
      {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MobileNavbar from './MobileNavbar.vue'

const props = defineProps({
  workshopItems: { type: Array, default: () => [] },
  blackMarketItems: { type: Array, default: () => [] }
})

defineEmits(['close'])

const activeTab = ref('workshop')
const toastMsg = ref('')

const currentItems = computed(() => {
  return activeTab.value === 'workshop' ? props.workshopItems : props.blackMarketItems
})

const purchase = (item) => {
  const mode = activeTab.value === 'market' ? 'Purchase' : 'Service'
  toastMsg.value = `[${mode}] ${item.name} (-${item.price}G)`
  setTimeout(() => toastMsg.value = '', 2000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+KR:wght@400;700&display=swap');

.mobile-market-view {
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

.mode-tabs {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #333;
}

.mode-btn {
  flex: 1;
  background: #111;
  color: #666;
  border: none;
  font-weight: bold;
  font-family: inherit;
  font-size: 1rem;
}

.mode-btn.active {
  background: #222;
  color: #ffb000;
}

.mode-btn.danger.active {
  color: #ff3333;
  background: #200;
}

.market-bar {
  padding: 10px 16px;
  background: #080808;
  border-bottom: 1px solid #222;
  text-align: right;
  color: #ffb000;
  font-weight: bold;
}

.mobile-item-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;  padding-bottom: 70px; /* Navbar Space */  display: flex;
  flex-direction: column;
  gap: 12px;
}

.m-item-card {
  display: flex;
  background: #111;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 4px;
  transition: all 0.2s;
}
.m-item-card:active { transform: scale(0.98); background: #1a1a1a; }

.black-market-card {
  border-color: #522;
  background: #150a0a;
}

.card-left {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
  background: #050505;
  border-radius: 4px;
}

.card-right {
  flex: 1;
}

.item-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.item-name {
  color: #eee;
  font-weight: bold;
}

.item-price {
  color: #ffb000;
}

.item-desc {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 8px;
  line-height: 1.3;
}

.item-meta {
  font-size: 0.75rem;
  color: #555;
  display: flex;
  justify-content: space-between;
}

.toast-popup {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffb000;
  color: #000;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: translateX(-50%) scale(0.8); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}
</style>
