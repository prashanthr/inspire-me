# Node Image -- Alternatively can use https://github.com/keymetrics/docker-pm2/blob/master/tags/latest/jessie/Dockerfile
FROM node:current
# Labels & metadata
LABEL version="certbot"
LABEL name="inspire-me-service"
LABEL description="This is an image for inspire me service"
LABEL maintainer "Prashanth R <https://github.com/prashanthr>"
# OS Upgrades & Dependencies
RUN apt-get update &&  apt-get dist-upgrade -y && apt-get clean && apt-get install apt-utils -y
# Install Yarn
RUN npm install -g yarn
# Set env
ENV WORK_DIR=/var/www/deploy/app/
ENV NODE_ENV=production
ENV PORT=9000
ENV NGINX_CONFIG_PATH=/etc/nginx/sites-available/default
ENV CERTBOT_EMAIL=prashanthrdev+certbotstg@gmail.com
ENV CERTBOT_SERVER=https://acme-staging-v02.api.letsencrypt.org/directory
ENV CERTBOT_DOMAIN=comical.site
# Workdir
RUN mkdir -p ${WORK_DIR}
WORKDIR ${WORK_DIR}
# package handling
ADD package*.json ${WORK_DIR}
RUN yarn --${NODE_ENV}
# Install App Dependencies
COPY . ${WORK_DIR}
# Build the front end assets
RUN yarn build-app
# Run application
CMD ["./node_modules/.bin/pm2-runtime", "start", "ecosystem.json"]
# Install other deps
RUN apt-get install apt-transport-https lsb-release ca-certificates nginx certbot python3-certbot-nginx -y
# Check versions
RUN nginx -v && certbot --version
# NGINX
COPY ./deploy/nginx/default.lua ${NGINX_CONFIG_PATH}
RUN nginx -t
# Expose app to the world
EXPOSE ${PORT}
# Certbot & Let's encrypt
RUN certbot -n --agree-tos --nginx --server ${CERTBOT_SERVER} -d ${CERTBOT_DOMAIN} --email ${CERTBOT_EMAIL}
RUN certbot renew --dry-run
