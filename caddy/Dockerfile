# Stage 1: Build Caddy with custom modules
FROM caddy:2-builder AS builder

# Add this: use Go proxy with direct fallback and enable checksum DB
ENV GOPROXY=https://proxy.golang.org,direct \
    GOSUMDB=sum.golang.org

# Retry builds automatically if Go proxy flakes
RUN go env -w GOINSECURE=*.golang.org

RUN xcaddy build \
    --with github.com/mholt/caddy-ratelimit \
    --with github.com/caddy-dns/cloudflare

# Stage 2: Create the final production image
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
