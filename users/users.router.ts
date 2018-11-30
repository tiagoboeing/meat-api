import * as restify from 'restify'
import { Router } from '../common/router'
import { User } from './users.model'
import { NotFoundError } from 'restify-errors';

class UsersRouter extends Router {

    constructor() {
        super()

        // event emitter
        this.on('beforeRender', document => {
            document.password = undefined
            // delete document.password
        })
    }

    applyRoutes(application: restify.Server) {

        // GET
        application.get('/users/', (req, resp, next) => {
            User.find()
                .then(this.render(resp, next))
                .catch(next)
        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next)
        })

        // POST
        application.post('/users', (req, resp, next) => {
            let user = new User(req.body)
            user.save()
                .then(this.render(resp, next))
                .catch(next)
        })

        // PUT
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true }
            User.update({ _id: req.params.id }, req.body, options).exec()
                .then(result => {
                    if (result.n) {
                        return User.findById(req.params.id).exec()
                    } else {
                        throw new NotFoundError('Documento não encontrado')
                    }
                })
                .then(this.render(resp, next))
                .catch(next)
        })

        // PATCH - atualização parcial
        // content-type: application/merge-patch+json
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next)
        })

        // DELETE
        application.del('/users/:id', (req, resp, next) => {
            User.remove({ _id: req.params.id }).exec()
                .then((cmdResult: any) => {
                    if (cmdResult.n) {
                        resp.send(204)
                    } else {
                        throw new NotFoundError('Documento não encontrado')
                    }
                    return next()
                })
                .catch(next)
        })

    }
}

export const usersRouter = new UsersRouter()