#!/usr/bin/env bash
echo "Deploying docker image with repo $DOCKER_REPO and tag name $TAG_NAME..."
docker push $DOCKER_REPO:$TAG_NAME
