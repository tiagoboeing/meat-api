import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('async post /restaurants', async () => {
    return request(address)
        .post('/restaurants')
        .send({
            name: 'Restaurant 1'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Restaurant 1')
        }).catch(fail)
})

test('delete /restaurants', () => {
    return request(address)
        .post('/restaurants')
        .send({
            name: 'Restaurant 2'
        })
        .then(response => request(address)
            .delete(`/restaurants/${response.body._id}`)
            .send({}))
        .then(response => {
            expect(response.status).toBe(204)
        })
        .catch(fail)
})

test('get /restaurants/aaa - not found', () => {
    return request(address)
        .get('/restaurants/aaa')
        .then(response => {
            expect(response.status).toBe(404)
        }).catch(fail)
})

test('patch /restaurants/:id', () => {
    return request(address)
        .post('/restaurants')
        .send({
            name: 'Restaurant 1'
        })
        .then(response => request(address)
            .patch(`/restaurants/${response.body._id}`)
            .send({
                name: 'Restaurant 1 - patch'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Restaurant 1 - patch')
        })
        .catch(fail)
})