# Node 8.14.x Image -- Alternatively can use https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/jessie/Dockerfile
FROM node:8.14-jessie
# Labels & metadata
LABEL version="1.0"
LABEL name="node-docker-bunny"
LABEL description="This is a node docker image"
LABEL maintainer "Prashanth R <https://github.com/prashanthr>"
# OS Upgrades & Dependencies
RUN apt-get update &&  apt-get dist-upgrade -y && apt-get clean
# Set env
ENV WORK_DIR=/var/www/deploy/app/
ENV NODE_ENV=production
ENV PORT=8080
# Workdir
RUN mkdir -p ${WORK_DIR}
WORKDIR ${WORK_DIR}
# package handling
ADD package*.json ${WORK_DIR}
RUN npm install --${NODE_ENV}
RUN npm install pm2@latest -g
# Install App Dependencies
COPY . ${WORK_DIR}
# Expose port
EXPOSE ${PORT}
# Run application
CMD ["pm2-runtime", "start", "./ecosystem.json"]
