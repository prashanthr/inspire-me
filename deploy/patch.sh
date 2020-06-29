#!/usr/bin/env bash
kubectl --namespace $KUBE_NAMESPACE patch deployment comical-site-app -p \
  "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
