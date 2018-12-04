import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { restaurantRouter } from './restaurants/restaurants.router'

const server = new Server()
server.bootstrap([
    usersRouter,
    restaurantRouter
]).then(server => {
    console.log('API rodando em: ', server.application.address());
}).catch(error => {
    console.log('Servidor falhou ao iniciar');
    console.error(error)
    process.exit(1)
})
