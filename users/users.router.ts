import * as restify from 'restify'
import { Router } from '../common/router'
import { User } from './users.model'

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {

        // GET
        application.get('/users', (req, resp, next) => {
            User.find().then(users => {
                resp.json(users)
                return next()
            })
        })

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user => {
                if (user) {
                    resp.json(user)
                    return next()
                }
                resp.send(404)
                return next()
            })
        })

        // POST
        application.post('/users', (req, resp, next) => {
            let user = new User(req.body)
            user.save().then(user => {
                user.password = undefined
                resp.json(user)
                return next()
            })
        })

        // PUT
        application.put('/users', (req, resp, next) => {

        })
    }
}

export const usersRouter = new UsersRouter()