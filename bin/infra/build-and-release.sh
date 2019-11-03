#!/usr/bin/env bash
[ -z $DOCKER_REPO ] && export DOCKER_REPO="inspire-me-test"
[ -z "$TAG_NAME" ] && export TAG_NAME=${uuid^^}
./bin/infra/docker-build.sh
