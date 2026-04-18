FROM node:18-slim

# Install dependencies for yt-dlp
RUN apt-get update && apt-get install -y \
    python3 \
    curl \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# tell yt-dlp to use node runtime
ENV YT_DLP_JS_RUNTIME=node

WORKDIR /app

# Install node dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]