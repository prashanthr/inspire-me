#!/usr/bin/env bash
if [ -z $DOCKER_PORT ] then;
  DOCKER_PORT=9000
fi

echo "Running docker container (repo: $DOCKER_REPO, tag name: $TAG_NAME) at port $DOCKER_PORT..."
docker run -p $DOCKER_PORT:$DOCKER_PORT $DOCKER_REPO:$TAG_NAME
