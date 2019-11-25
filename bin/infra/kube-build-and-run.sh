#!/usr/bin/env bash
if [ -z $CONTAINER_NAME ]; then 
  CONTAINER_NAME="inspire-me"
fi

if [ -z $TAG_NAME ]; then 
  TAG_NAME="dev" #$(uuidgen)
fi

if [ -z $PORT ]; then
  PORT=9000
fi

NAME_TAG="$CONTAINER_NAME:$TAG_NAME"
KUBE_APP_NAME=inspireme
TAG=$NAME_TAG ./bin/infra/docker-build.sh

# eval $(minikube docker-env)
kubectl run $KUBE_APP_NAME --image=$NAME_TAG --port=$PORT
kubectl expose deployment $KUBE_APP_NAME --type=NodePort --name=$KUBE_APP_NAME
# eval $(minikube docker-env -u)
kubectl get deployments
kubectl get services
# minikube start
minikube service $KUBE_APP_NAME
