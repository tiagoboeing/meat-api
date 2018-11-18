const users = [
    { name: 'Cara 1', email: 'email@email.com' },
    { name: 'Cara 2', email: 'email@email.com' }
]

export class User {
    static findAll(): Promise<any[]>{
        return Promise.resolve(users)
    }
}