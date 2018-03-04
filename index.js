const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const fetch = require("node-fetch");
const cors = require("cors");
const compression = require("compression");
const { Engine } = require("apollo-engine");

const TMDB_API_PATH = "https://api.themoviedb.org/3";

// Construct a schema, using GraphQL schema language
const typeDefs = `
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

const resolvers = {
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

// Put together the schema and resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

if (!process.env.TMDB_API_KEY) {
  throw new Error(
    "Please provide an API key for themoviedb.org in the environment variable TMDB_API_KEY."
  );
}

if (!process.env.ENGINE_API_KEY) {
  throw new Error(
    "Please provide an API key for Apollo Engine in the environment variable ENGINE_API_KEY."
  );
}

const PORT = process.env.PORT || 3000;

app.use(initApolloEngine().expressMiddleware());
app.use(cors());
app.use(compression());

// The GraphQL endpoint
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema,
    tracing: true,
    cacheControl: true,
    context: {
      secrets: {
        TMDB_API_KEY: process.env.TMDB_API_KEY
      }
    }
  })
);

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
});

function initApolloEngine() {
  const engine = new Engine({
    engineConfig: {
      apiKey: process.env.ENGINE_API_KEY,
      stores: [
        {
          name: "publicResponseCache",
          inMemory: {
            cacheSize: 10485760
          }
        }
      ],
      queryCache: {
        publicFullQueryStore: "publicResponseCache"
      }
    },
    graphqlPort: PORT
  });

  engine.start();

  return engine;
}
