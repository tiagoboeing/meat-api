const users = [
    { id: '1', name: 'Cara 1', email: 'email@email.com' },
    { id: '2', name: 'Cara 2', email: 'email@email.com' }
]

export class User {
    static findAll(): Promise<any[]>{
        return Promise.resolve(users)
    }

    static findById(id: string): Promise<any>{
        return new Promise(resolve => {
            const filtered = users.filter(user => user.id === id)
            let user = undefined
            if(filtered.length > 0){
                user = filtered[0]
            }
            resolve(user)
        })
    }
}