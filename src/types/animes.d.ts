export interface Anime {
  id:            string;
  type:          TypeEnum;
  links:         AnimeLinks;
  attributes:    Attributes;
  relationships: { [key: string]: Relationship };
}

export interface Attributes {
  createdAt:           Date;
  updatedAt:           Date;
  slug:                string;
  synopsis:            string;
  description:         string;
  coverImageTopOffset: number;
  titles:              Titles;
  canonicalTitle:      string;
  abbreviatedTitles:   string[];
  averageRating:       string;
  ratingFrequencies:   { [key: string]: string };
  userCount:           number;
  favoritesCount:      number;
  startDate:           Date;
  endDate:             Date;
  nextRelease:         null;
  popularityRank:      number;
  ratingRank:          number;
  ageRating:           AgeRating;
  ageRatingGuide:      string;
  subtype:             ShowTypeEnum;
  status:              Status;
  tba:                 null | string;
  posterImage:         PosterImage;
  coverImage:          CoverImage | null;
  episodeCount:        number;
  episodeLength:       number | null;
  totalLength:         number;
  youtubeVideoId:      null | string;
  showType:            ShowTypeEnum;
  nsfw:                boolean;
}

export enum AgeRating {
  G = "G",    // General Audiences
  PG = "PG",  // Parental Guidance Suggested
  R = "R",    // Restricted
  R18 = "R18" // Explicit
}

export interface CoverImage {
  tiny:     string;
  large:    string;
  small:    string;
  original: string;
  meta:     Meta;
}

export interface Meta {
  dimensions: Dimensions;
}

export interface Dimensions {
  tiny:    Large;
  large:   Large;
  small:   Large;
  medium?: Large;
}

export interface Large {
  width:  number;
  height: number;
}

export interface PosterImage {
  tiny:     string;
  large:    string;
  small:    string;
  medium:   string;
  original: string;
  meta:     Meta;
}

export enum ShowTypeEnum {
  ONA = "ONA",
  OVA = "OVA",
  TV = "TV",
  Movie = "movie",
  Music = "music",
  Special = "special"
}

export enum Status {
  Finished = "finished",
}

export interface Titles {
  en?:    string;
  en_jp:  string;
  ja_jp:  string;
  en_us?: string;
}

export interface AnimeLinks {
  self: string;
}

export interface Relationship {
  links: RelationshipLinks;
}

export interface RelationshipLinks {
  self:    string;
  related: string;
}

export enum TypeEnum {
  Anime = "anime",
}
