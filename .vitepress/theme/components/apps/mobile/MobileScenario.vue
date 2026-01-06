<template>
  <div class="mobile-scenario-wrapper">
    <!-- Header -->
    <header class="m-header">
      <div class="m-header-top">
        <h1 class="m-title">MISSION_LOG</h1>
        <div class="m-status-ind">OP-STATUS: ACTIVE</div>
      </div>
      <div class="m-progress-bar">
        <div class="m-progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </header>

    <!-- Chapter List -->
    <div class="m-chapter-list">
      <div 
        v-for="(chapter, index) in chapters" 
        :key="index"
        class="m-chapter-card"
        :class="{ 'is-locked': !isUnlocked(index), 'is-active': selectedIndex === index }"
        @click="selectChapter(index)"
      >
        <div class="m-card-status">
          <span class="m-index">OP-{{ 900 + index }}</span>
          <span class="m-lock-icon" v-if="!isUnlocked(index)">🔒 LKD</span>
          <span class="m-lock-icon unlocked" v-else>🔓 OPN</span>
        </div>
        
        <h3 class="m-chapter-title">{{ chapter.title }}</h3>
        
        <div class="m-card-body" v-if="selectedIndex === index">
          <div class="m-info-grid">
            <div class="m-info-item"><span>LOC:</span> {{ chapter.loc }}</div>
            <div class="m-info-item"><span>TIME:</span> {{ chapter.time }}</div>
            <div class="m-info-item"><span>DIFF:</span> {{ chapter.difficulty }}</div>
          </div>
          
          <div class="m-desc-box">
             <div class="m-label">>> BRIEFING</div>
             <p>{{ isUnlocked(index) ? chapter.bg : 'ENCRYPTED DATA // ACCESS DENIED' }}</p>
          </div>
          
          <div class="m-desc-box alert" v-if="isUnlocked(index) && chapter.crisis">
             <div class="m-label red">>> THREAT</div>
             <p>{{ chapter.crisis }}</p>
          </div>

          <!-- Action Button -->
          <div class="m-actions">
            <button class="m-btn-start" v-if="isUnlocked(index)" @click.stop="startMission(index)">
              INITIATE SIMULATION
            </button>
             <button class="m-btn-locked" v-else @click.stop="handleLockedClick(index)">
              ACCESS DENIED
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="m-footer">
      <button class="m-btn-back" @click="$emit('close')">ABORT MISSION / RETURN</button>
    </footer>

    <!-- Password Modal -->
    <div class="m-modal" v-if="showPasswordModal">
      <div class="m-modal-box">
        <h3 class="m-modal-title">SECURITY CHECK</h3>
        <p class="m-modal-msg">ENTER ACCESS CODE</p>
        <input type="text" v-model="passwordInput" class="m-input" placeholder="CODE" />
        <div class="m-modal-actions">
          <button class="m-btn outline" @click="showPasswordModal = false">CANCEL</button>
          <button class="m-btn solid" @click="verifyPassword">VERIFY</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const emit = defineEmits(['close']);

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
    bg: '하층 암시장 구역. 현재 수배 중이며 불량품으로 식별되었습니다. 긴급 수리 및 보급이 필요합니다.',
    crisis: '현상금 사냥꾼 다수 포진. 신원 발각 시 즉결 처형 위험.',
    stagnation: '수배망 확대 및 사냥꾼 추적 개시.',
    objective: '수리 완료 및 밀항 지도 확보 → 3장으로 이동.',
    requiredPassword: 'NEEDLE_AND_THREAD',
    time: '2200', loc: 'BLACK MARKET', weather: 'SMOG', difficulty: 'NORMAL'
  },
  {
    title: '강철의 뱃속으로',
    bg: '중앙 배관 구역 진입. 자동 감시기 및 고압 증기 함정이 다수 분포합니다.',
    crisis: '수직 통로 돌파 필요. 발각 시 집중 포화 사격 예상.',
    stagnation: '배관 내 압력 및 온도 임계치 초과.',
    objective: '중층 진입 및 추적 따돌리기 → 4장으로 이동.',
    requiredPassword: 'SPIDER_LILY',
    time: '0300', loc: 'PIPELINE', weather: 'STEAM', difficulty: 'HARD'
  },
  {
    title: '톱니바퀴의 선택',
    bg: '중층 공장 지구. 고립된 상태에서 거대 세력과 접촉했습니다.',
    crisis: '핵심 코드 결여로 인한 기능 정지 임박.',
    stagnation: '세력 소속 강요 및 동력로 과부하.',
    objective: '거점 확보 및 잠입 준비 완료 → 5장으로 이동.',
    requiredPassword: 'RED_LENS',
    time: '1400', loc: 'FACTORY', weather: 'CLEAR', difficulty: 'NORMAL'
  },
  {
    title: '창조의 비밀',
    bg: '기계창 심층부 도달. 추적기(X)의 감시망이 작동 중입니다.',
    crisis: '메인 서버 접속 시도. 진실 확인. 오직 μ타입 기체만이 산성 안개를 견딜 수 있음.',
    stagnation: '독가스 살포 및 폐기 프로토콜 가동.',
    objective: '기원 근거 및 좌표 확보 후 지상으로 하강.',
    requiredPassword: 'GHOST_PROTOCOL',
    time: '0000', loc: 'DEEP LAB', weather: 'TOXIC', difficulty: 'VERY HARD'
  },
  {
    title: '녹슨 바다의 심연',
    bg: '지상 구역 진입. 고농도 산성 안개 및 기계수가 출몰합니다.',
    crisis: '방호막 내구도 한계 도달. 고대 유물 신호 감지.',
    stagnation: '방호막 효력 상실 위기 및 거대 괴수 접근.',
    objective: '유물 확보 및 기체 각성.',
    requiredPassword: 'BLOOD_THRONE',
    time: '1800', loc: 'GROUND ZERO', weather: 'ACID STORM', difficulty: 'EXTREME'
  },
  {
    title: '포위망 돌파',
    bg: '중층 복귀 완료. 보안국장의 계엄령이 선포되었습니다.',
    crisis: '퇴로 차단됨. 무력으로 포위망 분쇄 및 상층 승강기 탈취 필요.',
    stagnation: '포위망 급격히 축소 및 공중 폭격 개시.',
    objective: '국장 격파 및 상층 경로 확보.',
    requiredPassword: 'IRON_HAMMER',
    time: '1000', loc: 'MID-LAYER', weather: 'WAR', difficulty: 'HARD'
  },
  {
    title: '천공의 가면무도회',
    bg: '상층 귀족원 구역. 난공불락의 황금 방벽이 가동 중입니다.',
    crisis: '귀족 신분 위장 잠입 시도. 내통자를 통한 게이트 개방 필요.',
    stagnation: '정예 저격수 배치 및 사병단의 집중 포화 사격.',
    objective: '황실 코드 확보.',
    requiredPassword: 'GOLDEN_FAN',
    time: '2000', loc: 'UPPER CITY', weather: 'GOLD DUST', difficulty: 'HARD'
  },
  {
    title: '백금의 수호자',
    bg: '황궁 정문. 최강의 기체(0호기)가 앞을 가로막습니다.',
    crisis: '생사를 건 사투. 모든 장애물 제거 후 남은 것은 황제와 코어뿐.',
    stagnation: '무한 증원 병력 투입 및 광역 섬멸 병기 발동.',
    objective: '근위대 격파 및 황궁 진입.',
    requiredPassword: 'PLATINUM_WING',
    time: '1200', loc: 'PALACE GATE', weather: 'HOLY LIGHT', difficulty: 'BOSS'
  },
  {
    title: '최후의 태엽',
    bg: '황제와의 대면. 도시의 운명을 결정할 순간입니다.',
    crisis: '절대 명령권 발동 및 코어 임계점 도달.',
    stagnation: '코어 붕괴 시작 및 도시 추락 카운트다운 개시.',
    objective: '결말 선택 및 후일담.',
    requiredPassword: 'CLOCKWORK_HEART',
    time: '2359', loc: 'THRONE ROOM', weather: 'VOID', difficulty: 'FINAL'
  }
];

