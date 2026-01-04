import { defineConfig } from 'vitepress'

export default defineConfig({
  // ▼ 이 줄이 반드시 필요합니다! (저장소 이름이 my-vortex-engine일 경우)
  base: '/my-vortex-engine/',

  // 기존 설정 유지
  vite: {
    build: {
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    esbuild: {
      drop: ['console', 'debugger']
    }
  }
})