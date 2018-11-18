import { Server } from './server/server'

const server = new Server()
server.bootstrap().then(server => {
    console.log('API rodando em: ', server.application.address());
}).catch(error => {
    console.log('Servidor falhou ao iniciar');
    console.error(error)
    process.exit(1)
})
