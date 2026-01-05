/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VORTEX ENGINE - STEAMPUNK SOUND SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 스팀펑크 세계관의 최첨단 데이터베이스를 위한 사운드 시스템
 * 
 * 사운드 카테고리:
 * - UI: 호버, 클릭, 토글 등 기본 인터랙션
 * - MECHANICAL: 기계적 작동음, 톱니바퀴, 레버
 * - STEAM: 증기 방출, 압력 해제
 * - ELECTRONIC: 전자 비프음, 데이터 전송
 * - AMBIENT: 배경음, 부팅 시퀀스
 * - SPECIAL: 크리티컬 성공/실패, 주사위 등
 */

import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { withBase } from 'vitepress';

// 사운드 타입 정의
export type SoundCategory = 
  | 'ui'        // 기본 UI 사운드
  | 'mechanical' // 기계 작동음
  | 'steam'     // 증기 사운드
  | 'electronic' // 전자음
  | 'ambient'   // 배경음
  | 'special';  // 특수 효과음

export type SoundType = 
  // UI 사운드
  | 'hover'           // 마우스 호버 - 가벼운 금속 틱
  | 'click'           // 클릭 - 기계식 버튼 클릭
  | 'click-heavy'     // 강한 클릭 - 레버/스위치
  | 'toggle-on'       // 토글 ON - 릴레이 스위치
  | 'toggle-off'      // 토글 OFF - 릴레이 해제
  | 'select'          // 선택 - 다이얼 돌리기
  | 'back'            // 뒤로가기 - 역회전
  | 'cancel'          // 취소 - cancle.wav
  
  // 기계 사운드
  | 'gear-turn'       // 톱니바퀴 회전
  | 'gear-engage'     // 톱니바퀴 맞물림
  | 'lever-pull'      // 레버 당김
  | 'valve-open'      // 밸브 열림
  | 'valve-close'     // 밸브 닫힘
  | 'mechanism-start' // 기계 시동
  | 'mechanism-stop'  // 기계 정지
  
  // 증기 사운드
  | 'steam-hiss'      // 증기 쉭 (짧은)
  | 'steam-release'   // 증기 방출 (긴)
  | 'steam-burst'     // 증기 폭발
  | 'pressure-build'  // 압력 상승
  | 'pressure-release'// 압력 해제
  
  // 전자 사운드
  | 'beep'            // 단순 비프
  | 'beep-confirm'    // 확인 비프 (상승)
  | 'beep-deny'       // 거부 비프 (하강)
  | 'beep-alert'      // 경고 비프
  | 'data-transmit'   // 데이터 전송
  | 'typing'          // 타자기/텔레타이프
  | 'scan'            // 스캔 사운드
  
  // 배경/시퀀스 사운드
  | 'boot-start'      // 부팅 시작
  | 'boot-line'       // 부팅 라인 출력
  | 'boot-complete'   // 부팅 완료
  | 'ambient-hum'     // 배경 웅웅거림
  | 'power-up'        // 전원 켜짐
  | 'power-down'      // 전원 꺼짐
  
  // 특수 효과
  | 'sequence-start'  // 시퀀스 시작 (sequence.wav)
  | 'dice-roll'       // 주사위 굴림
  | 'dice-stop'       // 주사위 정지
  | 'critical-success'// 크리티컬 성공 (잭팟)
  | 'critical-fail'   // 크리티컬 실패 (펌블)
  | 'success'         // 일반 성공
  | 'fail'            // 일반 실패
  | 'unlock'          // 해금
  | 'alarm'           // 알람
  | 'explosion'       // 폭발
  | 'warp'            // 워프/전이
  | 'transition'      // 화면 전환
  | 'card-flip'       // 카드 뒤집기
  | 'card-select'     // 카드 선택
  | 'buy'             // 구매
  | 'loading-bar';    // 로딩 바 (루프)

// 사운드 설정
interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  category: SoundCategory;
}

