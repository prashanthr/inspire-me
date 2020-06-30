#!/usr/bin/env bash
if [ -z $CONTAINER_NAME ]; then 
  CONTAINER_NAME="comical-site"
fi

if [ -z $TAG_NAME ]; then 
  TAG_NAME=$(./bin/infra/get-pkg-version.sh)
fi

# docker build and release
NAME_TAG="$DOCKER_USER/$CONTAINER_NAME:$TAG_NAME"

TAG=$NAME_TAG ./bin/infra/docker-build.sh
DOCKER_USER=$DOCKER_USER TAG=$NAME_TAG ./bin/infra/docker-release.sh
# kube build and release
