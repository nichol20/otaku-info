import { ANIMES_URL, TRENDING_ANIME_URL } from "@/data/api";
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

  return filterStr
}

export const animesUrl = (pageLimit: number=10, offset: number=0, filters?: Filters) => 
 `${ANIMES_URL}?page[limit]=${pageLimit}&page[offset]=${offset}${getFilterString(filters)}`

export const trendingAnimeUrl = () => TRENDING_ANIME_URL

export const singleAnimeUrl = (id: string) => `${ANIMES_URL}/${id}`