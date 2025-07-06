FROM node:18-alpine

WORKDIR /app

# Copy lock files and package.json from frontend folder
COPY frontend/package.json frontend/yarn.lock* frontend/package-lock.json* frontend/pnpm-lock.yaml* frontend/.npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy the rest of the frontend app
COPY frontend/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
