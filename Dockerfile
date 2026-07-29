# Use Node Alpine image
FROM node:20-alpine

# Install git and necessary tools for npm
RUN apk add --no-cache git bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose port
EXPOSE 10000

# Start QUEEN BELLA MD
CMD ["node", "queenbella.js"]