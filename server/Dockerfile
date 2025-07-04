# for deployment
FROM  node:20-alpine3.17
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
