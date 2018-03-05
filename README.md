# The Movie Database GraphQL wrapper

This is for now a super simple wrapper of the REST API for [The Movie Database](https://www.themoviedb.org/) to convert it to GraphQL.

BUUUT. I plan to make it the best way to access TMDb via a GraphQL Endpoint available, at least until it's that good that Travis decides to make the API support GraphQL in the future.

Check out the [live API hosted on Now](https://movie-database-graphql-qwqnwstigc.now.sh).

## Running the app

You'll need two API keys:

1. [themoviedb.org API key](https://www.themoviedb.org/documentation/api)
2. [Apollo Engine API key](https://engine.apollographql.com/)

Run the app in local with:

```sh
yarn install
TMDB_API_KEY=<key 1> ENGINE_API_KEY=<key 2> yarn start
```

You might want to install now's zeit.co tools to deploy:
1. [Now Deployments](http://zeit.co/now)

Deploy the app to now's cloud with:
```sh
yarn install
now -e TMDB_API_KEY="<key 1>" -e ENGINE_API_KEY="<key 2>"
```

## Docs

To learn about what's going on, check out the docs for the tools and libraries used:

1. [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
2. [Apollo Engine](https://www.apollographql.com/docs/engine/)
3. [Deployment: Zeit's Docs](https://zeit.co/docs)

## After completing the wrapper, build a client example app, using many SaaS and libraries, and document it as a blogpost series or vlog in a YT channel (Inspired very much in cabin-instagram clone series)

1. [Auth0 | AUTH
2. [Algolia | SEARCH](https://www.algolia.com/)
3. Stream for feeds
4. [Sendbird for CHAT](https://sendbird.com/)

