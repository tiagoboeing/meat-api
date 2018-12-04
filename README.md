# meat-api
API modelo para restaurantes

## Instalando dependências
- Rode `npm install`

## Rodar localmente
- Para realizar modificações, use o compilador do Typescript, no shell digite `tsc -w`
- Rodar Node com Nodemon, em outro shell utilize `nodemon dist/main.js`

> No caso do projeto o MongoDB está remoto no Mlab.

## Rotas

### Users
- GET, POST, PUT, PATCH, DELETE: `/users`
- GET `/users/:id` (User by Id)
- GET `/users?email=jon@doe.com` (User by email)

### Restaurants
- GET, POST, PUT, PATCH, DELETE: `/restaurants`
  - GET, PUT: `/restaurants/{_id}/menu`

### Reviews
- GET, POST, DELETE: `/reviews`
- GET `/reviews/{_id}` (Review by Id)
  

## Executar testes
- Rodar `npm test`
