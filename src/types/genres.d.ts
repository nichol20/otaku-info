export interface Genre {
  id:         string
  type:       string
  links:      Links
  attributes: Attributes
}

export interface Attributes {
  createdAt:   Date
  updatedAt:   Date
  name:        string
  slug:        string
  description: null | string
}

export interface Links {
  self: string
}
