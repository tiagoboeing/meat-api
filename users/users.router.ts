import * as restify from 'restify'
import { Router } from '../common/router'
import { User } from './users.model'

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
        application.get('/users', (req, resp, next) => {
            User.find().then(this.render(resp, next))
        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(this.render(resp, next))
        })

        // POST
        application.post('/users', (req, resp, next) => {
            let user = new User(req.body)
            user.save().then(this.render(resp, next))
        })

        // PUT
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true }
            User.update({ _id: req.params.id }, req.body, options).exec()
                .then(result => {
                    if (result.n) {
                        return User.findById(req.params.id).exec()
                    } else {
                        resp.send(404)
                    }
                }).then(this.render(resp, next))
        })

        // PATCH - atualização parcial
        // content-type: application/merge-patch+json
        application.patch('/users/:id', (req, resp, next) => {
            const options = { new: true }
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
        })

        // DELETE
        application.del('/users/:id', (req, resp, next) => {
            User.remove({ _id: req.params.id }).exec()
                .then((cmdResult: any) => {
                    if (cmdResult.n) {
                        resp.send(204)
                    } else {
                        resp.send(404)
                    }
                    return next()
                })
        })

    }
}

export const usersRouter = new UsersRouter()