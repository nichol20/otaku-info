export interface Episode {
  id:            string;
  type:          Type;
  links:         EpisodeLinks;
  attributes:    Attributes;
  relationships: Relationships;
}

export interface Attributes {
  createdAt:      string;
  updatedAt:      string;
  synopsis:       string | null;
  description:    string | null;
  titles:         Titles;
  canonicalTitle: string | null;
  seasonNumber:   number | null;
  number:         number;
  relativeNumber: null;
  airdate:        string | null;
  length:         number | null;
  thumbnail:      Thumbnail | null;
}

export interface Thumbnail {
  original: string;
  meta:     Meta;
}

export interface  Meta {
  dimensions: Dimensions;
}

export interface Dimensions {
}

export interface Titles {
  en_jp?: string;
  en_us?: string;
  ja_jp?: string;
}

export interface EpisodeLinks {
  self: string;
}

export interface Relationships {
  media:  Media;
  videos: Media;
}

export interface Media {
  links: MediaLinks;
}

export interface MediaLinks {
  self:    string;
  related: string;
}

export enum Type {
  Episodes = "episodes",
}