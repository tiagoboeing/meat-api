import * as jestCli from 'jest-cli'
import { Server } from './server/server'
import { environment } from './common/environment'
import { usersRouter } from './users/users.router'
import { User } from './users/users.model'
import { reviewsRouter } from './reviews/reviews.router';
import { Review } from './reviews/reviews.model';
import { restaurantRouter } from './restaurants/restaurants.router';
import { Restaurant } from './restaurants/restaurants.model';

let server: Server

const beforeAllTests = () => {
    environment.db.connection = process.env.DB_URL ||
        'mongodb://meat-api:meat-api1@ds125684.mlab.com:25684/meat-api-test'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server.bootstrap([
        usersRouter,
        reviewsRouter,
        restaurantRouter
    ])
        .then(() => User.remove({}).exec())
        .then(() => {
            let admin = new User()
            admin.name = 'admin'
            admin.email = 'admin@email.com',
            admin.password = '123456',
            admin.profiles = ['admin', 'user']
            return admin.save()
        })
        .then(() => Review.remove({}).exec())
        .then(() => Restaurant.remove({}).exec())
}

const afterAllTests = () => {
    return server.shutdown()
}

beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(error => {
        console.error(error)
        process.exit(1)
    })