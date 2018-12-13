import * as restify from 'restify'
import * as mongoose from 'mongoose'
import * as fs from 'fs'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePathBodyParser } from './merge-path.parser';
import { handleError } from './error.handler';
import { tokenParser } from '../security/token.parser';
import { fstat } from 'fs';
import { logger } from '../common/logger';

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

                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                }
                if(environment.security.enableHTTPS){
                    options.certificate = fs.readFileSync(environment.security.certificate),
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options)

                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }))

                // trabalhar com JSON
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePathBodyParser)
                
                this.application.use(tokenParser)

                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                    // console.log('API rodando em http://localhost:3000');
                })

                this.application.on('restifyError', handleError)

                // (req, resp, route, error)
                // this.application.on('after', restify.plugins.auditLogger({
                //     log: logger,
                //     event: 'after',
                //     server: this.application
                // }))

                // this.application.on('audit', data => {

                // })

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