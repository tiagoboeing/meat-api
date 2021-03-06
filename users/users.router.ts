import * as restify from 'restify'
import { User } from './users.model'
import { ModelRouter } from '../common/model-router';
import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handler';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)

        // event emitter
        this.on('beforeRender', document => {
            document.password = undefined
            // delete document.password
        })
    }

    findByEmail = (req, resp, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {
                version: '1.0.0', handler: [
                    this.findAll, authorize('admin')
                ]
            },
            {
                version: '2.0.0', handler: [
                    authorize('admin'),
                    this.findByEmail,
                    this.findAll
                ]
            }
        ]));
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById, authorize('admin')])
        application.post(`${this.basePath}`, [this.save, authorize('admin')])
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace, authorize('admin')])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update, authorize('admin')])
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete, authorize('admin')])

        application.post(`${this.basePath}/authenticate`, authenticate)
    }
}

export const usersRouter = new UsersRouter()