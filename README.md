# The Racing API


## DEV environment setup

1. install dependencies
```
npm install
```

2. run the database
```
cd prisma
docker-compose up -d
```

3. run migrations and seed the database
```
prisma migrate dev --name init
prisma generate
npm run seed
```

4. run the server
```
npm run dev
```

## Production environment setup

1. run the dockerfile
```
docker build -t opora-backend .
```
2. upload images to the server
3. Run migrations and seed the database (if running for the first time)
```
prisma migrate dev --name init
npm run seed
```
4. run the production docker-compose file
```
docker-compose up -d
```
> Note: in a real production you should use nginx or some other load balancer \
> you should also probably use kubernetes to deploy the application.
> Also you should probably use a reverse proxy (nginx) to implement https.

### Explanation notes
> I've used SQL database for the development environment.
> I've decided to use sql database for the development environment because it's \
> better for handling a lot of relational data. And from what I've seen thant what I had

