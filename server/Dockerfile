# Use the official Node.js image as the base image
FROM node:22

# Set the working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Nest.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application and run migrations
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]
