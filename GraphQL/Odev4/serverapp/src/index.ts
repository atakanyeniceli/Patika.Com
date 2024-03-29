import { ApolloServer } from '@apollo/server'
import { resolvers } from './Resolvers/index.js'
import typeDefs from './Schema/index.js'
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';



const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);


const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ]
})

await server.start()
app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server))

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});

