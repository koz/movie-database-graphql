import fetch from "node-fetch";

const TMDB_API_PATH = "https://api.themoviedb.org/3";

export default {
  Query: {
    movies: (root, args, context) => {
      // Wrapping a REST API with GraphQL is simple, you just describe the
      // result in the schema above, and call fetch in the resolver
      // See a complete tutorial: https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035
      return fetch(
        `${TMDB_API_PATH}/search/movie?api_key=${
          context.secrets.TMDB_API_KEY
        }&query=${args.query}&include_adult=false`
      )
        .then(res => res.json())
        .then(({ results }) => results);
    },
    config: (_, $, context) => {
      return fetch(
        `${TMDB_API_PATH}/configuration?api_key=${context.secrets.TMDB_API_KEY}`
      ).then(res => res.json());
    },
    movie: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/movie/${args.id}?api_key=${
          context.secrets.TMDB_API_KEY
        }&append_to_response=credits`
      ).then(res => res.json());
    },
    movie_genres: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/genre/movie/list?api_key=${
          context.secrets.TMDB_API_KEY}`
      )
        .then(res => res.json())
        .then(({ genres }) => genres);
    },
    movies_by_genre: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/genre/${args.id}/movies?api_key=${context.secrets.TMDB_API_KEY}`
      ).then(res => res.json())
      .then(({ results }) => results);

    },
    tv: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/tv/${args.id}?api_key=${
          context.secrets.TMDB_API_KEY
        }&append_to_response=credits`
      ).then(res => res.json());
    },
    tv_genres: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/genre/tv/list?api_key=${
          context.secrets.TMDB_API_KEY}&append_to_response=credits`
      )
        .then(res => res.json())
        .then(({ genres }) => genres);
    },
    tv_by_genre: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/genre/${args.id}/tv?api_key=${context.secrets.TMDB_API_KEY}`
      ).then(res => res.json())
      .then(({ results }) => results);
    },
    company: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/company/${args.id}?api_key=${
          context.secrets.TMDB_API_KEY
        }`
      ).then(res => res.json());
    },
    company_movies: (root, args, context) => {
      return fetch(
        `${TMDB_API_PATH}/company/${args.id}/movies?api_key=${
          context.secrets.TMDB_API_KEY
        }`
      ).then(res => res.json())
      .then(({ results }) => results);

    },
  }
};
