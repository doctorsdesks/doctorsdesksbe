FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use a smaller base image for the final stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist /app/build
COPY package*.json ./
RUN npm install --only=production
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]