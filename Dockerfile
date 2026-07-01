FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock tsup.config.ts ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

CMD ["node", "dist/index.js"]
