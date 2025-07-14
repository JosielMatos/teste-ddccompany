# Use Node.js 20.x as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first
COPY package.json yarn.lock ./

# Install Node.js dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . /app

# Generate Prisma client, run linter, and build the application
RUN yarn prisma generate && \
    yarn lint --fix --quiet && \
    yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]

# Command can be defined in docker-compose.yml
