import { AgeRating, Season } from "@/types/filters";
import { Streamer } from "@/types/filters";

export const genres: string[] = ["Action","Adventure","Comedy","Drama","Sci-Fi","Space","Mystery","Magic","Supernatural","Police","Fantasy","Sports","Romance","Cars","Slice of Life","Racing","Horror","Psychological","Thriller","Martial Arts","Super Power","School","Ecchi","Vampire","Historical","Military","Dementia","Mecha","Demons","Samurai","Harem","Music","Parody","Shoujo Ai","Game","Shounen Ai","Kids","Hentai","Yuri","Yaoi","Anime Influenced","Gender Bender","Doujinshi","Mahou Shoujo","Mahou Shounen","Gore","Law","Cooking","Mature","Medical","Political","Tokusatsu","Youth","Workplace","Crime","Zombies","Documentary","Family","Food","Friendship","Tragedy","Isekai"]

export const streamers: Streamer[] = [
  'Hulu',
  'Funimation',
  'Crunchyroll',
  'CONtv',
  'Netflix',
  'HIDIVE',
  'TubiTV',
  'Amazon',
  'YouTube',
  'AnimeLab'
]

export const seasons: Season[] = [ 'winter', 'spring', 'summer', 'fall' ]

export const ageRatings: AgeRating[] = ['G', 'PG', 'R', 'R18']