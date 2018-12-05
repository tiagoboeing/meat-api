import * as restify from 'restify'
import { User } from '../users/users.model';
import { NotAuthorizedError } from 'restify-errors';

export const authenticate: restify.RequestHandler = (req, resp, next) => {
    const { email, password } = req.body
    User.findByEmail(email, '+password')
        .then(user => {
            if(user && user.matches(password)){
                // gerar token

            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
        }).catch(next)
}