const selectedIndex = ref(-1);
const unlockedIndices = ref([0]);
const showPasswordModal = ref(false);
const passwordInput = ref('');
const targetUnlockIndex = ref(-1);

const isUnlocked = (index) => unlockedIndices.value.includes(index);

const selectChapter = (index) => {
  if (selectedIndex.value === index) {
      selectedIndex.value = -1; // Toggle off
  } else {
      selectedIndex.value = index;
  }
};

const handleLockedClick = (index) => {
    const ch = chapters[index];
    if (ch.requiredPassword) {
        targetUnlockIndex.value = index;
        passwordInput.value = '';
        showPasswordModal.value = true;
    }
}

const verifyPassword = () => {
    if (targetUnlockIndex.value === -1) return;
    const ch = chapters[targetUnlockIndex.value];
    if (passwordInput.value === ch.requiredPassword) {
        unlockedIndices.value.push(targetUnlockIndex.value);
        showPasswordModal.value = false;
        alert('ACCESS GRANTED');
    } else {
        alert('ACCESS DENIED');
    }
}

const startMission = (index) => {
    alert('SIMULATION INITIATED: ' + chapters[index].title);
}

const progressPercent = computed(() => {
    return Math.round((unlockedIndices.value.length / chapters.length) * 100);
});

// Persistence
onMounted(() => {
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
});

