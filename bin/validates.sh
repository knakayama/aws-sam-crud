#!/usr/bin/env bash

for template in sam.yml; do
  echo "$template" \
    | xargs -I% -t aws cloudformation validate-template --template-body file://%
done
