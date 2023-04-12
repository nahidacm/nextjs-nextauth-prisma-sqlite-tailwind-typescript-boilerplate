NextJS boilerplate application with:
1. Prisma
2. JWT Authentication
3. TypeScript


#### Installation
1. Install: `yarn install`
2. DB Migrate: `yarn prisma migrate dev`
3. Run the project: `yarn dev`

#### API Endpoints
1. `localhost:3000/api/register`
Payload:
```json
{
    "email": "jukatuby@mailinator.com",
    "password": "Pa$$w0rd!"
}
```
2. `localhost:3000/api/login`
Payload:
```json
{
    "email": "jukatuby@mailinator.com",
    "password": "Pa$$w0rd!"
}
```