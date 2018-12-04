import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePathBodyParser } from './merge-path.parser';
import { handleError } from './error.handler';

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

                // trabalhar com JSON
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePathBodyParser)

                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                    // console.log('API rodando em http://localhost:3000');
                })

                this.application.on('restifyError', handleError)

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

    shutdown(){
        return mongoose.disconnect().then(() => this.application.close())
    }
}