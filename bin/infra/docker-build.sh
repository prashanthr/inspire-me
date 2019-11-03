#!/usr/bin/env bash
echo "Running docker build with repo $DOCKER_REPO and tag name $TAG_NAME..."
docker build --tag $DOCKER_REPO:$TAG_NAME ./
