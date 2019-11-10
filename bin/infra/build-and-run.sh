#!/usr/bin/env bash
if [ -z $DOCKER_REPO ]; then 
  DOCKER_REPO="inspire-me-test"
fi

if [ -z $TAG_NAME ]; then 
  TAG_NAME="v0.1" #$(uuidgen)
fi

DOCKER_REPO=$DOCKER_REPO TAG_NAME=$TAG_NAME ./bin/infra/docker-build.sh
DOCKER_REPO=$DOCKER_REPO TAG_NAME=$TAG_NAME ./bin/infra/docker-run.sh
