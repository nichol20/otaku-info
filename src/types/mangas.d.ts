export interface Manga {
  id:            string
  type:          Type
  links:         MangaLinks
  attributes:    Attributes
  relationships: RelationShips
}

export interface Attributes {
  createdAt:           string
  updatedAt:           string
  slug:                string
  synopsis:            string
  description:         string
  coverImageTopOffset: number
  titles:              Titles
  canonicalTitle:      string
  abbreviatedTitles:   string[]
  averageRating:       null | string
  ratingFrequencies:   { [key: string]: string }
  userCount:           number
  favoritesCount:      number
  startDate:           string | null
  endDate:             string | null
  nextRelease:         null
  popularityRank:      number
  ratingRank:          number | null
  ageRating:           null | string
  ageRatingGuide:      null | string
  subtype:             Type
  status:              Status
  tba:                 null | string
  posterImage:         PosterImage
  coverImage:          CoverImage | null
  chapterCount:        number | null
  volumeCount:         number
  serialization:       null | string
  mangaType:           Type
}

export interface CoverImage {
  tiny:        string
  large:       string
  small:       string
  original:    string
  meta:        CoverImageMeta
  tiny_webp?:  string
  large_webp?: string
  small_webp?: string
}

export interface CoverImageMeta {
  dimensions: PurpleDimensions
}

export interface PurpleDimensions {
  tiny:        Dimension
  large:       Dimension
  small:       Dimension
  tiny_webp?:  Dimension
  large_webp?: Dimension
  small_webp?: Dimension
}

export interface Dimension {
  width:  number
  height: number
}

export enum Type {
  Manga = "manga",
  Oneshot = "oneshot",
}

export interface PosterImage {
  tiny?:    string
  large?:   string
  small?:   string
  medium?:  string
  original: string
  meta:     PosterImageMeta
}

export interface PosterImageMeta {
  dimensions: FluffyDimensions
}

export interface FluffyDimensions {
  tiny?:   Dimension
  large?:  Dimension
  small?:  Dimension
  medium?: Dimension
}

export enum Status {
  Current = "current",
  Finished = "finished",
  Tba = "tba",
}

export interface Titles {
  en?:    null | string
  en_jp?:  string
  en_us?: string
  ja_jp?: string
  zh_cn?: string
}

export interface MangaLinks {
  self: string
}

export interface RelationShips {
  genres:               Relationship
  categories:           Relationship
  castings:             Relationship
  installments:         Relationship
  mappings:             Relationship
  reviews:              Relationship
  mediaRelationships:   Relationship
  characters:           Relationship
  staff:                Relationship
  productions:          Relationship
  quotes:               Relationship
  chapters:             Relationship
  mangaCharacters:      Relationship
  mangaStaff:           Relationship
}

export interface Relationship {
  links: RelationshipLinks
}

export interface RelationshipLinks {
  self:    string
  related: string
}
