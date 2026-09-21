# Persona Studio

GS 랄프톤 콘텐츠 검토 대시보드. LLM 결과 JSON과 미디어를 모아 GitHub Pages에 배포하는 정적 웹사이트입니다.

## 구조

- data/contents/<콘텐츠폴더>/content.json: 편집할 원본 (객체 하나)
- data/contents/<콘텐츠폴더>/*: 이미지·영상·포스터
- data/contents.json: 빌드가 만드는 목록. 직접 수정하지 마세요.
- scripts/build.mjs: 검증·목록 생성·정적 배포 파일 수집
- dist/: 배포 결과 (자동 생성, Git 제외)
- .github/workflows/pages.yml: main push 시 검사·빌드·배포

## 로컬 실행

Node.js 22 이상. 의존성 설치 없이 npm run dev 실행 후 http://127.0.0.1:5180 접속.
콘텐츠를 추가하거나 수정한 뒤 npm run build를 실행하고 브라우저를 새로고침합니다.
npm run check와 npm test로 검증합니다. index.html을 직접 열면 JSON 로드가 불가능하므로 서버를 사용하세요.

## 콘텐츠 추가

1. 고유 폴더를 만들고 이미지·영상 파일을 저장합니다.
2. 기존 content.json을 복사해 고유 id, 문안, media 경로를 작성합니다.
3. npm run build로 검증합니다.
4. 원본 JSON·미디어·코드를 Git에 커밋하고 main에 push합니다.

세부 규칙은 docs/content-format.md 참고. 기존 샘플 6건은 미디어가 없어 CSS 일러스트로 표시됩니다. 실제 첨부 이미지는 카드·상세에, 영상은 상세 플레이어에 표시됩니다.

## GitHub Pages 최초 설정

저장소 Settings → Pages → Build and deployment → Source를 GitHub Actions로 지정합니다. 기본 브랜치가 main이 아니면 pages.yml의 branches를 수정하세요. 이후 main push 또는 Actions의 수동 실행으로 배포합니다. 배포 파일은 dist만 업로드되며 서버, 테스트, 임시 파일은 포함하지 않습니다.
공식 문서: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 수정·승인과 한계

화면에서 수정·승인한 항목은 브라우저 로컬 저장소에 저장되며 같은 id의 원본보다 우선합니다. 승인된 내용이 바뀌지 않도록 미디어도 해당 로컬 수정본을 유지합니다. 팀원과 승인 상태가 공유되거나 Git의 JSON이 수정되지는 않습니다. 초기 기존 브라우저 데이터도 보존합니다. 실제 AI 생성·SNS 게시·서버 인증은 연결하지 않았습니다.

공개 배포에는 공개 가능한 가상 데이터와 미디어만 포함하세요. 검토 대기 콘텐츠도 Pages에 배포하면 공개됩니다. 큰 영상이 쌓이면 별도 저장소를 사용하는 구조로 확장할 수 있습니다.

샘플 미디어 확인: 대시보드에서 `샘플`을 검색하면 꽃 이미지와 약 5초짜리 영상 콘텐츠를 볼 수 있습니다. 영상 카드를 열고 재생 버튼을 누르세요.
