#!/usr/bin/env bash
if [ -z $CONTAINER_NAME ]; then 
  CONTAINER_NAME="inspire-me"
fi

if [ -z $TAG_NAME ]; then 
  TAG_NAME="v0.0.1" #$(uuidgen)
fi

NAME_TAG="$CONTAINER_NAME:$TAG_NAME"

TAG=$NAME_TAG ./bin/infra/docker-build.sh
CONTAINER_NAME=$CONTAINER_NAME TAG=$NAME_TAG ./bin/infra/docker-run.sh
