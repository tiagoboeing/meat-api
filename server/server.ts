import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { environment } from '../common/environment'
import { Router } from '../common/router'

export class Server {

    application: restify.Server

    initializeDb(): Promise<any> {
        (<any>mongoose.Promise) = global.Promise
        return mongoose.connect(environment.db.connection, {
            useNewUrlParser: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser())

                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                    // console.log('API rodando em http://localhost:3000');
                })

            } catch (error) {
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        // inicializa rotas se conexão com DB for bem sucedida
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this))
    }
}