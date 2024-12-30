# Base image with Ubuntu
FROM ubuntu:22.04

# Set the working directory
WORKDIR /usr/src/app

# Update and install prerequisites
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Add Node.js repository and install Node.js (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Expose port 3000 (or any port your app uses)
EXPOSE 3007

# Set default command (useful for interactive containers)
CMD [ "bash" ]
