#!/usr/bin/env bash
echo "Deploying docker image for user $DOCKER_USER and tag name $TAG_NAME..."
docker push $DOCKER_USER/$TAG
