export interface Category {
  id:            string
  type:          string
  links:         CategoryLinks
  attributes:    Attributes
  relationships: Relationships
}

export interface Attributes {
  createdAt:       string
  updatedAt:       string
  title:           string
  description:     string
  totalMediaCount: number
  slug:            string
  nsfw:            boolean
  childCount:      number
}

export interface CategoryLinks {
  self: string
}

export interface Relationships {
  parent: Relationship
  anime:  Relationship
  drama:  Relationship
  manga:  Relationship
}

export interface Relationship {
  links: RelationshipLinks
}

export interface RelationshipLinks {
  self:    string
  related: string
}