#!/usr/bin/env bash
eval $(minikube docker-env)
docker build -t $IMAGE_TAG .
kubectl run $POD_NAME --image=$IMAGE_TAG --port=$PORT
kubectl expose deployment $POD_NAME --type=NodePort --name=$SERVICE_NAME
eval $(minikube docker-env -u)
kubectl get deployments
minikube service $SERVICE_NAME --vm-driver=hyperkit
