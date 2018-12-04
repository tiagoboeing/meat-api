import * as restify from 'restify'
import { ModelRouter } from './common/model-router';
import { Router } from './common/router';

class MainRouter extends Router {
    applyRoutes(application: restify.Server){
        application.get('/', (req, resp, next) => {
            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews',
            })
        })
    }
}

export const mainRouter = new MainRouter()