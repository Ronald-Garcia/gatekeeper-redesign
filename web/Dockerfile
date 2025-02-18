# Build stage
FROM node:lts-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
ARG VITE_API_DB_URL=http://localhost:3000
ARG VITE_API_MACHINE_URL=http://127.0.0.1:5000
ENV VITE_API_DB_URL=${VITE_API_DB_URL}
ENV VITE_API_MACHINE_URL=${VITE_API_MACHINE_URL}
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]