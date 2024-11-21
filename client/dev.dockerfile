FROM node:20.18.1-bullseye

# Install basic development tools
RUN apt-get update && apt-get install -y less man-db sudo wget \
  && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
  && apt-get install -y ./google-chrome-stable_current_amd64.deb \
  && rm ./google-chrome-stable_current_amd64.deb \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

WORKDIR /workspaces/client

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Make port 4200 available to the world outside this container
EXPOSE 4200

# Set entrypoint
CMD [ "/bin/sh", "-c \"while sleep 1000; do :; done\"" ]
