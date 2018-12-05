import 'jest'
import * as request from 'supertest'
import { environment } from '../common/environment'

let address: string = (<any>global).address

// get
test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

// conteúdo de uma review
test('get /reviews/:id', () => {

    // cadastra user
    return request(address)
        .post('/users')
        .send({
            name: 'Tiago Boeing',
            email: 'tiago@tiago.com',
            password: '123'
        }).then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()

            let userId = response.body._id

            // cadastra restaurant
            request(address)
                .post('/restaurants')
                .send({ name: 'restaurant' })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body._id).toBeDefined()

                    let restId = response.body._id

                    // cadastra review
                    request(address)
                        .post('/reviews')
                        .send({
                            date: '2018-02-20T23:20:10',
                            rating: 2,
                            comments: 'teste',
                            user: userId,
                            restaurant: restId
                        })
                        .then(res => {
                            expect(res.status).toBe(200)
                            expect(res.body._id).toBeDefined()

                            // GET na review cadastrada
                            request(address)
                                .get(`/reviews/${res.body._id}`)
                                .then(res => {
                                    expect(res.status).toBe(200)
                                    expect(res.body._id).toBeDefined()
                                    expect(res.body.date).toBe('2018-02-20T23:20:10Z')
                                    expect(res.body.rating).toBe(2)
                                    expect(res.body.comments).toBe('teste')
                                    expect(res.body.user).toBe(userId)
                                    expect(res.body.restaurant).toBe(restId)
                                })
                                .catch(fail)
                        })
                })
                .catch(fail)
        })
        .catch(fail)
})

// post
test('post /reviews', () => {
    // cadastra user
    return request(address)
        .post('/users')
        .send({
            name: 'user cadastro',
            email: 'cadastro@user.com',
            password: '123'
        }).then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()

            let userId = response.body._id

            // cadastra restaurant
            request(address)
                .post('/restaurants')
                .send({ name: 'restaurant' })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body._id).toBeDefined()

                    let restId = response.body._id

                    // cadastra review
                    request(address)
                        .post('/reviews')
                        .send({
                            date: '2018-02-20T23:20:10',
                            rating: 2,
                            comments: 'teste',
                            user: userId,
                            restaurant: restId
                        })
                        .then(res => {
                            expect(res.status).toBe(200)
                            expect(res.body._id).toBeDefined()
                            expect(res.body.date).toBe('2018-02-20T23:20:10Z')
                            expect(res.body.rating).toBe(2)
                            expect(res.body.comments).toBe('teste')
                            expect(res.body.user).toBe(userId)
                            expect(res.body.restaurant).toBe(restId)
                        })
                })
        })
        .catch(fail)
})

// not found
test('get /reviews/aaa - not found', () => {
    return request(address)
        .get('/reviews/aaa')
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})