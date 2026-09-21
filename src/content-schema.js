function validateItems(data) {
  if (!Array.isArray(data)) throw new Error('콘텐츠 JSON의 최상위 값은 배열이어야 합니다.');
  const ids = new Set();
  for (const item of data) {
    if (!item || !Number.isSafeInteger(item.id) || ids.has(item.id)) throw new Error('각 콘텐츠에는 중복되지 않는 정수 id가 필요합니다.');
    ids.add(item.id);
    if (item.media !== undefined && !Array.isArray(item.media)) throw new Error(item.id + ': media는 배열이어야 합니다.');
    for (const media of item.media || []) {
      if (!media || !['image','video'].includes(media.type)) throw new Error(item.id + ': 미디어 유형 오류');
      for (const key of ['src', ...(media.poster ? ['poster'] : [])]) {
        if (typeof media[key] !== 'string' || !/^\.\/data\/contents\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(media[key]) || media[key].includes('..')) throw new Error(item.id + ': 미디어는 콘텐츠 폴더 안의 상대 경로여야 합니다.');
      }
      if (media.alt !== undefined && typeof media.alt !== 'string') throw new Error(item.id + ': alt는 문자열이어야 합니다.');
    }
    for (const key of ['title', 'brand', 'category', 'type', 'status', 'scene', 'date', 'caption']) {
      if (typeof item[key] !== 'string') throw new Error(item.id + ': ' + key + '는 문자열이어야 합니다.');
    }
    if (!['review','generating','approved','published','rejected'].includes(item.status)) throw new Error(item.id + ': 지원하지 않는 상태입니다.');
    if (!['coffee','picnic','travel','room','food','matcha'].includes(item.scene)) throw new Error(item.id + ': 지원하지 않는 일러스트입니다.');
    if (!['이미지','영상','텍스트'].includes(item.type)) throw new Error(item.id + ': 지원하지 않는 콘텐츠 유형입니다.');
    if (!Number.isSafeInteger(item.version) || item.version < 1) throw new Error(item.id + ': version은 양의 정수여야 합니다.');
    if (['approved','published'].includes(item.status) && item.approvedVersion !== item.version) throw new Error(item.id + ': 승인 버전이 현재 버전과 일치해야 합니다.');
  }
  return data;
}

globalThis.validateItems = validateItems;
