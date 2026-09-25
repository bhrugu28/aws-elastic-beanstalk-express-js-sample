FROM node:16-bullseye-slim

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

COPY --chown=node:node app.js server.js config.js ./

USER node

EXPOSE 8080
CMD ["node", "server.js"]