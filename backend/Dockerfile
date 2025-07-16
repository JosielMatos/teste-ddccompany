# Use Node.js 20.x as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
