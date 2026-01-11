# Vortex Engine Wiki

VORTEX ENGINE 프로젝트의 문서 저장소입니다. VitePress를 기반으로 구축되었습니다.

## 시작하기

### 필요 조건
- Node.js (v18 이상 권장)

### 설치
프로젝트의 의존성을 설치합니다:
```bash
npm install
```

### 로컬 실행 (개발 모드)
실시간 미리보기와 함께 로컬 서버를 실행합니다:
```bash
npm run docs:dev
```
브라우저에서 `http://localhost:5173/my-vortex-engine/`으로 접속하여 확인할 수 있습니다.

### 빌드
배포용 정적 파일을 생성합니다:
```bash
npm run docs:build
```
생성된 파일은 `.vitepress/dist`에 위치합니다.

## 배포 (GitHub Pages)

이 프로젝트는 GitHub Pages를 통해 배포되도록 설정되어 있습니다.
`main` 브랜치에 코드를 푸시하면 GitHub Actions가 자동으로 빌드 및 배포를 수행합니다.

- **설정 파일**: `.github/workflows/main.yml`
- **배포 주소**: `https://<username>.github.io/my-vortex-engine/`

## 파일 구조

- `docs/`: (설정 시) 문서 소스
- `.vitepress/`: 설정 및 테마 관련 파일
  - `config.mts`: 사이트 설정 (base url 등)
  - `theme/`: 커스텀 테마 및 컴포넌트
- `public/`: 정적 리소스 (이미지, 사운드 등)
- `maintenance_scripts/`: 유지보수용 스크립트 (스타일 주입 등 - 현재 사용 안함)

## 주의사항
- 이미지 경로는 `/images/...`와 같이 절대 경로를 사용하며, Vue 컴포넌트 내에서는 `withBase` 함수를 사용하여 `base` URL을 포함시켜야 합니다.
