import { Engine } from "apollo-engine";
import { PORT } from './constants';

export default function initApolloEngine() {
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
