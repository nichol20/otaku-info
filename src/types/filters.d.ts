export interface Filters {
  genres?:  string[]
  text?:     string
  season?:   Season | ""
  streamers?: Streamer[]
}

export type Season = 'winter' | 'spring' | 'summer' | 'fall'
export type Streamer = 'Hulu' | 'Funimation' | 'Crunchyroll' | 'CONtv' | 'Netflix' | 'HIDIVE' | 'TubiTV' | 'Amazon' | 'YouTube' | 'AnimeLab'

export type AgeRating = "G" | "PG" | "R" | "R18"