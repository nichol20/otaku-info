export interface StreamingLinks {
  id:            string
  type:          string
  links:         StreamingLinkLinks
  attributes:    Attributes
  relationships: Relationships
}

export interface Attributes {
  createdAt: string
  updatedAt: string
  url:       string
  subs:      string[]
  dubs:      string[]
}

export interface StreamingLinkLinks {
  self: string
}

export interface Relationships {
  streamer: Media
  media:    Media
}

export interface Media {
  links: MediaLinks
}

export interface MediaLinks {
  self:    string
  related: string
}
