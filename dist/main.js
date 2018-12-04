"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const reviews_router_1 = require("./reviews/reviews.router");
const main_router_1 = require("./main.router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurants_router_1.restaurantRouter,
    reviews_router_1.reviewsRouter,
    main_router_1.mainRouter
]).then(server => {
    console.log('API rodando em: ', server.application.address());
}).catch(error => {
    console.log('Servidor falhou ao iniciar');
    console.error(error);
    process.exit(1);
});
