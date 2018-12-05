import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('async post /users', () => {
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

test('get /users/aaa - not found', () => {
    return request(address)
        .get('/users/aaa')
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Jon Doe2',
            email: 'jon@doe.com',
            password: 'jon123'
        })
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .send({
                name: 'Jon Doe - patch'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Jon Doe - patch')
            expect(response.body.email).toBe('jon@doe.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

test('delete /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'User 1',
            email: 'user@12.com',
            password: '123'
        })
        .then(response => request(address)
            .delete(`/users/${response.body._id}`)
            .send({}))
        .then(response => {
            expect(response.status).toBe(204)
        })
        .catch(fail)
})

// executar somente um teste isolado
// test.only

// pular teste
// test.skip


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