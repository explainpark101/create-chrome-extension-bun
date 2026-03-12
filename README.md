# create-chrome-extension-bun

Chrome 확장 프로그램 프로젝트를 만들어 주는 CLI입니다. 
Bun에서만 사용할 수 있습니다.

## 요구사항

- Bun 1.0.0 이상

## 사용법

```bash
bun create chrome-extension-bun [프로젝트명]
```

프로젝트명을 생략하면 `./my-chrome-extension`에 생성됩니다.

실행 후 의존성 설치 여부를 물어봅니다. `y`를 입력하면 `bun install`이 실행됩니다.

## 생성되는 프로젝트

- Manifest V3 기반
- background service worker, content script, popup 포함
- TypeScript

## 빌드 및 테스트

```bash
cd [프로젝트명]
bun install
bun run pack
```

`dist` 폴더가 생성됩니다. Chrome에서 `chrome://extensions` → 개발자 모드 → 압축해제된 확장 프로그램 로드 → 프로젝트 폴더의 `dist` 폴더를 선택하면 됩니다.

## 개발 예정
- [ ] React, Vue 지원을 추가할 예정입니다.
