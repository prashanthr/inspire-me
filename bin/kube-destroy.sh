#!/usr/bin/env bash
kubectl delete service $SERVICE_NAME --namespace=$NAMESPACE
kubectl delete pods --all --namespace=$NAMESPACE
kubectl delete deployments --all --namespace=$NAMESPACE
