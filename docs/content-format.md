# LLM 결과 저장 규칙

콘텐츠 하나당 data/contents/<고유폴더>/content.json 하나를 작성합니다. 폴더명은 영문, 숫자, 하이픈, 밑줄만 사용합니다. JSON 최상위는 배열이 아닌 객체입니다.

기존 data/contents/content-001/content.json을 복사해 시작할 수 있습니다. id는 전체 폴더에서 고유한 정수이고 version은 1부터 시작합니다. 새 결과는 status: "review"로 작성합니다. scene은 미디어 없는 경우의 기본 일러스트(coffee, picnic, travel, room, food, matcha)입니다.

필수: id, title, brand, category, type, status, scene, date, caption, version.
유형: 이미지 / 영상 / 텍스트. 상태: review / generating / approved / published / rejected.
승인·게시 상태에는 현재 version과 같은 approvedVersion이 필요합니다.

미디어가 없으면 media: []를 사용합니다. 이미지 또는 영상을 여러 개 첨부할 수 있습니다:

```json
"media": [
  {"type":"image","src":"./data/contents/content-007/image.webp","alt":"이미지 설명"},
  {"type":"video","src":"./data/contents/content-007/video.mp4","poster":"./data/contents/content-007/poster.jpg"}
]
```

경로는 index.html 기준이며 자신의 콘텐츠 폴더 내 파일만 허용합니다. 파일명은 영문·숫자·점·밑줄·하이픈을 사용하세요. poster는 선택 사항입니다. 지원 이미지: JPG/PNG/WebP/GIF/AVIF. 영상: MP4/WebM/OGG. 브라우저 재생 호환성을 위해 MP4는 H.264/AAC로 인코딩하세요. 확장자 검사만 수행하므로 실제 재생 가능 여부는 제작 단계에서 확인해야 합니다.

미디어 파일을 먼저 완성한 뒤 content.json.tmp에 JSON을 쓰고 마지막에 content.json으로 이름을 바꾸세요. content.json이 없는 폴더는 수집하지 않습니다. 잘못된 JSON, 중복 ID, 없는 미디어가 있으면 배포를 중단해 기존 사이트를 유지합니다. 임시 파일과 JSON에 참조되지 않은 파일은 배포하지 않습니다.

가상 인물 표시를 문안에 포함하고 실제 구매·사용 경험을 지어내지 마세요. 공개 Pages에 올릴 모든 결과는 승인 상태와 무관하게 공개됩니다. 게시 완료는 SNS 모의 상태이며 Pages 배포 여부와는 별개입니다.

## 등록된 실제 미디어 샘플

- sample-flower-image: 공개 꽃 영상의 1초 지점을 추출한 JPG
- sample-flower-video: 동일 영상 MP4와 JPG 포스터
- 원본: https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4 (MDN CC0 샘플)
- GS 상품·AI 생성 결과가 아닌 미디어 표시 테스트용입니다.
