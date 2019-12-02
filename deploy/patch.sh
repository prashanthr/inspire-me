#!/usr/bin/env bash
kubectl --kubeconfig="minerva-kubeconfig.yaml" patch deployment inspire-me -p \
  "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
