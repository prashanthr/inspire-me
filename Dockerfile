# Node Image -- Alternatively can use https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/jessie/Dockerfile
FROM node:current
# Labels & metadata
LABEL version="latest"
LABEL name="comical-site"
LABEL description="This is an image for comical site app"
LABEL maintainer "Prashanth R <https://github.com/prashanthr>"
# OS Upgrades & Dependencies
RUN apt-get update && apt-get dist-upgrade -y && apt-get clean
# Caddy for https & certificates
RUN apt-get install apt-utils apt-transport-https ca-certificates --yes
RUN echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" | tee -a /etc/apt/sources.list.d/caddy-fury.list
RUN apt-get update && apt-get install caddy  --yes
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
RUN ls -la ${WORK_DIR}
# Build the front end assets
RUN yarn build-app
# Copy caddyfile for service
COPY ./Caddyfile /etc/caddy/Caddyfile
# Run service
CMD ["./node_modules/.bin/pm2-runtime", "start", "./ecosystem.json"]
# Expose port
EXPOSE ${PORT}