watch(unlockedIndices, (newVal) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vortex-unlocked-chapters', JSON.stringify(newVal));
  }
}, { deep: true });

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.mobile-scenario-wrapper {
  background: #111;
  color: #ffb000;
  font-family: 'Share Tech Mono', 'Noto Sans KR', monospace;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  z-index: 9999;
}

.m-header {
  padding: 20px;
  background: #000;
  border-bottom: 2px solid #333;
}

.m-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.m-title {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 1px;
}

.m-status-ind {
  font-size: 0.8rem;
  color: #0f0;
  border: 1px solid #0f0;
  padding: 2px 5px;
  border-radius: 2px;
}

.m-progress-bar {
  height: 4px;
  background: #333;
  width: 100%;
}

.m-progress-fill {
  background: #ffb000;
  height: 100%;
  transition: width 0.3s ease;
}

.m-chapter-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.m-chapter-card {
  background: #1a1a1a;
  border: 1px solid #444;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: all 0.2s;
}

.m-chapter-card.is-active {
  border-color: #ffb000;
  background: #252010;
}

.m-chapter-card.is-locked {
  opacity: 0.7;
  border-style: dashed;
}

.m-card-status {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.m-lock-icon { font-weight: bold; }
.m-lock-icon.unlocked { color: #0f0; }

.m-chapter-title {
  margin: 0;
  padding: 15px;
  font-size: 1.1rem;
}

.m-card-body {
  padding: 0 15px 15px;
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.m-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  font-size: 0.8rem;
  margin-bottom: 15px;
  color: #ccc;
}

.m-info-item span { color: #888; }

.m-desc-box {
  background: rgba(0,0,0,0.3);
  padding: 10px;
  border-left: 2px solid #666;
  margin-bottom: 10px;
}

.m-desc-box.alert {
  border-left-color: #f33;
  background: rgba(255,50,50,0.1);
}

.m-label {
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 5px;
  font-weight: bold;
}
.m-label.red { color: #f33; }

.m-desc-box p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.m-actions {
  margin-top: 15px;
}

.m-btn-start, .m-btn-locked {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.m-btn-start {
  background: #ffb000;
  color: #000;
}

.m-btn-locked {
  background: #333;
  color: #888;
}

.m-footer {
  padding: 15px;
  border-top: 1px solid #333;
  background: #000;
}

.m-btn-back {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #ffb000;
  color: #ffb000;
  font-family: inherit;
}

/* Modal */
.m-modal {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex; align-items: center; justify-content: center;
  z-index: 10000;
}

.m-modal-box {
  background: #111;
  border: 2px solid #ffb000;
  padding: 20px;
  width: 80%;
  text-align: center;
}

.m-modal-title { color: #f33; margin-top: 0; }
.m-modal-msg { margin: 20px 0; }

.m-input {
  width: 90%;
  padding: 10px;
  background: #000;
  border: 1px solid #ffb000;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  font-family: inherit;
  margin-bottom: 20px;
}

.m-modal-actions { display: flex; gap: 10px; justify-content: center; }

.m-btn { padding: 10px 20px; font-family: inherit; cursor: pointer; }
.m-btn.outline { background: transparent; border: 1px solid #666; color: #ccc; }
.m-btn.solid { background: #ffb000; border: none; color: #000; }
</style>