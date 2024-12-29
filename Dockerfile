# Base image: Ubuntu
FROM ubuntu:22.04

WORKDIR /app

# Update and install prerequisites
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (using NodeSource setup script for the latest LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy files from the current directory on the host to /app in the container
COPY . /app

# Set the default command
CMD ["node", "--version"]
