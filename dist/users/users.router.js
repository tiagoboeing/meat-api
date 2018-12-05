"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => user ? [user] : [])
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        // event emitter
        this.on('beforeRender', document => {
            document.password = undefined;
            // delete document.password
        });
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {
                version: '1.0.0', handler: [
                    this.findAll, authz_handler_1.authorize('admin')
                ]
            },
            {
                version: '2.0.0', handler: [
                    authz_handler_1.authorize('admin'),
                    this.findByEmail,
                    this.findAll
                ]
            }
        ]));
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById, authz_handler_1.authorize('admin')]);
        application.post(`${this.basePath}`, [this.save, authz_handler_1.authorize('admin')]);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace, authz_handler_1.authorize('admin')]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update, authz_handler_1.authorize('admin')]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete, authz_handler_1.authorize('admin')]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
