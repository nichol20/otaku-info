import { ANIMES_URL } from "@/data/api";

export const animesUrl = (pageLimit: number=10, offset: number=0) =>
  `${ANIMES_URL}?page[limit]${pageLimit}&page[offset]=${offset}`