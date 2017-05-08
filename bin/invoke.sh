#!/usr/bin/env bash

function_name="$1"
stack_name="$2"
stage="$3"

aws lambda invoke \
  --function-name "$(aws cloudformation describe-stack-resource \
    --stack-name "$stack_name-$stage" \
    --logical-resource-id "$function_name" \
    --query 'StackResourceDetail.PhysicalResourceId' \
    --output text)" \
  --log-type "Tail" \
  --query "LogResult" \
  /dev/stdin \
  | perl -MMIME::Base64 -ne 'print decode_base64($_)'
