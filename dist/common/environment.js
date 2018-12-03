"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: {
        connection: process.env.SERVER_PORT ||
            'mongodb://meat-api:meat-api1@ds047146.mlab.com:47146/meat-api'
    },
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
};
