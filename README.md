# Restaurant API

NestJS REST API with MongoDB.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Swagger docs at `http://localhost:3000/api`

## Endpoints

- `POST /restaurants` — create a restaurant
- `GET /restaurants` — list all, filter with `?cuisine=Burgers`
- `GET /restaurants/nearby?latitude=&longitude=` — find within 1KM
- `GET /restaurants/:id` — get by ID or slug
- `POST /users` — create a user
- `GET /users/:id` — get user by ID
- `POST /follows` — follow a restaurant
- `DELETE /follows` — unfollow
- `GET /follows/user/:userId` — get restaurants a user follows
- `GET /recommendations/:userId` — get restaurant recommendations
