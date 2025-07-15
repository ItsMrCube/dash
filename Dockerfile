FROM oven/bun AS base

WORKDIR /app

COPY package.json bun.lock /app/

RUN bun i

COPY *.config.js *.config.ts tsconfig.json /app/
COPY src /app/src
COPY static /app/static

RUN bun -b run vite build

FROM oven/bun AS prod

WORKDIR /app

COPY --from=base /app/build /app/build
# Temp workaround: error: ENOENT while resolving package 'cookie' from '/app/build/server/index.js'
COPY --from=base /app/node_modules /app/node_modules

ENTRYPOINT [ "bun", "/app/build/index.js" ]