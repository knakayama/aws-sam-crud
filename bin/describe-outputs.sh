#!/usr/bin/env bash

stack_name="$1"
stage="$2"

aws cloudformation describe-stacks \
  --stack-name "$stack_name-$stage" \
  --query 'Stacks[].Outputs' \
  --output "table"
