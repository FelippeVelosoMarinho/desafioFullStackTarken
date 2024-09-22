# Use Alpine Linux as the base image
#FROM alpine:3.14
FROM node:18-alpine

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

RUN mkdir /server

# Install sqlite
RUN apk --no-cache add sqlite

# Create a directory for your application
WORKDIR /server

# Copy package.json and package-lock.json files to the container
COPY ./server /server

# Expose the port your Express app listens on (e.g., 3000)
EXPOSE 3000

# Install application dependencies
RUN npm install