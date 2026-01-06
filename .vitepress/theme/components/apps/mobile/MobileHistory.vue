<template>
  <div class="mobile-history-container">
    <header class="mobile-header">
      <div class="header-content">
        <h1 class="page-title">CHRONICLE_DB</h1>
        <span class="system-status">SYS: ONLINE</span>
      </div>
      <div class="header-line"></div>
    </header>

    <div class="timeline-list">
      <div v-for="(event, index) in events" :key="index" class="timeline-item">
        <div class="time-marker">
          <div class="marker-dot"></div>
          <div class="marker-line"></div>
        </div>
        <div class="event-card">
          <div class="event-year">{{ event.year }}</div>
          <h2 class="event-title">{{ event.title }}</h2>
          <p class="event-desc">{{ event.desc || event.description }}</p>
          <div class="event-meta" v-if="event.integrity">
             INTEGRITY: {{ event.integrity }}%
          </div>
        </div>
      </div>
    </div>

    <footer class="mobile-footer">
      <button @click="$emit('close')" class="back-btn">
        <span class="btn-icon">◀</span> RETURN TO MENU
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.mobile-history-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #050505;
  color: #ffb000;
  font-family: 'Share Tech Mono', 'Noto Sans KR', monospace;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.mobile-header {
  padding: 20px;
  background: #0a0a0a;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5px;
}

.page-title {
  font-size: 1.5rem;
  margin: 0;
  letter-spacing: 2px;
  color: #ffb000;
  text-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
}

.system-status {
  font-size: 0.7rem;
  color: #00ff88;
}

.header-line {
  height: 2px;
  background: linear-gradient(90deg, #ffb000, transparent);
  width: 100%;
}

.timeline-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  gap: 15px;
}

.time-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffb000;
  box-shadow: 0 0 10px rgba(255, 176, 0, 0.8);
  margin-top: 5px;
}

.marker-line {
  flex: 1;
  width: 2px;
  background: rgba(255, 176, 0, 0.3);
  margin-top: 5px;
}

.timeline-item:last-child .marker-line {
  display: none;
}

.event-card {
  flex: 1;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 176, 0, 0.3);
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.event-year {
  font-size: 0.8rem;
  color: #ff8800;
  margin-bottom: 5px;
  font-weight: bold;
}

.event-title {
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: #ffe0a0;
}

.event-desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #ccc;
  margin: 0 0 10px 0;
}

.event-meta {
  font-size: 0.7rem;
  color: #666;
  text-align: right;
  border-top: 1px dashed rgba(255, 176, 0, 0.2);
  padding-top: 5px;
}

.mobile-footer {
  padding: 20px;
  background: #0a0a0a;
  border-top: 1px solid #333;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.back-btn {
  background: transparent;
  border: 1px solid #ffb000;
  color: #ffb000;
  padding: 10px 30px;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.back-btn:active {
  background: rgba(255, 176, 0, 0.2);
}

.btn-icon {
  font-size: 0.8rem;
}
</style>