FROM node:latest AS COMPILER

RUN apt update && apt upgrade -y
RUN apt install -y npm
RUN echo "Node: " && node -v
RUN echo "NPM: " && npm -v

WORKDIR /app
COPY prisma prisma
COPY package.json .
COPY package-lock.json .
COPY src src
COPY tsconfig.json .

RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:latest AS BUILDER

RUN echo "Node: " && node -v
RUN echo "NPM: " && npm -v

WORKDIR /app
COPY prisma prisma
COPY package.json .
COPY package-lock.json .
RUN npm install --production
RUN npx prisma generate

# this stage is used in order to not install npm
FROM node:bullseye-slim AS RUNNER
WORKDIR /app
COPY --from=COMPILER /app/dist dist
COPY --from=BUILDER /app/node_modules node_modules
COPY package.json .
COPY package-lock.json .
ENTRYPOINT ["node", "dist/server.js"]
