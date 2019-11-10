#!/usr/bin/env bash
echo "Building docker image with repo $DOCKER_REPO and tag name $TAG_NAME..."
docker build --tag $DOCKER_REPO:$TAG_NAME ./
