import { ANIMES_URL, TRENDING_ANIME_URL } from "@/data/api";

export const animesUrl = (pageLimit: number=10, offset: number=0, filter?: string) =>
  `${ANIMES_URL}?page[limit]=${pageLimit}&page[offset]=${offset}${filter ? `&filter[text]=${filter}` : ''}`

export const trendingAnimeUrl = () => TRENDING_ANIME_URL

export const singleAnimeUrl = (id: string) => `${ANIMES_URL}/${id}`