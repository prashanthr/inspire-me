#!/usr/bin/env bash
# download cluster config file
kubectl --kubeconfig=$KUBE_CONF_PATH get nodes
kubectl --kubeconfig=$KUBE_CONF_PATH apply -f ./deploy/kube-config/production
kubectl --kubeconfig=$KUBE_CONF_PATH get service inspire-me
kubectl --kubeconfig=$KUBE_CONF_PATH get service inspire-me
