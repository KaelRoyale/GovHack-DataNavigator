export interface GoogleCustomSearchResponseDto {
  kind: string
  url: Url
  queries: Queries
  context: Context
  searchInformation: SearchInformation
  items: Item[]
}

export interface Url {
  type: string
  template: string
}

export interface Queries {
  previousPage: PreviousPage[]
  request: Request[]
  nextPage: NextPage[]
}

export interface PreviousPage {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

export interface Request {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

export interface NextPage {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

export interface Context {
  title: string
}

export interface SearchInformation {
  searchTime: number
  formattedSearchTime: string
  totalResults: string
  formattedTotalResults: string
}

export interface Item {
  kind: string
  title: string
  htmlTitle: string
  link: string
  displayLink: string
  snippet: string
  htmlSnippet: string
  formattedUrl: string
  htmlFormattedUrl: string
  pagemap: Pagemap
}

export interface Pagemap {
  cse_thumbnail?: CseThumbnail[]
  metatags: Metatag[]
  cse_image?: CseImage[]
  WebPage?: WebPage[]
}

export interface CseThumbnail {
  src: string
  width: string
  height: string
}

export interface Metatag {
  "theme-color"?: string
  viewport: string
  "og:image"?: string
  "og:type"?: string
  "og:site_name"?: string
  "site-url"?: string
  "apple-mobile-web-app-title"?: string
  "og:title"?: string
  "apple-mobile-web-app-status-bar-style"?: string
  "apple-mobile-web-app-capable"?: string
  "mobile-web-app-capable"?: string
  "og:locale"?: string
  "template-dir"?: string
  "og:url"?: string
  "og:image:width"?: string
  "twitter:card"?: string
  "og:image:height"?: string
  "twitter:label1"?: string
  "og:image:type"?: string
  "og:description"?: string
  "article:publisher"?: string
  "twitter:data1"?: string
  "twitter:site"?: string
  "article:modified_time"?: string
  "twitter:title"?: string
  "twitter:site:id"?: string
  handheldfriendly?: string
  mobileoptimized?: string
  "turbolinks-cache-control"?: string
  tags?: string
  "og:image:alt"?: string
  referrer?: string
  "og:updated_time"?: string
  department?: string
  "article:author"?: string
  "core service"?: string
  "msapplication-tilecolor"?: string
  "msapplication-config"?: string
  "scripps institution of oceanography, uc san diego"?: string
  "twitter:description"?: string
  "format-detection"?: string
}

export interface CseImage {
  src: string
}

export interface WebPage {
  name: string
  text: string
}
