import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { restaurantRouter } from './restaurants/restaurants.router'
import { reviewsRouter } from './reviews/reviews.router'
import { mainRouter } from './main.router';

const server = new Server()
server.bootstrap([
    usersRouter,
    restaurantRouter,
    reviewsRouter,
    mainRouter
]).then(server => {
    console.log('API rodando em: ', server.application.address());
}).catch(error => {
    console.log('Servidor falhou ao iniciar');
    console.error(error)
    process.exit(1)
})
