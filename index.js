import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import cors from "cors";
import compression from "compression";
import initApolloEngine from './src/apollo';
import resolvers from './src/resolvers';
import typeDefs from './src/typeDefs';
import { PORT } from './src/constants';

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


