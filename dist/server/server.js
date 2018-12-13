"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const fs = require("fs");
const environment_1 = require("../common/environment");
const merge_path_parser_1 = require("./merge-path.parser");
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
const logger_1 = require("../common/logger");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.connection, {
            useNewUrlParser: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger_1.logger
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate),
                        options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                this.application = restify.createServer(options);
                this.application.pre(restify.plugins.requestLogger({
                    log: logger_1.logger
                }));
                // trabalhar com JSON
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_path_parser_1.mergePathBodyParser);
                this.application.use(token_parser_1.tokenParser);
                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                    // console.log('API rodando em http://localhost:3000');
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        // inicializa rotas se conexão com DB for bem sucedida
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
