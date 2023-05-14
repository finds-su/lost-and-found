FROM node:18-alpine AS base

##### DEPENDENCIES

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./prisma/

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
 if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
 elif [ -f package-lock.json ]; then npm ci; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### BUILDER

FROM base AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG ANALYZE
ENV ANALYZE=$ANALYZE
ARG DISABLE_PWA
ENV DISABLE_PWA=$DISABLE_PWA

ARG S3_UPLOAD_KEY
ENV S3_UPLOAD_KEY=$S3_UPLOAD_KEY

ARG S3_UPLOAD_SECRET
ENV S3_UPLOAD_SECRET=$S3_UPLOAD_SECRET

ARG S3_UPLOAD_BUCKET
ENV S3_UPLOAD_BUCKET=$S3_UPLOAD_BUCKET

ARG S3_UPLOAD_HOSTNAME
ENV S3_UPLOAD_HOSTNAME=$S3_UPLOAD_HOSTNAME

ARG S3_UPLOAD_ENDPOINT_URL
ENV S3_UPLOAD_ENDPOINT_URL=$S3_UPLOAD_ENDPOINT_URL

ARG S3_UPLOAD_REGION
ENV S3_UPLOAD_REGION=$S3_UPLOAD_REGION

ARG NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS
ENV NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS=$NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ARG OPENAI_IMAGE_PATHNAME
ENV OPENAI_IMAGE_PATHNAME=$OPENAI_IMAGE_PATHNAME

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL

ARG MIREA_CLIENT_ID
ENV MIREA_CLIENT_ID=$MIREA_CLIENT_ID

ARG MIREA_CLIENT_SECRET
ENV MIREA_CLIENT_SECRET=$MIREA_CLIENT_SECRET

ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID

ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

ARG GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID

ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
 if [ -f yarn.lock ]; then yarn build; \
 elif [ -f package-lock.json ]; then npm run build; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
 else echo "Lockfile not found." && exit 1; \
 fi

##### RUNNER

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# TODO: Remove this line after fix
# https://github.com/vercel/next.js/issues/48077
# https://github.com/vercel/next.js/issues/48173
COPY --from=builder /app/node_modules/next/dist/compiled/jest-worker ./node_modules/next/dist/compiled/jest-worker

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "production"]
