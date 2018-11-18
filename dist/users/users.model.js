"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { name: 'Cara 1', email: 'email@email.com' },
    { name: 'Cara 2', email: 'email@email.com' }
];
class User {
    static findAll() {
        return Promise.resolve(users);
    }
}
exports.User = User;
