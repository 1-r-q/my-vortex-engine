import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ko',
  title: 'VORTEX ENGINE',
  description: 'Vortex Engine Wiki',
  head: [
    ['meta', { name: 'google', content: 'notranslate' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }]
  ],
  // ▼ [중요] 도메인 연결 시에는 무조건 '/' 로 변경해야 합니다.
  // 기존: base: '/my-vortex-engine/',
  base: '/',

  // (기존 설정 유지)
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
