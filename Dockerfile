# Node Image -- Alternatively can use https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/jessie/Dockerfile
FROM node:current AS base
# Labels & metadata
LABEL version="caddy"
LABEL name="comical-site"
LABEL description="This is an image for comical site app"
LABEL maintainer "Prashanth R <https://github.com/prashanthr>"
# OS Upgrades & Dependencies
RUN apt-get update && apt-get dist-upgrade -y && apt-get clean
# Install Yarn
RUN npm install -g yarn
# Set envs
ENV WORK_DIR=/var/www/deploy/app/
ENV NODE_ENV=production
ENV PORT=9000
# Workdir
RUN mkdir -p ${WORK_DIR}
WORKDIR ${WORK_DIR}
# package handling
ADD package*.json ${WORK_DIR}
ADD yarn.lock ${WORK_DIR}
RUN yarn --${NODE_ENV}
# Install App Dependencies
COPY . ${WORK_DIR}
# List for confirmation
RUN ls -altr ${WORK_DIR}
# Build the front end assets
RUN yarn build-app

# Caddy
FROM caddy/caddy:alpine
# Set Env Again
ENV WORK_DIR=/var/www/deploy/app/
ENV NODE_ENV=production
ENV PORT=9000
# Copy caddyfile for service
COPY ./Caddyfile /etc/caddy/Caddyfile
# OS Upgrades & Dependencies
RUN apt-get update && apt-get dist-upgrade -y && apt-get clean
# Copy files from base
COPY --from=base ${WORK_DIR} ${WORK_DIR}
# Install node, npm, yarn again
RUN apt-get install nodejs npm -y && nodejs -v
RUN npm install -g yarn
# Yarn install
RUN yarn --${NODE_ENV}
# Run service
CMD ["./node_modules/.bin/pm2-runtime", "start", "./ecosystem.json"]
# Expose port
EXPOSE ${PORT}