// 사운드 맵 (실제 파일이 없으면 Web Audio API로 생성)
const SOUND_MAP: Record<SoundType, SoundConfig> = {
  // UI 사운드
  'loading-bar': { src: '/sound/loading.wav', volume: 0.8, loop: true, category: 'ui' },
  'hover': { src: '/sound/hover.wav', volume: 0.1, category: 'ui' },
  'click': { src: '/sound/click.wav', volume: 0.4, category: 'ui' },
  'click-heavy': { src: '/sound/click.wav', volume: 0.5, category: 'ui' },
  'toggle-on': { src: '/sound/click.wav', volume: 0.4, category: 'ui' },
  'toggle-off': { src: '/sound/click.wav', volume: 0.4, category: 'ui' },
  'select': { src: '/sound/click.wav', volume: 0.4, category: 'ui' },
  'back': { src: '/sound/cancle.wav', volume: 0.3, category: 'ui' },
  'cancel': { src: '/sound/cancle.wav', volume: 0.5, category: 'ui' },
  
  // 기계 사운드
  'gear-turn': { src: '/sound/loading.wav', volume: 0.8, category: 'mechanical' },
  'gear-engage': { src: '/sound/click.wav', volume: 0.5, category: 'mechanical' },
  'lever-pull': { src: '/sound/click.wav', volume: 0.5, category: 'mechanical' },
  'valve-open': { src: '/sound/click.wav', volume: 0.4, category: 'mechanical' },
  'valve-close': { src: '/sound/cancle.wav', volume: 0.4, category: 'mechanical' },
  'mechanism-start': { src: '/sound/loading.wav', volume: 0.8, category: 'mechanical' },
  'mechanism-stop': { src: '/sound/cancle.wav', volume: 0.4, category: 'mechanical' },
  
  // 증기 사운드
  'steam-hiss': { src: '/sound/loading.wav', volume: 0.8, category: 'steam' },
  'steam-release': { src: '/sound/loading.wav', volume: 0.8, category: 'steam' },
  'steam-burst': { src: '/sound/error.wav', volume: 0.6, category: 'steam' },
  'pressure-build': { src: '/sound/loading.wav', volume: 0.8, category: 'steam' },
  'pressure-release': { src: '/sound/cancle.wav', volume: 0.5, category: 'steam' },
  
  // 전자 사운드
  'beep': { src: '/sound/type.wav', volume: 0.3, category: 'electronic' },
  'beep-confirm': { src: '/sound/unlock.wav', volume: 0.4, category: 'electronic' },
  'beep-deny': { src: '/sound/error.wav', volume: 0.4, category: 'electronic' },
  'beep-alert': { src: '/sound/error.wav', volume: 0.5, category: 'electronic' },
  'data-transmit': { src: '/sound/loading.wav', volume: 0.7, category: 'electronic' },
  'typing': { src: '/sound/type.wav', volume: 0.2, category: 'electronic' },
  'scan': { src: '/sound/loading.wav', volume: 0.7, category: 'electronic' },
  
  // 배경 사운드
  'boot-start': { src: '/sound/loading.wav', volume: 0.8, category: 'ambient' },
  'boot-line': { src: '/sound/type.wav', volume: 0.2, category: 'ambient' },
  'boot-complete': { src: '/sound/unlock.wav', volume: 0.5, category: 'ambient' },
  'ambient-hum': { src: '/sound/background%20sound.mp3', volume: 1.0, loop: true, category: 'ambient' },
  'power-up': { src: '/sound/loading.wav', volume: 0.8, category: 'ambient' },
  'power-down': { src: '/sound/cancle.wav', volume: 0.4, category: 'ambient' },
  
  // 특수 효과
  'sequence-start': { src: '/sound/sequence.wav', volume: 0.5, category: 'special' },
  'dice-roll': { src: '/sound/loading.wav', volume: 0.7, category: 'special' },
  'dice-stop': { src: '/sound/click.wav', volume: 0.6, category: 'special' },
  'critical-success': { src: '/sound/unlock.wav', volume: 0.7, category: 'special' },
  'critical-fail': { src: '/sound/error.wav', volume: 0.7, category: 'special' },
  'success': { src: '/sound/unlock.wav', volume: 0.5, category: 'special' },
  'fail': { src: '/sound/error.wav', volume: 0.5, category: 'special' },
  'unlock': { src: '/sound/unlock.wav', volume: 0.6, category: 'special' },
  'alarm': { src: '/sound/error.wav', volume: 0.6, category: 'special' },
  'explosion': { src: '/sound/error.wav', volume: 0.7, category: 'special' },
  'warp': { src: '/sound/loading.wav', volume: 0.7, category: 'special' },
  'transition': { src: '/sound/loading.wav', volume: 0.7, category: 'special' },
  'card-flip': { src: '/sound/click.wav', volume: 0.4, category: 'special' },
  'card-select': { src: '/sound/click.wav', volume: 0.5, category: 'special' },
  'buy': { src: '/sound/buy.wav', volume: 1.0, category: 'ui' },
};

