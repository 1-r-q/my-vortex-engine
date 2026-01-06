<template>
  <div class="mobile-navbar">
    <button 
      v-for="item in navItems" 
      :key="item.id"
      class="nav-item"
      :class="{ active: currentPath.includes(item.path) }"
      @click="navigate(item.path)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute, withBase } from 'vitepress';

const router = useRouter();
const route = useRoute();

const navItems = [
  { id: 'home', label: 'HOME', icon: '🏠', path: '/index.html' },
  { id: 'history', label: 'HISTORY', icon: '📜', path: '/guide/history.html' },
  { id: 'world', label: 'WORLD', icon: '🌍', path: '/world/map.html' },
  { id: 'chars', label: 'CHARS', icon: '👤', path: '/characters/index.html' },
  { id: 'market', label: 'MARKET', icon: '📦', path: '/assets/list.html' },
  { id: 'system', label: 'RULES', icon: '⚖️', path: '/threats/database.html' },
];

const currentPath = computed(() => route.path);

const navigate = (path) => {
  if (navigator.vibrate) navigator.vibrate(5);
  router.go(withBase(path));
};
</script>

<style scoped>
.mobile-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 10000;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #666;
  font-family: inherit;
  font-size: 0.7rem; /* slightly larger for readability */
  padding: 5px;
  flex: 1;
  height: 100%;
  transition: all 0.2s ease;
}

.nav-item:active {
  background: rgba(255, 176, 0, 0.1);
  transform: scale(0.95);
}

.nav-item.active {
  color: #ffb000;
  text-shadow: 0 0 8px rgba(255, 176, 0, 0.5);
}

.nav-icon {
  font-size: 1.2rem;
  margin-bottom: 2px;
}
</style>
