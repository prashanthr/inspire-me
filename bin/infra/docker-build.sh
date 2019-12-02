#!/usr/bin/env bash
# TAG_NAME=$DOCKER_REPO:$TAG_NAME
echo "Building docker image with tag $TAG..."
docker build -t $TAG .
