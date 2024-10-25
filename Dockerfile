# Dockerfile for Fragments Microservice
# This file defines all the Docker instructions necessary to build an image
# of the Fragments microservice, including setting up the environment,
# installing dependencies, and running the service.

# FROM node:18.20.3

# LABEL maintainer="Cris Huynh <xhuynh@myseneca.ca>"
# LABEL description="Fragments node.js microservice"

# # We default to use port 8080 in our service
# ENV PORT=8080

# # Reduce npm spam when installing within Docker
# # https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
# ENV NPM_CONFIG_LOGLEVEL=warn

# # Disable colour when run inside Docker
# # https://docs.npmjs.com/cli/v8/using-npm/config#color
# ENV NPM_CONFIG_COLOR=false

# # Use /app as our working directory
# WORKDIR /app

# # explicit filenames - Copy the package.json and package-lock.json
# # files into the working dir (/app), using full paths and multiple source
# # files.  All of the files will be copied into the working dir `./app`
# COPY package.json package-lock.json ./

# # Install node dependencies defined in package-lock.json
# RUN npm install

# # Copy src to /app/src/
# COPY ./src ./src

# # Copy our HTPASSWD file
# COPY ./tests/.htpasswd ./tests/.htpasswd

# # Start the container by running our server
# CMD npm start

# # We run our service on port 8080
# EXPOSE 8080




# DOCKER OPTIMIZATIONS
# Stage 1; Build stage
FROM node:18-alpine AS builder

LABEL maintainer="Cris Huynh <xhuynh@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Environment setup
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the application
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

#--------------------------------------------#
# Stage 2: Final Stage
FROM node:18-alpine

# Use the same environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Expose port and run the application
EXPOSE 8080
CMD [ "npm", "start" ]
