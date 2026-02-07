# shop-frontend

Vite + React 기반 모바일 우선 쇼핑몰 프론트엔드(로그인 화면만 최소 구현).

## 실행
```bash
npm i
npm run dev
```

## 백엔드 연동 (세션)
- `fetch`는 `credentials: "include"`를 사용합니다.
- 기본값은 Vite 프록시로 `http://localhost:8080`에 붙습니다: `vite.config.js`
- 다른 주소를 쓰면 `.env`에 `VITE_API_BASE_URL`을 설정하세요(예: `http://localhost:8080`).

