<template>
  <div class="window-frame" :style="styleObject" @mousedown="startDrag">
    <div class="window-header">
      <div class="window-title">
        <span class="icon">⚙️</span>
        {{ title }}
      </div>
      <div class="window-controls">
        <button class="control-btn close" @click="$emit('close')">×</button>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
    <!-- Resizer handles could go here -->
    <div class="corner-deco top-left"></div>
    <div class="corner-deco top-right"></div>
    <div class="corner-deco bottom-left"></div>
    <div class="corner-deco bottom-right"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: String,
  initialX: { type: Number, default: 100 },
  initialY: { type: Number, default: 100 },
  width: { type: String, default: '800px' },
  height: { type: String, default: '600px' },
  zIndex: { type: Number, default: 100 }
});

const emit = defineEmits(['close', 'focus']);

const x = ref(props.initialX);
const y = ref(props.initialY);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const styleObject = computed(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`,
  width: props.width,
  height: props.height,
  zIndex: props.zIndex
}));

const startDrag = (e) => {
  // Only drag if clicking header
  if (!e.target.closest('.window-header')) return;
  
  emit('focus');
  isDragging.value = true;
  dragOffset.value = {
    x: e.clientX - x.value,
    y: e.clientY - y.value
  };
  
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  x.value = e.clientX - dragOffset.value.x;
  y.value = e.clientY - dragOffset.value.y;
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
.window-frame {
  position: fixed;
  background: rgba(15, 10, 5, 0.95);
  border: 2px solid #8b5a2b;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: opacity 0.2s;
}

.window-header {
  height: 36px;
  background: linear-gradient(90deg, #2a1f15, #3d2e1f);
  border-bottom: 2px solid #8b5a2b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  cursor: grab;
  user-select: none;
}

.window-header:active {
  cursor: grabbing;
}

.window-title {
  color: #ffb000;
  font-family: 'Share Tech Mono', monospace;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 0 5px rgba(255, 176, 0, 0.5);
}

.window-controls {
  display: flex;
  gap: 5px;
}

.control-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #8b5a2b;
  background: #1a1208;
  color: #ffb000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #ff4500;
  color: #fff;
  border-color: #ff4500;
}

.window-content {
  flex: 1;
  overflow: hidden; /* Changed from auto to hidden to let child handle scroll */
  padding: 0; /* Removed padding */
  color: #e0d0b0;
  font-family: 'Share Tech Mono', monospace;
  display: flex; /* Ensure child fills height */
  flex-direction: column;
}

/* Custom Scrollbar */
.window-content::-webkit-scrollbar {
  width: 8px;
}
.window-content::-webkit-scrollbar-track {
  background: #1a1208;
}
.window-content::-webkit-scrollbar-thumb {
  background: #8b5a2b;
  border: 1px solid #3d2e1f;
}
.window-content::-webkit-scrollbar-thumb:hover {
  background: #ffb000;
}

/* Corner Decorations */
.corner-deco {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid #ffb000;
  pointer-events: none;
}
.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }
</style>