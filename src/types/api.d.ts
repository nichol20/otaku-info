export interface ApiResponse<T> {
  data: T
  links?: ApiResponseLinks
  meta?: Meta
  [key: string]: any
}

interface Meta {
  count: number
}

interface ApiResponseLinks {
  first?: string
  prev?:  string
  next?:  string
  last?:  string
}