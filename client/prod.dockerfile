FROM node:20.18.1-bullseye

# Set the working directory to /api
WORKDIR /client

# copy package.json into the container at /api
COPY package*.json /client/

# install dependencies
RUN npm install

# Copy the rest of the application code into the container at /client
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Build the project
RUN npm run build
