export interface ApiResponse<T> {
  data: T
  meta?: ApiResponseMeta
  links?: ApiResponseLinks
  [key: string]: any
}

interface ApiResponseMeta {
  count: number
}

interface ApiResponseLinks {
  first?: string
  prev?:  string
  next?:  string
  last?:  string
}