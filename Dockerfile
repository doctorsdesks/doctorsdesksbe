# Dockerfile
FROM --platform=$TARGETPLATFORM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app's source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start:prod"]
