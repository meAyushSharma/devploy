# Use an official Node.js base image
FROM node:18

# Install additional tools
RUN apt-get update && apt-get install -y curl git && \
    apt-get clean

# Set working directory inside the container
WORKDIR /sandbox

# Expose the port for the Node.js server
EXPOSE 3000

# Start the container with a shell
CMD ["bash"]
