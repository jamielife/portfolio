FROM node:16.20.2-bullseye-slim AS web-build

WORKDIR /app

COPY package.json package-lock.json ./
COPY patches ./patches

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx expo build:web

FROM alpine:3.22

ARG PB_VERSION=0.40.4

RUN apk add --no-cache ca-certificates unzip \
    && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -O /tmp/pocketbase.zip \
    && unzip /tmp/pocketbase.zip -d /pb \
    && rm /tmp/pocketbase.zip

COPY pocketbase/pb_migrations /pb/pb_migrations
COPY --from=web-build /app/web-build /pb/pb_public

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--automigrate=false", "--encryptionEnv=PB_ENCRYPTION_KEY", "--origins=https://jamietaylor.me,http://localhost:19006"]
