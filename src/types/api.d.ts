export interface ApiResponse<T> {
  data: T
  links?: ApiResponseLinks
  [key: string]: any
}

interface ApiResponseLinks {
  first?: string
  prev?:  string
  next?:  string
  last?:  string
}