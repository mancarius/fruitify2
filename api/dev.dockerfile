# Use a lighter version of Node as a parent image
FROM node:lts

# Install basic development tools
RUN apt-get update && apt-get install -y less man-db sudo && rm -rf /var/lib/apt/lists/*

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME && \
  chmod 0440 /etc/sudoers.d/$USERNAME

# Set the working directory to /workspaces/api
WORKDIR /workspaces/api

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Set entrypoint
CMD ["/bin/sh", "-c", "while sleep 1000; do :; done"]
