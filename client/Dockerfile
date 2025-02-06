# FROM  node:latest AS builder
# WORKDIR /app
# # Copy package files separately to leverage Docker caching
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# ENV NODE_ENV=production
# RUN npm run build

# FROM nginx:1.25.2-alpine-slim
# COPY --from=builder /app/dist /usr/share/nginx/html
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

FROM  node:20-alpine3.17
WORKDIR /app
COPY package*.json ./
# ENV NODE_ENV=development
RUN npm ci
COPY . .