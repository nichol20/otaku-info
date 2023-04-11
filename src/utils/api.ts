import { ANIME_URL, MANGA_URL, TRENDING_ANIME_URL, TRENDING_MANGA_URL } from "@/data/api";
import { Filters } from "@/types/filters";

const getFilterString = (filters: Filters | undefined) => {
  let filterStr = ''

  if(filters?.text && filters.text.length > 0) filterStr += `&filter[text]=${filters.text}`

  if(filters?.genres) {
    filters.genres.forEach(genre => {
      filterStr += `&filter[genres]=${genre}`
    })
  }

  if(filters?.season && filters.season.length > 0) filterStr += `&filter[season]=${filters.season}`

  if(filters?.streamers) {
    filters.streamers.forEach(streamer => {
      filterStr += `&filter[streamers]=${streamer}`
    })
  }

  if(filters?.ageRating && filters.ageRating.length > 0) filterStr += `&filter[ageRating]=${filters.ageRating}`

  return filterStr
}

export const animeUrl = (pageLimit: number=10, offset: number=0, filters?: Filters) => 
 `${ANIME_URL}?page[limit]=${pageLimit}&page[offset]=${offset}${getFilterString(filters)}`

 export const mangaUrl = (pageLimit: number=10, offset: number=0, filters?: Filters) => 
 `${MANGA_URL}?page[limit]=${pageLimit}&page[offset]=${offset}${getFilterString(filters)}`

export const trendingAnimeUrl = () => TRENDING_ANIME_URL
export const trendingMangaUrl = () => TRENDING_MANGA_URL

export const singleAnimeUrl = (id: string) => `${ANIME_URL}/${id}`