// 전역 오디오 컨텍스트 (Web Audio API)
let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let currentAmbientSource: AudioBufferSourceNode | null = null;
let ambientGainNode: GainNode | null = null;
let currentAmbientAudio: HTMLAudioElement | null = null;

// 카테고리별 볼륨 (Reactive)
const categoryVolumes = reactive<Record<SoundCategory, number>>({
  ui: 1.0,
  mechanical: 0.8,
  steam: 0.7,
  electronic: 0.8,
  ambient: 1.0,
  special: 1.0,
});

// 오디오 캐시
const audioCache: Map<string, AudioBuffer> = new Map();

// 사운드 활성화 상태
const soundEnabled = ref(true);
const masterVolume = ref(0.7);

/**
 * Web Audio API 초기화
 */
function initAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.value = masterVolume.value;
    
    // 볼륨 스파이크 방지: 0에서 시작하여 페이드 인 (제거됨 - 개별 사운드에서 처리)
    // masterGainNode.gain.setValueAtTime(0, audioContext.currentTime);
    // masterGainNode.gain.linearRampToValueAtTime(masterVolume.value, audioContext.currentTime + 0.5);
  }
  return audioContext;
}

/**
 * 오디오 버퍼 로드
 */
async function loadAudioBuffer(src: string): Promise<AudioBuffer | null> {
  const resolvedSrc = withBase(src);
  if (audioCache.has(resolvedSrc)) {
    return audioCache.get(resolvedSrc)!;
  }
  
  try {
    const ctx = initAudioContext();
    
    // AudioContext가 suspended 상태여도 decodeAudioData는 작동하므로
    // 여기서 resume()을 호출하지 않음 (호버 등 제스처 없는 인터랙션 시 경고 방지)
    
    const response = await fetch(resolvedSrc);
    if (!response.ok) {
      console.warn(`[SteamSound] Fetch failed for: ${resolvedSrc} (status: ${response.status})`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    audioCache.set(resolvedSrc, audioBuffer);
    return audioBuffer;
  } catch (error) {
    // Web Audio API 디코딩 실패 시 null 반환 (HTML5 Audio로 폴백)
    return null;
  }
}

// HTML5 Audio 캐시
const html5AudioCache: Map<string, HTMLAudioElement> = new Map();

/**
 * HTML5 Audio로 사운드 재생 (Web Audio API 폴백)
 */
function playHtml5Audio(src: string, volume: number, loop: boolean = false): HTMLAudioElement {
  const resolvedSrc = withBase(src);
  
  // 캐시된 오디오 복제 또는 새로 생성
  let audio: HTMLAudioElement;
  
  if (html5AudioCache.has(resolvedSrc)) {
    // 캐시된 오디오를 복제하여 동시 재생 가능하게
    audio = html5AudioCache.get(resolvedSrc)!.cloneNode() as HTMLAudioElement;
  } else {
    audio = new Audio(resolvedSrc);
    html5AudioCache.set(resolvedSrc, audio);
  }
  
  audio.volume = Math.min(1, Math.max(0, volume));
  audio.loop = loop;
  
  audio.play().catch(err => {
    // 자동 재생 정책으로 인한 실패는 무시
  });
  
  return audio;
}

/**
 * Synthesized 사운드 생성 (파일이 없을 때 Web Audio API로 생성)
 */
function playSynthesizedSound(type: SoundType, volume: number = 0.5): void {
  const ctx = initAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filterNode = ctx.createBiquadFilter();
  
  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(masterGainNode!);
  
  // 사운드 타입별 파라미터
  switch (type) {
    // ═══ UI 사운드 ═══
    case 'hover':
      // 가벼운 금속 틱 - 짧고 높은 클릭
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(2000, now);
      oscillator.frequency.exponentialRampToValueAtTime(1500, now + 0.02);
      filterNode.type = 'highpass';
      filterNode.frequency.value = 1000;
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      break;
      
    case 'click':
      // 기계식 버튼 클릭 - 날카로운 클릭 + 메탈릭 공명
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 500;
      filterNode.Q.value = 2;
      gainNode.gain.setValueAtTime(volume * 0.6, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      
      // 메탈릭 공명 추가
      const resonance = ctx.createOscillator();
      const resGain = ctx.createGain();
      resonance.type = 'sine';
      resonance.frequency.setValueAtTime(1200, now);
      resonance.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      resGain.gain.setValueAtTime(volume * 0.2, now + 0.02);
      resGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      resonance.connect(resGain);
      resGain.connect(masterGainNode!);
      resonance.start(now);
      resonance.stop(now + 0.12);
      break;
      
    case 'click-heavy':
      // 레버/스위치 - 무거운 기계 클릭
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 400;
      gainNode.gain.setValueAtTime(volume * 0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
      
    case 'toggle-on':
      // 릴레이 스위치 ON - 클릭 + 상승음
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 400;
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      oscillator.start(now);
      oscillator.stop(now + 0.12);
      break;
      
    case 'toggle-off':
      // 릴레이 스위치 OFF - 클릭 + 하강음
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(500, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 350;
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      oscillator.start(now);
      oscillator.stop(now + 0.12);
      break;
      
    case 'select':
      // 다이얼 돌리기 - 기어 느낌의 클릭
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1000 + i * 200, now + i * 0.03);
        g.gain.setValueAtTime(volume * 0.3, now + i * 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.04);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.04);
      }
      return;
      
    case 'back':
      // 역회전 - 하강하는 기어음
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(800, now);
      filterNode.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
      
    // ═══ 기계 사운드 ═══
    case 'gear-turn':
      // 톱니바퀴 회전
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 200 + Math.random() * 100;
        g.gain.setValueAtTime(volume * 0.2, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.03);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.03);
      }
      return;
      
    case 'gear-engage':
      // 톱니바퀴 맞물림
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(100, now);
      oscillator.frequency.setValueAtTime(300, now + 0.05);
      oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.2);
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 500;
      gainNode.gain.setValueAtTime(volume * 0.7, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
      
    case 'lever-pull':
      // 레버 당김
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(80, now);
      oscillator.frequency.linearRampToValueAtTime(200, now + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(60, now + 0.3);
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 400;
      gainNode.gain.setValueAtTime(volume * 0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;
      
    case 'valve-open':
    case 'valve-close':
      // 밸브 열림/닫힘
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(type === 'valve-open' ? 150 : 200, now);
      oscillator.frequency.exponentialRampToValueAtTime(type === 'valve-open' ? 300 : 100, now + 0.2);
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 250;
      filterNode.Q.value = 5;
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
      break;
      
    case 'mechanism-start':
      // 기계 시동
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(50, now);
      oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.5);
      oscillator.frequency.setValueAtTime(150, now + 0.5);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(100, now);
      filterNode.frequency.exponentialRampToValueAtTime(500, now + 0.5);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.6, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, now + 0.7);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
      oscillator.start(now);
      oscillator.stop(now + 1);
      break;
      
    case 'mechanism-stop':
      // 기계 정지
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(500, now);
      filterNode.frequency.exponentialRampToValueAtTime(50, now + 0.8);
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
      oscillator.start(now);
      oscillator.stop(now + 1);
      break;
      
    // ═══ 증기 사운드 ═══
    case 'steam-hiss':
      // 증기 쉭 (노이즈 + 필터)
      playNoiseSound(ctx, 0.1, volume * 0.4, 2000, 8000);
      return;
      
    case 'steam-release':
      // 증기 방출 (긴)
      playNoiseSound(ctx, 0.5, volume * 0.5, 1000, 6000);
      return;
      
    case 'steam-burst':
      // 증기 폭발
      playNoiseSound(ctx, 0.3, volume * 0.8, 500, 10000);
      return;
      
    case 'pressure-build':
      // 압력 상승
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(50, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 1);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(100, now);
      filterNode.frequency.exponentialRampToValueAtTime(400, now + 1);
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.linearRampToValueAtTime(volume * 0.6, now + 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      oscillator.start(now);
      oscillator.stop(now + 1.2);
      break;
      
    case 'pressure-release':
      // 압력 해제
      playNoiseSound(ctx, 0.4, volume * 0.6, 2000, 5000);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;
      
    // ═══ 전자 사운드 ═══
    case 'beep':
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
      
    case 'beep-confirm':
      // 확인 비프 (상승)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.setValueAtTime(900, now + 0.08);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.setValueAtTime(volume * 0.4, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
      
    case 'beep-deny':
      // 거부 비프 (하강)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.setValueAtTime(250, now + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.setValueAtTime(volume * 0.3, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
      break;
      
    case 'beep-alert':
      // 경고 비프
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 1000;
        g.gain.setValueAtTime(volume * 0.5, now + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.1);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.1);
      }
      return;
      
    case 'data-transmit':
      // 데이터 전송
      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 1500 + Math.random() * 1000;
        g.gain.setValueAtTime(volume * 0.2, now + i * 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.02);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.02);
      }
      return;
      
    case 'typing':
      // 타자기
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1500 + Math.random() * 500, now);
      filterNode.type = 'highpass';
      filterNode.frequency.value = 1000;
      gainNode.gain.setValueAtTime(volume * 0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      oscillator.start(now);
      oscillator.stop(now + 0.02);
      break;
      
    case 'scan':
      // 스캔
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
      oscillator.frequency.exponentialRampToValueAtTime(300, now + 1);
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
      oscillator.start(now);
      oscillator.stop(now + 1);
      break;
      
    // ═══ 배경 사운드 ═══
    case 'boot-start':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(30, now);
      oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.5, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      oscillator.start(now);
      oscillator.stop(now + 0.8);
      break;
      
    case 'boot-line':
      oscillator.type = 'square';
      oscillator.frequency.value = 1000;
      gainNode.gain.setValueAtTime(volume * 0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      oscillator.start(now);
      oscillator.stop(now + 0.03);
      break;
      
    case 'boot-complete':
      // 부팅 완료 팡파레
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(volume * 0.4, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
      return;
      
    case 'power-up':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(50, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.8);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(100, now);
      filterNode.frequency.exponentialRampToValueAtTime(800, now + 0.8);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.6, now + 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
      oscillator.start(now);
      oscillator.stop(now + 1);
      break;
      
    case 'power-down':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(30, now + 1);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(800, now);
      filterNode.frequency.exponentialRampToValueAtTime(50, now + 1);
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      oscillator.start(now);
      oscillator.stop(now + 1.2);
      break;
      
    // ═══ 특수 효과 ═══
    case 'dice-roll':
      // 주사위 굴림 - 기계적 회전음
      for (let i = 0; i < 15; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 300 + Math.random() * 400;
        const t = now + i * 0.05;
        g.gain.setValueAtTime(volume * (0.4 - i * 0.02), t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(t);
        osc.stop(t + 0.04);
      }
      return;
      
    case 'dice-stop':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      gainNode.gain.setValueAtTime(volume * 0.6, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
      
    case 'critical-success':
      // 잭팟! - 화려한 상승음
      const successNotes = [523, 659, 784, 880, 1047, 1319];
      successNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(volume * 0.5, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.4);
      });
      // 추가 글리터 효과
      for (let i = 0; i < 10; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 2000 + Math.random() * 2000;
        const t = now + 0.3 + i * 0.04;
        g.gain.setValueAtTime(volume * 0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(t);
        osc.stop(t + 0.1);
      }
      return;
      
    case 'critical-fail':
      // 펌블 - 불길한 하강음
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.5);
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1000, now);
      filterNode.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      gainNode.gain.setValueAtTime(volume * 0.7, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      oscillator.start(now);
      oscillator.stop(now + 0.6);
      
      // 경고음 추가
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 200;
        const t = now + i * 0.2;
        g.gain.setValueAtTime(volume * 0.4, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(t);
        osc.stop(t + 0.15);
      }
      break;
      
    case 'success':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, now);
      oscillator.frequency.setValueAtTime(800, now + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
      break;
      
    case 'fail':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.setValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
      break;
      
    case 'unlock':
      // 해금 - 자물쇠 열리는 소리 + 팡파레
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.setValueAtTime(400, now + 0.1);
      oscillator.frequency.setValueAtTime(600, now + 0.2);
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.setValueAtTime(volume * 0.5, now + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.4, now + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;
      
    case 'alarm':
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = i % 2 === 0 ? 800 : 600;
        const t = now + i * 0.15;
        g.gain.setValueAtTime(volume * 0.5, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(masterGainNode!);
        osc.start(t);
        osc.stop(t + 0.12);
      }
      return;
      
    case 'explosion':
      playNoiseSound(ctx, 0.8, volume * 1.0, 50, 2000);
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(100, now);
      oscillator.frequency.exponentialRampToValueAtTime(20, now + 0.8);
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 300;
      gainNode.gain.setValueAtTime(volume * 0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
      oscillator.start(now);
      oscillator.stop(now + 1);
      break;
      
    case 'warp':
      // 워프 - 상승 후 사라짐
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(2000, now + 0.4);
      oscillator.frequency.exponentialRampToValueAtTime(8000, now + 0.6);
      gainNode.gain.setValueAtTime(volume * 0.5, now);
      gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      oscillator.start(now);
      oscillator.stop(now + 0.7);
      break;
      
    case 'transition':
      // 화면 전환
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      playNoiseSound(ctx, 0.1, volume * 0.2, 1000, 4000);
      break;
      
    case 'card-flip':
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 400;
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      oscillator.start(now);
      oscillator.stop(now + 0.12);
      break;
      
    case 'card-select':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.setValueAtTime(1000, now + 0.05);
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;
      
    default:
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
  }
}

/**
 * 노이즈 사운드 재생 (증기, 폭발 등)
 */
function playNoiseSound(
  ctx: AudioContext, 
  duration: number, 
  volume: number, 
  lowFreq: number, 
  highFreq: number
): void {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = (lowFreq + highFreq) / 2;
  filter.Q.value = (highFreq - lowFreq) / 1000;
  
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGainNode!);
  
  source.start();
  source.stop(ctx.currentTime + duration);
}

  // 사운드 재생 시간 기록 (스로틀링용)
  const lastPlayedMap: Record<string, number> = {};

  /**
   * 사운드 재생 메인 함수
   */
export async function playSound(type: SoundType, volumeMultiplier: number = 1, targetDuration?: number): Promise<AudioBufferSourceNode | HTMLAudioElement | null> {
  if (!soundEnabled.value) return null;
  if (typeof window === 'undefined') return null;
  
  // 스로틀링: typing 사운드는 30ms 내에 재실행 방지
  const now = Date.now();
  if (type === 'typing') {
    const lastPlayed = lastPlayedMap[type] || 0;
    if (now - lastPlayed < 30) return null;
    lastPlayedMap[type] = now;
  }
  
  const config = SOUND_MAP[type];
  const categoryVolume = categoryVolumes[config.category];
  const finalVolume = masterVolume.value * categoryVolume * (config.volume || 0.5) * volumeMultiplier;
  
  // 먼저 Web Audio API로 실제 파일 로드 시도
  const buffer = await loadAudioBuffer(config.src);
  
  if (buffer && audioContext && masterGainNode) {
    // Context가 suspended 상태라면 재개 시도 (사용자 인터랙션 필요)
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    // Web Audio API로 재생
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    // 재생 속도 조절
    if (targetDuration && buffer.duration > 0) {
      source.playbackRate.value = buffer.duration / targetDuration;
    }
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = finalVolume;
    
    source.connect(gainNode);
    gainNode.connect(masterGainNode);
    
    if (config.loop) {
      source.loop = true;
    }
    
    source.start();
    return source;
  } else {
    // Web Audio API 실패 시 HTML5 Audio로 폴백
    const audio = playHtml5Audio(config.src, finalVolume, config.loop || false);
    if (targetDuration && !isNaN(audio.duration) && audio.duration > 0) {
      audio.playbackRate = audio.duration / targetDuration;
    }
    return audio;
  }
}

/**
 * Vue Composable
 */
export function useSteamSound() {
  const isInitialized = ref(false);
  
  // 사용자 인터랙션 후 오디오 컨텍스트 초기화
  const initSound = () => {
    if (!isInitialized.value && typeof window !== 'undefined') {
      initAudioContext();
      isInitialized.value = true;
    }
  };
  
  onMounted(() => {
    // 첫 클릭/터치/키입력에서 초기화
    const handleInteraction = () => {
      initSound();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
  });
  
  return {
    // 상태
    soundEnabled,
    masterVolume,
    isInitialized,
    
    // 메서드
    initSound,
    playSound,
    preloadSound: (type: SoundType) => {
      const config = SOUND_MAP[type];
      if (config) {
        loadAudioBuffer(config.src);
      }
    },
    
    // 편의 메서드
    playHover: () => playSound('hover'),
    playClick: () => playSound('click'),
    playClickHeavy: () => playSound('click-heavy'),
    playToggleOn: () => playSound('toggle-on'),
    playToggleOff: () => playSound('toggle-off'),
    playSelect: () => playSound('select'),
    playBack: () => playSound('back'),
    playCancel: () => playSound('cancel'),
    
    playGearTurn: () => playSound('gear-turn'),
    playGearEngage: () => playSound('gear-engage'),
    playLeverPull: () => playSound('lever-pull'),
    playValveOpen: () => playSound('valve-open'),
    playValveClose: () => playSound('valve-close'),
    playMechanismStart: () => playSound('mechanism-start'),
    playMechanismStop: () => playSound('mechanism-stop'),
    
    playSteamHiss: () => playSound('steam-hiss'),
    playSteamRelease: () => playSound('steam-release'),
    playSteamBurst: () => playSound('steam-burst'),
    playPressureBuild: () => playSound('pressure-build'),
    playPressureRelease: () => playSound('pressure-release'),
    
    playBeep: () => playSound('beep'),
    playBeepConfirm: () => playSound('beep-confirm'),
    playBeepDeny: () => playSound('beep-deny'),
    playBeepAlert: () => playSound('beep-alert'),
    playDataTransmit: () => playSound('data-transmit'),
    playTyping: () => playSound('typing'),
    playScan: () => playSound('scan'),
    
    playBootStart: () => playSound('boot-start'),
    playBootLine: () => playSound('boot-line'),
    playBootComplete: () => playSound('boot-complete'),
    playPowerUp: () => playSound('power-up'),
    playPowerDown: () => playSound('power-down'),
    
    playSequenceStart: (duration?: number) => playSound('sequence-start', 1, duration),
    playDiceRoll: () => playSound('dice-roll'),
    playDiceStop: () => playSound('dice-stop'),
    playCriticalSuccess: () => playSound('critical-success'),
    playCriticalFail: () => playSound('critical-fail'),
    playSuccess: () => playSound('success'),
    playFail: () => playSound('fail'),
    playUnlock: () => playSound('unlock'),
    playAlarm: () => playSound('alarm'),
    playExplosion: () => playSound('explosion'),
    playWarp: () => playSound('warp'),
    playTransition: () => playSound('transition'),
    playCardFlip: () => playSound('card-flip'),
    playCardSelect: () => playSound('card-select'),
    playBuy: () => playSound('buy'),
    playLoadingBar: () => playSound('loading-bar'),
    
    // 배경음 제어 (HTML5 Audio 사용)
    playAmbient: async () => {
      if (currentAmbientAudio) return; // 이미 재생 중이면 무시
      
      // AudioContext 초기화 시도 (사용자 제스처가 있을 때만 성공)
      if (audioContext && audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
        } catch (e) {
          // 무시: 아직 사용자 제스처가 없음
        }
      }
      
      const type = 'ambient-hum';
      const config = SOUND_MAP[type];
      const resolvedSrc = withBase(config.src);
      const categoryVolume = categoryVolumes[config.category];
      const finalVolume = masterVolume.value * categoryVolume * (config.volume || 0.5);
      
      currentAmbientAudio = new Audio(resolvedSrc);
      // currentAmbientAudio.volume = Math.min(1, Math.max(0, finalVolume));
      // 페이드 인 효과 적용
      currentAmbientAudio.volume = 0;
      currentAmbientAudio.loop = true;
      
      currentAmbientAudio.play().then(() => {
        // 재생 성공 시 페이드 인
        if (!currentAmbientAudio) return;
        
        const targetVol = Math.min(1, Math.max(0, finalVolume));
        let currentVol = 0;
        const fadeInterval = setInterval(() => {
          if (!currentAmbientAudio) {
            clearInterval(fadeInterval);
            return;
          }
          
          currentVol += 0.05;
          if (currentVol >= targetVol) {
            currentVol = targetVol;
            clearInterval(fadeInterval);
          }
          currentAmbientAudio.volume = currentVol;
        }, 100);
      }).catch(err => {
        console.warn('[SteamSound] Ambient play failed:', err);
      });
    },
    
    stopAmbient: () => {
      if (currentAmbientAudio) {
        currentAmbientAudio.pause();
        currentAmbientAudio.currentTime = 0;
        currentAmbientAudio = null;
      }
      // Web Audio API 방식도 정리
      if (currentAmbientSource) {
        try {
          currentAmbientSource.stop();
        } catch (e) {
          // 이미 정지된 경우 무시
        }
        currentAmbientSource = null;
        ambientGainNode = null;
      }
    },

    // 볼륨 조절
    setMasterVolume: (vol: number) => {
      masterVolume.value = Math.max(0, Math.min(1, vol));
      if (masterGainNode) {
        masterGainNode.gain.value = masterVolume.value;
      }
      // 앰비언트 볼륨도 업데이트 (Web Audio API)
      if (ambientGainNode) {
        const config = SOUND_MAP['ambient-hum'];
        const categoryVolume = categoryVolumes['ambient'];
        ambientGainNode.gain.value = masterVolume.value * categoryVolume * (config.volume || 0.5);
      }
      // 앰비언트 볼륨도 업데이트 (HTML5 Audio)
      if (currentAmbientAudio) {
        const config = SOUND_MAP['ambient-hum'];
        const categoryVolume = categoryVolumes['ambient'];
        currentAmbientAudio.volume = Math.min(1, Math.max(0, masterVolume.value * categoryVolume * (config.volume || 0.5)));
      }
    },
    
    setCategoryVolume: (category: SoundCategory, vol: number) => {
      categoryVolumes[category] = Math.max(0, Math.min(1, vol));
      // 앰비언트 카테고리 변경 시 즉시 반영 (Web Audio API)
      if (category === 'ambient' && ambientGainNode) {
        const config = SOUND_MAP['ambient-hum'];
        ambientGainNode.gain.value = masterVolume.value * vol * (config.volume || 0.5);
      }
      // 앰비언트 카테고리 변경 시 즉시 반영 (HTML5 Audio)
      if (category === 'ambient' && currentAmbientAudio) {
        const config = SOUND_MAP['ambient-hum'];
        currentAmbientAudio.volume = Math.min(1, Math.max(0, masterVolume.value * vol * (config.volume || 0.5)));
      }
    },
    
    getCategoryVolume: (category: SoundCategory) => {
      return categoryVolumes[category];
    },
    
    categoryVolumes,

    toggleSound: () => {
      soundEnabled.value = !soundEnabled.value;
    },
  };
}

export default useSteamSound;
