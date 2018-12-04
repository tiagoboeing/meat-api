import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'
import { usersRouter } from '../users/users.router'
import { User } from './users.model'
import * as mongoose from 'mongoose';

let address: string
let server: Server

beforeAll(() => {
    environment.db.connection = process.env.DB_URL || 'mongodb://meat-api:meat-api1@ds125684.mlab.com:25684/meat-api-test'
    environment.server.port = process.env.SERVER_PORT || 3001
    address = `http://localhost:${environment.server.port}`
    server = new Server()
    return server.bootstrap([usersRouter])
        .then(() => User.remove({}).exec())
        .catch(console.error)
})

afterAll(() => {
    return server.shutdown()
})


test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('async post /users', async () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Jon Does',
            email: 'jon@does.com',
            password: 'jon123',
            cpf: '877.401.880-93'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Jon Does')
            expect(response.body.email).toBe('jon@does.com')
            expect(response.body.cpf).toBe('877.401.880-93')
            expect(response.body.password).toBeUndefined()
        }).catch(fail)
})


// teste de forma assíncrona
// test('async post /users', async () => {
//     try {

//         let response = await request('http://localhost:3001')
//             .post('/users')
//             .send({
//                 name: 'Jon Does',
//                 email: 'jon@does.com',
//                 password: 'jon123',
//                 cpf: '877.401.880-93'
//             })

//         expect(response.status).toBe(200)
//         expect(response.body._id).toBeDefined()
//         expect(response.body.name).toBe('Jon Does')
//         expect(response.body.email).toBe('jon@does.com')
//         expect(response.body.cpf).toBe('877.401.880-93')
//         expect(response.body.password).toBeUndefined()

//     } catch (e) {
//         fail(e)
//     }
// })