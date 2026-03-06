# Project: jiminyu.com

개인 웹사이트 (GitHub Pages 호스팅)

## Structure
- `index.html` — 메인 랜딩 페이지 (개인 소개 카드)
- `news/index.html` — 경영혁신실 뉴스 클리핑 페이지 (`/news`로 접속)
- `workers/cors-proxy.js` — Cloudflare Worker CORS 프록시 (별도 배포)

## Hosting
- GitHub Pages: `jiminyu.com` (repo: `jiminui/amy`)
- CORS Proxy Worker: `cors-proxy.jiminyu6577.workers.dev`

## Tech Stack
- 순수 HTML/CSS/JS (프레임워크 없음)
- 폰트: Cormorant Garamond, Inter, DM Mono (Google Fonts)
- 뉴스 데이터: Google News RSS → Cloudflare Worker 프록시 경유

## Conventions
- 한국어 UI, 코드 주석은 영어/한국어 혼용
- 단일 HTML 파일에 CSS/JS 인라인 (빌드 도구 없음)
- 새 페이지 추가 시 `페이지명/index.html` 구조 사용 (GitHub Pages에서 확장자 없이 접속 가능)
