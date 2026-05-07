/* eslint-disable prettier/prettier */
const ANILIST_GQL = 'https://graphql.anilist.co';

export async function anilistQuery(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(ANILIST_GQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

const MEDIA_FIELDS = `
  id idMal title { romaji english native } description coverImage { large extraLarge } bannerImage
  status episodes duration format genres averageScore popularity
  startDate { year month day } endDate { year month day }
  studios { nodes { name isAnimationStudio } }
  trailer { id site }
  nextAiringEpisode { airingAt episode }
`;

const MANGA_FIELDS = `
  id title { romaji english native } description coverImage { large extraLarge }
  status chapters volumes format genres averageScore popularity
  startDate { year month day }
  staff { nodes { name { full } } }
`;

export const anilist = {
  // ── ANIME ──────────────────────────────────────────────────
  trending: () => anilistQuery(`
    query { Page(page:1,perPage:20){ media(type:ANIME,sort:TRENDING_DESC,isAdult:false){ ${MEDIA_FIELDS} } } }
  `).then(d => d.Page.media),

  popular: () => anilistQuery(`
    query { Page(page:1,perPage:20){ media(type:ANIME,sort:POPULARITY_DESC,isAdult:false){ ${MEDIA_FIELDS} } } }
  `).then(d => d.Page.media),

  recent: () => anilistQuery(`
    query { Page(page:1,perPage:20){ media(type:ANIME,sort:START_DATE_DESC,status:RELEASING,isAdult:false){ ${MEDIA_FIELDS} } } }
  `).then(d => d.Page.media),

  searchAnime: (query: string) => anilistQuery(`
    query($q:String){ Page(page:1,perPage:20){ media(search:$q,type:ANIME,isAdult:false){ ${MEDIA_FIELDS} } } }
  `, { q: query }).then(d => d.Page.media),

  getById: (id: number) => anilistQuery(`
    query($id:Int){ Media(id:$id,type:ANIME){ ${MEDIA_FIELDS} } }
  `, { id }).then(d => d.Media),

  // ── MANGA ──────────────────────────────────────────────────
  searchManga: (query: string) => anilistQuery(`
    query($q:String){ Page(page:1,perPage:20){ media(search:$q,type:MANGA,isAdult:false){ ${MANGA_FIELDS} } } }
  `, { q: query }).then(d => d.Page.media),

  getMangaById: (id: number) => anilistQuery(`
    query($id:Int){ Media(id:$id,type:MANGA){
      ${MANGA_FIELDS}
      relations { edges { relationType node { id title { romaji english } coverImage { large } type } } }
    }}
  `, { id }).then(d => d.Media),

  popularManga: () => anilistQuery(`
    query { Page(page:1,perPage:20){ media(type:MANGA,sort:POPULARITY_DESC,isAdult:false){ ${MANGA_FIELDS} } } }
  `).then(d => d.Page.media),

  trendingManga: () => anilistQuery(`
    query { Page(page:1,perPage:20){ media(type:MANGA,sort:TRENDING_DESC,isAdult:false){ ${MANGA_FIELDS} } } }
  `).then(d => d.Page.media),
};
