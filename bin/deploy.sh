#!/usr/bin/env bash

stack_name="$1"
environment="$2"
template=".sam/packaged-$environment.yml"
param="params/param.$environment.json"
extra_args="$([[ "$npm_lifecycle_event" == "deploy:no-execute-change-set" ]] && echo "--no-execute-changeset")"

./bin/package.sh "$stack_name" "$environment" \
  && aws cloudformation deploy \
    --template-file "$template" \
    --stack-name "$stack_name-$environment" \
    --capabilities "CAPABILITY_IAM" \
    --parameter-overrides $(cat "$param" \
      | jq -r '.Parameters | to_entries | map("\(.key)=\(.value|tostring)") | .[]' \
      | tr '\n' ' ' \
      | awk '{print}') \
    $extra_args
