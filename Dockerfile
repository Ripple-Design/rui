# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /workspace

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@10.2.0 --activate
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json apps/docs/package.json
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY apps/docs ./apps/docs

RUN pnpm --filter docs build

FROM nginx:1.28-alpine AS runtime
WORKDIR /usr/share/nginx/html

COPY --from=build /workspace/apps/docs/.output/public ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
