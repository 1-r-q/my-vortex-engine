// 전역 해금 상태 관리 (브라우저 세션 동안 유지)
// sessionStorage를 사용하여 페이지 이동/라우팅 변경에도 상태 유지

interface UnlockedState {
  passwords: Record<string, boolean>; // 캐릭터 ID → 해금 여부
  hiddenQuotes: Record<string, boolean>; // 캐릭터 ID → 히든 쿼트 해금 여부
}

const STORAGE_KEY = 'vortex-unlocked-state';

// sessionStorage에서 상태 복원
function loadState(): UnlockedState {
  if (typeof window === 'undefined') {
    return { passwords: {}, hiddenQuotes: {} };
  }
  
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load unlocked state:', e);
  }
  
  return { passwords: {}, hiddenQuotes: {} };
}

// sessionStorage에 상태 저장
function saveState(state: UnlockedState): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save unlocked state:', e);
  }
}

// 상태 객체 (초기화 시 sessionStorage에서 복원)
let state: UnlockedState = loadState();

// Password 해금 상태 확인
export function isPasswordUnlocked(characterId: string): boolean {
  // 매번 sessionStorage에서 최신 상태 확인
  state = loadState();
  return !!state.passwords[characterId];
}

// Password 해금 처리
export function unlockPassword(characterId: string): void {
  state = loadState();
  state.passwords[characterId] = true;
  saveState(state);
}

// Hidden Quotes 해금 상태 확인
export function isHiddenQuotesUnlocked(characterId: string): boolean {
  state = loadState();
  return !!state.hiddenQuotes[characterId];
}

// Hidden Quotes 해금 처리
export function unlockHiddenQuotes(characterId: string): void {
  state = loadState();
  state.hiddenQuotes[characterId] = true;
  saveState(state);
}

// 전체 상태 반환 (디버깅용)
export function getUnlockedState(): UnlockedState {
  return loadState();
}

// 상태 리셋 (테스트용)
export function resetUnlockedState(): void {
  state = { passwords: {}, hiddenQuotes: {} };
  saveState(state);
}

export default state;
