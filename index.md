---
layout: home
---

<style>
/* 1. 기본 레이아웃 및 여백 제거 */
.vp-doc {
  padding: 0 !important;
  max-width: 100% !important;
}
.VPHome {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

/* 2. 유령 텍스트(목차/사이드바) 강제 숨김 */
.VPDocAside, .aside, .outline-link, .VPDocOutlineDropdown {
  display: none !important;
}

/* 3. 헤더 네비게이션바 숨기기 (전체화면 몰입감) */
header.VPNav {
  display: none !important;
}

/* 4. 배경색 통일 (검정) */
body, html, #app {
  background-color: #050505 !important;
  overflow: hidden; /* 스크롤 방지 */
}
</style>
