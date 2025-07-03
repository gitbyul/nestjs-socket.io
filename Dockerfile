# ===========================================
# Build Stage
# ===========================================
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for build (including dev dependencies)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ===========================================
# Production Stage
# ===========================================
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy environment file template
COPY --chown=nestjs:nodejs env.example .env

# Create necessary directories
RUN mkdir -p /app/log && \
    chown -R nestjs:nodejs /app/log

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 4000

# # Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
#   CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/main"] 