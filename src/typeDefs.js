// Construct a schema, using GraphQL schema language
export default `
# Cache all types in Apollo Engine for an hour
# since the data never changes. maxAge is in seconds
# See docs here: https://www.apollographql.com/docs/engine/caching.html
type Query @cacheControl(maxAge: 3600) {
  movies(query: String!): [Movie]
  config: Config
  movie(id: Int!): Movie
  movie_genres: [Genre]
  movies_by_genre(id: Int!): [Movie]
  tv(id: Int!): Tv
  tv_genres: [Genre]
  tv_by_genre(id: Int!): [Movie]
  company(id: Int!): Company
  company_movies(id: Int!): [Movie]

}
type Genre @cacheControl(maxAge: 3600) {
  id: Int
  name: String
}
type Movie @cacheControl(maxAge: 3600) {
  id: Int
  title: String
  poster_path: String
  overview: String
  backdrop_path: String
  budget: Int
  genres: [Genre]
  genre_ids: [Int]
  release_date: String
  original_title: String
  original_language: String
}

type Tv @cacheControl(maxAge: 3600) {
  id: Int
  name: String
  poster_path: String
  popularity: Float
  overview: String
  backdrop_path: String
  budget: Int
  genres: [Genre]
  first_air_date: String
  homepage: String
  episode_run_time: [Int]
  in_production: Boolean
  languages: [String]
  last_air_date: String
  number_of_episodes: Int
  number_of_seasons: Int
  origin_country: [String]
  original_language: String
  original_name: String
  status: String
  type: String
  vote_average: Float
  vote_count: Int
  created_by: [Person]
  networks: [Network]
  production_companies: [Company]
  seasons: [Season]
  credits: Credit
}

type Season @cacheControl(maxAge: 3600) {
  air_date: String
  episode_count: Int
  id: Int
  poster_path: String
  season_number: Int
}

type Episode @cacheControl(maxAge: 3600) {
  air_date: String
  episode_count: Int
  id: Int
  still_path: String
  episode_number: Int
}

type Person @cacheControl(maxAge: 3600) {
  id: Int
  name: String
  gender: Int
  profile_path: String
}

type Network @cacheControl(maxAge: 3600) {
  id: Int
  name: String
}

type Company @cacheControl(maxAge: 3600) {
  id: Int
  name: String
  description: String
  headquarters: String
  homepage: String
  logo_path: String
  parent_company: String
}
type Credit @cacheControl(maxAge: 3600) {
  id: String
  credit_type: String
  department: String
  job: String
  media_type: String
  media: Media
  person: [Person]

}
type Media @cacheControl(maxAge: 3600) {
  id: Int
  name: String
  original_name: String
  character: String
  episodes: [Episode]
  seasons: [Season]
}
type Images @cacheControl(maxAge: 3600) {
  poster_sizes: [String]
  base_url: String
  secure_base_url: String
}

type Config @cacheControl(maxAge: 3600) {
  images: Images
}
`;
