const express = require('express');
const fs = require('fs');
const { ApolloServer, UserInputError } = require('apollo-server-express');


const productsDB = [];

const resolvers = {
    Query: {
        productList,
    },
    Mutation: {
        productAdd,
    }
};

function productList() {
    return productsDB;
}

function productAdd(_, { product }) {
    product.id = productsDB.length + 1;
    productsDB.push(product);
    return product;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(4000, function () {
    console.log('App started on port 3000');
});