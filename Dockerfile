FROM node:20-alpine AS builder

WORKDIR /home/node/app

RUN npm -g install pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

FROM builder AS runner

USER node

CMD ["pnpm", "dev"]
