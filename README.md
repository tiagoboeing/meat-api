# meat-api
API modelo para restaurantes

## Instalando dependências
- Rode `npm install`

## Rodar localmente
- Para realizar modificações, use o compilador do Typescript, no shell digite `tsc -w`
- Rodar Node com Nodemon, em outro shell utilize `nodemon dist/main.js`

*No caso do projeto o MongoDB está remoto no Mlab.

## Rotas

### Usuários
- GET: `/users` (listar todos os usuários)
- GET `/users/:id` (usuário por ID)
- POST `/users` (inserir usuário, passe o objeto JSON)
