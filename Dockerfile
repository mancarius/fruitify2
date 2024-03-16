FROM node:18

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Install chromium for testing
RUN apt update && install -y wget && \
  wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  apt update && apt install -y ./google-chrome-stable_current_amd64.deb && \
  rm ./google-chrome-stable_current_amd64.deb

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Set the working directory
WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD npm run start
