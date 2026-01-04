// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue' // 1. Layout.vue 파일을 가져옵니다.
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: Layout, // 2. 여기서 Layout을 덮어씌워 줍니다. (이게 없으면 작동 안 함)
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}