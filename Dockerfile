FROM node:18-alpine

# Set working directory to where package.json actually exists
WORKDIR /app/flashcard-frontend

# Copy package.json and package-lock.json
COPY flashcard-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source files
COPY flashcard-frontend/ ./

# Build frontend
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
