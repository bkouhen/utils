FROM node:14 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
	cmake \
	&& rm -rf /var/lib/apt/lists/*

COPY . .
RUN rm -rf node_modules dist
RUN npm install && npm cache clean --force
RUN npm run build
RUN npm prune --production

FROM node:14-slim AS app

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "npm", "run", "start" ]
