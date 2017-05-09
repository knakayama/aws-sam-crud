#!/usr/bin/env bash

environment="$1"
opts="$(cat "params/param.$environment.json" \
  | jq -r '.Parameters | to_entries | map("\(.key)=\(.value|tostring)") | .[]' \
  | grep -E 'Domain|Stage' \
  | tr '\n' ' ' \
  | awk '{print}')"

env $opts $(npm bin)/mocha \
  --timeout 5000
