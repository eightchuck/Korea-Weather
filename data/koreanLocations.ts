export type KoreanLocation = {
  name: string;
  displayName: string;
  keywords: string[];
  type: 'coord';
  lat: number;
  lon: number;
};

export const koreanLocations: KoreanLocation[] = [
  {
    name: '서울',
    displayName: '서울특별시',
    keywords: ['서울', '서울시', '서울특별시'],
    type: 'coord',
    lat: 37.5665,
    lon: 126.9780,
  },
  {
    name: '인천',
    displayName: '인천광역시',
    keywords: ['인천', '인천시', '인천광역시'],
    type: 'coord',
    lat: 37.4563,
    lon: 126.7052,
  },
  {
    name: '부산',
    displayName: '부산광역시',
    keywords: ['부산', '부산시', '부산광역시'],
    type: 'coord',
    lat: 35.1796,
    lon: 129.0756,
  },
  {
    name: '대전',
    displayName: '대전광역시',
    keywords: ['대전', '대전시', '대전광역시'],
    type: 'coord',
    lat: 36.3504,
    lon: 127.3845,
  },
  {
    name: '광주',
    displayName: '광주광역시',
    keywords: ['광주', '광주시', '광주광역시'],
    type: 'coord',
    lat: 35.1595,
    lon: 126.8526,
  },
  {
    name: '대구',
    displayName: '대구광역시',
    keywords: ['대구', '대구시', '대구광역시'],
    type: 'coord',
    lat: 35.8714,
    lon: 128.6014,
  },
  {
    name: '울산',
    displayName: '울산광역시',
    keywords: ['울산', '울산시', '울산광역시'],
    type: 'coord',
    lat: 35.5384,
    lon: 129.3114,
  },
  {
    name: '제주',
    displayName: '제주특별자치도',
    keywords: ['제주', '제주도', '제주시', '제주특별자치도'],
    type: 'coord',
    lat: 33.4996,
    lon: 126.5312,
  },
  {
    name: '수원',
    displayName: '경기도 수원시',
    keywords: ['수원', '수원시'],
    type: 'coord',
    lat: 37.2636,
    lon: 127.0286,
  },
  {
    name: '성남',
    displayName: '경기도 성남시',
    keywords: ['성남', '성남시'],
    type: 'coord',
    lat: 37.4201,
    lon: 127.1266,
  },
  {
    name: '고양',
    displayName: '경기도 고양시',
    keywords: ['고양', '고양시'],
    type: 'coord',
    lat: 37.6584,
    lon: 126.8320,
  },
  {
    name: '용인',
    displayName: '경기도 용인시',
    keywords: ['용인', '용인시'],
    type: 'coord',
    lat: 37.2411,
    lon: 127.1776,
  },
  {
    name: '부천',
    displayName: '경기도 부천시',
    keywords: ['부천', '부천시'],
    type: 'coord',
    lat: 37.5036,
    lon: 126.7660,
  },
  {
    name: '안산',
    displayName: '경기도 안산시',
    keywords: ['안산', '안산시'],
    type: 'coord',
    lat: 37.3219,
    lon: 126.8309,
  },
  {
    name: '안양',
    displayName: '경기도 안양시',
    keywords: ['안양', '안양시'],
    type: 'coord',
    lat: 37.3943,
    lon: 126.9568,
  },
  {
    name: '천안',
    displayName: '충청남도 천안시',
    keywords: ['천안', '천안시'],
    type: 'coord',
    lat: 36.8151,
    lon: 127.1139,
  },
  {
    name: '청주',
    displayName: '충청북도 청주시',
    keywords: ['청주', '청주시'],
    type: 'coord',
    lat: 36.6424,
    lon: 127.4890,
  },
  {
    name: '전주',
    displayName: '전라북도 전주시',
    keywords: ['전주', '전주시'],
    type: 'coord',
    lat: 35.8242,
    lon: 127.1480,
  },
  {
    name: '익산',
    displayName: '전라북도 익산시',
    keywords: ['익산', '익산시'],
    type: 'coord',
    lat: 35.9483,
    lon: 126.9576,
  },
  {
    name: '목포',
    displayName: '전라남도 목포시',
    keywords: ['목포', '목포시'],
    type: 'coord',
    lat: 34.8118,
    lon: 126.3922,
  },
  {
    name: '순천',
    displayName: '전라남도 순천시',
    keywords: ['순천', '순천시'],
    type: 'coord',
    lat: 34.9507,
    lon: 127.4872,
  },
  {
    name: '포항',
    displayName: '경상북도 포항시',
    keywords: ['포항', '포항시'],
    type: 'coord',
    lat: 36.0190,
    lon: 129.3435,
  },
  {
    name: '안동',
    displayName: '경상북도 안동시',
    keywords: ['안동', '안동시'],
    type: 'coord',
    lat: 36.5684,
    lon: 128.7294,
  },
  {
    name: '춘천',
    displayName: '강원특별자치도 춘천시',
    keywords: ['춘천', '춘천시'],
    type: 'coord',
    lat: 37.8813,
    lon: 127.7300,
  },
  {
    name: '강릉',
    displayName: '강원특별자치도 강릉시',
    keywords: ['강릉', '강릉시'],
    type: 'coord',
    lat: 37.7519,
    lon: 128.8760,
  },
  {
    name: '신림',
    displayName: '서울특별시 관악구 신림동',
    keywords: ['신림', '신림동'],
    type: 'coord',
    lat: 37.4843,
    lon: 126.9297,
  },
];

export function getLocationSuggestions(query: string): KoreanLocation[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: KoreanLocation[] = [];
  const seen = new Set<string>();

  const exactMatches: KoreanLocation[] = [];
  const partialMatches: KoreanLocation[] = [];

  for (const location of koreanLocations) {
    const exactKeyword = location.keywords.some((keyword) => keyword === trimmed);
    const exactName = location.name === trimmed || location.displayName === trimmed;
    const partialKeyword = location.keywords.some((keyword) => keyword.includes(trimmed));
    const partialDisplay = location.displayName.includes(trimmed);

    if (exactKeyword || exactName) {
      exactMatches.push(location);
    } else if (partialKeyword || partialDisplay) {
      partialMatches.push(location);
    }
  }

  for (const location of [...exactMatches, ...partialMatches]) {
    if (!seen.has(location.displayName)) {
      seen.add(location.displayName);
      results.push(location);
      if (results.length >= 5) break;
    }
  }

  return results;
}

export function matchKoreanLocation(searchText: string): KoreanLocation | null {
  const trimmed = searchText.trim();
  if (!trimmed) return null;

  for (const location of koreanLocations) {
    if (
      location.name === trimmed ||
      location.displayName === trimmed ||
      location.keywords.includes(trimmed)
    ) {
      return location;
    }
  }

  return null;
}
